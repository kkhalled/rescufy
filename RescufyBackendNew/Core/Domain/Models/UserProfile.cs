namespace Domain.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        public string UserId { get; set; } = default!;
        public string BloodType { get; set; } = default!;
        public float WeightKg { get; set; }
        public float HeightCm { get; set; }
        public bool PregnancyStatus { get; set; }
        public string MedicalNotes { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }

        // Navigation Properties
        public ApplicationUser ApplicationUser { get; set; } = default!;
        public ICollection<ChronicDisease> ChronicDiseases { get; set; } = [];
        public ICollection<Allergy> Allergies { get; set; } = [];
        public ICollection<Medication> Medications { get; set; } = [];
        public ICollection<PastSurgery> PastSurgeries { get; set; } = [];
    }

}