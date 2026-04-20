using Domain.Contracts;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceAbstraction;
using Shared.DTOs.UserManagement;
using Shared.Enums;

namespace Service
{
    public class UserService(
        UserManager<ApplicationUser> userManager, 
        RoleManager<IdentityRole> roleManager,
        IUnitOfWork unitOfWork) : IUserService
    {
        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            if (await userManager.Users.AnyAsync(u => u.NationalId == dto.NationalId))
                throw new Exception("National ID is already registered.");

            // Validate HospitalId for HospitalAdmin role
            if (dto.Role == nameof(Roles.HospitalAdmin))
            {
                if (!dto.HospitalId.HasValue)
                    throw new Exception("HospitalId is required when creating a HospitalAdmin.");

                var hospital = await unitOfWork.GetRepository<Hospital, int>().GetByIdAsync(dto.HospitalId.Value);
                if (hospital == null)
                    throw new Exception("Hospital not found.");
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Name = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                EmailConfirmed = true,
                NationalId = dto.NationalId,
                Gender = dto.Gender,
                Age = dto.Age,
                HospitalId = dto.Role == nameof(Roles.HospitalAdmin) ? dto.HospitalId : null
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Assign Role
            var roleResult = await userManager.AddToRoleAsync(user, dto.Role);
            if (!roleResult.Succeeded)
            {
                throw new Exception($"Failed to assign role: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
            }

            return await MapToDtoAsync(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync(string? role = null)
        {
            var users = await userManager.Users
                .Include(u => u.Hospital)
                .ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                if (!string.IsNullOrEmpty(role))
                {
                    if (await userManager.IsInRoleAsync(user, role))
                    {
                        userDtos.Add(await MapToDtoAsync(user));
                    }
                }
                else
                {
                    userDtos.Add(await MapToDtoAsync(user));
                }
            }

            return userDtos;
        }

        public async Task<UserDto> GetUserByIdAsync(string id)
        {
            var user = await userManager.Users
                .Include(u => u.Hospital)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) throw new Exception("User not found");

            return await MapToDtoAsync(user);
        }

        public async Task<UserDto> UpdateUserAsync(string id, UpdateUserDto dto)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) throw new Exception("User not found");

            user.Name = dto.Name;
            user.PhoneNumber = dto.PhoneNumber;
            user.IsBanned = dto.IsBanned;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            return await MapToDtoAsync(user);
        }

        public async Task DeleteUserAsync(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) throw new Exception("User not found");

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to delete user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        private async Task<UserDto> MapToDtoAsync(ApplicationUser user)
        {
            var roles = await userManager.GetRolesAsync(user);
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? "",
                Name = user.Name,
                NationalId = user.NationalId,
                Gender = user.Gender,
                Age = user.Age,
                PhoneNumber = user.PhoneNumber,
                Roles = roles,
                IsBanned = user.IsBanned,
                HospitalId = user.HospitalId,
                HospitalName = user.Hospital?.Name
            };
        }

        public async Task<UserDto> AssignUserToHospitalAsync(string userId, int hospitalId)
        {
            var user = await userManager.Users
                .Include(u => u.Hospital)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) throw new Exception("User not found");

            // Verify hospital exists
            var hospital = await unitOfWork.GetRepository<Hospital, int>().GetByIdAsync(hospitalId);
            if (hospital == null) throw new Exception("Hospital not found");

            // Verify user is a HospitalAdmin
            var roles = await userManager.GetRolesAsync(user);
            if (!roles.Contains(nameof(Roles.HospitalAdmin)))
                throw new Exception("User must have HospitalAdmin role to be assigned to a hospital");

            user.HospitalId = hospitalId;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to assign user to hospital: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Reload with hospital info
            user = await userManager.Users
                .Include(u => u.Hospital)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return await MapToDtoAsync(user!);
        }

        public async Task<UserDto> RemoveUserFromHospitalAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.HospitalId = null;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to remove user from hospital: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            return await MapToDtoAsync(user);
        }
    }
}
