using System.Collections.Generic;

namespace Tn.JobPortal.Api.Models
{
    /// <summary>
    /// User Job Details And Search Strings
    /// </summary>
    public class UserJobDetailsAndSearchStringsModel
    {
        /// <summary>
        /// Gets or sets the user job search string.
        /// </summary>
        /// <value>
        /// The user job search string.
        /// </value>
        public string UserJobSearchString { get; set; }

        /// <summary>
        /// Gets or sets the job details.
        /// </summary>
        /// <value>
        /// The job details.
        /// </value>
        public List<JobDetailsModel> JobDetails { get; set; }

        /// <summary>
        /// Gets or sets the job search strings.
        /// </summary>
        /// <value>
        /// The job search strings.
        /// </value>
        public List<JobRolesModel> JobSearchStrings { get; set; }
    }
}
