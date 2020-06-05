using System;

namespace Tn.JobPortal.Api.Models
{
    /// <summary>
    /// Job Details
    /// </summary>
    public class JobDetailsModel
    {
        /// <summary>
        /// Gets or sets the job identifier.
        /// </summary>
        /// <value>
        /// The job identifier.
        /// </value>
        public int JobID { get; set; }

        /// <summary>
        /// Gets or sets the job title.
        /// </summary>
        /// <value>
        /// The job title.
        /// </value>
        public string JobTitle { get; set; }

        /// <summary>
        /// Gets or sets the job location.
        /// </summary>
        /// <value>
        /// The job location.
        /// </value>
        public string JobLocation { get; set; }

        /// <summary>
        /// Gets or sets the type of the job.
        /// </summary>
        /// <value>
        /// The type of the job.
        /// </value>
        public string JobType { get; set; }

        /// <summary>
        /// Gets or sets the name of the company.
        /// </summary>
        /// <value>
        /// The name of the company.
        /// </value>
        public string CompanyName { get; set; }

        /// <summary>
        /// Gets or sets the posted by.
        /// </summary>
        /// <value>
        /// The posted by.
        /// </value>
        public string PostedBy { get; set; }

        /// <summary>
        /// Gets or sets the posted date.
        /// </summary>
        /// <value>
        /// The posted date.
        /// </value>
        public DateTime PostedDate { get; set; }

        /// <summary>
        /// Gets or sets the job URL.
        /// </summary>
        /// <value>
        /// The job URL.
        /// </value>
        public string JobURL { get; set; }

        /// <summary>
        /// Gets or sets the row insert date.
        /// </summary>
        /// <value>
        /// The row insert date.
        /// </value>
        public DateTime RowInsertDate { get; set; }

        /// <summary>
        /// Gets or sets the row insert by.
        /// </summary>
        /// <value>
        /// The row insert by.
        /// </value>
        public string RowInsertBy { get; set; }

        /// <summary>
        /// Gets or sets the row update date.
        /// </summary>
        /// <value>
        /// The row update date.
        /// </value>
        public DateTime RowUpdateDate { get; set; }

        /// <summary>
        /// Gets or sets the row update by.
        /// </summary>
        /// <value>
        /// The row update by.
        /// </value>
        public string RowUpdateBy { get; set; }

        /// <summary>
        /// Gets or sets the job search string.
        /// </summary>
        /// <value>
        /// The job search string.
        /// </value>
        public string JobSearchString { get; set; }

        /// <summary>
        /// Gets or sets the job URL substr.
        /// </summary>
        /// <value>
        /// The job URL substr.
        /// </value>
        public string jobURLSubstr { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="JobDetailsModel"/> is archive.
        /// </summary>
        /// <value>
        ///   <c>true</c> if archive; otherwise, <c>false</c>.
        /// </value>
        public bool Archive { get; set; }

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
