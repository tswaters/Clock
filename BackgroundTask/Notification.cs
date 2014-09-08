using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Windows.UI.Text;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media.Imaging;

using Windows.Foundation;

using System.IO;
using Windows.UI.Notifications;
using Windows.Data.Xml.Dom;
using Windows.Storage.Streams;
using Windows.Storage;
using System.Runtime.InteropServices.WindowsRuntime;

namespace BackgroundTask
{
    /// <summary>
    /// Wrapper class for Tile Notifications
    /// </summary>
    public sealed class Notification
    {
        const string tileNotificationXml = @"<tile><visual version=""2"">{0}</visual></tile>";
        const string tileTemplateXml = @"<binding template=""{0}""><image id=""1"" src=""ms-appdata:///local/{1}""/></binding>";

        public static IAsyncOperation<string> UpdateTileAsync()
        {
            System.Diagnostics.Debug.WriteLine("Update tile called...");
            return AsyncInfo.Run<string>((token) =>
                Task.Run<string>(async() => 
                    {
                        List<string> tiles = new List<string>();
                        tiles.Add(await GetTileNodeAsync(TileTemplateType.TileSquare150x150Image, "TileSquare150x150Image"));
                        tiles.Add(await GetTileNodeAsync(TileTemplateType.TileWide310x150Image, "TileWide310x150Image"));

                        string xml = String.Format(tileNotificationXml, String.Join("", tiles));
                        System.Diagnostics.Debug.WriteLine("Sending tile notification " + xml);
                        XmlDocument xmlDoc = new XmlDocument();
                        xmlDoc.LoadXml(xml);

                        var tileNotification = new TileNotification(xmlDoc);
                        tileNotification.ExpirationTime = DateTimeOffset.Now.AddMinutes(1);
                        TileUpdateManager.CreateTileUpdaterForApplication().Update(tileNotification);
                        System.Diagnostics.Debug.WriteLine("Expiring " + tileNotification.ExpirationTime.ToString());
                        return "Done.";
                    }
            ));

        }
                
        public static IAsyncOperation<string> GetTileNodeAsync(TileTemplateType tileType, string tileName)
        {
            return AsyncInfo.Run<string>((token) =>
                Task.Run<string>(async () =>
                    {
                        MemoryStream ms = Graphics.GetMemoryStream(tileType);
                        string fileName = tileName + ".png";
                        System.Diagnostics.Debug.WriteLine("Creating " + fileName);
                        var file = await ApplicationData.Current.LocalFolder.CreateFileAsync(fileName, CreationCollisionOption.ReplaceExisting);
                        using (var stream = await file.OpenStreamForWriteAsync())
                        {
                            await stream.WriteAsync(ms.ToArray(), 0, (int)ms.Length);
                            await stream.FlushAsync();
                        };
                        return String.Format(tileTemplateXml, tileName, fileName);
                    }
                )
            );

        }
    }
}
