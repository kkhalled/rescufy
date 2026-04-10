namespace Shared.DTOs.Hospital
{
    public class HospitalDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string ContactPhone { get; set; } = default!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int AvailableBeds { get; set; }
        public int BedCapacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateHospitalDto
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string ContactPhone { get; set; } = default!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int AvailableBeds { get; set; }
        public int BedCapacity { get; set; }
    }

    public class UpdateHospitalDto
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? ContactPhone { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? AvailableBeds { get; set; }
        public int? BedCapacity { get; set; }
    }
}
