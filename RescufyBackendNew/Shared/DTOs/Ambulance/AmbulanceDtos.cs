using Shared.Enums;

namespace Shared.DTOs.Ambulance
{
    public class AmbulanceDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string VehicleInfo { get; set; } = default!;
        public string DriverPhone { get; set; } = default!;
        public AmbulanceStatus AmbulanceStatus { get; set; }
        public decimal SimLatitude { get; set; }
        public decimal SimLongitude { get; set; }
        public string? DriverId { get; set; }
        public string? DriverName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateAmbulanceDto
    {
        public string Name { get; set; } = default!;
        public string VehicleInfo { get; set; } = default!;
        public string DriverPhone { get; set; } = default!;
        public decimal SimLatitude { get; set; }
        public decimal SimLongitude { get; set; }
        public string? DriverId { get; set; }
    }

    public class UpdateAmbulanceDto
    {
        public string? Name { get; set; }
        public string? VehicleInfo { get; set; }
        public string? DriverPhone { get; set; }
        public AmbulanceStatus? AmbulanceStatus { get; set; }
        public decimal? SimLatitude { get; set; }
        public decimal? SimLongitude { get; set; }
        public string? DriverId { get; set; }
    }
}
