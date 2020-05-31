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
    }
}
