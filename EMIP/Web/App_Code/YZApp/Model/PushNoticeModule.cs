using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
namespace YZAppAdmin
{
    /// <summary>
    /// PushNoticeModule消息推送配置
    /// </summary>

    public class PushNoticeModule
    {
        public string WxAgentid { get; set; }
        public string WxId { get; set; }
        public string WxSecret { get; set; }
        public string WxPushUrl { get; set; }
        public string DdAgentid { get; set; }
        public string DdId { get; set; }
        public string DdSecret { get; set; }
        public string DdPushUrl { get; set; }
    }
}