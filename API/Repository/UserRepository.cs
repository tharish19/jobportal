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
        private string connectionString;

        public UserRepository(string _connectionString)
        {
            connectionString = _connectionString;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(connectionString);
        }

        public async Task<IEnumerable<JobDetailsModel>> GetLatestJobsAsync()
        {
            DateTime.TryParse("2020-05-21 03:35:00", out DateTime lastBusinessDateTime);
            try
            {
                using (MySqlConnection connection = GetConnection())
                {
                    var dbResult = await connection.QueryAsync<JobDetailsModel>
                        ("GetJobsFromLastBusinessDay",
                        new
                        {
                            lastBusinessDateTime
                        }, null, null, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                    return dbResult.ToList();
                }
            }
            catch (Exception)
            {

                throw;
            }

            return null;
        }
    }
}
