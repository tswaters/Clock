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

    WinJS.Namespace.define("Clock.Page", {
        binding: WinJS.Binding.as({
            date: Clock.date,
            time: Clock.time,
            analogHandColor: Settings.analogHandColor,
            analogTickColor: Settings.analogTickColor,
            analogBackColor: Settings.analogBackColor,
            digitalForeColor: Settings.digitalForeColor,
            digitalBackColor: Settings.digitalBackColor
        }),
        update: function () {
            Clock.tick();
            this.binding.date = Clock.date;
            this.binding.time = Clock.time;
            this.binding.digitalForeColor = Settings.digitalForeColor;
            this.binding.digitalBackColor = Settings.digitalBackColor;
            this.binding.analogHandColor = Settings.analogHandColor;
            this.binding.analogTickColor = Settings.analogTickColor;
            this.binding.analogBackColor = Settings.analogBackColor;
        }
    });


})()