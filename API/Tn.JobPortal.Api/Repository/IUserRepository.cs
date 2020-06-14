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

        /// <summary>
        /// Gets all consultants asynchronous.
        /// </summary>
        /// <returns>all consultants</returns>
        Task<List<ConsultantsDataModel>> GetAllConsultantsAsync();

        /// <summary>
        /// Adds the or update consultant asynchronous.
        /// </summary>
        /// <param name="ConsultantID">The consultant identifier.</param>
        /// <param name="ConsultantName">Name of the consultant.</param>
        /// <param name="MobileNumber">The mobile number.</param>
        /// <param name="Email">The email.</param>
        /// <param name="JobTitle">The job title.</param>
        /// <param name="insertedBy">The inserted by.</param>
        /// <returns>consultantId</returns>
        Task<int> AddOrUpdateConsultantAsync(int consultantId, string consultantName, string mobileNumber, string email, string jobTitle, string insertedBy);

        /// <summary>
        /// Adds the or update consultant member mapping asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="memberId">The member identifier.</param>
        /// <param name="insertedBy">The inserted by.</param>
        /// <returns>Consultant ID</returns>
        Task<int> AddOrUpdateConsultantMemberMappingAsync(int consultantId, string memberId, string insertedBy);

        /// <summary>
        /// Adds the or update consultant job role mapping asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="jobRoleId">The job role identifier.</param>
        /// <param name="insertedBy">The inserted by.</param>
        /// <returns>consultant ID</returns>
        Task<int> AddOrUpdateConsultantJobRoleMappingAsync(int consultantId, int jobRoleId, string insertedBy);

        /// <summary>
        /// Deletes the consultants asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="updatedBy">The updated by.</param>
        /// <returns>
        /// response
        /// </returns>
        Task<bool> DeleteConsultantsAsync(int consultantId, string updatedBy);

        /// <summary>
        /// Gets all consultants and jobs for member asynchronous.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="memberId">The member identifier.</param>
        /// <returns>all consultants and jobs</returns>
        Task<ConsultantsAndJobs> GetAllConsultantsAndJobsForMemberAsync(DateTime lastBusinessDateTime, string memberId);

        /// <summary>
        /// Gets the selected consultant jobs for member.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="memberId">The member identifier.</param>
        /// <param name="consultantIdList">The consultant identifier list.</param>
        /// <returns>jobs</returns>
        Task<List<JobDetailsModel>> GetSelectedConsultantJobsForMember(DateTime lastBusinessDateTime, string memberId, string consultantIdList);
    }
}
