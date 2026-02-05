using RESCUFY.API.Data;    // This allows C# to see AppDbContext
using RESCUFY.API.Models;  // For AppUser, Role, UserRole
using RESCUFY.API.models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace RESCUFY.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<EmergencyContact> EmergencyContacts { get; set; }
        public DbSet<Hospital> Hospitals { get; set; }
        public DbSet<Ambulance> Ambulances { get; set; }
        public DbSet<EmergencyRequest> EmergencyRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<FirstAid> FirstAids { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Add this to fix the Hospital -> EmergencyRequest cycle
            modelBuilder.Entity<EmergencyRequest>()
                .HasOne(er => er.Hospital)           // EmergencyRequest has one Hospital
                .WithMany(h => h.EmergencyRequests) // Hospital has many EmergencyRequests
                .HasForeignKey(er => er.HospitalId) // the FK in EmergencyRequest
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // Fix multiple cascade paths for UserRole
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany( u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

        }

    }
}