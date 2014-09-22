; (function () {
    "use strict";

    WinJS.Namespace.define("Converters", {

        'visibility': WinJS.Binding.converter(function (val) {
            return val ? "block" : "none";
        })

    });

})()

