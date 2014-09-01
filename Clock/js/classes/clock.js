(function () {
    "use strict";

    WinJS.Namespace.define("Clock", {
        date: null,
        time: null,
        tick: function () {
            this.date = Settings.dateFormat ? moment().format(Settings.dateFormat) : "";
            this.time = Settings.dateFormat ? moment().format(Settings.timeFormat) : "";
        }
    });

    Clock.tick();

})()