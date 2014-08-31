// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var tid;
    var dateFormat;
    var timeFormat;

    function init() {
        updateFormat();
        startTimer();
    }

    function updateFormat() {
        var settings = Windows.Storage.ApplicationData.current.localSettings.values;
        dateFormat = settings["dateFormat"] || 'MMMM DD, YYYY';;
        timeFormat = settings["timeFormat"] || 'h:mm A';
    }

    function startTimer() {
        tid = setInterval(updateTime, 1000);
    }

    function stopTimer() {
        clearInterval(tid);
    }

    function updateTime() {
        document.getElementById("date").innerHTML = moment().format(dateFormat);
        document.getElementById("time").innerHTML = moment().format(timeFormat);
    }

    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "settings": {
                "title": "Clock Settings",
                "href": "/html/settings.html"
            }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.addEventListener('formatChanged', function () {
        updateFormat();
    })

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            init();

            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().

        stopTimer();
    };

    app.start();
})();
