using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class EmergencyContact : BaseEntity<Guid>
    {
        public string ProfileId { get; set; } = default!; 
        public string FullName { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string Relation { get; set; } = default!;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey(nameof(ProfileId))]
        public ApplicationUser User { get; set; } = default!;
    }
}
