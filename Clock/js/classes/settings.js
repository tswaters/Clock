(function () {
    "use strict";

    var settings = Windows.Storage.ApplicationData.current.localSettings.values;
    WinJS.Namespace.define("Settings", {
        foreColor: null, 
        backColor: null, 
        dateFormat: null, 
        timeFormat: null, 
        foreColor_default: '#fff',
        backColor_default: '#000',
        dateFormat_default: 'MMMM Do, YYYY',
        timeFormat_default: 'h:mm a',
        getSettings: function () {
            this.foreColor = settings["foreColor"] || this.foreColor_default;
            this.backColor = settings["backColor"] || this.backColor_default;
            this.dateFormat = settings["dateFormat"] || this.dateFormat_default;
            this.timeFormat = settings["timeFormat"] || this.timeFormat_default;
        },
        setSetting: function (settingName, value) {
            this[settingName] = value;
            settings[settingName] = value;
            Clock.Page.update();
        },
        resetSetting: function (settingName) {
            this.setSetting(settingName, this[settingName + "_default"]);
        }
    });

    Settings.getSettings();

})()