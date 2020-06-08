using Tn.JobPortal.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tn.JobPortal.Api.Repository
{
    /// <summary>
    /// User Repository Interface
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Gets the holiday list.
        /// </summary>
        /// <returns></returns>
        Task<List<DateTime>> GetHolidayListAsync();

        /// <summary>
        /// Gets the user job search strings asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        Task<string> GetUserJobSearchStringsAsync(string userId);

        /// <summary>
        /// Gets the latest jobs.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetLatestJobsAsync(DateTime lastBusinessDateTime, string user);

        /// <summary>
        /// Gets the job search strings.
        /// </summary>
        /// <returns></returns>
        Task<List<JobRolesModel>> GetJobSearchStringsAsync();

        /// <summary>
        /// Gets the filtered jobs.
        /// </summary>
        /// <param name="whereCondition">The where condition.</param>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="jobSearchString">The job search string.</param>
        /// <param name="filteredBy">The filtered by.</param>
        /// <returns></returns>
        Task<List<JobDetailsModel>> GetFilteredJobsAsync(string whereCondition, DateTime lastBusinessDateTime, string jobSearchString, string filteredBy);

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

        /// <summary>
        /// Gets the leader board details asynchronous.
        /// </summary>
        /// <param name="startDateTime">The start date time.</param>
        /// <returns></returns>
        Task<List<JobStatusModel>> GetLeaderBoardDetailsAsync(DateTime startDateTime);
    }
}
