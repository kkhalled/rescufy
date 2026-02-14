using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.ToTable("Assignments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Notes)
               .HasMaxLength(1000);

        builder.Property(x => x.Status)
               .HasConversion<int>()
               .IsRequired();

        builder.HasOne(x => x.Request)
               .WithMany(r => r.Assignments)
               .HasForeignKey(x => x.RequestId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Ambulance)
               .WithMany(a => a.Assignments)
               .HasForeignKey(x => x.AmbulanceId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Hospital)
               .WithMany(h => h.Assignments)
               .HasForeignKey(x => x.HospitalId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.ApplicationUser)
               .WithMany(u => u.AssignedAssignments)
               .HasForeignKey(x => x.AssignedBy)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
