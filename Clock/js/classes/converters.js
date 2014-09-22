; (function () {
    "use strict";

    WinJS.Namespace.define("Converters", {

        'visibility': WinJS.Binding.converter(function (val) {
            return val ? "block" : "none";
        }),

        'test': WinJS.Binding.converter(function (val) {
            console.log('Binding converter called with' + val);
            return val;
        })

    });

})()

