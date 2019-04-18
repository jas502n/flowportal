using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
namespace YZAppAdmin
{
    /// <summary>
    /// IYZAppProvider 的摘要说明
    /// </summary>

    public partial interface IYZAppAdminProvider : IDisposable
    {

        /// <summary>
        /// 新增编辑App
        /// </summary>
        void SaveApp(AppModule app);

        /// <summary>
        /// 删除App
        /// </summary>
        void DeleteApp(int id);



        /// <summary>
        /// 读取App
        /// </summary>
        List<AppModule> GetApplist(string type);

        /// <summary>
        /// 保存登录
        /// </summary>
        void SaveLogin(LoginModule login);

        /// <summary>
        /// 获取登录
        /// </summary>
        LoginModule LoadLogin();

      

        /// <summary>
        /// 获取消息推送配置
        /// </summary>
        PushNoticeModule LoadNotice();



        /// <summary>
        /// 保存消息推送配置
        /// </summary>
        void SaveNotice(PushNoticeModule login);



        /// <summary>
        /// 读取收藏App
        /// </summary>
        List<AppModule> GetMFavorite();

        /// <summary>
        /// 读取App
        /// </summary>
        List<ApplistItem> GetMApplist(string type);


        /// <summary>
        /// 读取App
        /// </summary>
        List<SearchAppModule> SearchMApplist(string kwd);
        /// <summary>
        /// 删除收藏App
        /// </summary>
        void DeleteMFavorite(string resID);
        /// <summary>
        /// 收藏App
        /// </summary>
        void AddMFavorite(string resID);

        /// <summary>
        /// 
        /// </summary>
        void SaveAppInfo(AppInfoModule aim);


        AppInfoModule LoadAppInfo(string pid);




        /// <summary>
        /// 
        /// </summary>
        OrgSyncInfoModule LoadOrgSyncConfig();


        /// <summary>
        /// 
        /// </summary>
        void SaveOrgSyncConfig(OrgSyncInfoModule OrgSync);
    }


}
