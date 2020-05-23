using System;

namespace rest_api_jobs.Models
{
    /// <summary>
    /// Job Status Model
    /// </summary>
    public class JobStatusModel
    {
        /// <summary>
        /// Gets or sets the job identifier.
        /// </summary>
        /// <value>
        /// The job identifier.
        /// </value>
        public int JobID { get; set; }

        /// <summary>
        /// Gets or sets the job status.
        /// </summary>
        /// <value>
        /// The job status.
        /// </value>
        public string JobStatus { get; set; }

        /// <summary>
        /// Gets or sets the applied by.
        /// </summary>
        /// <value>
        /// The applied by.
        /// </value>
        public string AppliedBy { get; set; }

        /// <summary>
        /// Gets or sets the applied on.
        /// </summary>
        /// <value>
        /// The applied on.
        /// </value>
        public DateTime AppliedOn { get; set; }
    }
}
