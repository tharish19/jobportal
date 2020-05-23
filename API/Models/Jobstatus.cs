using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using rest_api_jobs.Converters;
namespace rest_api_jobs.Models
{
    public class SearchQuery
    {
        public List<dynamic> data { get; set; }
        public int filterscount { get; set; }
        public int filterbyuser { get; set; }
        public string userid { get; set; }
        public string filtervalue1 { get; set; }
        public string filtercondition1 { get; set; }
        public string filterdatafield1 { get; set; }
        public string filteroperator1 { get; set; }

        public string filtervalue2 { get; set; }
        public string filtercondition2 { get; set; }
        public string filterdatafield2 { get; set; }
        public string filteroperator2 { get; set; }

        public string filtervalue3 { get; set; }
        public string filtercondition3 { get; set; }
        public string filterdatafield3 { get; set; }
        public string filteroperator3 { get; set; }

        public string filtervalue4 { get; set; }
        public string filtercondition4 { get; set; }
        public string filterdatafield4 { get; set; }
        public string filteroperator4 { get; set; }

        public string filtervalue5 { get; set; }
        public string filtercondition5 { get; set; }
        public string filterdatafield5 { get; set; }
        public string filteroperator5 { get; set; }

        public string filtervalue6 { get; set; }
        public string filtercondition6 { get; set; }
        public string filterdatafield6 { get; set; }
        public string filteroperator6 { get; set; }

        public string filtervalue7 { get; set; }
        public string filtercondition7 { get; set; }
        public string filterdatafield7 { get; set; }
        public string filteroperator7 { get; set; }

        public string filtervalue8 { get; set; }
        public string filtercondition8 { get; set; }
        public string filterdatafield8 { get; set; }
        public string filteroperator8 { get; set; }

        public string filtervalue9 { get; set; }
        public string filtercondition9 { get; set; }
        public string filterdatafield9 { get; set; }
        public string filteroperator9 { get; set; }

        public string filtervalue10 { get; set; }
        public string filtercondition10 { get; set; }
        public string filterdatafield10 { get; set; }
        public string filteroperator10 { get; set; }

        public string filtervalue0 { get; set; }
        public string filtercondition0 { get; set; }
        public string filterdatafield0 { get; set; }
        public string filteroperator0 { get; set; }

        public string filtervalue11 { get; set; }
        public string filtercondition11 { get; set; }
        public string filterdatafield11 { get; set; }
        public string filteroperator11 { get; set; }

        public string filtervalue12 { get; set; }
        public string filtercondition12 { get; set; }
        public string filterdatafield12 { get; set; }
        public string filteroperator12 { get; set; }

        public string filtervalue13 { get; set; }
        public string filtercondition13 { get; set; }
        public string filterdatafield13 { get; set; }
        public string filteroperator14 { get; set; }

        public string groupscount { get; set; }
        public string pagenum { get; set; }
        public int pagesize { get; set; }
        public int recordstartindex { get; set; }
        public int recordendindex { get; set; }
        public List<dynamic> filtersArray { get; set; }
        public string getsorttype { get; set; }
        public string getsortfield { get; set; }
        public List<dynamic> filterGroups { get; set; }
    }
        public class Jobstatus
    {

        [JsonConverter(typeof(IntToStringConverter))]
        public int JobID { get; set; }

        public string JobStatus { get; set; }

        public string AppliedBy { get; set; }

        public DateTime AppliedOn { get; set; }

        


    }
    
   public class JobstatusC
    {
        public string job_id { get; set; }

        public string job_status { get; set; }

        public string user_id { get; set; }
    }

    public class JobsFilter
    {
        public DateTime LastUsed { get; set; }

        public string where_jobs { get; set; }

        public string where_jobstatus { get; set; }

        public string userid { get; set; }
        public int pagenum { get; set; }
        public int pagesize {get; set;}
        public int startindex { get; set; }
        public int endindex { get; set; }
        public string jd_order { get; set; }

        public string js_order { get; set; }
    }
}
