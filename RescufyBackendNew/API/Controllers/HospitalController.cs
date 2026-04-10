using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstraction;
using Shared.DTOs.Hospital;
using Shared.Enums;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalController(IHospitalService hospitalService, IUserService userService) : ControllerBase
    {
        /// <summary>
        /// Get all hospitals (SuperAdmin/Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult<IEnumerable<HospitalDto>>> GetAll()
        {
            var hospitals = await hospitalService.GetAllHospitalsAsync();
            return Ok(hospitals);
        }

        /// <summary>
        /// Get hospital by ID (SuperAdmin/Admin can see any, HospitalAdmin can only see their own)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)},{nameof(Roles.HospitalAdmin)}")]
        public async Task<ActionResult<HospitalDto>> GetById(int id)
        {
            // If HospitalAdmin, verify they can only access their own hospital
            if (User.IsInRole(nameof(Roles.HospitalAdmin)) && 
                !User.IsInRole(nameof(Roles.Admin)) && 
                !User.IsInRole(nameof(Roles.SuperAdmin)))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await userService.GetUserByIdAsync(userId!);
                if (user.HospitalId != id)
                    return Forbid();
            }

            var hospital = await hospitalService.GetHospitalByIdAsync(id);
            if (hospital == null)
                return NotFound(new { Message = "Hospital not found" });

            return Ok(hospital);
        }

        /// <summary>
        /// HospitalAdmin gets their own hospital
        /// </summary>
        [HttpGet("my-hospital")]
        [Authorize(Roles = nameof(Roles.HospitalAdmin))]
        public async Task<ActionResult<HospitalDto>> GetMyHospital()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userService.GetUserByIdAsync(userId!);

            if (!user.HospitalId.HasValue)
                return NotFound(new { Message = "You are not assigned to any hospital" });

            var hospital = await hospitalService.GetHospitalByIdAsync(user.HospitalId.Value);
            if (hospital == null)
                return NotFound(new { Message = "Hospital not found" });

            return Ok(hospital);
        }

        /// <summary>
        /// Create a new hospital (SuperAdmin/Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult<HospitalDto>> Create([FromBody] CreateHospitalDto dto)
        {
            var hospital = await hospitalService.CreateHospitalAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = hospital.Id }, hospital);
        }

        /// <summary>
        /// Update hospital (HospitalAdmin can only update their own hospital)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)},{nameof(Roles.HospitalAdmin)}")]
        public async Task<ActionResult<HospitalDto>> Update(int id, [FromBody] UpdateHospitalDto dto)
        {
            // If HospitalAdmin, verify they can only update their own hospital
            if (User.IsInRole(nameof(Roles.HospitalAdmin)) && 
                !User.IsInRole(nameof(Roles.Admin)) && 
                !User.IsInRole(nameof(Roles.SuperAdmin)))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await userService.GetUserByIdAsync(userId!);
                if (user.HospitalId != id)
                    return Forbid();
            }

            var hospital = await hospitalService.UpdateHospitalAsync(id, dto);
            if (hospital == null)
                return NotFound(new { Message = "Hospital not found" });

            return Ok(hospital);
        }

        /// <summary>
        /// Delete hospital (SuperAdmin/Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await hospitalService.DeleteHospitalAsync(id);
            if (!result)
                return NotFound(new { Message = "Hospital not found" });

            return NoContent();
        }

        /// <summary>
        /// Get all admins for a specific hospital (SuperAdmin/Admin only)
        /// </summary>
        [HttpGet("{id}/admins")]
        [Authorize(Roles = $"{nameof(Roles.Admin)},{nameof(Roles.SuperAdmin)}")]
        public async Task<ActionResult> GetHospitalAdmins(int id)
        {
            var admins = await hospitalService.GetHospitalAdminsAsync(id);
            return Ok(admins);
        }
    }
}
