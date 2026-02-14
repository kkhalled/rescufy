using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.UserManagement
{
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;

        [Required]
        public string Name { get; set; } = default!;

        public string? PhoneNumber { get; set; }

        [Required]
        public string Role { get; set; } = default!; // "Admin", "AmbulanceDriver", "HospitalAdmin", "User"
    }
}
