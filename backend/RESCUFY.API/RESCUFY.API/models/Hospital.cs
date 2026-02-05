using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RESCUFY.API.models;


namespace RESCUFY.API.models
{
    public class Hospital
    {
        [Key]
        public int HospitalId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(200)]
        public string Location { get; set; }  // Location of the hospital

        [Required]
        public int Capacity { get; set; }  // Number of beds or general capacity

        // Navigation property: all emergency requests assigned to this hospital
        public ICollection<EmergencyRequest> EmergencyRequests { get; set; }

    }
}
