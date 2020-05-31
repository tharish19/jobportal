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
        /// Gets the latest jobs.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        Task<UserJobDetailsAndSearchStringsModel> GetLatestJobsAsync(string userId = null);

        /// <summary>
        /// Gets the job search strings.
        /// </summary>
        /// <returns></returns>
        Task<List<JobRolesModel>> GetJobSearchStringsAsync();

        /// <summary>
        /// Gets the filtered jobs.
        /// </summary>
        /// <param name="jobSearchString">The job search string.</param>
        /// <param name="filteredBy">The filtered by.</param>
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString, string filteredBy);

        /// <summary>
        /// Adds the or update job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus);
    }
}
