using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RESCUFY.API.Data;
using RESCUFY.API.models;

namespace RESCUFY.API.models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        [Required]
        public int UserId { get; set; }  // Foreign key to User

        [ForeignKey("UserId")]
        public AppUser User { get; set; }  // Navigation property to User

        [Required]
        [MaxLength(50)]
        public string Type { get; set; }  // Type of notification

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }  // e.g., "Sent", "Read"

        [Required]
        public DateTime SendingTime { get; set; }  // When the notification was sent

        [Required]
        [MaxLength(500)]
        public string Message { get; set; }  // The notification content



    }
}
