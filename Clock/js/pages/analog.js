; (function () {
    "use strict";
    
    Number.prototype.toRoman = function () {
        var n = Math.floor(this), s = '', d = [
            { r: 'M', d: 1000 },
            { r: 'CM', d: 900 },
            { r: 'D', d: 500 },
            { r: 'CD', d: 400 },
            { r: 'C', d: 100 },
            { r: 'XC', d: 90 },
            { r: 'L', d: 50 },
            { r: 'XL', d: 40 },
            { r: 'X', d: 10 },
            { r: 'IX', d: 9 },
            { r: 'V', d: 5 },
            { r: 'IV', d: 4 },
            { r: 'I', d: 1 }
        ];
        if (n < 1) return NaN;
        for (var i = 0; i < d.length; i++) {
            while (n >= d[i].d) {
                n -= d[i].d;
                s += d[i].r;
            }
            if (n === 0) return s;
        }
        return NaN;
    }

    var tid = null, canvas, ctx;

    function setupTicker() {
        if (tid === null) {
            tid = setInterval(update, 1000);
        }
    }

    function clearTicker() {
        clearInterval(tid);
        tid = null;
    }

    var canvas, ctx, centerX, centerY, radius

    var page = WinJS.UI.Pages.define("/html/analog.html", {
        ready: function (element, options) {

            WinJS.Binding.processAll(element, Clock.Page.binding);

            canvas = document.getElementById("analog");
            ctx = canvas.getContext('2d');
            
            var h = canvas.clientHeight,
                w = canvas.clientWidth;

            centerX = w / 2,
            centerY = h / 2,
            radius = (centerX < centerY ? centerX : centerY) * 0.7;

            canvas.width = w;
            canvas.height = h;
            ctx.font = "2.0em Segoe UI";
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";

            // set up interval to tick
            setupTicker();
            update();

        }

    });

    function update() {
        var now = new Date();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawNumerals();
        var s = (now.getSeconds() / 60);
        var m = (now.getMinutes() / 60) + (s / 60);
        var h = (now.getHours() / 12) + (m / 12);
        updateHand(h, Settings.analogHandColor, '3', 0.75);
        updateHand(m, Settings.analogHandColor, '2', 0.80);
        updateHand(s, Settings.analogHandColor, '1', 0.90);
    }

    function drawNumerals() {
        ctx.strokeStyle = Settings.analogTickColor;
        ctx.fillStyle = Settings.analogTickColor;
        for (var i = 1; i <= 60; i += 1) {
            var val = (Math.PI * 2 * (i / 60)) - (Math.PI / 2)
            var x = Math.cos(val);
            var y = Math.sin(val);
            if (i % 5 === 0) {
                ctx.fillText((i / 5).toRoman(), centerX + x * (radius * 1.2), centerY + y * (radius * 1.2));
            }
            ctx.beginPath();
            ctx.lineWidth = i % 5 === 0 ? 2 : 1;
            var width = 1 + (i % 5 === 0 ? .1 : .05);
            ctx.moveTo(centerX + x * (radius * 1.0), centerY + y * (radius * 1.0));
            ctx.lineTo(centerX + x * (radius * width), centerY + y * (radius * width));
            ctx.stroke();
        }
    }

    function updateHand(interval, color, width, length) {
        var val = (Math.PI * 2 * (interval)) - (Math.PI / 2);
        var targetX = centerX + Math.cos(val) * radius * length;
        var targetY = centerY + Math.sin(val) * radius * length;
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
    }

})()