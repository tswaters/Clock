using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Windows.Storage;
using System.IO;


namespace Logging
{
    /// <summary>Responsible for outputting log files to local app directory.</summary>
    public sealed class Logger
    {
        /// <summary>Filename to save log files as.</summary>
        public static string fileName { get; set; }

        /// <summary>Sets a default fileName to save to.</summary>
        static Logger()
        {
            fileName = "logger.txt";
        }

        /// <summary>Takes a string and outputs that to the log file.</summary>
        /// <param name="str">String to write to log file.</param>
        [System.Diagnostics.ConditionalAttribute("DEBUG")]
        private async static void Output(string str)
        {
            // generate the string to output.
            var sb = new StringBuilder();
            sb.Append(DateTime.Now.ToString("yyyy-MM-dd hh:m:ss"));
            sb.Append(" ");
            sb.Append(str);
            sb.Append(Environment.NewLine);

            // get the local application data directory and append text to log file.
            try
            {
                var appData = ApplicationData.Current;
                var local = appData.LocalFolder;
                var collision = CreationCollisionOption.OpenIfExists;
                var file = await local.CreateFileAsync(fileName, collision);
                await FileIO.AppendTextAsync(file, sb.ToString());
            }
            catch (Exception e) {
                
            }
        }

        /// <summary>Writes a line to the log file.</summary>
        /// <param name="str">String to write to log.</param>
        [Windows.Foundation.Metadata.DefaultOverloadAttribute]
        [System.Diagnostics.ConditionalAttribute("DEBUG")]
        public static void WriteLine(string str)
        {
            Output(str);
        }

        /// <summary>Writes a formatted string to log file.</summary>
        /// <param name="str">Format string to use.</param>
        /// <param name="args">Replacements to perform.</param>
        [System.Diagnostics.ConditionalAttribute("DEBUG")]
        public static void WriteLine(string str, params object[] args)
        {
            WriteLine(string.Format(str, args));
        }

        /// <summary>Writes an exception to the log file.</summary>
        /// <param name="e">Exception to write to log file.</param>
        [System.Diagnostics.ConditionalAttribute("DEBUG")]
        public static void WriteLine(Exception e)
        {
            WriteLine("Exception {0}\n STACK TRACE {1}", e.Message, e.StackTrace);
        }
    }
}
