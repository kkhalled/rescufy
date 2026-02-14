using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models
{
    public class PastSurgery : BaseEntity<Guid>
    {
        public int ProfileId { get; set; }
        public string Name { get; set; } = default!;
        public int Year { get; set; }
        public string Notes { get; set; } = default!;

        // Navigation Properties
        [ForeignKey(nameof(ProfileId))]
        public UserProfile UserProfile { get; set; } = default!;
    }
}
