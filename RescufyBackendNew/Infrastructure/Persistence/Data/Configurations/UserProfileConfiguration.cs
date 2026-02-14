using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("UserProfiles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.BloodType)
               .HasMaxLength(10)
               .IsRequired();

        builder.Property(x => x.MedicalNotes)
               .HasMaxLength(1000);

        builder.Property(x => x.WeightKg)
               .HasColumnType("decimal(18,2)");

        builder.Property(x => x.HeightCm)
               .HasColumnType("decimal(18,2)");
        
        builder.Property(x => x.PregnancyStatus)
               .IsRequired();

        builder.HasOne(x => x.ApplicationUser)
               .WithOne(u => u.UserProfile)
               .HasForeignKey<UserProfile>(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
