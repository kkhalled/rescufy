using System;
using System.Collections.Generic;
using RESCUFY.API.models;
using RESCUFY.API.Models;
using System.ComponentModel.DataAnnotations;

namespace RESCUFY.API.models
{
    public class Role
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
       
    }
}

