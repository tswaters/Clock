(function () {
    "use strict";

    var background = Windows.ApplicationModel.Background;
    
    WinJS.Namespace.define("TaskHandler", {
        'taskEntryPoint': 'BackgroundTask.Tasks',
        'tasks': {
            'ClockBackgroundTask_TimeZoneChange': new background.SystemTrigger(background.SystemTriggerType.timeZoneChange, false),
            'ClockBackgroundTask_SessionConnected': new background.SystemTrigger(background.SystemTriggerType.sessionConnected, false),
            'ClockBackgroundTask_UserPresent': new background.SystemTrigger(background.SystemTriggerType.userPresent, false),
            'ClockBackgroundTask_Timer': new background.TimeTrigger(15, false)
        },
        'registerTasks': function () {
            for (var task in this.tasks) {
                this.register(task, this.taskEntryPoint, this.tasks[task]);
             }
        },
        'register': function (taskName, taskEntryPoint, trigger) {
            // ensure this task has not already been registered. if it has, return the task.
            var iter = background.BackgroundTaskRegistration.allTasks.first();
            var hascur = iter.hasCurrent;
            while (hascur) {
                if (iter.current.value.name === taskName) { return iter.current; }
                hascur = iter.moveNext();
            }
            // otherwise, create a new task with passed parameters and register it
            var builder = new background.BackgroundTaskBuilder();
            builder.name = taskName;
            builder.taskEntryPoint = taskEntryPoint;
            builder.setTrigger(trigger);
            return builder.register();
        }
    });
})();

