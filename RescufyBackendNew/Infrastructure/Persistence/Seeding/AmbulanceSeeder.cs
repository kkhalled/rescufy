using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;
using Shared.Enums;

namespace Persistence.Seeding
{
    public class AmbulanceSeeder(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        public async Task SeedAsync()
        {
            if (!context.Ambulances.Any())
            {
                var driver = await userManager.FindByEmailAsync("driver@rescufy.com");
                if (driver != null)
                {
                    var ambulances = new List<Ambulance>
                    {
                        new()
                        {
                            Name = "Ambulance Alpha",
                            VehicleInfo = "Ford Transit 2024 - ICU Unit",
                            DriverPhone = "010-12345678",
                            AmbulanceStatus = AmbulanceStatus.Available,
                            SimLatitude = 30.0444m, // Downtown Cairo
                            SimLongitude = 31.2357m,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            DriverId = driver.Id
                        },
                        new()
                        {
                            Name = "Ambulance Bravo",
                            VehicleInfo = "Toyota HiAce 2023",
                            DriverPhone = "011-87654321",
                            AmbulanceStatus = AmbulanceStatus.Available,
                            SimLatitude = 29.9792m, // Giza Pyramid Area
                            SimLongitude = 31.1342m,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            DriverId = null // Currently unassigned
                        },
                        new()
                        {
                            Name = "Ambulance Charlie",
                            VehicleInfo = "Mercedes-Benz Sprinter 2022",
                            DriverPhone = "012-11223344",
                            AmbulanceStatus = AmbulanceStatus.Busy,
                            SimLatitude = 30.0967m, // Heliopolis
                            SimLongitude = 31.3303m,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            DriverId = null
                        }
                    };

                    await context.Ambulances.AddRangeAsync(ambulances);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
