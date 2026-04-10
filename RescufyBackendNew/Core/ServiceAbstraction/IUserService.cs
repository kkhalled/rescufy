using Shared.DTOs.UserManagement;

namespace ServiceAbstraction
{
    public interface IUserService
    {
        Task<UserDto> CreateUserAsync(CreateUserDto dto);
        Task<IEnumerable<UserDto>> GetAllUsersAsync(string? role = null);
        Task<UserDto> GetUserByIdAsync(string id);
        Task<UserDto> UpdateUserAsync(string id, UpdateUserDto dto);
        Task DeleteUserAsync(string id);
        Task<UserDto> AssignUserToHospitalAsync(string userId, int hospitalId);
        Task<UserDto> RemoveUserFromHospitalAsync(string userId);
    }
}
