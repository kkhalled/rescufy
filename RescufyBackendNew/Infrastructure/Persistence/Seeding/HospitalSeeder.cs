using Domain.Models;
using Persistence.Data;

namespace Persistence.Seeding
{
    public class HospitalSeeder(ApplicationDbContext context)
    {
        public async Task SeedAsync()
        {
            if (!context.Hospitals.Any())
            {
                var hospitals = new List<Hospital>
                {
                    new()
                    {
                        Name = "Aso Shofah - Cairo",
                        Address = "123 Nile Corniche, Maadi, Cairo",
                        ContactPhone = "02-23456789",
                        Latitude = 29.9602m,
                        Longitude = 31.2569m,
                        AvailableBeds = 50,
                        BedCapacity = 200,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Name = "Al Salam International Hospital",
                        Address = "Corniche El Nile, Maadi, Cairo",
                        ContactPhone = "02-19885",
                        Latitude = 29.9868m,
                        Longitude = 31.2277m,
                        AvailableBeds = 15,
                        BedCapacity = 350,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Name = "Dar Al Fouad Hospital",
                        Address = "26th of July Corridor, Giza",
                        ContactPhone = "16370",
                        Latitude = 30.0074m,
                        Longitude = 30.9733m,
                        AvailableBeds = 30,
                        BedCapacity = 150,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Name = "Ain Shams Specialized Hospital",
                        Address = "Khalifa El-Maamon St, Abbasiya, Cairo",
                        ContactPhone = "02-24024156",
                        Latitude = 30.0760m,
                        Longitude = 31.2859m,
                        AvailableBeds = 100,
                        BedCapacity = 800,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Name = "Saudi German Hospital",
                        Address = "Joseph Tito St, Nozha, Cairo",
                        ContactPhone = "16259",
                        Latitude = 30.1342m,
                        Longitude = 31.3653m,
                        AvailableBeds = 45,
                        BedCapacity = 300,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                await context.Hospitals.AddRangeAsync(hospitals);
                await context.SaveChangesAsync();
            }
        }
    }
}
