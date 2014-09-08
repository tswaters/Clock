(function () {
    "use strict";

    var background = Windows.ApplicationModel.Background;
    
    WinJS.Namespace.define("TaskHandler", {
        'USERPRESENT_TASK_NAME': 'ClockBackgroundTask_UserPresent',
        'USERPRESENT_TASK_TRIGGER': new background.SystemTrigger(background.SystemTriggerType.userPresent, false),
        'TIMER_TASK_NAME': 'ClockBackgroundTask_Timer',
        'TIMER_TASK_TRIGGER': new background.TimeTrigger(15, false),
        'TASK_ENTRY_POINT': 'BackgroundTask.Tasks',

        'registerTasks': function () {
            // register the background tasks
            var trigger  = 
            this.register(this.TIMER_TASK_NAME, this.TASK_ENTRY_POINT, this.TIMER_TASK_TRIGGER);
            this.register(this.USERPRESENT_TASK_NAME, this.TASK_ENTRY_POINT, this.USERPRESENT_TASK_TRIGGER);
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

