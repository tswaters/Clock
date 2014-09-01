(function () {
    "use strict";

    var activation = Windows.ApplicationModel.Activation;
    var app = WinJS.Application;
    var nav = WinJS.Navigation;
    var sched = WinJS.Utilities.Scheduler;
    var ui = WinJS.UI;

    var page = ui.Pages.define("/html/default.html", {
        ready: function () {

            // attach handlers to the settings app buttons
            document.getElementById('cmdDateFormatSettings').onclick = function () {
                ui.SettingsFlyout.showSettings('dateFormatSettings', '/html/settings.html');
            };

            // attach handlers to the settings app buttons
            document.getElementById('cmdColorSettings').onclick = function () {
                ui.SettingsFlyout.showSettings('colorSettings', '/html/settings.html');
            };
        }
    })

    app.addEventListener('settings', function (e) {
        e.detail.applicationcommands = {
            "dateFormatSettings": { "title": "Formats", "href": "/html/settings.html" },
            "colorSettings": { "title": "Colors", "href": "/html/settings.html" }
        };
        ui.SettingsFlyout.populateSettings(e);
    });

    app.addEventListener('activated', function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // Application has been newly launched. 
            } else {
                // Application has been reactivated from suspension.
            }
            
            nav.history = app.sessionState.history || {};
            nav.history.current.initialPlaceholder = true;

            // Optimize the load of the application and while the splash screen is shown, execute high priority scheduled work.
            ui.disableAnimations();
            var p = ui.processAll().then(function () {
                return nav.navigate(nav.location || Application.navigator.home, nav.state);
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