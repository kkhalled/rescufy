using Domain.Contracts;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ServiceAbstraction;
using Shared.DTOs.Auth;
using Shared.Enums;
using Shared.Settings;
using Shared.SharedResources;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Service
{
    public class AuthService(
        UserManager<ApplicationUser> userManager,
        IUnitOfWork unitOfWork,
        IOptions<AppSettings> appSettings,
        IMailingService emailService,
        IConfiguration configuration,
        IHostEnvironment env,
        IStringLocalizer<SharedResources> localizer,
        IFileStorageService fileStorageService)
        : IAuthService
    {

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {
            var user = await userManager.Users
                .Include(u => u.Hospital)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user is not null && !user.EmailConfirmed)
                await userManager.DeleteAsync(user);

            if (user == null || !await userManager.CheckPasswordAsync(user, request.Password))
            {
                return new AuthResult { Succeeded = false, Message = localizer[SharedResourcesKeys.InvalidCredentials] };
            }

            var token = await GenerateJwtTokenAsync(user);
            var roles = await userManager.GetRolesAsync(user);

            var result = new AuthResult 
            { 
                Succeeded = true, 
                Token = token, 
                Message = localizer[SharedResourcesKeys.LoginSuccessful],
                User = new UserInfo
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email ?? "",
                    PhoneNumber = user.PhoneNumber,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Roles = roles.ToList()
                }
            };

            // Include hospital info if user is a HospitalAdmin
            if (roles.Contains(nameof(Roles.HospitalAdmin)) && user.Hospital != null)
            {
                result.Hospital = new HospitalInfo
                {
                    Id = user.Hospital.Id,
                    Name = user.Hospital.Name,
                    Address = user.Hospital.Address,
                    ContactPhone = user.Hospital.ContactPhone,
                    Latitude = user.Hospital.Latitude,
                    Longitude = user.Hospital.Longitude,
                    AvailableBeds = user.Hospital.AvailableBeds,
                    BedCapacity = user.Hospital.BedCapacity
                };
            }

            return result;
        }

        public async Task<AuthResult> ChangePasswordAsync(ChangePassRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.OldPassword) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Message = localizer[SharedResourcesKeys.CredentialsAreRequired]
                };
            }

            var user = await userManager.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Message = localizer[SharedResourcesKeys.UserNotFound]
                };
            }

            var isOldPasswordCorrect = await userManager.CheckPasswordAsync(user, request.OldPassword);
            if (!isOldPasswordCorrect)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Message = localizer[SharedResourcesKeys.OldPassIsIncorrect]
                };
            }

            var result = await userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return new AuthResult
                {
                    Succeeded = false,
                    Message = $"Failed to change password: {errors}"
                };
            }

            var newToken = await GenerateJwtTokenAsync(user);

            return new AuthResult
            {
                Succeeded = true,
                Message = localizer[SharedResourcesKeys.PasswordChangedSuccessfully],
                Token = newToken
            };
        }

        public async Task<string> ForgetPasswordAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                throw new Exception(localizer[SharedResourcesKeys.UserNotFound]);

            await SendOtpAsync(user.Id, email);
            return localizer[SharedResourcesKeys.OtpSentSuccessfully];
        }

        private async Task SendOtpAsync(string userId, string email)
        {
            var code = new Random().Next(100000, 999999).ToString();
            var expiry = DateTime.Now.AddMinutes(10);

            var repo = unitOfWork.GetRepository<EmailVerificationCode, int>();
            var existingVerification = await repo.GetFirstOrDefaultAsync(v => v.ApplicationUserId == userId);
            if (existingVerification != null)
            {
                repo.Remove(existingVerification);
                await unitOfWork.SaveChangesAsync();
            }

            var verification = new EmailVerificationCode
            {
                Code = code,
                ExpirationTime = expiry,
                ApplicationUserId = userId
            };
            await repo.AddAsync(verification);
            await unitOfWork.SaveChangesAsync();


            var filePath = Path.Combine(env.ContentRootPath, "wwwroot", "HTML", "VerificationOtp.html");
            if (!File.Exists(filePath))
                throw new FileNotFoundException(localizer[SharedResourcesKeys.AnErrorOccured]);

            var body = await File.ReadAllTextAsync(filePath);
            var frontUrl = appSettings.Value.FrontEndUrl;
            var loginUrl = $"{frontUrl}login";
            var baseUrl = appSettings.Value.BaseUrl?.TrimEnd('/');
            var logoUrl = $"{baseUrl?.TrimEnd('/')}/Images/Logo.png";


            body = body.Replace("{{logo_url}}", logoUrl)
                       .Replace("{{otp_code}}", code);

            await emailService.SendEmailAsync(email, localizer[SharedResourcesKeys.OtpEmailSubject], body);

        }

        public async Task<string> VerifyResetPasswordOtpAsync(VerifyOtpRequest dto)
        {

            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception(localizer[SharedResourcesKeys.UserNotFound]);

            var repo = unitOfWork.GetRepository<EmailVerificationCode, int>();
            var record = await repo.GetFirstOrDefaultAsync(x => x.ApplicationUserId == user.Id && x.Code == dto.Otp);
            if (record == null || record.ExpirationTime < DateTime.Now)
                throw new Exception(localizer[SharedResourcesKeys.InvalidOrExpiredOtp]);

            repo.Remove(record);
            await unitOfWork.SaveChangesAsync();

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(token));

            var resetLink = $"{appSettings.Value.ResetPasswordUrl}?email={Uri.EscapeDataString(user.Email!)}&token={encodedToken}";


            var filePath = Path.Combine(env.ContentRootPath, "wwwroot", "HTML", "ResetPassword.html");
            if (!File.Exists(filePath))
                throw new FileNotFoundException(localizer[SharedResourcesKeys.AnErrorOccured]);

            var body = await File.ReadAllTextAsync(filePath);
            var frontUrl = appSettings.Value.FrontEndUrl;
            var loginUrl = $"{frontUrl}login";
            var baseUrl = appSettings.Value.BaseUrl?.TrimEnd('/');
            var logoUrl = $"{baseUrl?.TrimEnd('/')}/Images/Logo.png";


            body = body.Replace("{{user_name}}", user.Name ?? user.UserName)
                       .Replace("{{logo_url}}", logoUrl)
                       .Replace("{{reset_link}}", resetLink);

            await emailService.SendEmailAsync(user.Email!, localizer[SharedResourcesKeys.OtpEmailSubject], body);
            return localizer[SharedResourcesKeys.ResetEmailSentSuccessfully];
        }

        private async Task<string> GenerateJwtTokenAsync(ApplicationUser user)
        {
            var jwtSettings = configuration.GetSection("JWT");

            var roles = await userManager.GetRolesAsync(user);
            var baseUrl = appSettings.Value.BaseUrl.TrimEnd('/');

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Email!),
                new Claim("FullName",user.Name),
                new Claim("PicUrl",(baseUrl+user.ProfileImageUrl)??(baseUrl+"Images/ProfileImages/default.png")),
                new Claim("Email", user.Email!),
                new Claim("UserName", user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("SecurityStamp", user.SecurityStamp ?? string.Empty)
            };


            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
                authClaims.Add(new Claim("Role", role));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["ValidIssuer"],
                audience: jwtSettings["ValidAudience"],
                expires: DateTime.Now.AddDays(Convert.ToDouble(jwtSettings["DurationInDays"])),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthResult> ResetPasswordAsync(ResetPasswordRequest dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
               string.IsNullOrWhiteSpace(dto.Token) ||
               string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Message = localizer[SharedResourcesKeys.CredentialsAreRequired]
                };
            }


            var user = await userManager.Users
                  .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Message = localizer[SharedResourcesKeys.UserNotFound]
                };
            }

            var decodedTokenBytes = WebEncoders.Base64UrlDecode(dto.Token);
            var decodedToken = System.Text.Encoding.UTF8.GetString(decodedTokenBytes);

            var result = await userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return new AuthResult
                {
                    Succeeded = false,
                    Message = $"Failed to change password: {errors}"
                };
            }

            var newToken = await GenerateJwtTokenAsync(user);

            return new AuthResult
            {
                Succeeded = true,
                Message = localizer[SharedResourcesKeys.PasswordChangedSuccessfully],
                Token = newToken
            };
        }
        public async Task<string> RegisterAsync(RegisterRequest dto)
        {
            var existingUser = await userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                if (existingUser.EmailConfirmed)
                    throw new Exception(localizer[SharedResourcesKeys.EmailAlreadyExists]);
                else
                    await userManager.DeleteAsync(existingUser);

            existingUser = await userManager.FindByNameAsync(dto.UserName);
            if (existingUser != null)
                if (existingUser.EmailConfirmed)
                    throw new Exception(localizer[SharedResourcesKeys.UserNameAlreadyExist]);
                else
                    await userManager.DeleteAsync(existingUser);

            if (await userManager.Users.AnyAsync(u => u.NationalId == dto.NationalId))
                 throw new Exception("National ID is already registered.");

            ValidateUserName(dto.UserName);

            string? imageUrl = null;

            if (dto.ProfileImage != null && dto.ProfileImage.Length > 0)
            {
                var directory = "Images/ProfileImages";
                imageUrl = await fileStorageService.SaveFileAsync(dto.ProfileImage, directory, maxSize: 5 * 1024 * 1024);
            }

            var user = new ApplicationUser
            {
                Email = dto.Email,
                UserName = dto.UserName,
                Name = dto.Name,
                ProfileImageUrl = imageUrl,
                EmailConfirmed = false,
                NationalId = dto.NationalId,
                Gender = dto.Gender,
                Age = dto.Age,
                
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to register user: {errors}");
            }

            await userManager.AddToRoleAsync(user, Roles.User.ToString());
            await SendOtpAsync(user.Id, user.Email);

            return localizer[SharedResourcesKeys.OtpSentSuccessfully];
        }
        private void ValidateUserName(string username)
        {
            username = username.Trim();

            if (username.Length < 3 || username.Length > 20)
                throw new Exception(SharedResourcesKeys.InvalidLengthForUserName);

            if (!System.Text.RegularExpressions.Regex.IsMatch(username, "^[a-zA-Z][a-zA-Z0-9_]*$"))
                throw new Exception(SharedResourcesKeys.InvalidCharsForUserName);

            var reserved = new[] { "admin", "root", "system", "support", "contact" };
            if (reserved.Contains(username.ToLower()))
                throw new Exception(SharedResourcesKeys.ReservedUserName);

            if (username.All(char.IsDigit))
                throw new Exception(SharedResourcesKeys.UserNameIsNumber);
        }

        public async Task<AuthResult> VerifyRegistrationOtpAsync(VerifyOtpRequest dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception(localizer[SharedResourcesKeys.UserNotFound]);

            var repo = unitOfWork.GetRepository<EmailVerificationCode, int>();
            var record = await repo.GetFirstOrDefaultAsync(x => x.ApplicationUserId == user.Id && x.Code == dto.Otp);
            if (record == null || record.ExpirationTime < DateTime.Now)
                throw new Exception(localizer[SharedResourcesKeys.InvalidOrExpiredOtp]);

            user.EmailConfirmed = true;
            repo.Remove(record);
            await unitOfWork.SaveChangesAsync();
            await userManager.UpdateAsync(user);
            var token = await GenerateJwtTokenAsync(user);

            return new AuthResult { Succeeded = true, Token = token, Message = localizer[SharedResourcesKeys.LoginSuccessful] };
        }
    }
}
