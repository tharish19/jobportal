﻿using rest_api_jobs.Models;
using rest_api_jobs.Repository;
using System;
using System.Collections.Generic;
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
    }
}
