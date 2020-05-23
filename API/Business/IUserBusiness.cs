using rest_api_jobs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace rest_api_jobs.Business
{
    /// <summary>
    /// User Business Interface
    /// </summary>
    public interface IUserBusiness
    {
        /// <summary>
        /// Gets the latest jobs asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetLatestJobsAsync();
    }
}
