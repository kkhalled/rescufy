namespace Shared.DTOs.Auth
{
    public class AuthResult
    {
        public bool Succeeded { get; set; }
        public string Token { get; set; } = default!;
        public string Message { get; set; } = default!;
        public UserInfo? User { get; set; }
        public HospitalInfo? Hospital { get; set; }
    }

    public class UserInfo
    {
        public string Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PhoneNumber { get; set; }
        public string? ProfileImageUrl { get; set; }
        public List<string> Roles { get; set; } = [];
    }

    public class HospitalInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string ContactPhone { get; set; } = default!;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int AvailableBeds { get; set; }
        public int BedCapacity { get; set; }
    }
}
