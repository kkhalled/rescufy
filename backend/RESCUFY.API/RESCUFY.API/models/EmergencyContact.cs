using RESCUFY.API.models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RESCUFY.API.Models
{
    public class EmergencyContact
    {
        [Key] // <-- this is required
        public int ContactId { get; set; }

        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Relationship { get; set; }

        [ForeignKey("AppUser")]
        public int UserId { get; set; }
        public AppUser User { get; set; }
    }
}