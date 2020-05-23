
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using rest_api_jobs.Models;
using rest_api_jobs.Repository;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Web;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity;
using System.Collections;
using System.Security.Cryptography;
using System.IO;
using System.Data;
namespace rest_api_jobs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class FetchmysqldataController : ControllerBase
    {

        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };



        [HttpPost]
        public IEnumerable<Jobs> Post([FromForm] SearchQuery jObject)
        {
            //System.Diagnostics.Debug.WriteLine(wee);
            Jobsdata context = HttpContext.RequestServices.GetService(typeof(rest_api_jobs.Models.Jobsdata)) as Jobsdata;

            ArrayList wherej = new ArrayList();
            ArrayList wherei = new ArrayList();
            int filterscount = 0;

            filterscount = jObject.filterscount;
            ArrayList query = new ArrayList();
            ArrayList queryi = new ArrayList();
            if (filterscount > 0)
            {



                for (int i = 0; i < filterscount; i++)
                {

                    dynamic fe = jObject.GetType().GetProperty("filterdatafield" + i).GetValue(jObject);

                    string tempField = fe;

                    dynamic val = jObject.GetType().GetProperty("filtervalue" + i).GetValue(jObject);
                    dynamic con = jObject.GetType().GetProperty("filtercondition" + i).GetValue(jObject);
                    //string ty = v.type;
                    dynamic opp = jObject.GetType().GetProperty("filteroperator" + i).GetValue(jObject);
                    if (opp == "0") opp = "AND"; else opp = "OR";

                    ArrayList qr = context.GetAlljobstring(con, fe, val);

                    val = val + " " + opp;
                    if (val != "")
                    {
                        if (!qr[0].Equals(""))
                            query.Add(qr[0]);
                        if (!qr[1].Equals(""))
                            queryi.Add(qr[1]);

                    }
                    int inn = i + 1;
                    dynamic fee = tempField;
                    if (filterscount >= inn)
                        fee = jObject.GetType().GetProperty("filterdatafield" + inn).GetValue(jObject);
                    if (fee != tempField || filterscount == inn)
                    {

                        if (query.Count > 0)
                        {
                            string qtr = "(";
                            int cn = 1;
                            foreach (string it in query)
                            {
                                string oper = "";
                                if (cn != query.Count)
                                    oper = opp;
                                qtr += it + " " + oper;
                                cn++;
                            }


                            qtr += ")";
                            wherej.Add(qtr);
                            query = new ArrayList();
                        }
                        if (queryi.Count > 0)
                        {
                            string qtri = "(";

                            int cni = 1;
                            foreach (string it in queryi)
                            {
                                string operi = "";
                                if (cni != queryi.Count)
                                    operi = opp;
                                qtri += it + " " + operi;
                                cni++;
                            }

                            qtri += ")";

                            wherei.Add(qtri);
                            queryi = new ArrayList();
                        }
                        if (fe == "appliedBy")
                            wherei.Add("(appliedDate BETWEEN CURDATE() -INTERVAL 30 DAY AND CURDATE())");
                    }


                }


            }
            string whereiQuery = "";
            string whereQuery = "";
            if (wherei.Count > 0)
            {
                whereiQuery = "where ";
                int cnw = 1;
                foreach (string it in wherei)
                {
                    string operw = "";
                    if (cnw != wherei.Count)
                        operw = "AND";
                    whereiQuery += it + " " + operw;
                    cnw++;
                }

            }
            if (wherej.Count > 0)
            {
                whereQuery = " AND ";
                int cnq = 1;
                foreach (string it in wherej)
                {
                    string operq = "";
                    if (cnq != wherej.Count)
                        operq = "AND";
                    whereQuery += it + " " + operq;
                    cnq++;
                }
            }



            whereQuery = " Archive=0 " + whereQuery;

            dynamic orderby = "";
            dynamic orderbyi = "";
            string sortdatafield = jObject.getsortfield;
            string sortorder = jObject.getsorttype;



            if (sortdatafield != null && sortorder != null && (sortorder == "desc" || sortorder == "asc"))
            {
                if (sortdatafield == "postedBy" || sortdatafield == "appliedDate")
                    orderbyi = " ORDER BY `" + sortdatafield + "` " + sortorder;
                else
                    orderby = " ORDER BY `" + sortdatafield + "` " + sortorder;
            }
            var d = new JobsFilter();
            d.where_jobs = this.Encrypt(whereQuery);
            d.where_jobstatus = this.Encrypt(whereiQuery);
            d.pagenum = Convert.ToInt32(jObject.pagenum);
            d.pagesize = jObject.pagesize;
            d.startindex = jObject.recordstartindex;
            d.endindex = jObject.recordendindex;
            d.userid = jObject.userid;
            d.js_order = this.Encrypt(orderbyi);
            d.jd_order = this.Encrypt(orderby);

            if (jObject.filterbyuser == 1)
            {
                List<JobsFilter> jobfilter = context.insertJobFilter(d);

                return context.GetAlljobs(jObject.recordstartindex, jObject.pagesize, jObject, whereQuery, whereiQuery, orderby, orderbyi);
            }
            else
            {
                dynamic user_querys = context.getJobFilter(jObject.userid);
                //List<JobsFilter> jobfilter = context.insertJobFilter(d);
                int sc = user_querys.Count;
                System.Diagnostics.Debug.WriteLine("wr query " + sc);
                if (user_querys.Count > 0)
                {
                    dynamic user_query = user_querys[0];

                    string qq = user_query.where_jobs;
                    System.Diagnostics.Debug.WriteLine("wr query more " + qq);
                    whereQuery = this.Decrypt(user_query.where_jobs);
                    whereiQuery = this.Decrypt(user_query.where_jobstatus);
                    int pg = user_query.pagesize;
                    orderby = this.Decrypt(user_query.jd_order);
                    orderbyi = this.Decrypt(user_query.js_order);
                    System.Diagnostics.Debug.WriteLine("wr query  " + whereQuery);
                    return context.GetAlljobs(jObject.recordstartindex, pg, jObject, whereQuery, whereiQuery, orderby, orderbyi);
                }
                else
                {
                    return context.GetAlljobs(jObject.recordstartindex, jObject.pagesize, jObject, whereQuery, whereiQuery, orderby, orderbyi);
                }
            }
            /*int count = context.getTotalrows(where);
			List<jobsResult> result = new List<jobsResult>();
			var r = new jobsResult();
			r.count = count;
			r.data = jobs;
			result.Add(r);
			return result;*/

        }
        private string Encrypt(string clearText)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
        private string Decrypt(string cipherText)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }

        [HttpGet]
        [Route("/insert")]
        public IEnumerable<Jobstatus> insertStatus(int JobID, string JobStatus, string AppliedBy)
        {
            List<Jobstatus> result = new List<Jobstatus>();
            var contact = new Jobstatus();
            contact.JobID = JobID;
            contact.JobStatus = JobStatus;
            contact.AppliedBy = AppliedBy;

            try
            {
                /*list.JobID = JobID;
                list.JobStatus = AppliedBy;
                list.AppliedBy = JobStatus;*/
                Jobsdata context = HttpContext.RequestServices.GetService(typeof(rest_api_jobs.Models.Jobsdata)) as Jobsdata;
                var results = context.getJobstatusrows(contact);

                return (result);
            }
            catch (Exception e)
            {
                var d = new Jobstatus();
                d.JobID = 1;
                d.AppliedBy = e.Message.ToString();
                d.JobStatus = "2";
                result.Add(d);
                return result;
            }
        }
        [HttpGet]
        [Route("/jobstatus")]
        public List<jobsResult> Get()
        {
            Jobsdata context = HttpContext.RequestServices.GetService(typeof(rest_api_jobs.Models.Jobsdata)) as Jobsdata;

            List<Jobstatus> list = new List<Jobstatus>();
            var arrayList = context.GetAlljobgroupby("jobLocation");
            var arrayList2 = context.GetAlljobgroupby("postedBy");
            list = context.GetAlljobstatus();

            List<jobsResult> result = new List<jobsResult>();
            var r = new jobsResult();
            r.jobLocation = arrayList;
            r.postedBy = arrayList2;
            r.data = list;
            result.Add(r);
            return result;
        }

        [HttpGet]
        [Route("/update")]
        public IEnumerable<Jobstatus> Post(int JobID, string JobStatus, string AppliedBy)
        {
            List<Jobstatus> result = new List<Jobstatus>();
            var contact = new Jobstatus();
            contact.JobID = JobID;
            contact.JobStatus = JobStatus;
            contact.AppliedBy = AppliedBy;
            try
            {
                Jobsdata context = HttpContext.RequestServices.GetService(typeof(rest_api_jobs.Models.Jobsdata)) as Jobsdata;
                var results = context.getJobstatusrows(contact);
                return (results);
            }
            catch (Exception e)
            {
                var d = new Jobstatus();
                d.JobID = 1;
                d.AppliedBy = e.Message.ToString();
                d.JobStatus = contact.JobStatus;
                result.Add(d);
                return (result);
            }
        }
    }


}
