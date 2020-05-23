using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using rest_api_jobs.Models;
using System.Net.Http;


namespace rest_api_jobs.Repository
{
    public class jobstatusRepository
    {
        private const string CacheKey = "ContactStore";
        public bool SaveContact(JobstatusC contact)
        {
            List<Jobstatus> list = new List<Jobstatus>();
            list.Add(new Jobstatus()
            {
                JobID = Convert.ToInt32(contact.job_id),
                JobStatus = contact.job_status.ToString(),
                AppliedBy = contact.user_id.ToString(),


            });
            return true;
        }
    }
}
