using Shared.DTOs.Hospital;
using Shared.DTOs.UserManagement;

namespace ServiceAbstraction
{
    public interface IHospitalService
    {
        Task<IEnumerable<HospitalDto>> GetAllHospitalsAsync();
        Task<HospitalDto?> GetHospitalByIdAsync(int id);
        Task<HospitalDto> CreateHospitalAsync(CreateHospitalDto dto);
        Task<HospitalDto?> UpdateHospitalAsync(int id, UpdateHospitalDto dto);
        Task<bool> DeleteHospitalAsync(int id);
        Task<IEnumerable<UserDto>> GetHospitalAdminsAsync(int hospitalId);
    }
}
