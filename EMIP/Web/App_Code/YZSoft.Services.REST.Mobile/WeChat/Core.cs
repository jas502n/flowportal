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
using YZSoft.Web.WeChat;

namespace YZSoft.Services.REST.Mobile.WeChat
{
    public class CoreHandler : YZServiceHandler
    {
        public AttachmentInfo DownloadTempMediaFile(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string cropId = request.GetString("cropId");
            string appSecret = request.GetString("appSecret");
            string mediaId = request.GetString("mediaId");

            string accessToken = WeChatManager.Instance.GetAccessToken(cropId, appSecret);
            return WeChatManager.DownloadTempMediaFile(accessToken, mediaId);
        }
    }
}