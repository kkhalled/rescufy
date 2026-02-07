using BCrypt.Net;                     // for password hashing
using Microsoft.EntityFrameworkCore;  // for database queries
using RESCUFY.API.Data;               // for AppDbContext
using RESCUFY.API.DTOs;               // for LoginDto and RegisterDto
using RESCUFY.API.models;
using RESCUFY.API.Models;             // for AppUser, Role, etc.
using System.Threading.Tasks;

namespace RESCUFY.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        // Register method
        public async Task<bool> Register(RegisterDto dto)
        {
            // Check if user with this email exists
            if (await _context.AppUsers.AnyAsync(u => u.Email == dto.Email))
                return false; // <-- return boolean, not string

            // Hash the password
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Create new user
            var user = new AppUser
            {
                FullName = dto.fullname,          
                Email = dto.Email,                
                PasswordHash = hashedPassword,    
                RoleId = dto.RoleID,              
                Gender = dto.gender,            
                PhoneNumber = dto.phonenumber,
                Address = dto.address,
                CreatedAt = DateTime.Now,
                Age = dto.Age,
                DateOfBirth = dto.DateOfBirth
            };

            // Add to database
            _context.AppUsers.Add(user);
            await _context.SaveChangesAsync();

            return true; // <-- return boolean
        }

        // Login method
        public async Task<bool> Login(LoginDto dto)
        {
            // Find the user by email
            var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return false;

            // Verify password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
                return false;

            return true;
        }
    }
}