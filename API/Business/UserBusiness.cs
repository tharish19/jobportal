using rest_api_jobs.Models;
using rest_api_jobs.Repository;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace rest_api_jobs.Business
{
    public class UserBusiness : IUserBusiness
    {
        /// <summary>
        /// The user repository Interface
        /// </summary>
        private readonly IUserRepository userRepository;

        /// <summary>
        /// The holiday list
        /// </summary>
        private List<DateTime> holidayList;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserBusiness"/> class.
        /// </summary>
        /// <param name="_userRepository">The user repository.</param>
        public UserBusiness(IUserRepository _userRepository)
        {
            userRepository = _userRepository;
            holidayList = new List<DateTime>();
        }

        /// <summary>
        /// Gets the latest jobs asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<UserJobDetailsAndSearchStringsModel> GetLatestJobsAsync(string postedByValues, string userId = null)
        {
            UserJobDetailsAndSearchStringsModel userJobDetailsAndSearchStrings = new UserJobDetailsAndSearchStringsModel();

            List<JobRolesModel> jobSearchStrings = await userRepository.GetJobSearchStringsAsync().ConfigureAwait(false);
            string userJobSearchString = (userId != null && userId != "") ? await userRepository.GetUserJobSearchStringsAsync(userId).ConfigureAwait(false) : "";

            userJobDetailsAndSearchStrings.UserJobSearchString = userJobSearchString;
            userJobDetailsAndSearchStrings.JobSearchStrings = jobSearchStrings;

            if (userJobSearchString != null && userJobSearchString != "")
            {
                userJobDetailsAndSearchStrings.JobDetails = await GetFilteredJobsAsync(userJobSearchString, userId, postedByValues);
                return userJobDetailsAndSearchStrings;
            }
            else
            {
                int counter = 0;
                bool isNotDataSufficient = true;
                holidayList = (holidayList.Count <= 0) ? await userRepository.GetHolidayListAsync().ConfigureAwait(false) : holidayList;
                DateTime date = DateTime.Today;
                List<JobDetailsModel> jobs;
                do
                {
                    DateTime lastBusinessDateTime = GetLastBusinessDay(date);
                    jobs = await userRepository.GetLatestJobsAsync(lastBusinessDateTime).ConfigureAwait(false);

                    counter++;
                    date = date.AddDays(-1);

                    if (jobs.Count > 100 || counter >= 4)
                        isNotDataSufficient = false;

                } while (isNotDataSufficient);
                userJobDetailsAndSearchStrings.JobDetails = jobs;
                return userJobDetailsAndSearchStrings;
            }
        }

        /// <summary>
        /// Gets the job search strings.
        /// </summary>
        /// <returns></returns>
        public async Task<List<JobRolesModel>> GetJobSearchStringsAsync()
        {
            return await userRepository.GetJobSearchStringsAsync().ConfigureAwait(false);
        }

        /// <summary>
        /// Gets the filtered jobs asynchronous.
        /// </summary>
        /// <param name="jobSearchString">The job search string.</param>
        /// <param name="filteredBy">The filtered by.</param>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString, string filteredBy, string postedByValues)
        {
            string whereCondition = "";
            string postedByCondition = "";
            string jobRoleCondition = "";
            string[] filters;
            holidayList = (holidayList.Count <= 0) ? await userRepository.GetHolidayListAsync().ConfigureAwait(false) : holidayList;
            DateTime lastBusinessDateTime = GetLastBusinessDay(DateTime.Today);

            if (postedByValues != null && postedByValues != "")
            {
                filters = postedByValues.Split(',');

                foreach (var str in filters)
                {
                    postedByCondition = postedByCondition + " OR JD.PostedBy like '%" + str + "%'";
                }

                postedByCondition = Regex.Replace(postedByCondition, "^ OR (.*)", " AND ($1) ");
            }

            if (jobSearchString != null && jobSearchString != "")
            {
                filters = jobSearchString.Split(',');

                foreach (var str in filters)
                {
                    jobRoleCondition = jobRoleCondition + " OR JD.JobSearchString like '%" + str + "%'";
                }

                jobRoleCondition = Regex.Replace(jobRoleCondition, "^ OR (.*)", " AND ($1)");
            }

            whereCondition = postedByCondition + jobRoleCondition + " order by JD.RowInsertDate Desc";

            return await userRepository.GetFilteredJobsAsync(whereCondition, lastBusinessDateTime, jobSearchString, filteredBy).ConfigureAwait(false);
        }

        /// <summary>
        /// Adds the or update job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        public async Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus)
        {
            return await userRepository.AddOrUpdateJobStatusAsync(jobStatus).ConfigureAwait(false);
        }

        /// <summary>
        /// Adds the or update job roles asynchronous.
        /// </summary>
        /// <param name="jobRoles">The job roles.</param>
        /// <returns></returns>
        public async Task<int> AddOrUpdateJobRolesAsync(JobRolesModel jobRoles)
        {
            return await userRepository.AddOrUpdateJobRolesAsync(jobRoles).ConfigureAwait(false);
        }

        #region Private Methods

        /// <summary>
        /// Gets the last business day.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>Last Business Day</returns>
        private DateTime GetLastBusinessDay(DateTime date)
        {
            do
            {
                date = date.AddDays(-1);
            }
            while (IsHoliday(date));

            while (IsWeekend(date))
                date = date.AddDays(-1);

            return date.AddHours(16);
        }

        /// <summary>
        /// Determines whether the specified date is weekend.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>
        ///   <c>true</c> if the specified date is weekend; otherwise, <c>false</c>.
        /// </returns>
        private bool IsWeekend(DateTime date)
        {
            return date.DayOfWeek == DayOfWeek.Saturday ||
                   date.DayOfWeek == DayOfWeek.Sunday;
        }

        /// <summary>
        /// Determines whether the specified date is holiday.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <returns>
        ///   <c>true</c> if the specified date is holiday; otherwise, <c>false</c>.
        /// </returns>
        private bool IsHoliday(DateTime date)
        {
            return holidayList.Contains(date);
        }

        #endregion
    }
}
