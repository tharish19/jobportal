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
    // [Authorize]
    public class UserController : ControllerBase
    {
        private IUserBusiness userBusiness;

        public UserController(IUserBusiness _userBusiness)
        {
            userBusiness = _userBusiness;
        }

        [HttpGet("jobsposted")]
        public async Task<List<JobDetailsModel>> GetLatestJobsAsync()
        {
            try
            {
                return await userBusiness.GetLatestJobsAsync().ConfigureAwait(false);
            }
            catch (Exception exp)
            {
                return null;
            }
        }
    }
}