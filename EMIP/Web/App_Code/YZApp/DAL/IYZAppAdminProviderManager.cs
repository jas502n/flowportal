using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
namespace YZAppAdmin
{
    /// <summary>
    /// IYZAppProviderManager 的摘要说明
    /// </summary>
    public class IYZAppAdminProviderManager
    {

        public static IYZAppAdminProvider DefaultProvider
        {
            get
            {
                return new YZAppAdminDataSource();

            }
        }
    }
}
