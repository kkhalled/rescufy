namespace Domain.Models
{
    public class Assignment : BaseEntity<int>
    {
        public int RequestId { get; set; }
        public int AmbulanceId { get; set; }
        public int? HospitalId { get; set; }
        public string AssignedBy { get; set; } = default!;
        public DateTime AssignedAt { get; set; }
        public int? EtaMinutes { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool AutoAssigned { get; set; }
        public float DistanceKm { get; set; }
        public float HospitalDistanceKm { get; set; }
        public float AssignmentScore { get; set; }
        public int ReassignmentCount { get; set; }
        public string Notes { get; set; } = default!;
        public Shared.Enums.AssignmentStatus Status { get; set; }

        // Navigation Properties
        public Request Request { get; set; } = default!;
        public Ambulance Ambulance { get; set; } = default!;
        public Hospital Hospital { get; set; } = default!;
        public ApplicationUser ApplicationUser { get; set; } = default!;
    }
}
