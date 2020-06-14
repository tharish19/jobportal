using System.Collections.Generic;

namespace Tn.JobPortal.Api.Models
{
    /// <summary>
    /// ConsultantsAndJobs
    /// </summary>
    public class ConsultantsAndJobs
    {
        /// <summary>
        /// Gets or sets the consultant data.
        /// </summary>
        /// <value>
        /// The consultant data.
        /// </value>
        public List<BasicConsultantData> ConsultantsData { get; set; }

        /// <summary>
        /// Gets or sets the jobs data.
        /// </summary>
        /// <value>
        /// The jobs data.
        /// </value>
        public List<JobDetailsModel> JobsData { get; set; }
    }
}
