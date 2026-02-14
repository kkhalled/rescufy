using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class Medication : BaseEntity<Guid>
    {
        public int ProfileId { get; set; }
        public string Name { get; set; } = default!;
        public string Dosage { get; set; } = default!;
        public string Frequency { get; set; } = default!;

        // Navigation Properties
        [ForeignKey(nameof(ProfileId))]
        public UserProfile UserProfile { get; set; } = default!;
    }
}
