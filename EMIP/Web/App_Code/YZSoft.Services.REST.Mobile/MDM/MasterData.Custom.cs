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
    partial class MasterDataHandler
    {
        public virtual object GetBarcodeInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string barcode = request.GetString("barcode", null);
            string format = request.GetString("format", null);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (IDbCommand cmd = cn.CreateCommand())
                    {
                        IDbDataParameter paramBarcode = provider.CreateParameter("Barcode", barcode, true);
                        IDbDataParameter paramFormat = provider.CreateParameter("Format", format, true);

                        cmd.CommandText = String.Format("SELECT * FROM YZMDProduct WHERE Barcode={0} AND Format={1}",
                            paramBarcode.ParameterName,
                            paramFormat.ParameterName);

                        cmd.Parameters.Add(paramBarcode);
                        cmd.Parameters.Add(paramFormat);

                        using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                        {
                            DataTable table = reader.LoadTable();
                            if (table.Rows.Count >= 1)
                            {
                                JToken rv = JToken.FromObject(table);
                                return (rv as JArray)[0];
                            }
                            else
                                return new JObject();
                        }
                    }
                }
            }
        }

        public virtual object GetExpenseTypes(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (IDbCommand cmd = cn.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM YZMDExpenseType";

                        using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                        {
                            DataTable table = reader.LoadTable();

                            PageResult.RegularColumnsName(table, new string[] {
                                "Code",
                                "Text",
                                "NameSpace",
                                "Image"
                            }); 
                            
                            return table;
                        }
                    }
                }
            }
        }
    }
}