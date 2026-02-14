using Microsoft.AspNetCore.Identity;

namespace Domain.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } = "";
        public string? ProfileImageUrl { get; set; }

        public bool IsBanned { get; set; } = false;
        public EmailVerificationCode EmailVerificationCode { get; set; } = default!;

        public UserProfile UserProfile { get; set; } = default!;
        public ICollection<Request> Requests { get; set; } = default!;
        public ICollection<Notification> Notifications { get; set; } = [];
        public ICollection<Assignment> AssignedAssignments { get; set; } = [];
        public ICollection<AuditLog> AuditLogs { get; set; } = [];
    }
}
