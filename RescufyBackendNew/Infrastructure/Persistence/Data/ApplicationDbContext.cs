using Domain.Models;
using Domain.Models.Security;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<LoginAudit> LoginAudits { get; set; }
        public DbSet<BlockedIp> BlockedIps { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<AIAnalysis> AIAnalyses { get; set; }
        public DbSet<Ambulance> Ambulances { get; set; }
        public DbSet<Hospital> Hospitals { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }
        public DbSet<EmergencyContact> EmergencyContacts { get; set; }
        public DbSet<ChronicDisease> ChronicDiseases { get; set; }
        public DbSet<Allergy> Allergies { get; set; }
        public DbSet<Medication> Medications { get; set; }
        public DbSet<PastSurgery> PastSurgeries { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AssemblyReference).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
