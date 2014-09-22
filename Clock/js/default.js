(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var background = Windows.ApplicationModel.Background;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;
    
    var page = ui.Pages.define("/html/default.html", {
        ready: function () {

            // attach handlers to the settings app buttons
            document.getElementById('cmdGeneralSettings').onclick = function () {
                ui.SettingsFlyout.showSettings('generalSettings', '/html/settings.html');
            };

        }
    })

    app.addEventListener('settings', function (e) {
        e.detail.applicationcommands = {
            "generalSettings": { "title": "Settings", "href": "/html/settings.html" }
        };
        ui.SettingsFlyout.populateSettings(e);
    });

    app.addEventListener('activated', function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            
            // if the user grants access to use background tasks and lock screen, register the tasks.
            background.BackgroundExecutionManager.requestAccessAsync().then(function (status) {
                if (status === background.BackgroundAccessStatus.allowedMayUseActiveRealTimeConnectivity
                 || status === background.BackgroundAccessStatus.allowedWithAlwaysOnRealTimeConnectivity) {
                    TaskHandler.registerTasks();
                }
            });
            
            // perform an immediete update to the live tile.
            BackgroundTask.Notification.addTilesToScheduleAsync(new Date(), 15);
            
            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(Settings.showAnalog ? "/html/analog.html" : "/html/digital.html", nav.state);
            }).then(function () {
                return sched.requestDrain(sched.Priority.aboveNormal + 1);
            }).then(function () {
                ui.enableAnimations();
            });

            args.setPromise(p);
        }
    });

    app.addEventListener('checkpoint', function (args) {
        app.sessionState.history = nav.history;
    });

    app.start();

})();