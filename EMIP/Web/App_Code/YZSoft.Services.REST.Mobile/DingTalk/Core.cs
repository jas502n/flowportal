using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using BPM;
using BPM.Client;
using YZSoft.Web.DingTalk;

namespace YZSoft.Services.REST.Mobile.DingTalk
{
    public class CoreHandler : YZServiceHandler
    {
        public AttachmentInfo DownloadTempMediaFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string url = request.GetString("mediaUrl");
            string ext = request.GetString("ext",null);

            return DingTalkManager.DownloadTempMediaFile(url, ext);
        }
    }
}