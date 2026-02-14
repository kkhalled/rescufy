namespace Shared.DTOs.UserManagement
{
    public class UserDto
    {
        public string Id { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? PhoneNumber { get; set; }
        public IList<string> Roles { get; set; } = [];
        public bool IsBanned { get; set; }
    }
}
