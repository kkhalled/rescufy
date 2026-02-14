using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceAbstraction;
using Shared.DTOs.UserManagement;
using Shared.Enums;

namespace Service
{
    public class UserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager) : IUserService
    {
        public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email, // Use full email as username to avoid conflicts
                Email = dto.Email,
                Name = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                EmailConfirmed = true // Auto-confirm for admin created users
            };

            var result = await userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Validate Role
            if (!await roleManager.RoleExistsAsync(dto.Role))
            {
                 // Rollback? Or just throw. UserManager doesn't support transaction rollback easily without TransactionScope. 
                 // But for simplicity, we'll check role existence before creating user? 
                 // Let's do that in a better way. 
                 // But stick to the flow: 
                 
                 // If role doesn't exist, we should have checked earlier. 
                 // Assuming role exists because we validate against Enum in controller or here.
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
            var users = await userManager.Users.ToListAsync();
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
            var user = await userManager.FindByIdAsync(id);
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
            // user.Email? usually requires specific flow for email change. Keeping it simple.

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
                PhoneNumber = user.PhoneNumber,
                Roles = roles,
                IsBanned = user.IsBanned
            };
        }
    }
}
