using Domain.Contracts;
using Domain.Models;
using ServiceAbstraction;
using Shared.DTOs.Ambulance;
using Shared.Enums;

namespace Service
{
    public class AmbulanceService(IUnitOfWork unitOfWork) : IAmbulanceService
    {
        public async Task<IEnumerable<AmbulanceDto>> GetAllAmbulancesAsync()
        {
            var ambulances = await unitOfWork.GetRepository<Ambulance, int>()
                .GetAllAsync(includes: a => a.Driver!);
            return ambulances.Select(MapToDto);
        }

        public async Task<AmbulanceDto?> GetAmbulanceByIdAsync(int id)
        {
            var ambulance = await unitOfWork.GetRepository<Ambulance, int>()
                .GetFirstOrDefaultAsync(a => a.Id == id, a => a.Driver!);
            return ambulance == null ? null : MapToDto(ambulance);
        }

        public async Task<AmbulanceDto?> GetAmbulanceByDriverIdAsync(string driverId)
        {
            var ambulance = await unitOfWork.GetRepository<Ambulance, int>()
                .GetFirstOrDefaultAsync(a => a.DriverId == driverId, a => a.Driver!);
            return ambulance == null ? null : MapToDto(ambulance);
        }

        public async Task<AmbulanceDto> CreateAmbulanceAsync(CreateAmbulanceDto dto)
        {
            var ambulance = new Ambulance
            {
                Name = dto.Name,
                VehicleInfo = dto.VehicleInfo,
                DriverPhone = dto.DriverPhone,
                SimLatitude = dto.SimLatitude,
                SimLongitude = dto.SimLongitude,
                DriverId = dto.DriverId,
                AmbulanceStatus = AmbulanceStatus.Available,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await unitOfWork.GetRepository<Ambulance, int>().AddAsync(ambulance);
            await unitOfWork.SaveChangesAsync();

            return MapToDto(ambulance);
        }

        public async Task<AmbulanceDto?> UpdateAmbulanceAsync(int id, UpdateAmbulanceDto dto)
        {
            var ambulance = await unitOfWork.GetRepository<Ambulance, int>().GetByIdAsync(id);
            if (ambulance == null) return null;

            if (dto.Name != null) ambulance.Name = dto.Name;
            if (dto.VehicleInfo != null) ambulance.VehicleInfo = dto.VehicleInfo;
            if (dto.DriverPhone != null) ambulance.DriverPhone = dto.DriverPhone;
            if (dto.AmbulanceStatus.HasValue) ambulance.AmbulanceStatus = dto.AmbulanceStatus.Value;
            if (dto.SimLatitude.HasValue) ambulance.SimLatitude = dto.SimLatitude.Value;
            if (dto.SimLongitude.HasValue) ambulance.SimLongitude = dto.SimLongitude.Value;
            if (dto.DriverId != null) ambulance.DriverId = dto.DriverId;
            ambulance.UpdatedAt = DateTime.UtcNow;

            unitOfWork.GetRepository<Ambulance, int>().Update(ambulance);
            await unitOfWork.SaveChangesAsync();

            // Reload with driver info
            var updated = await unitOfWork.GetRepository<Ambulance, int>()
                .GetFirstOrDefaultAsync(a => a.Id == id, a => a.Driver!);
            return updated == null ? null : MapToDto(updated);
        }

        public async Task<bool> DeleteAmbulanceAsync(int id)
        {
            var ambulance = await unitOfWork.GetRepository<Ambulance, int>().GetByIdAsync(id);
            if (ambulance == null) return false;

            unitOfWork.GetRepository<Ambulance, int>().Remove(ambulance);
            await unitOfWork.SaveChangesAsync();

            return true;
        }

        private static AmbulanceDto MapToDto(Ambulance ambulance) => new()
        {
            Id = ambulance.Id,
            Name = ambulance.Name,
            VehicleInfo = ambulance.VehicleInfo,
            DriverPhone = ambulance.DriverPhone,
            AmbulanceStatus = ambulance.AmbulanceStatus,
            SimLatitude = ambulance.SimLatitude,
            SimLongitude = ambulance.SimLongitude,
            DriverId = ambulance.DriverId,
            DriverName = ambulance.Driver?.Name,
            CreatedAt = ambulance.CreatedAt,
            UpdatedAt = ambulance.UpdatedAt
        };
    }
}
