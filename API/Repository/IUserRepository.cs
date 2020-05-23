using rest_api_jobs.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace rest_api_jobs.Repository
{
    /// <summary>
    /// User Repository Interface
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Gets the holiday list asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<List<DateTime>> GetHolidayListAsync();

        /// <summary>
        /// Gets the latest jobs asynchronous.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetLatestJobsAsync(DateTime lastBusinessDateTime);

        /// <summary>
        /// Adds the or update job status asynchronous.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus);
    }
}
