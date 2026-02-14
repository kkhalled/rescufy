using Shared.Enums;

namespace Shared.DTOs
{
    public class RequestFilterDto
    {
        public string? UserId { get; set; }
        public RequestStatus? RequestStatus { get; set; }
        public bool? IsSelfCase { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
