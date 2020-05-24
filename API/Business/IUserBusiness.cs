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
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetLatestJobsAsync();

        /// <summary>
        /// Gets the filtered jobs.
        /// </summary>
        /// <param name="jobSearchString">The job search string.</param>
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString);

        //Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString, string filteredBy);

        /// <summary>
        /// Adds the or update job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus);
    }
}
