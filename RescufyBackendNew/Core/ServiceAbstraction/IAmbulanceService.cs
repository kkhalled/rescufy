using Shared.DTOs.Ambulance;

namespace ServiceAbstraction
{
    public interface IAmbulanceService
    {
        Task<IEnumerable<AmbulanceDto>> GetAllAmbulancesAsync();
        Task<AmbulanceDto?> GetAmbulanceByIdAsync(int id);
        Task<AmbulanceDto> CreateAmbulanceAsync(CreateAmbulanceDto dto);
        Task<AmbulanceDto?> UpdateAmbulanceAsync(int id, UpdateAmbulanceDto dto);
        Task<bool> DeleteAmbulanceAsync(int id);
        Task<AmbulanceDto?> GetAmbulanceByDriverIdAsync(string driverId);
    }
}
