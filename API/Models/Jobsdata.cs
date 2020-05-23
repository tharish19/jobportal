using MySql.Data.MySqlClient;    
using System;    
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections;
using System.Runtime.InteropServices.ComTypes;

namespace rest_api_jobs.Models
{

    public class Jobsdata
    {
        public string ConnectionString { get; set; }

        public Jobsdata(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
        public dynamic GetAlljobstring(string filtercondition = null, string filterdatafield = null, string filtervalue = null)
        {
            string where = "";
            string wherei = "";
            dynamic arrayList = new ArrayList();
            if (filterdatafield == "appliedDate" || filterdatafield == "rowinsertdate")
               //filtervalue = "DATE_FORMAT(" + filtervalue + ", % M % d % Y)";
               filtervalue= DateTime.Parse(filtervalue).ToString("yyyy-MM-dd");
            switch (filtercondition)
            {
                case "CONTAINS":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE '%" + filtervalue + "%'";
                    else
                        where += " " + filterdatafield + " LIKE '%" + filtervalue + "%'";
                    break;
                case "CONTAINS_CASE_SENSITIVE":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE BINARY '%" + filtervalue + "%'";
                    else
                        where += " " + filterdatafield + " LIKE BINARY '%" + filtervalue + "%'";
                    break;
                case "DOES_NOT_CONTAIN":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " NOT LIKE '%" + filtervalue + "%'";
                    else
                        where += " " + filterdatafield + " NOT LIKE '%" + filtervalue + "%'";
                    break;
                case "DOES_NOT_CONTAIN_CASE_SENSITIVE":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " NOT LIKE BINARY '%" + filtervalue + "%'";
                    else
                        where += " " + filterdatafield + " NOT LIKE BINARY '%" + filtervalue + "%'";
                    break;
                case "EQUAL":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " = '" + filtervalue + "'";
                    
                    else
                        where += " " + filterdatafield + " = '" + filtervalue + "'";
                    break;
                case "EQUAL_CASE_SENSITIVE":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE BINARY '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " LIKE BINARY '" + filtervalue + "'";
                    break;
                case "NOT_EQUAL":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " NOT LIKE '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " NOT LIKE '" + filtervalue + "'";
                    break;
                case "NOT_EQUAL_CASE_SENSITIVE":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " NOT LIKE BINARY '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " NOT LIKE BINARY '" + filtervalue + "'";
                    break;
                case "GREATER_THAN":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " > '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " > '" + filtervalue + "'";
                    break;
                case "LESS_THAN":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " < '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " < '" + filtervalue + "'";
                    break;
                case "GREATER_THAN_OR_EQUAL":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " >= '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " >= '" + filtervalue + "'";
                    break;
                case "LESS_THAN_OR_EQUAL":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " <= '" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " <= '" + filtervalue + "'";
                    break;
                case "STARTS_WITH":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE '" + filtervalue + "%'";
                    else
                        where += " " + filterdatafield + " LIKE '" + filtervalue + "%'";
                    break;
                case "STARTS_WITH_CASE_SENSITIVE":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE BINARY '" + filtervalue + "%'";
                    else
                        where += " " + filterdatafield + " LIKE BINARY '" + filtervalue + "%'";
                    break;
                case "ENDS_WITH":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE '%" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " LIKE '%" + filtervalue + "'";
                    break;
                case "ENDS_WITH_CASE_SENSITIVE":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " LIKE BINARY '%" + filtervalue + "'";
                    else
                        where += " " + filterdatafield + " LIKE BINARY '%" + filtervalue + "'";
                    break;
                case "NULL":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " IS NULL";
                    else
                        where += " " + filterdatafield + " IS NULL";
                    break;
                case "NOT_NULL":
                    if (filterdatafield == "appliedBy" || filterdatafield == "appliedDate")
                        wherei += " " + filterdatafield + " IS NOT NULL";
                    else
                        where += " " + filterdatafield + " IS NOT NULL";
                    break;
            }
           
            arrayList.Add(where);
            arrayList.Add(wherei);
            return arrayList;
        }
        public dynamic filterAppliedby(dynamic wh = null)
        {
            var arrayList = new ArrayList();
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                wh = wh.Replace("appliedDate", "appliedOn");
                string wee = wh;
                System.Diagnostics.Debug.WriteLine(wee);
                MySqlCommand cmd = new MySqlCommand("select jobID from jobsstatus " + wh, conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int jid=Convert.ToInt32(reader["jobID"]);
                        arrayList.Add(jid);
                    }
                }
            }
            string query = "";
            if(arrayList.Count>0)
            {
                query += "  jobID in(";
                int i = 1;
                foreach(int inn in arrayList)
                {
                    query += inn;
                    if (i != arrayList.Count)
                        query += ",";
                    i++;
                }
               
                query += ")";
            }
            if (query.Length > 3)
                query = query + " and ";
            else query =" jobID in(99999999999999999999) and ";
            return query;
        }
        public List<Jobs> GetAlljobs(int start, int endIndex = 500, dynamic myform = null, dynamic wh = null, dynamic whi = null, string orderby = null, string orderbyi = null)
        {

            List<Jobs> list = new List<Jobs>();
            string wherein = "";
            if (whi != null && whi != "" && whi.Length > 5)
                wherein = this.filterAppliedby(whi);
            using (MySqlConnection conn = GetConnection())
            {
                //,(select AppliedBy from jobsstatus as s where s.jobID=j.jobID and s.jobStatus=1 limit 1) as AppliedBy
                conn.Open();
                System.Diagnostics.Debug.WriteLine(wherein);
                string whh = wh.Replace("me", "i");
                System.Diagnostics.Debug.WriteLine(whh);
                MySqlCommand cmd = new MySqlCommand("select * from jobsdetails  where " + wherein + " " + wh + " " + orderby + "  limit @Start,@End", conn);
                cmd.Parameters.AddWithValue("@Start", start);
                cmd.Parameters.AddWithValue("@End", endIndex);
                int count = this.getTotalrows(wh, wherein);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var d = new Jobs();


                        d.JobID = Convert.ToInt32(reader["JobID"]);
                        d.JobTitle = reader["JobTitle"].ToString();
                        d.JobLocation = reader["JobLocation"].ToString();
                        d.JobType = reader["JobType"].ToString();
                        d.CompanyName = reader["CompanyName"].ToString();
                        d.PostedBy = reader["PostedBy"].ToString();
                        d.rowinsertdate = Convert.ToDateTime(reader["rowinsertdate"]);
                        d.JobURL = reader["JobURL"].ToString();
                        d.AppliedBy = endIndex.ToString();
                        d.Archive = reader["Archive"].ToString();
                        d.count = count;
                        d.AppliedDate = "";
                        list.Add(d);

                    }
                }
            }
            return list;
        }
        public List<JobsFilter> getJobFilter(string st = null)
        {
            List<JobsFilter> result = new List<JobsFilter>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();

                MySqlCommand cmd1 = new MySqlCommand("select * from jobssearchfilter where userid=@user_id order by lastUsed desc limit 1", conn);
                
                    cmd1.Parameters.AddWithValue("@user_id", st);
                    using (var reader = cmd1.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            var d = new JobsFilter();
                            d.pagesize = Convert.ToInt32(reader["pagesize"]);
                            d.where_jobs = reader["where_jobs"].ToString();
                            d.where_jobstatus = reader["where_jobstatus"].ToString();
                            d.pagenum = Convert.ToInt32(reader["pagenum"]);
                            d.pagesize = Convert.ToInt32(reader["pagesize"]);
                            d.startindex = Convert.ToInt32(reader["startindex"]);
                            d.endindex = Convert.ToInt32(reader["endindex"]);
                            d.js_order = reader["js_order"].ToString();
                            d.jd_order = reader["jd_order"].ToString();
                            result.Add(d);
                        }
                    }

                
            }

            return result;
        }
        public int getTotalrows(dynamic wh = null, dynamic whr = null)
        {
            
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
               
                MySqlCommand cmd = new MySqlCommand("select count(*)  as count from jobsdetails  where " + whr + " " + wh, conn);
                int count = Convert.ToInt32(cmd.ExecuteScalar());
                return count;
            }
        }
        public List<Jobstatus> getJobstatusrows (Jobstatus st)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("select count(*)  as count from jobsstatus where jobID=@JobID and appliedBy=@AppliedBy", conn);
                cmd.Parameters.AddWithValue("@JobID", st.JobID);
                cmd.Parameters.AddWithValue("@JobStatus", st.JobStatus);
                cmd.Parameters.AddWithValue("@AppliedBy", st.AppliedBy);
                int count = Convert.ToInt32(cmd.ExecuteScalar());
                return this.updateJobstatus(st,count);
                
            }
        }
        public List<Jobstatus> updateJobstatus(Jobstatus st,int count=0)
        {
            List<Jobstatus> result = new List<Jobstatus>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                string sqlq = "";
                if (count > 0)
                sqlq  = "update jobsstatus set jobStatus=@JobStatus where jobID=@JobID and appliedBy=@AppliedBy";
                else
                sqlq = "insert into jobsstatus(jobID,jobStatus,appliedBy)values(@JobID,@JobStatus,@AppliedBy)";
                using (MySqlCommand cmd = new MySqlCommand(sqlq, conn))
                {

                    cmd.Parameters.AddWithValue("@JobID", st.JobID);
                    cmd.Parameters.AddWithValue("@JobStatus", st.JobStatus);
                    cmd.Parameters.AddWithValue("@AppliedBy", st.AppliedBy);

                    try
                    {

                        using (var reader = cmd.ExecuteReader())
                        {
                            var list = new Jobstatus();
                            while (reader.Read())
                            {

                                list.JobID = Convert.ToInt32(reader["JobID"]);
                                list.JobStatus = reader["JobStatus"].ToString();
                                list.AppliedBy = reader["AppliedBy"].ToString();

                                result.Add(list);

                            }
                            list.JobID = st.JobID;
                            list.JobStatus = st.JobStatus;
                            list.AppliedBy = st.AppliedBy;

                            result.Add(list);
                        }
                        return result;
                    }
                    catch (Exception e)
                    {
                        var list = new Jobstatus();
                        list.JobID = st.JobID;
                        list.AppliedBy = e.Message.ToString();
                        result.Add(list);
                        return result;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }

            }

        }
       
        public List<JobsFilter> insertJobFilter(JobsFilter st)
        {
            List<JobsFilter> result = new List<JobsFilter>();
            
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                int count = 0;
                string sqlq = "";
                using(MySqlCommand cmd1=new MySqlCommand("select count(*) as count from jobssearchfilter where userid=@userid",conn))
                {
                    cmd1.Parameters.AddWithValue("@userid", st.userid);
                    count = Convert.ToInt32(cmd1.ExecuteScalar());
                }
                if (count > 0)
                    sqlq = "update jobssearchfilter set where_jobs=@where_jobs,where_jobstatus=@where_jobstatus,pagenum=@pagenum,pagesize=@pagesize,startindex=@startindex,endindex=@endindex,userid=@userid,js_order=@js_order,jd_order=@jd_order where  userid=@userid";
                else
                    sqlq = "insert into jobssearchfilter(userid,where_jobs,where_jobstatus,pagenum,pagesize,startindex,endindex,js_order,jd_order)values(@userid,@where_jobs,@where_jobstatus,@pagenum,@pagesize,@startindex,@endindex,@js_order,@jd_order)";
                
             //string    sqlqq = "update jobssearchfilter set where_jobs="+st.where_jobs+ ",where_jobstatus=" + st.where_jobstatus + ",pagenum= " + st.pagenum + ",pagesize=" + st.pagesize + ",startindex= " + st.startindex+",endindex= " + st.endindex+", userid= "+st.userid+", js_order=" + st.js_order+",jd_order= "+st.jd_order+" where  userid=" + st.userid;
               
                using (MySqlCommand cmd = new MySqlCommand(sqlq, conn))
                {

                    cmd.Parameters.AddWithValue("@where_jobs", st.where_jobs);
                    cmd.Parameters.AddWithValue("@where_jobstatus", st.where_jobstatus);
                    cmd.Parameters.AddWithValue("@pagenum", st.pagenum);
                    cmd.Parameters.AddWithValue("@pagesize", st.pagesize);
                    cmd.Parameters.AddWithValue("@startindex", st.startindex);
                    cmd.Parameters.AddWithValue("@endindex", st.endindex);
                    cmd.Parameters.AddWithValue("@userid", st.userid);
                    cmd.Parameters.AddWithValue("@js_order", st.js_order);
                    cmd.Parameters.AddWithValue("@jd_order", st.jd_order);

                    try
                    {

                        using (var reader = cmd.ExecuteReader())
                        {
                            var list = new JobsFilter();
                           
                            list.userid = st.userid;
                            list.pagesize = st.pagesize;
                            list.pagenum =  st.pagenum;
                            list.startindex = st.startindex;
                            list.endindex = st.endindex;

                            result.Add(list);
                        }
                        return result;
                    }
                    catch (Exception e)
                    {
                        var list = new JobsFilter();
                        list.userid = st.userid;
                        list.where_jobs = st.where_jobs.Trim()+" "+e.Message.ToString();
                        result.Add(list);
                        return result;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }

            }
            
        }
        
        public List<Jobstatus> GetAlljobstatus()
        {
            List<Jobstatus> list = new List<Jobstatus>();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("select * from jobsstatus ", conn);

                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        list.Add(new Jobstatus()
                        {
                            JobID = Convert.ToInt32(reader["JobID"]),
                            JobStatus = reader["JobStatus"].ToString(),
                            AppliedBy = reader["AppliedBy"].ToString(),
                            AppliedOn = Convert.ToDateTime(reader["AppliedOn"])
                                        

                        });
                    }
                }
                
            }
            return list;
        }

        public dynamic GetAlljobgroupby(string col=null)
        {
            var arrayList = new ArrayList();

            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("select DISTINCT "+ col + "  from jobsdetails where Archive=0", conn);
                /*JobID = Convert.ToInt32(reader["jobID"]),
                            PostedBy = reader["postedBy"].ToString(),*/
                using (var reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        if(reader[col].ToString()!="")
                        arrayList.Add(reader[col].ToString());
                   
                    }
                }

            }
            return arrayList;
        }

    }
   
}
