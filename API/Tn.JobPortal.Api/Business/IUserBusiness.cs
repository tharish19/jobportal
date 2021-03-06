﻿using Tn.JobPortal.Api.Models;
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

        /// <summary>
        /// Gets the leader board details asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<WeekAndDayLeaderBoard> GetLeaderBoardDetailsAsync();

        /// <summary>
        /// Gets all consultants asynchronous.
        /// </summary>
        /// <returns>all consultants</returns>
        Task<List<ConsultantsClientModel>> GetAllConsultantsAsync();

        /// <summary>
        /// Adds the or update consultants asynchronous.
        /// </summary>
        /// <param name="insertedBy">The inserted by.</param>
        /// <param name="consultantData">The consultant data.</param>
        /// <returns>response</returns>
        Task<int> AddOrUpdateConsultantsAsync(string insertedBy, ConsultantsClientModel consultantData);

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
        /// <param name="memberId">The member identifier.</param>
        /// <returns>all consultants and jobs </returns>
        Task<ConsultantsAndJobs> GetAllConsultantsAndJobsForMemberAsync(string memberId);

        /// <summary>
        /// Gets the selected consultant jobs for member.
        /// </summary>
        /// <param name="memberId">The member identifier.</param>
        /// <param name="consultantIdList">The consultant identifier list.</param>
        /// <returns>list of jobs</returns>
        Task<List<JobDetailsModel>> GetSelectedConsultantJobsForMember(string memberId, string consultantIdList);
    }
}
