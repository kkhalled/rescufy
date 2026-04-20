using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DTOs.Ambulance;
using Shared.Enums;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AmbulanceController(IAmbulanceService ambulanceService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult<IEnumerable<AmbulanceDto>>> GetAll()
        {
            var ambulances = await ambulanceService.GetAllAmbulancesAsync();
            return Ok(ambulances);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)},{nameof(Roles.AmbulanceDriver)}")]
        public async Task<ActionResult<AmbulanceDto>> GetById(int id)
        {
            var ambulance = await ambulanceService.GetAmbulanceByIdAsync(id);
            if (ambulance == null)
                return NotFound(new { Message = "Ambulance not found" });

            return Ok(ambulance);
        }

        [HttpGet("my-ambulance")]
        [Authorize(Roles = nameof(Roles.AmbulanceDriver))]
        public async Task<ActionResult<AmbulanceDto>> GetMyAmbulance()
        {
            var driverId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (driverId == null) return Unauthorized();

            var ambulance = await ambulanceService.GetAmbulanceByDriverIdAsync(driverId);
            if (ambulance == null)
                return NotFound(new { Message = "No ambulance assigned to this driver" });

            return Ok(ambulance);
        }

        [HttpPost]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult<AmbulanceDto>> Create([FromBody] CreateAmbulanceDto dto)
        {
            var ambulance = await ambulanceService.CreateAmbulanceAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = ambulance.Id }, ambulance);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult<AmbulanceDto>> Update(int id, [FromBody] UpdateAmbulanceDto dto)
        {
            var ambulance = await ambulanceService.UpdateAmbulanceAsync(id, dto);
            if (ambulance == null)
                return NotFound(new { Message = "Ambulance not found" });

            return Ok(ambulance);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)},{nameof(Roles.AmbulanceDriver)}")]
        public async Task<ActionResult<AmbulanceDto>> UpdateStatus(int id, [FromBody] UpdateAmbulanceStatusDto dto)
        {
            var ambulance = await ambulanceService.UpdateAmbulanceAsync(id, new UpdateAmbulanceDto 
            { 
                AmbulanceStatus = dto.Status 
            });
            
            if (ambulance == null)
                return NotFound(new { Message = "Ambulance not found" });

            return Ok(ambulance);
        }

        [HttpPut("{id}/location")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)},{nameof(Roles.AmbulanceDriver)}")]
        public async Task<ActionResult<AmbulanceDto>> UpdateLocation(int id, [FromBody] UpdateAmbulanceLocationDto dto)
        {
            var ambulance = await ambulanceService.UpdateAmbulanceAsync(id, new UpdateAmbulanceDto 
            { 
                SimLatitude = dto.Latitude,
                SimLongitude = dto.Longitude
            });
            
            if (ambulance == null)
                return NotFound(new { Message = "Ambulance not found" });

            return Ok(ambulance);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await ambulanceService.DeleteAmbulanceAsync(id);
            if (!result)
                return NotFound(new { Message = "Ambulance not found" });

            return NoContent();
        }
    }

    public class UpdateAmbulanceStatusDto
    {
        public AmbulanceStatus Status { get; set; }
    }

    public class UpdateAmbulanceLocationDto
    {
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
