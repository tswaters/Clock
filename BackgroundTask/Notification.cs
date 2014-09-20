using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation;
using System.Runtime.InteropServices.WindowsRuntime;
using System.IO;
using Windows.UI.Notifications;
using Windows.Data.Xml.Dom;
using Windows.Storage;

namespace BackgroundTask
{
    /// <summary>
    /// Wrapper class for Tile Notifications
    /// </summary>
    public sealed class Notification
    {
        /// <summary>
        /// This xml represents the format of a tile notification - need to splice in one or more tiles.
        /// </summary>
        const string tileNotificationXml = @"<tile><visual version=""2"">{0}</visual></tile>";

        /// <summary>
        /// This xml represents the format of the Image tile templates - need to splice in template & filename.
        /// </summary>
        const string tileTemplateXml = @"<binding template=""{0}""><image id=""1"" src=""ms-appdata:///local/{1}""/></binding>";
        
        /// <summary>
        /// Sets up a series of tile notifications every minute from a given time.
        /// </summary>
        /// <param name="runFor">Time to start from</param>
        /// <param name="tiles">Number of tile updates to schedul</param>
        /// <returns>IAsyncAction</returns>
        public static IAsyncAction AddTilesToScheduleAsync(DateTimeOffset runFor, int tiles)
        {
            // ensure the provided date time is for the top of the minute.
            var date = runFor.AddSeconds(-runFor.Second);

            return AsyncInfo.Run((token) =>
            {
                return Task.Run(async () =>
                {
                    TileUpdater updater = TileUpdateManager.CreateTileUpdaterForApplication();

                    // remove all existing scheduled notifications.
                    var items = updater.GetScheduledTileNotifications();
                    foreach(var item in items) {
                        updater.RemoveFromSchedule(item);
                    }
                    
                    // create an immediate tile update.
                    updater.Update(await GetTileNotificationAsync(date, 0));
                    
                    for (var x = 1; x <= tiles; x++)
                    {
                        updater.AddToSchedule(await GetScheduledTileNotificationAsync(date.AddMinutes(x), x));
                    }
                });
            });
        }

        /// <summary>Returns a TileNotification</summary>
        /// <param name="delivery">Date at which the tile is effective.</param>
        /// <param name="fileNum">Integer identifying which number it is.</param>
        /// <returns>ScheduledTileNotification</returns>
        /// <remarks>Tile is set to expire 1 minute from the delivery date.</remarks>
        /// <remarks>This is used to fire an immediate update once.</remarks>
        private async static Task<TileNotification> GetTileNotificationAsync(DateTimeOffset delivery, int fileNum)
        {
            var tileXml = await GetNotificationXml(delivery, fileNum);
            var tile = new TileNotification(tileXml);
            tile.ExpirationTime = delivery.AddMinutes(1);
            return tile;
        }

        /// <summary>Returns a ScheduledTileNotification</summary>
        /// <param name="delivery">Date at which the tile is effective.</param>
        /// <param name="fileNum">Integer identifying which number it is.</param>
        /// <returns>ScheduledTileNotification</returns>
        /// <remarks>Tile is set to expire 1 minute from the delivery date.</remarks>
        private async static Task<ScheduledTileNotification> GetScheduledTileNotificationAsync(DateTimeOffset delivery, int fileNum)
        {
            var tileXml = await GetNotificationXml(delivery, fileNum);
            var tile = new ScheduledTileNotification(tileXml, delivery);
            tile.ExpirationTime = delivery.AddMinutes(1);
            return tile;
        }

        /// <summary>Returns the XmlDocument for a tile notification update</summary>
        /// <param name="delivery">Date to show on the images</param>
        /// <param name="fileNum">Number identifying the update.</param>
        /// <returns></returns>
        private async static Task<XmlDocument> GetNotificationXml(DateTimeOffset delivery, int fileNum)
        {
            string[] tiles = {
                await GetTileXml(delivery, "square-" + fileNum + ".png", TileTemplateType.TileSquare150x150Image, "TileSquare150x150Image"),
                await GetTileXml(delivery, "wide-" + fileNum + ".png", TileTemplateType.TileWide310x150Image, "TileWide310x150Image")
            };
            var tileXml = new XmlDocument();
            tileXml.LoadXml(String.Format(tileNotificationXml, String.Join("", tiles)));
            return tileXml;
        }

        /// <summary>Returns the XML string for a single tile update. </summary>
        /// <param name="delivery">The date to show on the generated image.</param>
        /// <param name="fileName">A filename to store the generated image.</param>
        /// <param name="tileType">The TileTemplateType of the tile.</param>
        /// <param name="tileName">Must be the same as tileType.</param>
        /// <returns></returns>
        private async static Task<String> GetTileXml(DateTimeOffset delivery, string fileName, TileTemplateType tileType, string tileName)
        {
            var xmlDoc = new XmlDocument();
            var ms = Graphics.GetMemoryStream(tileType, delivery);
            var file = await ApplicationData.Current.LocalFolder.CreateFileAsync(fileName, CreationCollisionOption.ReplaceExisting);
            using (var stream = await file.OpenStreamForWriteAsync())
            {
                await stream.WriteAsync(ms.ToArray(), 0, (int)ms.Length);
                await stream.FlushAsync();
            };
            return String.Format(tileTemplateXml, tileName, fileName);
        }

    }
}
