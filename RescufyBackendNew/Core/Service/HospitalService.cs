using Domain.Contracts;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceAbstraction;
using Shared.DTOs.Hospital;
using Shared.DTOs.UserManagement;
using Shared.Enums;

namespace Service
{
    public class HospitalService(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager) : IHospitalService
    {
        public async Task<IEnumerable<HospitalDto>> GetAllHospitalsAsync()
        {
            var hospitals = await unitOfWork.GetRepository<Hospital, int>().GetAllAsync();
            return hospitals.Select(MapToDto);
        }

        public async Task<HospitalDto?> GetHospitalByIdAsync(int id)
        {
            var hospital = await unitOfWork.GetRepository<Hospital, int>().GetByIdAsync(id);
            return hospital == null ? null : MapToDto(hospital);
        }

        public async Task<HospitalDto> CreateHospitalAsync(CreateHospitalDto dto)
        {
            var hospital = new Hospital
            {
                Name = dto.Name,
                Address = dto.Address,
                ContactPhone = dto.ContactPhone,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                AvailableBeds = dto.AvailableBeds,
                BedCapacity = dto.BedCapacity,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await unitOfWork.GetRepository<Hospital, int>().AddAsync(hospital);
            await unitOfWork.SaveChangesAsync();

            return MapToDto(hospital);
        }

        public async Task<HospitalDto?> UpdateHospitalAsync(int id, UpdateHospitalDto dto)
        {
            var hospital = await unitOfWork.GetRepository<Hospital, int>().GetByIdAsync(id);
            if (hospital == null) return null;

            if (dto.Name != null) hospital.Name = dto.Name;
            if (dto.Address != null) hospital.Address = dto.Address;
            if (dto.ContactPhone != null) hospital.ContactPhone = dto.ContactPhone;
            if (dto.Latitude.HasValue) hospital.Latitude = dto.Latitude.Value;
            if (dto.Longitude.HasValue) hospital.Longitude = dto.Longitude.Value;
            if (dto.AvailableBeds.HasValue) hospital.AvailableBeds = dto.AvailableBeds.Value;
            if (dto.BedCapacity.HasValue) hospital.BedCapacity = dto.BedCapacity.Value;
            hospital.UpdatedAt = DateTime.UtcNow;

            unitOfWork.GetRepository<Hospital, int>().Update(hospital);
            await unitOfWork.SaveChangesAsync();

            return MapToDto(hospital);
        }

        public async Task<bool> DeleteHospitalAsync(int id)
        {
            var hospital = await unitOfWork.GetRepository<Hospital, int>().GetByIdAsync(id);
            if (hospital == null) return false;

            unitOfWork.GetRepository<Hospital, int>().Remove(hospital);
            await unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<UserDto>> GetHospitalAdminsAsync(int hospitalId)
        {
            var users = await userManager.Users
                .Where(u => u.HospitalId == hospitalId)
                .ToListAsync();

            var result = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                if (roles.Contains(nameof(Roles.HospitalAdmin)))
                {
                    result.Add(new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email ?? "",
                        Name = user.Name,
                        NationalId = user.NationalId,
                        Gender = user.Gender,
                        Age = user.Age,
                        PhoneNumber = user.PhoneNumber,
                        Roles = roles,
                        IsBanned = user.IsBanned,
                        HospitalId = user.HospitalId,
                        HospitalName = null
                    });
                }
            }
            return result;
        }

        private static HospitalDto MapToDto(Hospital hospital) => new()
        {
            Id = hospital.Id,
            Name = hospital.Name,
            Address = hospital.Address,
            ContactPhone = hospital.ContactPhone,
            Latitude = hospital.Latitude,
            Longitude = hospital.Longitude,
            AvailableBeds = hospital.AvailableBeds,
            BedCapacity = hospital.BedCapacity,
            CreatedAt = hospital.CreatedAt,
            UpdatedAt = hospital.UpdatedAt
        };
    }
}
