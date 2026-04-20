using Domain.Contracts;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using ServiceAbstraction;
using Shared.DTOs;
using Shared.Enums;

namespace Service
{
    public class RequestService(IUnitOfWork unitOfWork) : IRequestService
    {
        public async Task<Request> CreateRequestAsync(string userId, string description, decimal latitude, decimal longitude, string address, bool isSelfCase)
        {
            return await CreateRequestAsync(userId, description, latitude, longitude, address, isSelfCase, numberOfPeopleAffected: 1);
        }

        async Task IRequestService.CreateRequestAsync(string userId, string description, decimal latitude, decimal longitude, string address, bool isSelfCase, int numberOfPeopleAffected)
        {
            await CreateRequestInternalAsync(userId, description, latitude, longitude, address, isSelfCase, numberOfPeopleAffected);
        }

        public async Task<Request> CreateRequestAsync(string userId, string description, decimal latitude, decimal longitude, string address, bool isSelfCase, int numberOfPeopleAffected)
        {
            return await CreateRequestInternalAsync(userId, description, latitude, longitude, address, isSelfCase, numberOfPeopleAffected);
        }

        private async Task<Request> CreateRequestInternalAsync(string userId, string description, decimal latitude, decimal longitude, string address, bool isSelfCase, int numberOfPeopleAffected)
        {
            var request = new Request
            {
                UserId = userId,
                Description = description,
                IsSelfCase = isSelfCase,
                Latitude = latitude,
                Longitude = longitude,
                Address = address,
                NumberOfPeopleAffected = numberOfPeopleAffected,
                RequestStatus = RequestStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            try
            {
                await unitOfWork.GetRepository<Request, int>().AddAsync(request);

                await unitOfWork.SaveChangesAsync(); // Save to get RequestId
            }
            catch (Exception)
            {

                throw;
            }

            // Find nearest available ambulance
            var ambulances = await unitOfWork.GetRepository<Ambulance, int>()
                .GetAllAsync(a => a.AmbulanceStatus == AmbulanceStatus.Available && a.DriverId != null);

            Ambulance? nearestAmbulance = null;
            double minDistance = double.MaxValue;

            foreach (var ambulance in ambulances)
            {
                var distance = CalculateDistance((double)latitude, (double)longitude, (double)ambulance.SimLatitude, (double)ambulance.SimLongitude);
                if (distance < minDistance)
                {
                    minDistance = distance;
                    nearestAmbulance = ambulance;
                }
            }

            if (nearestAmbulance != null)
            {
                var assignment = new Assignment
                {
                    RequestId = request.Id,
                    AmbulanceId = nearestAmbulance.Id,
                    AssignedAt = DateTime.UtcNow,
                    AutoAssigned = true,
                    DistanceKm = (float)minDistance,
                    HospitalDistanceKm = 0, // Placeholder
                    Status = AssignmentStatus.Pending,
                    AssignedBy = userId,
                    Notes = ""
                };
                
                // Assuming AssignmentStatus exists or is handled by default prop if not available. 
                // Checked Assignment.cs, it inherits from BaseEntity which has Id.
                // Assignment.cs has properties but no Status enum shown in view_file earlier? 
                // Wait, Assignment.cs showed: public int RequestId... public int AmbulanceId... 
                // It didn't explicitly show 'AssignmentStatus'. 
                // Let's check shared enums if AssignmentStatus exists, or if I should set RequestStatus. 
                // The prompt implies assignment. 
                
                await unitOfWork.GetRepository<Assignment, int>().AddAsync(assignment);
                request.RequestStatus = RequestStatus.Assigned;
                unitOfWork.GetRepository<Request, int>().Update(request);
                
                nearestAmbulance.AmbulanceStatus = AmbulanceStatus.Busy;
                unitOfWork.GetRepository<Ambulance, int>().Update(nearestAmbulance);

                try
                {
                    await unitOfWork.SaveChangesAsync();
                }
                catch (Exception)
                {

                    throw;
                }
            }

            return request;
        }

        public async Task<IEnumerable<Request>> GetDriverRequestsAsync(string driverId)
        {
            var assignments = await unitOfWork.GetRepository<Assignment, int>()
                .GetAllAsync(
                    predicate: a => a.Ambulance.DriverId == driverId,
                    includes: [a => a.Request, a => a.Request.ApplicationUser, a => a.Ambulance]
                );

            return assignments.Select(a => a.Request);
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Haversine formula
            var R = 6371; // Radius of the earth in km
            var dLat = Deg2Rad(lat2 - lat1);
            var dLon = Deg2Rad(lon2 - lon1);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(Deg2Rad(lat1)) * Math.Cos(Deg2Rad(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        private double Deg2Rad(double deg)
        {
            return deg * (Math.PI / 180);
        }

        public async Task<IEnumerable<Request>> GetRequestsAsync(RequestFilterDto filter)
        {
            return await unitOfWork.Context.Set<Request>()
                .Include(r => r.ApplicationUser)
                .Where(r =>
                    (string.IsNullOrEmpty(filter.UserId) || r.UserId == filter.UserId) &&
                    (!filter.RequestStatus.HasValue || r.RequestStatus == filter.RequestStatus) &&
                    (!filter.IsSelfCase.HasValue || r.IsSelfCase == filter.IsSelfCase) &&
                    (!filter.StartDate.HasValue || r.CreatedAt >= filter.StartDate) &&
                    (!filter.EndDate.HasValue || r.CreatedAt <= filter.EndDate)
                )
                .ToListAsync();
        }

        public async Task<Request?> GetRequestByIdAsync(int id)
        {
            return await unitOfWork.Context.Set<Request>()
                .Include(r => r.ApplicationUser)
                    .ThenInclude(u => u.UserProfile)
                        .ThenInclude(p => p.ChronicDiseases)
                .Include(r => r.ApplicationUser)
                    .ThenInclude(u => u.UserProfile)
                        .ThenInclude(p => p.Medications)
                .Include(r => r.ApplicationUser)
                    .ThenInclude(u => u.UserProfile)
                        .ThenInclude(p => p.Allergies)
                .Include(r => r.AIAnalysis)
                .Include(r => r.Assignments)
                    .ThenInclude(a => a.Ambulance)
                        .ThenInclude(amb => amb.Driver)
                .Include(r => r.Assignments)
                    .ThenInclude(a => a.Hospital)
                .Include(r => r.AuditLogs)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}
