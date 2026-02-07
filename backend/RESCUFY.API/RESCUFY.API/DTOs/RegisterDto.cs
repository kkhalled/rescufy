
namespace RESCUFY.API.DTOs
{
    public class RegisterDto
    {
        public string fullname { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public int RoleID {  get; set; }

        public string gender { get; set; }

        public string phonenumber { get; set; }
        public string address { get; set; }
        
        public int Age { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}