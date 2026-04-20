using System.ComponentModel.DataAnnotations;

namespace Shared.DTOs.UserManagement
{
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        [StringLength(14, MinimumLength = 14, ErrorMessage = "National ID must be exactly 14 digits")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "National ID must be numeric")]
        public string NationalId { get; set; } = default!;

        [Required]
        [RegularExpression("^(Male|Female)$", ErrorMessage = "Gender must be 'Male' or 'Female'")]
        public string Gender { get; set; } = default!;

        [Required]
        [Range(1, 120, ErrorMessage = "Age must be between 1 and 120")]
        public int Age { get; set; }

        [Required]
        public string Password { get; set; } = default!;

        [Required]
        public string Name { get; set; } = default!;

        public string? PhoneNumber { get; set; }

        [Required]
        public string Role { get; set; } = default!; // "Admin", "AmbulanceDriver", "HospitalAdmin", "User"

        /// <summary>
        /// Required when Role is "HospitalAdmin" - the hospital ID to assign the admin to
        /// </summary>
        public int? HospitalId { get; set; }
    }
}
