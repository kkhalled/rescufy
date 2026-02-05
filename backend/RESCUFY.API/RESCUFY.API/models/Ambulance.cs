using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RESCUFY.API.models;


namespace RESCUFY.API.models
{
    public class Ambulance
    {
        [Key]
        public int AmbulanceId { get; set; }

        [Required]
        [MaxLength(50)]
        public string LicensePlate { get; set; }  // Ambulance registration number

        [Required]
        public int HospitalId { get; set; }  // Foreign key to Hospital

        [ForeignKey("HospitalId")]
        public Hospital Hospital { get; set; }  // Navigation property to Hospital

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }  // e.g., "Available", "OnRoute", "Busy"

        // Navigation property: all emergency requests assigned to this ambulance
        public ICollection<EmergencyRequest> EmergencyRequests { get; set; }

        [Required]
        public double Latitude { get; set; }  // Simulated or real latitude

        [Required]
        public double Longitude { get; set; }  // Simulated or real longitude
    }
}
