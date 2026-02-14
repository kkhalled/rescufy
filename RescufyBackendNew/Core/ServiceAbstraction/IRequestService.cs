using Domain.Models;
using Shared.DTOs;

namespace ServiceAbstraction
{
    public interface IRequestService
    {
        Task<Request> CreateRequestAsync(string userId, string description, decimal latitude, decimal longitude, string address, bool isSelfCase);
        Task<IEnumerable<Request>> GetDriverRequestsAsync(string driverId);
        Task<IEnumerable<Request>> GetRequestsAsync(RequestFilterDto filter);
    }
}
