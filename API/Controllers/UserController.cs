using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using rest_api_jobs.Business;
using rest_api_jobs.Models;

namespace rest_api_jobs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class UserController : ControllerBase
    {
        /// <summary>
        /// The user business
        /// </summary>
        private IUserBusiness userBusiness;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="_userBusiness">The user business.</param>
        public UserController(IUserBusiness _userBusiness)
        {
            userBusiness = _userBusiness;
        }

        /// <summary>
        /// Gets the latest jobs posted.
        /// </summary>
        /// <returns></returns>
        [HttpGet("jobsposted/{userid?}")]
        public async Task<List<JobDetailsModel>> GetLatestJobsAsync(string userId = null)
        {
            return await userBusiness.GetLatestJobsAsync(userId).ConfigureAwait(false);
        }

        /// <summary>
        /// Gets the job search strings.
        /// </summary>
        /// <returns></returns>
        [HttpGet("searchstrings")]
        public async Task<List<string>> GetJobSearchStringsAsync()
        {
            return await userBusiness.GetJobSearchStringsAsync().ConfigureAwait(false);
        }


        /// <summary>
        /// Gets the filtered jobs asynchronous.
        /// </summary>
        /// <param name="jobSearchString">The job search string.</param>
        /// <param name="filteredBy">The filtered by.</param>
        /// <returns></returns>
        [HttpGet("filter/jobs/{jobSearchString}/{filteredBy}")]
        public async Task<List<JobDetailsModel>> GetFilteredJobsAsync(string jobSearchString, string filteredBy)
        {
            return await userBusiness.GetFilteredJobsAsync(jobSearchString, filteredBy).ConfigureAwait(false);
        }

        /// <summary>
        /// Adds the or update job status.
        /// </summary>
        /// <param name="jobStatus">The job status.</param>
        /// <returns></returns>
        [HttpPost("update/job/status")]
        public async Task<bool> AddOrUpdateJobStatusAsync(JobStatusModel jobStatus)
        {
            return await userBusiness.AddOrUpdateJobStatusAsync(jobStatus).ConfigureAwait(false);
        }
    }
}