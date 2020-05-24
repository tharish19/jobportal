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
        }

        /// <summary>
        /// Gets the latest jobs asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetLatestJobsAsync()
        {
            int counter = 0;
            bool isNotDataSufficient = true;
            holidayList = new List<DateTime>();
            holidayList = await userRepository.GetHolidayListAsync().ConfigureAwait(false);
            List<JobDetailsModel> jobs = new List<JobDetailsModel>();
            DateTime date = DateTime.Today;

            do
            {
                DateTime lastBusinessDateTime = GetLastBusinessDay(date);
                jobs = await userRepository.GetLatestJobsAsync(lastBusinessDateTime).ConfigureAwait(false);

                counter++;
                date = date.AddDays(-1);

                if (jobs.Count > 100 || counter >= 5)
                    isNotDataSufficient = false;

            } while (isNotDataSufficient);

            return jobs;
        }

        /// <summary>
        /// Gets the filtered jobs asynchronous.
        /// </summary>
        /// <param name="jobSearchString">The job search string.</param>
        /// <returns></returns>
        public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString)
        {
            holidayList = new List<DateTime>();
            holidayList = await userRepository.GetHolidayListAsync().ConfigureAwait(false);
            DateTime lastBusinessDateTime = GetLastBusinessDay(DateTime.Today);
            string[] filters = jobSearchString.Split(',');
            string whereCondition = "";
            foreach (var str in filters)
            {
                whereCondition = whereCondition + " OR JobSearchString like '" + str + "'";
            }
            whereCondition = Regex.Replace(whereCondition, "^ OR (.*)", " $1" + " order by JD.RowInsertDate Desc");

            return await userRepository.GetFilteredJobsAsync(whereCondition, lastBusinessDateTime).ConfigureAwait(false);
        }

        //public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString, string filteredBy)
        //{
        //    holidayList = new List<DateTime>();
        //    holidayList = await userRepository.GetHolidayListAsync().ConfigureAwait(false);
        //    DateTime lastBusinessDateTime = GetLastBusinessDay(DateTime.Today);
        //    string[] filters = jobSearchString.Split(',');
        //    string whereCondition = "";
        //    foreach (var str in filters)
        //    {
        //        whereCondition = whereCondition + " OR JobSearchString like '" + str + "'";
        //    }
        //    whereCondition = Regex.Replace(whereCondition, "^ OR (.*)", " $1" + " order by JD.RowInsertDate Desc");

        //    return await userRepository.GetFilteredJobsAsync(whereCondition, lastBusinessDateTime, jobSearchString, filteredBy).ConfigureAwait(false);
        //}

        /// <summary>
        /// Adds the or update job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        public async Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus)
        {
            return await userRepository.AddOrUpdateJobStatusAsync(jobStatus).ConfigureAwait(false);
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
