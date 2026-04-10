using Domain.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence.Data;

namespace Persistence.Seeding
{
    public class DataSeeding(
        ApplicationDbContext _context,
        IHostEnvironment _env,
        SuperAdminSeeder _superAdminSeeder,
        RolesSeeder _rolesSeeder,
        UsersSeeder _usersSeeder,
        AmbulanceSeeder _ambulanceSeeder,
        HospitalSeeder _hospitalSeeder,
        RequestSeeder _requestSeeder,
        ILogger<DataSeeding> _logger
        ) : IDataSeeding
    {
        public void DataSeed()
        {
            try
            {
                // Apply pending migrations
                var pendingMigrations = _context.Database.GetPendingMigrations().ToList();
                if (pendingMigrations.Any())
                {
                    _logger.LogInformation("Applying {Count} pending migrations: {Migrations}", 
                        pendingMigrations.Count, string.Join(", ", pendingMigrations));
                    _context.Database.Migrate();
                }

                _rolesSeeder.SeedAsync().GetAwaiter().GetResult();
                _superAdminSeeder.SeedAsync().GetAwaiter().GetResult();

                // Only seed test data in development
                if (_env.IsDevelopment())
                {
                    _usersSeeder.SeedAsync().GetAwaiter().GetResult();
                    _ambulanceSeeder.SeedAsync().GetAwaiter().GetResult();
                    _hospitalSeeder.SeedAsync().GetAwaiter().GetResult();
                    _requestSeeder.SeedAsync().GetAwaiter().GetResult();
                }

                _context.SaveChanges();
                _logger.LogInformation("Data seeding completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data seeding: {Message}", ex.Message);
                throw;
            }
        }
    }
}
