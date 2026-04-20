namespace Domain.Models
{
    public class Hospital : BaseEntity<int>
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string ContactPhone { get; set; } = default!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int AvailableBeds { get; set; }
        public int BedCapacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation Properties
        public ICollection<Assignment> Assignments { get; set; } = [];
        public ICollection<ApplicationUser> Admins { get; set; } = [];
    }
}
