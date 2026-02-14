using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;
using Shared.Enums;

namespace Persistence.Seeding
{
    public class UsersSeeder(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        public async Task SeedAsync()
        {
            // Ambulance Driver
            var ambulanceDriverUser = await userManager.FindByEmailAsync("driver@rescufy.com");
            if (ambulanceDriverUser == null)
            {
                ambulanceDriverUser = new ApplicationUser
                {
                    UserName = "ambulancedriver",
                    Email = "driver@rescufy.com",
                    Name = "Ambulance Driver",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(ambulanceDriverUser, "P@ssword12");
                if (!result.Succeeded) throw new Exception("Failed to create Ambulance Driver user");
            }

            if (!await userManager.IsInRoleAsync(ambulanceDriverUser, Roles.AmbulanceDriver.ToString()))
            {
                await userManager.AddToRoleAsync(ambulanceDriverUser, Roles.AmbulanceDriver.ToString());
            }

            // Hospital Admin
            var hospitalAdminUser = await userManager.FindByEmailAsync("admin@hospital.com");
            if (hospitalAdminUser == null)
            {
                hospitalAdminUser = new ApplicationUser
                {
                    UserName = "hospitaladmin",
                    Email = "admin@hospital.com",
                    Name = "Hospital Admin",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(hospitalAdminUser, "P@ssword12");
                if (!result.Succeeded) throw new Exception("Failed to create Hospital Admin user");
            }

            if (!await userManager.IsInRoleAsync(hospitalAdminUser, Roles.HospitalAdmin.ToString()))
            {
                await userManager.AddToRoleAsync(hospitalAdminUser, Roles.HospitalAdmin.ToString());
            }

            // Standard User
            var standardUser = await userManager.FindByEmailAsync("user@rescufy.com");
            if (standardUser == null)
            {
                standardUser = new ApplicationUser
                {
                    UserName = "user",
                    Email = "user@rescufy.com",
                    Name = "Standard User",
                    EmailConfirmed = true,
                    // Seed Emergency Contact
                    // EmergencyContacts = // Collection is initialized in constructor, but can add here if navig prop set. 
                    // Better to add separately via context to ensure IDs are set if needed, or saving changes.
                };
                var result = await userManager.CreateAsync(standardUser, "P@ssword12");
                if (!result.Succeeded) throw new Exception("Failed to create Standard User");
            }

            if (!await userManager.IsInRoleAsync(standardUser, Roles.User.ToString()))
            {
                await userManager.AddToRoleAsync(standardUser, Roles.User.ToString());
            }

            // Seed User Profile and Medical History for Standard User
            if (!context.UserProfiles.Any(p => p.UserId == standardUser.Id))
            {
                var profile = new UserProfile
                {
                    UserId = standardUser.Id,
                    BloodType = "O+",
                    WeightKg = 75.5f,
                    HeightCm = 180f,
                    PregnancyStatus = false,
                    MedicalNotes = "No major issues, allergic to Penicillin.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await context.UserProfiles.AddAsync(profile);
                await context.SaveChangesAsync(); // Save to get Profile Id

                // Seed Medical History
                var allergies = new List<Allergy>
                {
                    new() { ProfileId = profile.Id, Name = "Penicillin", Severity = "Severe", Notes = "Causes anaphylaxis" },
                    new() { ProfileId = profile.Id, Name = "Dust Mites", Severity = "Mild", Notes = "Sneezing and runny nose" }
                };
                await context.Allergies.AddRangeAsync(allergies);

                var conditions = new List<ChronicDisease>
                {
                    new() { ProfileId = profile.Id, Name = "Hypertension", Severity = "Moderate", DiagnosedYear = 2020, IsActive = true },
                    new() { ProfileId = profile.Id, Name = "Asthma", Severity = "Mild", DiagnosedYear = 2015, IsActive = true }
                };
                await context.ChronicDiseases.AddRangeAsync(conditions);

                var medications = new List<Medication>
                {
                    new() { ProfileId = profile.Id, Name = "Lisinopril", Dosage = "10mg", Frequency = "Once daily" },
                    new() { ProfileId = profile.Id, Name = "Albuterol Inhaler", Dosage = "2 puffs", Frequency = "As needed" }
                };
                await context.Medications.AddRangeAsync(medications);

                var surgeries = new List<PastSurgery>
                {
                    new() { ProfileId = profile.Id, Name = "Appendectomy", Year = 2010, Notes = "No complications" }
                };
                await context.PastSurgeries.AddRangeAsync(surgeries);
                
                // Seed Emergency Contact
                if (!context.EmergencyContacts.Any(c => c.ProfileId == standardUser.Id))
                {
                     // Note: EmergencyContact.ProfileId maps to ApplicationUser.Id (string), based on the model definition viewed earlier.
                     // The model had: public string ProfileId { get; set; } and [ForeignKey(nameof(ProfileId))] public ApplicationUser User { get; set; }
                     var emergencyContacts = new List<EmergencyContact>
                     {
                         new() { ProfileId = standardUser.Id, FullName = "Jane Doe", PhoneNumber = "010-99887766", Relation = "Spouse", IsActive = true, CreatedAt = DateTime.UtcNow },
                         new() { ProfileId = standardUser.Id, FullName = "John Smith", PhoneNumber = "011-22334455", Relation = "Father", IsActive = true, CreatedAt = DateTime.UtcNow }
                     };
                     await context.EmergencyContacts.AddRangeAsync(emergencyContacts);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
