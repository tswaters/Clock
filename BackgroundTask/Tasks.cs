using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Windows.UI.Notifications;
using Windows.Storage;
using Windows.ApplicationModel.Background;
using Windows.System.Threading;

namespace BackgroundTask
{
    public sealed class Tasks : IBackgroundTask
    {
        /// <summary>Main entry point into the Background Task.</summary>
        /// <param name="taskInstance">Task instance being invoked.</param>
        /// <remarks>This sets up a timer to run <see cref="DoWork"/> every minute.</remarks>
        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            var deferral = taskInstance.GetDeferral();
            await Notification.AddTilesToScheduleAsync(DateTimeOffset.Now, 15);
            deferral.Complete();
        }
        
    }
}
