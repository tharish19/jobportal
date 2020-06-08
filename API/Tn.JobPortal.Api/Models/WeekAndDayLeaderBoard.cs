using System.Collections.Generic;

namespace Tn.JobPortal.Api.Models
{
    /// <summary>
    /// WeekAndDayLeaderBoard
    /// </summary>
    public class WeekAndDayLeaderBoard
    {
        /// <summary>
        /// Gets or sets the day details.
        /// </summary>
        /// <value>
        /// The day details.
        /// </value>
        public List<LeaderBoardDetails> DayDetails { get; set; }

        /// <summary>
        /// Gets or sets the week details.
        /// </summary>
        /// <value>
        /// The week details.
        /// </value>
        public List<LeaderBoardDetails> WeekDetails { get; set; }
    }
}
