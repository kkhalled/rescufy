using Domain.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Data;
using Persistence.Repositories;
using Persistence.Seeding;

namespace Persistence
{
	public static class InfrastructureServicesRegistration
	{
		public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<ApplicationDbContext>(options =>
			{
				var connectionString = configuration.GetConnectionString("DefaultConnection");
				options.UseSqlServer("Server=localhost;Database=rescufy_test;Trusted_Connection=True;TrustServerCertificate=True;");
			});

			services.AddScoped<IDataSeeding, DataSeeding>();
			services.AddScoped<IUnitOfWork, UnitOfWork>();
			services.AddScoped<SuperAdminSeeder>();
			services.AddScoped<RolesSeeder>();
			services.AddScoped<UsersSeeder>();
			services.AddScoped<AmbulanceSeeder>();
			services.AddScoped<HospitalSeeder>();
			return services;
		}
	}
}