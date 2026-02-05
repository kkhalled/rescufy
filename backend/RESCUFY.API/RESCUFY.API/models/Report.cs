using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RESCUFY.API.Data;
using RESCUFY.API.models;

namespace RESCUFY.API.models
{
    public class Report
    {
        [Key]
        public int ReportId { get; set; }

        // The patient this report belongs to
        [ForeignKey("User")]
        public int UserId { get; set; }
        public AppUser User { get; set; }

        public string BloodType { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string ChronicDiseases { get; set; }
        public string Allergies { get; set; }
        public string Medications { get; set; }
        public string PreviousSurgeries { get; set; }
        public string EmergencyNotes { get; set; }
        public string PreferredHospital { get; set; }
        public string PreferredDoctor { get; set; }
        public string InsuranceProvider { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;






    }
}
