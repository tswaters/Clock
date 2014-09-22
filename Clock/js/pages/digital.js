; (function () {
    "use strict";

    var tid = null;
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    function setupTicker() {
        tid = setInterval(Clock.Page.update.bind(Clock.Page), 1000);
    }

    function clearTicker() {
        clearInterval(tid);
        tid = null;
    }

    var page = WinJS.UI.Pages.define("/html/digital.html", {
        ready: function (element, options) {

            // set up binding to the date/time elements and set up interval to tick
            WinJS.Binding.processAll(element, Clock.Page.binding);
            setupTicker();
        }

    });

    app.addEventListener('checkpoint', function (args) {
       
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
                // coming back from suspension, set up the interval again
                setupTicker();
            }
        }

    });

    app.addEventListener('checkpoint', function () {
        clearTicker()
    });

})();
