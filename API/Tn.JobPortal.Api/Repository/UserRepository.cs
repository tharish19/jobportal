using Dapper;
using MySql.Data.MySqlClient;
using Tn.JobPortal.Api.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Tn.JobPortal.Api.Repository
{
    public class UserRepository : IUserRepository
    {
        /// <summary>
        /// The My SQL connection string
        /// </summary>
        private string connectionString;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserRepository"/> class.
        /// </summary>
        /// <param name="_connectionString">The connection string.</param>
        public UserRepository(string _connectionString)
        {
            connectionString = _connectionString;
        }

        /// <summary>
        /// Gets the MY SQL connection string.
        /// </summary>
        /// <returns></returns>
        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(connectionString);
        }

        /// <summary>
        /// Gets the list of holidays.
        /// </summary>
        /// <returns></returns>
        public async Task<List<DateTime>> GetHolidayListAsync()
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<DateTime>("GetHolidayList",
                    null, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        /// <summary>
        /// Gets the user job search strings.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        public async Task<string> GetUserJobSearchStringsAsync(string userId)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return (await connection.QueryAsync<string>("GetUserJobSearchStrings",
                    new
                    {
                        userId
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false)).FirstOrDefault();
            }
        }

        /// <summary>
        /// Gets the latest jobs which are posted after the 4 pm of last business date.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetLatestJobsAsync(DateTime lastBusinessDateTime, string user)
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<JobDetailsModel>("GetJobsFromLastBusinessDay",
                    new
                    {
                        lastBusinessDateTime,
                        user
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        /// <summary>
        /// Gets the job search strings.
        /// </summary>
        /// <returns></returns>
        public async Task<List<JobRolesModel>> GetJobSearchStringsAsync()
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<JobRolesModel>("GetJobSearchStrings",
                    null, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        /// <summary>
        /// Gets the filtered jobs.
        /// </summary>
        /// <param name="whereCondition">The where condition.</param>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="jobSearchString">The job search string.</param>
        /// <param name="filteredBy">The filtered by.</param>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string whereCondition, DateTime lastBusinessDateTime, string jobSearchString, string filteredBy)
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<JobDetailsModel>("GetFilteredJobs",
                    new
                    {
                        whereCondition,
                        lastBusinessDateTime,
                        jobSearchString,
                        filteredBy
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        /// <summary>
        /// Adds the or update selected job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        public async Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return await connection.ExecuteScalarAsync<bool>("AddOrUpdateJobStatus",
                    new
                    {
                        selectedJobID = jobStatus.JobID,
                        selectedJobStatus = jobStatus.JobStatus,
                        appliedByThe = jobStatus.AppliedBy
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Adds the or update job roles asynchronous.
        /// </summary>
        /// <param name="jobRoles">The job roles.</param>
        /// <returns></returns>
        public async Task<int> AddOrUpdateJobRolesAsync(JobRolesModel jobRoles)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return await connection.ExecuteScalarAsync<int>("AddOrUpdateJobRoles",
                    new
                    {
                        jobRoleId = jobRoles.JobRoleId,
                        jobRole = jobRoles.JobRole,
                        isDeleted = jobRoles.IsDeleted
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Gets the leader board details asynchronous.
        /// </summary>
        /// <param name="startDateTime">The start date time.</param>
        /// <returns></returns>
        public async Task<List<JobStatusModel>> GetLeaderBoardDetailsAsync(DateTime startDateTime)
        {
            using (MySqlConnection connection = GetConnection())
            {
                var result = await connection.QueryAsync<JobStatusModel>("GetLeaderBoardData",
                    new
                    {
                        startDateTime
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return result.ToList();
            }
        }

        /// <summary>
        /// Gets all consultants asynchronous.
        /// </summary>
        /// <returns>
        /// all consultants
        /// </returns>
        public async Task<List<ConsultantsDataModel>> GetAllConsultantsAsync()
        {
            using (MySqlConnection connection = GetConnection())
            {
                var result = await connection.QueryAsync<ConsultantsDataModel>("GetConsultants",
                    null, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return result.ToList();
            }
        }

        /// <summary>
        /// Adds the or update consultant asynchronous.
        /// </summary>
        /// <param name="ConsultantID">The consultant identifier.</param>
        /// <param name="ConsultantName">Name of the consultant.</param>
        /// <param name="MobileNumber">The mobile number.</param>
        /// <param name="Email">The email.</param>
        /// <param name="JobTitle">The job title.</param>
        /// <param name="insertedBy">The inserted by.</param>
        /// <returns>
        /// consultantId
        /// </returns>
        public async Task<int> AddOrUpdateConsultantAsync(int consultantId, string consultantName, string mobileNumber, string email, string jobTitle, string insertedBy)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return await connection.ExecuteScalarAsync<int>("AddOrUpdateConsultants",
                    new
                    {
                        cstId = consultantId,
                        consultantName,
                        email,
                        mobileNumber,
                        jobTitle,
                        insertedBy
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Adds the or update consultant member mapping asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="memberId">The member identifier.</param>
        /// <param name="insertedBy">The inserted by.</param>
        /// <returns>
        /// Consultant ID
        /// </returns>
        public async Task<int> AddOrUpdateConsultantMemberMappingAsync(int consultantId, string memberId, string insertedBy)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return await connection.ExecuteScalarAsync<int>("AddOrUpdateConsultantMemberMappings",
                    new
                    {
                        consultantId,
                        memberId,
                        insertedBy
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Adds the or update consultant job role mapping asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="jobRoleId">The job role identifier.</param>
        /// <param name="insertedBy">The inserted by.</param>
        /// <returns>
        /// consultant ID
        /// </returns>
        public async Task<int> AddOrUpdateConsultantJobRoleMappingAsync(int consultantId, int jobRoleId, string insertedBy)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return await connection.ExecuteScalarAsync<int>("AddOrUpdateConsultantJobRoleMappings",
                    new
                    {
                        consultantId,
                        jobRoleId,
                        insertedBy
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Deletes the consultants asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="updatedBy">The updated by.</param>
        /// <returns></returns>
        public async Task<bool> DeleteConsultantsAsync(int consultantId, string updatedBy)
        {
            using (MySqlConnection connection = GetConnection())
            {
                return await connection.ExecuteScalarAsync<bool>("DeleteConsultant",
                    new
                    {
                        consultantId,
                        updatedBy
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Gets all consultants and jobs for member asynchronous.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="memberId">The member identifier.</param>
        /// <returns>
        /// all consultants and jobs
        /// </returns>
        public async Task<ConsultantsAndJobs> GetAllConsultantsAndJobsForMemberAsync(DateTime lastBusinessDateTime, string memberId)
        {
            using (MySqlConnection connection = GetConnection())
            {
                ConsultantsAndJobs consultantsAndJobs = new ConsultantsAndJobs();
                var reader = connection.QueryMultiple("GetAllConsultantsAndJobsForMember",
                    new
                    {
                        lastBusinessDateTime,
                        memberId
                    }, null, null, commandType: CommandType.StoredProcedure);
                consultantsAndJobs.ConsultantsData = (await reader.ReadAsync<BasicConsultantData>().ConfigureAwait(false)).ToList();
                consultantsAndJobs.JobsData = (await reader.ReadAsync<JobDetailsModel>().ConfigureAwait(false)).ToList();
                return consultantsAndJobs;
            }
        }

        /// <summary>
        /// Gets the selected consultant jobs for member.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <param name="memberId">The member identifier.</param>
        /// <param name="consultantIdList">The consultant identifier list.</param>
        /// <returns>
        /// jobs
        /// </returns>
        public async Task<List<JobDetailsModel>> GetSelectedConsultantJobsForMember(DateTime lastBusinessDateTime, string memberId, string consultantIdList)
        {
            using (MySqlConnection connection = GetConnection())
            {
                var result = await connection.QueryAsync<JobDetailsModel>("GetSelectedConsultantJobsForMember",
                    new
                    {
                        lastBusinessDateTime,
                        consultantIdList,
                        memberId
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return result.ToList();
            }
        }
    }
}
