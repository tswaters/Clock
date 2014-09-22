(function () {
    "use strict";

    function getSettingOrDefault(settingName) {
        return _.isUndefined(settings[settingName])
            ? Settings[settingName + "_default"]
            : settings[settingName];
    }

    var settings = Windows.Storage.ApplicationData.current.localSettings.values;
    WinJS.Namespace.define("Settings", {
        // holds the different settings' current values.
        dateFormat: null, 
        timeFormat: null,
        analogHandColor: null,
        analogTickColor: null,
        analogBackColor: null,
        digitalForeColor: null,
        digitalBackColor: null,
        showAnalog: null,
        showDigital: null,
        // holds the different settings' default values.
        analogHandColor_default: '#fff',
        analogTickColor_default: '#eee',
        analogBackColor_default: '#000',
        digitalForeColor_default: '#fff',
        digitalBackColor_default: '#000',
        dateFormat_default: 'MMMM Do, YYYY',
        timeFormat_default: 'h:mm a',
        showAnalog_default: true,
        showDigital_default: false,
        // populate all settings from localSettings.
        getSettings: function () {
            this.analogHandColor = getSettingOrDefault("analogHandColor");
            this.analogTickColor = getSettingOrDefault("analogTickColor");
            this.analogBackColor = getSettingOrDefault("analogBackColor");
            this.digitalForeColor = getSettingOrDefault("digitalForeColor");
            this.digitalBackColor = getSettingOrDefault("digitalBackColor");
            this.dateFormat = getSettingOrDefault("dateFormat");
            this.timeFormat = getSettingOrDefault("timeFormat");
            this.showAnalog = getSettingOrDefault("showAnalog");
            this.showDigital = getSettingOrDefault("showDigital");
        },
        // update setting with new value.
        setSetting: function (settingName, value) {
            this[settingName] = value;
            settings[settingName] = value;
            Clock.Page.update();
        },
        // reset a setting to it's default value.
        resetSetting: function (settingName) {
            this.setSetting(settingName, this[settingName + "_default"]);
        }
    });

    Settings.getSettings();

})()