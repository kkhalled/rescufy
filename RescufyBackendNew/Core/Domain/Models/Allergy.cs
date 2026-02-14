using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class Allergy : BaseEntity<Guid>
    {
        public int ProfileId { get; set; }
        public string Name { get; set; } = default!;
        public string Severity { get; set; } = default!;
        public string Notes { get; set; } = default!;

        // Navigation Properties
        [ForeignKey(nameof(ProfileId))]
        public UserProfile UserProfile { get; set; } = default!;
    }
}
