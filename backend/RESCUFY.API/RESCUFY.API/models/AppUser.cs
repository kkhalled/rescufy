using RESCUFY.API.models;
using RESCUFY.API.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RESCUFY.API.models
{
    public class AppUser
    {

        [Key]
        public int UserId { get; set; }

        [Required]
        public string FullName { get; set; }

        public int Age { get; set; }

        public string Gender { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        // ===== Relation with Role =====
        [ForeignKey("Role")]
        public int RoleId { get; set; }

        public Role Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
