(function () {
    "use strict";

    // set up a list of keys for the legend
    var dateOptions = [
        { key: 'M', name: 'Month' },
        { key: 'Mo', name: 'Month' },
        { key: 'MM', name: 'Month' },
        { key: 'MMM', name: 'Month' },
        { key: 'MMMM', name: 'Month' },
        { key: 'D', name: 'Day' },
        { key: 'Do', name: 'Day' },
        { key: 'DD', name: 'Day', },
        { key: 'd', name: 'Day' },
        { key: 'do', name: 'Day' },
        { key: 'dd', name: 'Day' },
        { key: 'ddd', name: 'Day' },
        { key: 'dddd', name: 'Day' },
        { key: 'YY', name: 'Year' },
        { key: 'YYYY', name: 'Year' },
    ];

    var timeOptions = [
        { key: 'A', name: 'AM/PM' },
        { key: 'a', name: 'AM/PM' },
        { key: 'H', name: 'Hour' },
        { key: 'HH', name: 'Hour' },
        { key: 'h', name: 'Hour' },
        { key: 'hh', name: 'Hour' },
        { key: 'm', name: 'Minute' },
        { key: 'mm', name: 'Minute' },
        { key: 's', name: 'Second' },
        { key: 'ss', name: 'Second' },
    ];

    timeOptions.forEach(function (item) {
        item.sample = moment().format(item.key);
    })

    dateOptions.forEach(function (item) {
        item.sample = moment().format(item.key);
    });

    WinJS.Namespace.define("MomentOptions", {
        date: new WinJS.Binding.List(dateOptions),
        time: new WinJS.Binding.List(timeOptions)
    })

})()