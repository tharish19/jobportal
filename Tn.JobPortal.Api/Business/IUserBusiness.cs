using Tn.JobPortal.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tn.JobPortal.Api.Business
{
    /// <summary>
    /// User Business Interface
    /// </summary>
    public interface IUserBusiness
    {
        /// <summary>
        /// Gets the latest jobs.
        /// </summary>
        /// <param name="postedByValues">The posted by values.</param>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        Task<UserJobDetailsAndSearchStringsModel> GetLatestJobsAsync(string postedByValues, string userId = null);

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
        Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString, string filteredBy, string postedByValues);

        /// <summary>
        /// Adds the or update job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus);

        /// <summary>
        /// Adds the or update job roles asynchronous.
        /// </summary>
        /// <param name="jobRoles">The job roles.</param>
        /// <returns></returns>
        Task<int> AddOrUpdateJobRolesAsync(JobRolesModel jobRoles);
    }
}
