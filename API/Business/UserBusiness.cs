using rest_api_jobs.Models;
using rest_api_jobs.Repository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace rest_api_jobs.Business
{
    public class UserBusiness : IUserBusiness
    {
        private readonly IUserRepository userRepository;

        public UserBusiness(IUserRepository _userRepository)
        {
            userRepository = _userRepository;
        }

        public async Task<IEnumerable<JobDetailsModel>> GetLatestJobsAsync()
        {
            var response = await userRepository.GetLatestJobsAsync().ConfigureAwait(false);
            return response;
        }
    }
}
