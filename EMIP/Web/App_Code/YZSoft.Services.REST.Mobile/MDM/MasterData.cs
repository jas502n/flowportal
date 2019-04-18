using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Apps;
using System.Data.SqlClient;

namespace YZSoft.Services.REST.Mobile.MDM
{
    public partial class MasterDataHandler : YZServiceHandler
    {
        protected static BPMObjectNameCollection MDMTableNames = null;

        static MasterDataHandler()
        {
            //只允许访问特定的主数据表
            //MDMTableNames = new BPMObjectNameCollection();
            //MDMTableNames.Add("YZMDLeavingType");
        }
        
        public virtual object GetMasterData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string tableName = request.GetString("tableName");
            string orderby = request.GetString("orderby",null);
            JObject jPost = request.GetPostData<JObject>();
            BPMObjectNameCollection fields = jPost["fields"].ToObject<BPMObjectNameCollection>();

            fields.Unique();

            if (MDMTableNames != null)
            {
                if (!MDMTableNames.Contains(tableName))
                    throw new Exception(String.Format(Resources.YZMobile.Aspx_MDM_TableAccessDenied, tableName));
            }
            
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (IDbCommand cmd = cn.CreateCommand())
                    {
                        if (!String.IsNullOrEmpty(orderby))
                            orderby = "order by " + orderby;

                        cmd.CommandText = String.Format("select {0} from {1} {2}", String.Join(",",fields.ToArray()), tableName, orderby);

                        using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                        {
                            DataTable table = reader.LoadTable();
                            PageResult.RegularColumnsName(table, fields.ToArray());

                            return table;
                        }
                    }
                }
            }
        }

        public virtual object GetCountries(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (IDbCommand cmd = cn.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM YZMDCountry";

                        using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                        {
                            DataTable table = reader.LoadTable();

                            PageResult.RegularColumnsName(table, new string[] {
                                "Name",
                                "Name_en",
                                "IDDCode"
                            }); 

                            table.Columns.Add("Group", typeof(string));
                            table.Columns.Add("Order", typeof(string));
                            table.Columns.Add("Pinyin", typeof(string));

                            foreach (DataRow row in table.Rows)
                            {
                                string name = Convert.ToString(row["Name"]);
                                string py = YZPinYinHelper.GetShortPinyin(name).ToUpper();

                                row["Group"] = String.IsNullOrEmpty(py) ? "" : py.Substring(0, 1);
                                row["Order"] = py;
                                row["Pinyin"] = py;
                            }
                            return table;
                        }
                    }
                }
            }
        }
    }
}