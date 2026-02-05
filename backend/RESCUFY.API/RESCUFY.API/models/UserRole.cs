using RESCUFY.API.models;
using System;
using System.Collections.Generic;

namespace RESCUFY.API.Models
{
    public class UserRole
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        public int AssignedBy { get; set; }

        public AppUser AssignedByUser { get; set; } = null!;

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
