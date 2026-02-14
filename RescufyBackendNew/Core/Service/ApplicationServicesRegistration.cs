using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Service.Helpers;
using ServiceAbstraction;
using Shared.Settings;

namespace Service
{
    public static class ApplicationServicesRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddSingleton<IMailingService, MailingService>();
            services.AddScoped<IEmailValidatorService, EmailValidatorService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IpSecurityService>();

            services.AddAutoMapper((serviceProvider, cfg) =>
            {
                var appSettings = serviceProvider.GetRequiredService<IOptions<AppSettings>>();
                cfg.AddProfile(new MappingProfile(appSettings));
            }, typeof(MappingProfile));

            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IRequestService, RequestService>();
            services.AddScoped<IUserService, UserService>();
            return services;
        }
    }
}