using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class ChronicDisease : BaseEntity<Guid>
    {
        public int ProfileId { get; set; }
        public string Name { get; set; } = default!;
        public string Severity { get; set; } = default!;
        public int DiagnosedYear { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        [ForeignKey(nameof(ProfileId))]
        public UserProfile UserProfile { get; set; } = default!;
    }
}
