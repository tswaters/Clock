(function () {
    "use strict";

    // this is unused. I'm leaving it here as a reminder to just how easy it was to do it with just JavaScript.
    // Unfortunately, backgroundTasks are implemented as a WebWorkers which don't have a DOM to reference.
    // this means the following code will fail when creating canvas, on the document.createElement("CANVAS") line.

    var storage = Windows.Storage;
    var notifications = Windows.UI.Notifications;
    var tileImageFilename = "tile-image.png"

    WinJS.Namespace.define("TileNotification", {
        updateTile: function () {
            return saveCanvasToLocalFile(tileImageFilename)
                .then(function () {
                    sendTileNotification(tileImageFilename);
                })
        },
    })

    /**
     * saveCanvasToLocalFile
     * @param {HTMLCanvasElement} canvas The canvas to save
     * @param {string} fileName The filename to sae the canvas to
     * @returns {Promise} 
     */
    function saveCanvasToLocalFile(fileName) {
        var appdata = storage.ApplicationData.current;
        var localfolder = appdata.localFolder;
        var fileCollision = storage.CreationCollisionOption.replaceExisting;
        var reader;
        var stream;
        var createdFile;
        return localfolder.createFileAsync(fileName, fileCollision).then(function (file) {
            createdFile = file;
            stream = getCanvas().msToBlob().msDetachStream();
            reader = storage.Streams.DataReader(stream.getInputStreamAt(0));
            return reader.loadAsync(stream.size);
        }).then(function () {
            var bytes = new Array(stream.size);
            reader.readBytes(bytes);
            return storage.FileIO.writeBytesAsync(createdFile, bytes);
        })
        .then(function () {
            reader.close();
        });
    }

    /**
     * sendTileNotification
     * @param {string} fileName the filename to save to.
     */
    function sendTileNotification(fileName) {
        var template = notifications.TileTemplateType.tileWide310x150Image;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);
        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", "ms-appdata:///local/" + fileName);
        tileImageAttributes[0].setAttribute("alt", "Current Date and Time");
        var tileNotification = new notifications.TileNotification(tileXml);
        var currentTime = new Date();
        tileNotification.expirationTime = new Date(currentTime.getTime() + 60000);
        notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
    }


    /**
     * getCanvas
     * Creates a canvas with the current date/time.
     * @returns {HTMLCanvasElement}
     */
    function getCanvas() {
        var date = moment().format('dddd MMMM Do, YYYY');
        var time = moment().format('h:mm A');
        var canvas = window.document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = Settings.backColor;
        ctx.fillRect(0, 0, 300, 150)
        ctx.font = "13pt Segoe UI";
        ctx.fillStyle = Settings.foreColor;
        ctx.fillText(date, 15, 50);
        ctx.font = "24pt Segoe UI";
        ctx.fillText(time, 15, 90);
        return canvas;
    }

})();