using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RESCUFY.API.models;


namespace RESCUFY.API.models
{
    public class FirstAid
    {
        [Key]
        public int FirstAidId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }  // Title of the first aid procedure

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }  // Description of the procedure

        [Required]
        [MaxLength(500)]
        public string Symptoms { get; set; }  // Symptoms addressed by this first aid

        [Required]
        [MaxLength(1000)]
        public string Steps { get; set; }  // Step-by-step instructions

        [Required]
        [MaxLength(500)]
        public string Warnings { get; set; }  // Any warnings or precautions



    }
}
