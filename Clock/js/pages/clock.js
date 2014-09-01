// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
;(function () {
    "use strict";

    var tid = null;
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var binding = WinJS.Binding.as({
        date: Clock.date,
        time: Clock.time,
        foreColor: Settings.foreColor,
        backColor: Settings.backColor
    });

    var page = WinJS.UI.Pages.define("/html/clock.html", {
        init: function (element, options) {
            
        },
        
        ready: function (element, options) {

            // set up binding to the date/time elements and set up interval to tick
            WinJS.Binding.processAll(element, binding);
            tid = setInterval(Clock.Page.update, 1000);

        }

    });

    WinJS.Namespace.define("Clock.Page", {
        update: function () {
            Clock.tick();
            binding.date = Clock.date;
            binding.time = Clock.time;
            binding.foreColor = Settings.foreColor;
            binding.backColor = Settings.backColor;
        }
    });

    app.addEventListener('checkpoint', function (args) {
       
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
                // coming back from suspension, set up the interval again
                tid = setInterval(Clock.tick.bind(Clock), 1000);
            }
        }

    });

    app.addEventListener('checkpoint', function(){
        clearInterval(tid);
        tid = null;
    });

})();
