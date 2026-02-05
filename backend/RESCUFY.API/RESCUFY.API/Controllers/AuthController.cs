using Microsoft.AspNetCore.Mvc;
using RESCUFY.API.DTOs; // For LoginDto and RegisterDto
using RESCUFY.API.Services; // For AuthService
using System.Threading.Tasks;

namespace RESCUFY.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid request.");

            bool isRegistered = await _authService.Register(dto);
            if (!isRegistered)
            {
                return BadRequest("User already exists or invalid data.");
            }

            return Ok("login successful.");
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid request.");

            bool isLoggedIn = await _authService.Login(dto);
            if (!isLoggedIn)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok("Login successful.");
        }
    }
}
