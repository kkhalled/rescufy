using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RESCUFY.API.Data;
using RESCUFY.API.models;


namespace RESCUFY.API.models
{
    public class EmergencyRequest
    {
        [Key]
        public int EmergencyRequestId { get; set; }

        [Required]
        public int UserId { get; set; }  // Foreign key to User

        [ForeignKey("UserId")]
        public AppUser User { get; set; }   // Navigation property to User

        [Required]
        public int HospitalId { get; set; }  // Foreign key to Hospital

        [ForeignKey("HospitalId")]
        public Hospital Hospital { get; set; }  // Navigation property to Hospital

        [Required]
        public int AmbulanceId { get; set; }  // Foreign key to Ambulance

        [ForeignKey("AmbulanceId")]
        public Ambulance Ambulance { get; set; }  // Navigation property to Ambulance

        [Required]
        public DateTime RequestTime { get; set; }  // When the request was created

        [Required]
        [MaxLength(50)]

     
        public string Status { get; set; }  // e.g., "Pending", "Accepted", "Completed"

        [Required]
        [MaxLength(200)]
        public string Location { get; set; }  // Location of the emergency

        [Required]
        public double Latitude { get; set; }  // Where the emergency occurs

        [Required]
        public double Longitude { get; set; }  // Where the emergency occurs
    }
}
