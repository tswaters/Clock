using System;
using System.IO;
using System.Reflection;
using SharpDX;
using SharpDX.Direct2D1;
using SharpDX.DirectWrite;
using SharpDX.DXGI;
using SharpDX.IO;
using SharpDX.WIC;
using AlphaMode = SharpDX.Direct2D1.AlphaMode;
using Bitmap = SharpDX.WIC.Bitmap;
using D2DPixelFormat = SharpDX.Direct2D1.PixelFormat;
using WicPixelFormat = SharpDX.WIC.PixelFormat;
using DDDFactory = SharpDX.Direct2D1.Factory;
using DWFactory = SharpDX.DirectWrite.Factory;

namespace BackgroundTask
{
    /// <summary>
    /// Simple wrapper to SharpDX to create tile images
    /// </summary>
    /// <remarks>
    /// I have no desire to learn how to use DirectX just to write some text to an image.  This was taken verbatem from 
    /// https://github.com/christophwille/winrt-snippets/blob/master/RenderTextToBitmap/RenderTextToBitmap/MainPage.xaml.cs
    /// </remarks>
    class Graphics
    {

        /// <summary>Returns a MemoryStream containing a generated tile image.</summary>
        /// <param name="height">Height of the generated memory stream.</param>
        /// <param name="width">Width of the generated memory stream.</param>
        /// <returns><see cref="MemoryStream"/></returns>
        public static MemoryStream GetMemoryStream(Windows.UI.Notifications.TileTemplateType t)
        {

            Guid _pixelFormat = WicPixelFormat.Format32bppBGR;
            ImagingFactory _wicFactory;
            DDDFactory _dddFactory;
            DWFactory _dwFactory;
            RenderTargetProperties _renderTargetProperties;

            _pixelFormat = WicPixelFormat.Format32bppBGR;
            _wicFactory = new ImagingFactory();
            _dddFactory = new SharpDX.Direct2D1.Factory();
            _dwFactory = new SharpDX.DirectWrite.Factory();
            _renderTargetProperties = new RenderTargetProperties(RenderTargetType.Default, new D2DPixelFormat(Format.Unknown, AlphaMode.Unknown), 0, 0, RenderTargetUsage.None, FeatureLevel.Level_DEFAULT);
            
            int width;
            int height;
            RectangleF dateLocation;
            RectangleF timeLocation;
            TextFormat dateFormat;
            TextFormat timeFormat;
            switch (t)
            {
                case Windows.UI.Notifications.TileTemplateType.TileWide310x150Image:
                    width = 310;
                    height = 150;
                    dateLocation = new RectangleF(-10, 40, width, height);
                    timeLocation = new RectangleF(-10, 55, width, height);
                    dateFormat = new TextFormat(_dwFactory, "Segui UI", 18)
                    {
                        TextAlignment = TextAlignment.Trailing
                    };
                    timeFormat = new TextFormat(_dwFactory, "Segui UI", 36)
                    {
                        TextAlignment = TextAlignment.Trailing
                    };
                    break;
                case Windows.UI.Notifications.TileTemplateType.TileSquare150x150Image:
                    width = 150;
                    height = 150;
                    dateLocation = new RectangleF(-10, 10, width, height);
                    timeLocation = new RectangleF(-10, 85, width, height);
                    dateFormat = new TextFormat(_dwFactory, "Segui UI", 18)
                    {
                        TextAlignment = TextAlignment.Trailing
                    };
                    timeFormat = new TextFormat(_dwFactory, "Segui UI", 28)
                    {
                        TextAlignment = TextAlignment.Trailing
                    };
                    break;
                default:
                    throw new NotImplementedException("Unsupport tile type.");
            }

            // create image and strokes/formats/etc
            var foreColor = HexToColor(getSettingColor("foreColor", "#fff"));
            var backColor = HexToColor(getSettingColor("backColor", "#000"));
            var _wicBitmap = new Bitmap(_wicFactory, width, height, _pixelFormat, BitmapCreateCacheOption.CacheOnLoad);
            var _renderTarget = new WicRenderTarget(_dddFactory, _wicBitmap, _renderTargetProperties)
            {
                TextAntialiasMode = SharpDX.Direct2D1.TextAntialiasMode.Cleartype
            };
            var textBrush = new SharpDX.Direct2D1.SolidColorBrush(_renderTarget, foreColor);

            // draw to the bitmap.
            _renderTarget.BeginDraw();
            _renderTarget.Clear(backColor);
            _renderTarget.DrawText(getDateString("date"), dateFormat, dateLocation, textBrush);
            _renderTarget.DrawText(getDateString("time"), timeFormat, timeLocation, textBrush);
            _renderTarget.EndDraw();

            // return a memory stream with the encoding in it.
            var ms = new MemoryStream();
            var stream = new WICStream(_wicFactory, ms);
            var encoder = new PngBitmapEncoder(_wicFactory);
            encoder.Initialize(stream);
            var frameEncoder = new BitmapFrameEncode(encoder);
            frameEncoder.Initialize();
            frameEncoder.SetSize(width, height);
            Guid pixelFormatGuid = WicPixelFormat.FormatDontCare;
            frameEncoder.SetPixelFormat(ref pixelFormatGuid);
            frameEncoder.WriteSource(_wicBitmap);
            frameEncoder.Commit();
            encoder.Commit();
            frameEncoder.Dispose();
            encoder.Dispose();
            stream.Dispose();
            ms.Position = 0;
            return ms;

        }

        /// <summary>
        /// Retrieves color settings from the application and provides a default.
        /// </summary>
        /// <param name="setting">Setting name (backColor, foreColor)</param>
        /// <param name="defaultColor">Default to use if not found.</param>
        /// <returns></returns>
        private static string getSettingColor(string setting, string defaultColor) 
        {
            return Windows.Storage.ApplicationData.Current.LocalSettings.Values.ContainsKey(setting)
                ? (string)Windows.Storage.ApplicationData.Current.LocalSettings.Values[setting]
                : defaultColor;
        }

        /// <summary>
        /// Converts a hex string to <see cref="SharpDX.Color"/>
        /// </summary>
        /// <param name="hexColor">Incoming hex string (#fff, #ffffff)</param>
        /// <returns><see cref="SharpDX.Color"/></returns>
        private static SharpDX.Color HexToColor(string hexColor)
        {
            // remove the leading '#' if it exists
            hexColor = hexColor.Replace("#", "");

            // expand 3-digit colors if only 3 digits.
            if (hexColor.Length == 3)
            {
                hexColor = System.Text.RegularExpressions.Regex.Replace(hexColor, "(.)", "$1$1");
            }

            // if not 6-digits, throw exception
            if (hexColor.Length != 6)
            {
                throw new ArgumentException("Invalid color (#" + hexColor + ") passed.");
            }

            // perform conversions.
            return new SharpDX.Color(
                Convert.ToByte(hexColor.Substring(0, 2), 16),
                Convert.ToByte(hexColor.Substring(2, 2), 16),
                Convert.ToByte(hexColor.Substring(4, 2), 16)
            );
        }

        /// <summary>
        /// Performs string formatting to generate the current date/time.
        /// </summary>
        /// <param name="type">Format to use (expecting "date" or "time")</param>
        /// <returns>Formatted string (with ordinal for dates!)</returns>
        private static string getDateString(string type)
        {
            DateTime now = DateTime.Now;//new DateTime(2009, 9, 30); 
            string formatString = String.Empty;
            switch (type)
            {
                case "date":
                    formatString = String.Format(now.ToString("dddd MMMM {0}, yyyy"), getOrdinal(now.Day));
                    break;
                case "time":
                    formatString = now.ToString("h:mm tt");
                    break;
                default:
                    throw new ArgumentException("Invalid type passed to getDateString.");
            }
            return formatString;
        }

        /// <summary>
        /// Returns the ordinal for a date (e.g.  "st" in "1st")
        /// </summary>
        /// <param name="number">Day to format</param>
        /// <returns>Day with ordinal (e.g. 1st)</returns>
        private static string getOrdinal(int number)
        {
            string ordinal = String.Empty;
            switch (number % 100)
            {
                case 11:
                case 12:
                case 13:
                    ordinal = "th";
                    break;
            }

            switch (number % 10)
            {
                case 1: ordinal = "st"; break;
                case 2: ordinal = "nd"; break;
                case 3: ordinal = "rd"; break;
                default: ordinal = "th"; break;
            }
            return String.Format("{0}{1}", number.ToString(), ordinal);
        }
    }
}
