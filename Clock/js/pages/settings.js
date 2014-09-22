

(function () {
    "use strict";
    var binding = WinJS.Binding;
    var settings = Windows.Storage.ApplicationData.current.localSettings.values;
    var util = WinJS.Utilities;
    var page = WinJS.UI.Pages.define("/html/settings.html", {

        init: function (element, options) {

            // set up a binding observable pointing at Settings.
            this.binding = binding.as({
                showingDateLegend: false,
                showingTimeLegend: false,
                dateFormat: Settings.dateFormat,
                timeFormat: Settings.timeFormat,
                showAnalog: Settings.showAnalog,
                showDigital: Settings.showDigital
            });
            
            // set up colorjoe extras
            this.colorJoeExtras = [['fields', { space: 'RGB', limit: 255 }]];
        },

        ready: function (element, options) {

            // set up binding.
            binding.processAll(element, this.binding);

            // After the flyout closes, ensure live tiles are updated to reflect changes to settings.
            document.getElementById('generalSettings').addEventListener('afterhide', function () {
                BackgroundTask.Notification.addTilesToScheduleAsync(new Date(), 15);
            });

            // add change handlers to the clock type inputs.
            util.id("rdoClockType[analog]").listen("change", this._rdoClockTypeAnalog_change.bind(this));
            util.id("rdoClockType[digital]").listen("change", this._rdoClockTypeDigital_change.bind(this));

            // set up reset button handlers
            util.id("btnDefaults").listen("click", this._btnDefaults_click.bind(this));
            
            // set up the colorpickers.
            this.colorPickerAnalogHand = colorjoe
                .rgb('colorPicker-analogHandColor', Settings.analogHandColor, this.colorJoeExtras)
                .on('done', this._analogHandColor_selected.bind(this));

            this.colorPickerAnalogTick = colorjoe
                .rgb('colorPicker-analogTickColor', Settings.analogTickColor, this.colorJoeExtras)
                .on('done', this._analogTickColor_selected.bind(this));

            this.colorPickerAnalogBack = colorjoe
                .rgb('colorPicker-analogBackColor', Settings.analogBackColor, this.colorJoeExtras)
                .on('done', this._analogBackColor_selected.bind(this));

            this.colorPickerDigitalFore = colorjoe
                .rgb('colorPicker-digitalForeColor', Settings.digitalForeColor, this.colorJoeExtras)
                .on('done', this._digitalForeColor_selected.bind(this));

            this.colorPickerDigitalBack = colorjoe
                .rgb('colorPicker-digitalBackColor', Settings.digitalBackColor, this.colorJoeExtras)
                .on('done', this._digitalBackColor_selected.bind(this));

            // add change handlers to the date/time format inputs.
            util.id("txtDateFormat").listen("change", this._txtDateFormat_change.bind(this));
            util.id("txtTimeFormat").listen("change", this._txtTimeFormat_change.bind(this));
            
        },

        _rdoClockTypeAnalog_change: function (e) {
            var analogChecked = e.target.checked;
            this.binding.showAnalog = analogChecked;
            this.binding.showDigital = !analogChecked;
            Settings.setSetting("showAnalog", analogChecked);
            Settings.setSetting("showDigital", !analogChecked);
            WinJS.Navigation.navigate('/html/analog.html');
        },
        
        _rdoClockTypeDigital_change: function (e) {
            var digitalChecked = e.target.checked;
            this.binding.showDigital = digitalChecked;
            this.binding.showAnalog = !digitalChecked;
            Settings.setSetting("showDigital", digitalChecked);
            Settings.setSetting("showAnalog", !digitalChecked);
            WinJS.Navigation.navigate('/html/digital.html');
        },
        
        _btnDefaults_click: function (e) {
            Settings.resetSetting("analogHandColor");
            Settings.resetSetting("analogTickColor");
            Settings.resetSetting("analogBackColor");
            Settings.resetSetting("digitalForeColor");
            Settings.resetSetting("digitalBackColor");
            Settings.resetSetting("dateFormat");
            Settings.resetSetting("timeFormat");
            this.binding.dateFormat = Settings.dateFormat;
            this.binding.timeFormat = Settings.timeFormat;
            this.colorPickerAnalogHand.set(Settings.analogHandColor);
            this.colorPickerAnalogTick.set(Settings.analogTickColor);
            this.colorPickerAnalogBack.set(Settings.analogBackColor);
            this.colorPickerDigitalFore.set(Settings.digitalForeColor);
            this.colorPickerDigitalBack.set(Settings.digitalBackColor);
        },

        _analogHandColor_selected: function (c) { Settings.setSetting("analogHandColor", c.hex()); },
        _analogTickColor_selected: function (c) { Settings.setSetting("analogTickColor", c.hex()); },
        _analogBackColor_selected: function (c) { Settings.setSetting("analogBackColor", c.hex()); },

        _digitalForeColor_selected: function (c) { Settings.setSetting("digitalForeColor", c.hex()); },
        _digitalBackColor_selected: function (c) { Settings.setSetting("digitalBackColor", c.hex()); },

        _txtDateFormat_change: function (e) {
            this.binding.dateFormat = e.target.value;
            Settings.setSetting("dateFormat", e.target.value)
        },

        _txtTimeFormat_change: function (e) {
            this.binding.timeFormat = e.target.value;
            Settings.setSetting("timeFormat", e.target.value);
        }

    });



})();