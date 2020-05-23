using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace rest_api_jobs.Models
{
    public class Jobs
    {
        

        public int JobID { get; set; }

        public string JobTitle { get; set; }

        public string JobLocation { get; set; }

        public string JobType { get; set; }

        public string JobURL { get; set; }

        public string CompanyName { get; set; }

        public string PostedBy { get; set; }

        public  DateTime rowinsertdate { get; set; }

        
        public string AppliedDate { get; set; }

        public string AppliedBy { get; set; }

        public string Archive { get; set; }

        public int count { get; set; }


    }

    public class jobsResult
    {
        public dynamic jobLocation { get; set; }

        public dynamic postedBy { get; set; }
        public List<Jobstatus> data { get; set; }
    }
}
