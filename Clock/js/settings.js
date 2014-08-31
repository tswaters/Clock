

(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/html/settings.html", {
        ready: function (element, options) {

            // retrieve the application settings and populate format textboxes.
            var settings = Windows.Storage.ApplicationData.current.localSettings.values;
            document.getElementById("txtDateFormat").value = settings["dateFormat"] || 'MMMM DD, YYYY';;
            document.getElementById("txtTimeFormat").value = settings["timeFormat"] || 'h:mm A';

            // add change handlers to the date/time format inputs.
            document.getElementById("txtDateFormat").addEventListener("change", txtDateFormat_change);
            document.getElementById("txtTimeFormat").addEventListener("change", txtTimeFormat_change);

        },
        unload: function () {

            // remove the change handlers for the date/time input boxes
            document.getElementById("txtDateFormat").removeEventListener("change", txtDateFormat_change);
            document.getElementById("txtTimeFormat").removeEventListener("change", txtTimeFormat_change);

        }
    });

    function txtDateFormat_change(e) {
        Windows.Storage.ApplicationData.current.localSettings.values["dateFormat"] = e.target.value;
        WinJS.Application.queueEvent({ type: "formatChanged" });
    }

    function txtTimeFormat_change(e) {
        Windows.Storage.ApplicationData.current.localSettings.values["timeFormat"] = e.target.value;
        WinJS.Application.queueEvent({ type: "formatChanged" });
    }

})();