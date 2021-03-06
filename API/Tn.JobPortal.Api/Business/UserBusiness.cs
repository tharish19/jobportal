﻿using Tn.JobPortal.Api.Models;
using Tn.JobPortal.Api.Repository;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Linq;

namespace Tn.JobPortal.Api.Business
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
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
            DateTime cstDateTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);

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
                DateTime date = cstDateTime.Date;
                List<JobDetailsModel> jobs;
                do
                {
                    DateTime lastBusinessDateTime = GetLastBusinessDay(date);
                    jobs = await userRepository.GetLatestJobsAsync(lastBusinessDateTime, userId).ConfigureAwait(false);

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
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);

            string whereCondition = "";
            string postedByCondition = "";
            string jobRoleCondition = "";
            string[] filters;
            holidayList = (holidayList.Count <= 0) ? await userRepository.GetHolidayListAsync().ConfigureAwait(false) : holidayList;
            DateTime lastBusinessDateTime = GetLastBusinessDay(cstTime.Date);

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

        /// <summary>
        /// Gets the leader board details asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<WeekAndDayLeaderBoard> GetLeaderBoardDetailsAsync()
        {
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");

            DateTime date = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);
            List<JobStatusModel> result = new List<JobStatusModel>();

            DateTime lastBusinessDateTime = GetDateForTheDay(date.Date, 1); // Value of Monday is 1 for Day Of Week
            result = await userRepository.GetLeaderBoardDetailsAsync(lastBusinessDateTime).ConfigureAwait(false);

            List<LeaderBoardDetails> weekData = GetLeaderBoardDetails(result);

            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);

            var now = cstTime.Hour;
            var dateTimeToFilter = (now >= 9) ? cstTime.Date : cstTime.Date.AddDays(-1);

            List<JobStatusModel> response = result.Where(x => x.AppliedOn > dateTimeToFilter).ToList();
            List<LeaderBoardDetails> todayData = GetLeaderBoardDetails(response);

            WeekAndDayLeaderBoard leaderBoard = new WeekAndDayLeaderBoard();
            leaderBoard.DayDetails = todayData.OrderBy(m => m.Rank).ToList();
            leaderBoard.WeekDetails = weekData.OrderBy(m => m.Rank).ToList();

            return leaderBoard;
        }

        /// <summary>
        /// Gets all consultants asynchronous.
        /// </summary>
        /// <returns>
        /// all consultants
        /// </returns>
        public async Task<List<ConsultantsClientModel>> GetAllConsultantsAsync()
        {
            var response = await userRepository.GetAllConsultantsAsync().ConfigureAwait(false);
            List<ConsultantsClientModel> consultantsList = new List<ConsultantsClientModel>();
            var groupData = response.GroupBy(x => x.ConsultantID).ToList();
            foreach (var consultant in groupData.ToList())
            {
                List<string> MemberList = new List<string>();
                List<int> JobRoleList = new List<int>();
                foreach (var row in consultant)
                {
                    if (MemberList.Where(x => x == row.MemberID).Count() <= 0) MemberList.Add(row.MemberID);
                    if (JobRoleList.Where(x => x == row.JobRoleID).Count() <= 0) JobRoleList.Add(row.JobRoleID);
                }

                consultantsList.Add(
                    new ConsultantsClientModel()
                    {
                        ConsultantId = consultant.FirstOrDefault().ConsultantID,
                        ConsultantName = consultant.FirstOrDefault().ConsultantName,
                        Email = consultant.FirstOrDefault().Email,
                        MobileNumber = consultant.FirstOrDefault().MobileNumber,
                        JobTitle = consultant.FirstOrDefault().JobTitle,
                        MemberIdList = MemberList,
                        JobRoleIdList = JobRoleList
                    });
            }
            return consultantsList;
        }

        /// <summary>
        /// Adds the or update consultants asynchronous.
        /// </summary>
        /// <param name="insertedBy">The inserted by.</param>
        /// <param name="consultantData">The consultant data.</param>
        /// <returns>
        /// response
        /// </returns>
        public async Task<int> AddOrUpdateConsultantsAsync(string insertedBy, ConsultantsClientModel consultantData)
        {
            var response = await userRepository.AddOrUpdateConsultantAsync(consultantData.ConsultantId, consultantData.ConsultantName, consultantData.MobileNumber, consultantData.Email, consultantData.JobTitle, insertedBy).ConfigureAwait(false);

            if (consultantData.ConsultantId == 0) consultantData.ConsultantId = response;

            if (response > 0)
            {
                foreach (var memberId in consultantData.MemberIdList)
                {
                    await userRepository.AddOrUpdateConsultantMemberMappingAsync(consultantData.ConsultantId, memberId, insertedBy).ConfigureAwait(false);
                }

                foreach (var jobRoleId in consultantData.JobRoleIdList)
                {
                    await userRepository.AddOrUpdateConsultantJobRoleMappingAsync(consultantData.ConsultantId, jobRoleId, insertedBy).ConfigureAwait(false);
                }
            }
            return response;
        }

        /// <summary>
        /// Deletes the consultants asynchronous.
        /// </summary>
        /// <param name="consultantId">The consultant identifier.</param>
        /// <param name="updatedBy">The updated by.</param>
        /// <returns>
        /// response
        /// </returns>
        public async Task<bool> DeleteConsultantsAsync(int consultantId, string updatedBy)
        {
            return await userRepository.DeleteConsultantsAsync(consultantId, updatedBy).ConfigureAwait(false);
        }

        /// <summary>
        /// Gets all consultants and jobs for member asynchronous.
        /// </summary>
        /// <param name="memberId">The member identifier.</param>
        /// <returns>
        /// all consultants and jobs
        /// </returns>
        public async Task<ConsultantsAndJobs> GetAllConsultantsAndJobsForMemberAsync(string memberId)
        {
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);
            holidayList = (holidayList.Count <= 0) ? await userRepository.GetHolidayListAsync().ConfigureAwait(false) : holidayList;
            DateTime lastBusinessDateTime = GetLastBusinessDay(cstTime.Date);

            return await userRepository.GetAllConsultantsAndJobsForMemberAsync(lastBusinessDateTime, memberId).ConfigureAwait(false);
        }

        /// <summary>
        /// Gets the selected consultant jobs for member.
        /// </summary>
        /// <param name="memberId">The member identifier.</param>
        /// <param name="consultantIdList">The consultant identifier list.</param>
        /// <returns>
        /// list of jobs
        /// </returns>
        public async Task<List<JobDetailsModel>> GetSelectedConsultantJobsForMember(string memberId, string consultantIdList)
        {
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);
            holidayList = (holidayList.Count <= 0) ? await userRepository.GetHolidayListAsync().ConfigureAwait(false) : holidayList;
            DateTime lastBusinessDateTime = GetLastBusinessDay(cstTime.Date);

            return await userRepository.GetSelectedConsultantJobsForMember(lastBusinessDateTime, memberId, consultantIdList).ConfigureAwait(false);
        }

        #region Private Methods

        /// <summary>
        /// Gets the leader board details.
        /// </summary>
        /// <param name="result">The result.</param>
        /// <returns></returns>
        private List<LeaderBoardDetails> GetLeaderBoardDetails(List<JobStatusModel> result)
        {
            var groupedUsers = result.GroupBy(x => x.AppliedBy).ToList();
            var byTotalViews = groupedUsers.OrderByDescending(m => m.Count()).ToList();
            List<LeaderBoardDetails> leaderBoard = new List<LeaderBoardDetails>();

            foreach (var user in groupedUsers)
            {
                LeaderBoardDetails leaderBoardObject = new LeaderBoardDetails();
                leaderBoardObject.name = user.Key;
                leaderBoardObject.Rank = byTotalViews.FindIndex(x => x.Key == user.Key) + 1;
                leaderBoardObject.submissions = user.Count();
                leaderBoard.Add(leaderBoardObject);
            }
            return leaderBoard;
        }



        /// <summary>
        /// Gets the date for the day.
        /// </summary>
        /// <param name="date">The date.</param>
        /// <param name="day">The day.</param>
        /// <returns></returns>
        private DateTime GetDateForTheDay(DateTime date, int day)
        {
            while ((int)date.DayOfWeek != day)
                date = date.AddDays(-1);

            return date;
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

        #endregion
    }
}
