namespace YZAppAdmin
{
    /// <summary>
    /// LoginModule
    /// </summary>

    public class LoginModule
    {
        public string WxLogin { get; set; }//微信登录
        public string WxId { get; set; }//微信参数
        public string WxAgentId { get; set; }//微信参数
        public string WxSecret { get; set; }//微信参数
        public string DdLogin { get; set; }//钉钉登录
        public string DdId { get; set; }//钉钉参数
        public string DdAgentId { get; set; }//钉钉参数
        public string DdCorpId { get; set; }//钉钉参数
        public string DdSecret { get; set; }//钉钉参数
        public string OLogin { get; set; }//其他登录
    }
}