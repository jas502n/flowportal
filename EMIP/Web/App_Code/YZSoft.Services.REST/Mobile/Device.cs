using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Notify;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Mobile;

namespace YZSoft.Services.REST.Mobile
{
    public class DeviceHandler : YZServiceHandler
    {
        public virtual PageResult GetDevicesList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid", null);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    if (String.IsNullOrEmpty(uid))
                        return DeviceManager.GetDevices(provider, cn, null, request.GetSortString("LastLogin DESC"), request.Start, request.Limit);
                    else
                        return DeviceManager.GetUserDevices(provider, cn, uid, null, request.GetSortString("LastLogin DESC"), request.Start, request.Limit);
                }
            }
        }

        public virtual void DisableDevice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            string UUID = request.GetString("UUID");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Device device = DeviceManager.GetDevice(provider, cn, uid, UUID);
                    device.Disabled = true;
                    DeviceManager.Update(provider, cn, device);
                }
            }
        }

        public virtual void EnableDevice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");
            string UUID = request.GetString("UUID");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Device device = DeviceManager.GetDevice(provider, cn, uid, UUID);
                    device.Disabled = false;
                    DeviceManager.Update(provider, cn, device);
                }
            }
        }
    }
}