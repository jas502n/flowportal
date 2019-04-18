using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Notify;
using YZSoft.Services.REST.Attachment;
using ZXing.QrCode;
using ZXing;
using ZXing.Common;
using ZXing.Rendering;

namespace YZSoft.Services.REST.util
{
    public class BarcodeHandler : DownloadServiceBase
    {
        /*
        AZTEC,
        CODABAR,
        CODE_39,
        CODE_93,
        CODE_128,
        DATA_MATRIX,
        EAN_8,
        EAN_13,
        ITF,
        MAXICODE,
        PDF_417,
        QR_CODE,
        RSS_14,
        RSS_EXPANDED,
        UPC_A,
        UPC_E,
        All_1D,
        UPC_EAN_EXTENSION,
        MSI,
        PLESSEY,
        IMB,
        */
        public virtual void Encode(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string text = request.GetString("text");
            int width = request.GetInt32("width",0);
            int height = request.GetInt32("height",42);
            BarcodeFormat format = request.GetEnum<BarcodeFormat>("format", BarcodeFormat.CODE_128);
            bool pureBarcode = request.GetBool("pureBarcode", false);

            EncodingOptions options = new EncodingOptions
            {
                //DisableECI = true,
                //CharacterSet = "UTF-8",
                PureBarcode = pureBarcode,
                Margin = 0,
                Width = width,
                Height = height
            };

            BarcodeWriter writer = new BarcodeWriter();
            writer.Format = format;
            writer.Options = options;

            using(Bitmap image = writer.Write(text))
            {
                this.ProcessResponseHeader(context, format + ".gif",false);
                image.Save(context.Response.OutputStream, ImageFormat.Gif);
            }
        }
    }
}