using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.Enums;
using System.Security.Claims;
using Shared.DTOs; // Assuming CreateRequestDto is here or I need to create it
using Domain.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController(IRequestService requestService) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = nameof(Roles.User))]
        public async Task<IActionResult> CreateRequest([FromBody] CreateRequestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var request = await requestService.CreateRequestAsync(userId, dto.Description, dto.Latitude, dto.Longitude, dto.Address, dto.IsSelfCase);
            return Ok(request);
        }

        [HttpGet("driver")]
        [Authorize(Roles = nameof(Roles.AmbulanceDriver))]
        public async Task<IActionResult> GetDriverRequests()
        {
            var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (driverId == null) return Unauthorized();

            var requests = await requestService.GetDriverRequestsAsync(driverId);
            return Ok(requests);
        }

        [HttpGet]
        [Authorize(Roles = nameof(Roles.Admin) + "," + nameof(Roles.SuperAdmin) + "," + nameof(Roles.HospitalAdmin) + "," + nameof(Roles.User) + "," + nameof(Roles.AmbulanceDriver))]
        public async Task<IEnumerable<Request>> GetRequests([FromQuery] RequestFilterDto filter)
        {
            if (string.IsNullOrEmpty(filter.UserId) && 
                !filter.RequestStatus.HasValue && 
                !filter.IsSelfCase.HasValue && 
                !filter.StartDate.HasValue && 
                !filter.EndDate.HasValue)
            {
                filter.UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            }

            return await requestService.GetRequestsAsync(filter);
        }
    }

    public class CreateRequestDto
    {
        public string Description { get; set; } = string.Empty;
        public bool IsSelfCase { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Address { get; set; } = string.Empty;
    }
}
