using Domain.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
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
        HospitalSeeder _hospitalSeeder
        ) : IDataSeeding
    {
        public void DataSeed()
        {
            if (!_env.IsDevelopment())
                if (_context.Database.GetPendingMigrations().Any())
                    _context.Database.Migrate();

            _rolesSeeder.SeedAsync().GetAwaiter().GetResult();
            _superAdminSeeder.SeedAsync().GetAwaiter().GetResult();
            _usersSeeder.SeedAsync().GetAwaiter().GetResult();
            _ambulanceSeeder.SeedAsync().GetAwaiter().GetResult();
            _hospitalSeeder.SeedAsync().GetAwaiter().GetResult();

            _context.SaveChanges();
        }
    }
}
