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
    }
}
