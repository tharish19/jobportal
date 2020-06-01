namespace rest_api_jobs.Models
{
    /// <summary>
    /// Job Roles
    /// </summary>
    public class JobRolesModel
    {
        /// <summary>
        /// Gets or sets the job role identifier.
        /// </summary>
        /// <value>
        /// The job role identifier.
        /// </value>
        public int JobRoleId { get; set; }

        /// <summary>
        /// Gets or sets the job role.
        /// </summary>
        /// <value>
        /// The job role.
        /// </value>
        public string JobRole { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is deleted.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is deleted; otherwise, <c>false</c>.
        /// </value>
        public bool IsDeleted { get; set; }
    }
}
