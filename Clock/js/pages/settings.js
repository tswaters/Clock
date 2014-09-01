

(function () {
    "use strict";
    var binding = WinJS.Binding;
    var settings = Windows.Storage.ApplicationData.current.localSettings.values;
    var util = WinJS.Utilities;
    var page = WinJS.UI.Pages.define("/html/settings.html", {

        init: function (element, options) {

            // set up a binding observable pointing at Settings.
            this.binding = binding.as({
                dateFormat: Settings.dateFormat,
                timeFormat: Settings.timeFormat
            });
            
            // set up colorjoe extras
            this.colorJoeExtras = [['fields', { space: 'RGB', limit: 255 }]];
        },

        ready: function (element, options) {

            // set up binding.
            binding.processAll(element, this.binding);

            // set up reset button handlers
            util.id("btnColorDefaults").listen("click", this._btnColorDefaults_click.bind(this));
            util.id("btnFormatDefaults").listen("click", this._btnFormatDefaults_click.bind(this));

            // set up toggle legend buttons.
            util.id("btnDateLegend").listen("click", this._btnDateLegend_click.bind(this));
            util.id("btnTimeLegend").listen("click", this._btnTimeLegend_click.bind(this));

            // set up the colorpickers.
            this.colorPickerFore = colorjoe
                .rgb('colorPicker-foreColor', Settings.foreColor, this.colorJoeExtras)
                .on('done', this._foreColorPicker_selected.bind(this));

            this.colorPickerBack = colorjoe
                .rgb('colorPicker-backColor', Settings.backColor, this.colorJoeExtras)
                .on('done', this._backColorPicker_selected.bind(this));

            // add change handlers to the date/time format inputs.
            util.id("txtDateFormat").listen("change", this._txtDateFormat_change.bind(this));
            util.id("txtTimeFormat").listen("change", this._txtTimeFormat_change.bind(this));
            
        },

        _btnDateLegend_click: function (e) {
            util.id('tblDateLegend').toggleClass('hidden');
            e.target.textContent = util.id('tblDateLegend').hasClass('hidden') ? "Show Legend" : "Hide Legend";
        },

        _btnTimeLegend_click: function (e) {
            util.id('tblTimeLegend').toggleClass('hidden');
            e.target.textContent = util.id('tblTimeLegend').hasClass('hidden') ? "Show Legend" : "Hide Legend";
        },

        _btnColorDefaults_click: function (e) {
            Settings.resetSetting("foreColor");
            Settings.resetSetting("backColor");
            this.colorPickerFore.set("foreColor");
            this.colorPickerBack.set("backColor");
        },

        _btnFormatDefaults_click: function (e) {
            Settings.resetSetting("dateFormat");
            Settings.resetSetting("timeFormat");
            this.binding.dateFormat = Settings.dateFormat;
            this.binding.timeFormat = Settings.timeFormat;
        },

        _foreColorPicker_selected: function (c) {
            Settings.setSetting("foreColor", c.hex());
        },

        _backColorPicker_selected: function (c) {
            Settings.setSetting("backColor", c.hex());
        },

        _txtDateFormat_change: function (e) {
            Settings.setSetting("dateFormat", e.target.value)
        },

        _txtTimeFormat_change: function (e) {
            Settings.setSetting("timeFormat", e.target.value);
        }

    });



})();