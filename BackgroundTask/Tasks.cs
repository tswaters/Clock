using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Windows.Storage;
using Windows.ApplicationModel.Background;
using Windows.System.Threading;

namespace BackgroundTask
{
    public sealed class Tasks : IBackgroundTask
    {
        BackgroundTaskDeferral _deferral;
        volatile bool _cancelRequested = false;
        const int TOTAL_RUNS = 15;
        int runs = 0;

        /// <summary>Main entry point into the Background Task.</summary>
        /// <param name="taskInstance">Task instance being invoked.</param>
        /// <remarks>This sets up a timer to run <see cref="DoWork"/> every minute.</remarks>
        public void Run(IBackgroundTaskInstance taskInstance)
        {
            //System.Diagnostics.Debug.WriteLine("Running task.");
            _deferral = taskInstance.GetDeferral();
            taskInstance.Canceled += new BackgroundTaskCanceledEventHandler(OnCanceled);
            ThreadPoolTimer.CreatePeriodicTimer(new TimerElapsedHandler(DoWork), TimeSpan.FromMinutes(1));
        }

        /// <summary>Cancelled handler for the taskInstance</summary>
        /// <param name="sender">Task instance invoking the event.</param>
        /// <param name="reason">Reason for the cancellation.</param>
        /// <remarks>This sets <see cref="_cancelRequested"/> to true which completes the task.</remarks>
        private void OnCanceled(IBackgroundTaskInstance sender, BackgroundTaskCancellationReason reason)
        {
            _cancelRequested = true;
        }

        /// <summary>Performs the work of the background task.</summary>
        /// <param name="timer"></param>
        /// <remarks>
        /// This runs every minute for 15 minutes and complete the deferral when finished.
        /// Each iteration will call <see cref="Notification.UpdateTile"/> to perform a tile update.
        ///</remarks>
        private async void DoWork(ThreadPoolTimer timer)
        {
            //System.Diagnostics.Debug.WriteLine("Do work has been called.");
            if (_cancelRequested == true)
            {
                _deferral.Complete();
                timer.Cancel();
            }
            else
            {
                await Notification.UpdateTileAsync();
                if (++runs == TOTAL_RUNS)
                {
                    _cancelRequested = true;
                }
                //System.Diagnostics.Debug.WriteLine("Finished UpdateTile, run #" + runs);
            }
        }

    }
}
