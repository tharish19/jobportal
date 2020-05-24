using Dapper;
using MySql.Data.MySqlClient;
using rest_api_jobs.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace rest_api_jobs.Repository
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
        /// Gets the latest jobs which are posted after the 4 pm of last business date.
        /// </summary>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetLatestJobsAsync(DateTime lastBusinessDateTime)
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<JobDetailsModel>("GetJobsFromLastBusinessDay",
                    new
                    {
                        lastBusinessDateTime
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        /// <summary>
        /// Gets the job search strings.
        /// </summary>
        /// <returns></returns>
        public async Task<List<string>> GetJobSearchStringsAsync()
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<string>("GetJobSearchStrings",
                    null, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        /// <summary>
        /// Gets the filtered jobs asynchronous.
        /// </summary>
        /// <param name="whereCondition">The where condition.</param>
        /// <param name="lastBusinessDateTime">The last business date time.</param>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string whereCondition, DateTime lastBusinessDateTime)
        {
            using (MySqlConnection connection = GetConnection())
            {
                var dbResult = await connection.QueryAsync<JobDetailsModel>("GetFilteredJobs",
                    new
                    {
                        whereCondition,
                        lastBusinessDateTime
                    }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return dbResult.ToList();
            }
        }

        //public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string whereCondition, string lastBusinessDateTime, string jobSearchString, string filteredBy)
        //{
        //    using (MySqlConnection connection = GetConnection())
        //    {
        //        var dbResult = await connection.QueryAsync<JobDetailsModel>("GetFilteredJobs",
        //            new
        //            {
        //                whereCondition,
        //                lastBusinessDateTime,
        //                jobSearchString,
        //                filteredBy
        //            }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
        //        return dbResult.ToList();
        //    }
        //}

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
    }
}
