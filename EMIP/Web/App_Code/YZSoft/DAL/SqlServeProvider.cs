using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Collections.Generic;
using System.Text;
using System.Data.Common;
using System.Data.SqlClient;
using BPM;

namespace YZSoft.Web.DAL
{
    public partial class SqlServerProvider : YZDbProviderBase, IYZDbProvider
    {
        public SqlServerProvider()
        {
        }

        public IDbConnection OpenConnection(string connectionString = null)
        {
            if (connectionString == null)
                connectionString = this.ConnectionString;

            SqlConnection cn = new SqlConnection();
            cn.ConnectionString = connectionString;
            cn.Open();
            return cn;
        }

        //日期
        public override string DateToQueryString(DateTime date)
        {
            return "'" + YZStringHelper.DateToStringL(date) + "'";
        }

        //参数
        public override string GetParameterName(string columnName)
        {
            return "@" + columnName;
        }

        public override IDbDataParameter CreateParameter(string columnName, object value, bool addPerfix)
        {
            string parameterName = addPerfix ? this.GetParameterName(columnName) : columnName;
            return new SqlParameter(parameterName, value);
        }

        public int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName, object value)
        {
            string paramName = this.GetParameterName(columnName);
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT ISNULL(max(OrderIndex)+1,0) FROM {0} WHERE [{1}]={2}", tableName, columnName, paramName);
                cmd.Parameters.Add(new SqlParameter(paramName, value));

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public int GetNextOrderIndex(IDbConnection cn, string tableName, string columnName1, object value1, string columnName2, object value2)
        {
            string paramName1 = this.GetParameterName(columnName1);
            string paramName2 = this.GetParameterName(columnName2);
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Connection = cn as SqlConnection;
                cmd.CommandText = String.Format("SELECT ISNULL(max(OrderIndex)+1,0) FROM {0} WHERE [{1}]={2} AND [{3}]={4}", this.EncodeText(tableName), this.EncodeText(columnName1), paramName1, this.EncodeText(columnName2), paramName2);
                cmd.Parameters.Add(new SqlParameter(paramName1, value1));
                cmd.Parameters.Add(new SqlParameter(paramName2, value2));

                return System.Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        protected void GeneratePageCommand(IDbCommand cmd, string select, string sort, int startRowIndex, int rows)
        {
            PageInfo pageInfo = this.AjaxPageToDbPage(startRowIndex, rows);

            string query = @"
WITH YZSOFT_TEMP_A AS({0}),
YZSOFT_TEMP_B AS(SELECT *,ROW_NUMBER() OVER(ORDER BY {1}) AS RowNum FROM YZSOFT_TEMP_A),
YZSOFT_TEMP_C AS(SELECT count(*) AS TotalRows FROM YZSOFT_TEMP_B),
YZSOFT_TEMP_D AS(SELECT YZSOFT_TEMP_B.*,YZSOFT_TEMP_C.TotalRows FROM YZSOFT_TEMP_C,YZSOFT_TEMP_B)
SELECT * FROM YZSOFT_TEMP_D WHERE RowNum >= @StartRowIndex AND (RowNum<=@EndRowIndex OR @EndRowIndex < @StartRowIndex ) ORDER BY RowNum";

            cmd.CommandText = String.Format(query, select, sort);
            cmd.Parameters.Add(this.CreateParameter("StartRowIndex", pageInfo.StartRowIndex, true));
            cmd.Parameters.Add(this.CreateParameter("EndRowIndex", pageInfo.EndRowIndex, true));
        }
    }
}
