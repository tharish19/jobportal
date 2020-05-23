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
    }
}
