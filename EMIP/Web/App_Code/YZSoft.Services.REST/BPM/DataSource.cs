using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Data.Common;
using BPM.Data.Common;
using YZSoft.ESB.Model;
using YZSoft.ESB;
using YZSoft.ESB.Visit;
using System.Data;

namespace YZSoft.Services.REST.BPM
{
    public class DataSourceHandler : YZServiceHandler
    {
        public virtual JObject GetTreeOfTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            bool expand = request.GetBool("expand",true);

            TableIdentityCollection tables = new TableIdentityCollection();
            string strTables = request.GetString("tables", "[]");
            JArray jtables = JArray.Parse(strTables);
            foreach (JArray jtable in jtables)
                tables.Add(new TableIdentity((string)jtable[0], (string)jtable[1]));

            FlowDataSet dataSet;

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                dataSet = DataSourceManager.LoadDataSetSchema(cn, tables);
            }

            JObject rv = new JObject();

            JArray jTables = new JArray();
            rv[YZJsonProperty.children] = jTables;

            foreach (FlowDataTable table in dataSet.Tables)
            {
                JObject jTable = new JObject();
                jTables.Add(jTable);

                jTable["leaf"] = false;
                jTable["id"] = table.DataSourceName + ":" + table.TableName;
                jTable["text"] = TableIdentityHelper.GetTableIdentityName(table.DataSourceName,table.TableName);
                jTable["iconCls"] = "dbtable";
                jTable["expanded"] = expand;

                JArray children = new JArray();
                jTable[YZJsonProperty.children] = children;

                foreach (FlowDataColumn column in table.Columns)
                {
                    JObject jColumn = new JObject();
                    children.Add(jColumn);

                    jColumn["leaf"] = true;
                    jColumn["id"] = table.DataSourceName + ":" + table.TableName + "." + column.ColumnName;
                    jColumn["text"] = column.ColumnName;                 
                    jColumn["iconCls"] = "dbcolumn";

                    jColumn["data"] = JObject.FromObject(new {
                         DataSourceName = table.DataSourceName,
                         TableName = table.TableName,
                         ColumnName = column.ColumnName,
                         FullName = table.TableName + "." + column.ColumnName,
                         Type = column.DataType.Name
                    });
                }
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual TableIdentityCollection GetProcessGlobalTableIdentitys(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            string processName = request.GetString("ProcessName");

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                return BPMProcess.GetProcessGlobalTableIdentitys(cn, processName);
            }
        }

        public virtual JObject GetTableSchemas(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serverName = request.GetString("ServerName", null);
            TableIdentityCollection tables = request.GetPostData<JArray>().ToObject<TableIdentityCollection>();
            FlowDataSet dataSet;

            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, serverName);
                dataSet = DataSourceManager.LoadDataSetSchema(cn, tables);
                return YZJsonHelper.SerializeSchema(dataSet);
            }
        }

        public virtual JArray GetDataSourceAndTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string datasourceName = request.GetString("node",null);
            if (datasourceName == "root")
                datasourceName = null;
            bool expand = request.GetBool("expand", false);

            if (String.IsNullOrEmpty(datasourceName))
            {
                BPMObjectNameCollection dsNames;
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    dsNames = DataSourceManager.GetDataSourceNames(cn);
                }

                JArray rv = new JArray();
                foreach (string dsName in dsNames)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = false;
                    jitem["id"] = dsName;
                    jitem["text"] = dsName;
                    jitem["iconCls"] = "dbdatabase";
                    jitem["expanded"] = expand;
                }

                return rv;
            }
            else
            {
                bool includeView = request.GetBool("view",false);
                BPMObjectNameCollection tables;
                BPMObjectNameCollection views = new BPMObjectNameCollection();
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    tables = DataSourceManager.GetTables(cn, datasourceName);
                    if (includeView)
                        views = DataSourceManager.GetViews(cn, datasourceName);
                }

                JArray rv = new JArray();
                foreach (string tableName in tables)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = true;
                    jitem["id"] = datasourceName + '.' + tableName;
                    jitem["text"] = tableName;
                    jitem["iconCls"] = "dbtable";
                    jitem["data"] = JObject.FromObject(new
                    {
                        DataSourceName = datasourceName,
                        TableName = tableName
                    });

                }

                foreach (string viewName in views)
                {
                    JObject jitem = new JObject();
                    rv.Add(jitem);

                    jitem["leaf"] = true;
                    jitem["id"] = datasourceName + '.' + viewName;
                    jitem["text"] = viewName;
                    jitem["iconCls"] = "dbview";
                    jitem["data"] = JObject.FromObject(new
                    {
                        DataSourceName = datasourceName,
                        TableName = viewName
                    });
                }

                return rv;
            }
        }

        public virtual BPMObjectNameCollection GetDataSourceNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            if(String.IsNullOrEmpty(request.GetString("captibity",null)))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    return DataSourceManager.GetDataSourceNames(cn);
                }
            }
            else
            {
                DataSourceCapability captibity = request.GetEnum<DataSourceCapability>("captibity");

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    return DataSourceManager.GetDataSourceNames(cn, captibity);
                }
            }
        }

        public virtual BPMObjectNameCollection GetTables(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return DataSourceManager.GetTables(cn, datasourceName);
            }
        }

        public virtual BPMObjectNameCollection GetViews(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return DataSourceManager.GetViews(cn, datasourceName);
            }
        }

        public virtual BPMObjectNameCollection GetProcedures(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource", null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return DataSourceManager.GetProcedures(cn, datasourceName);
            }
        }

        public virtual BPMObjectNameCollection GetESBObjects(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            BPMObjectNameCollection rv = new BPMObjectNameCollection();
            SourceInfoCollection list = SourceInfoManager.GetSourceList();
            foreach (var item in list.ToArray())
            {
                rv.Add(string.Format("{0}:{1}",item.sourceType.ToString(),item.sourceName));
            }
            return rv;
        }

        public virtual JObject GetDataSourceSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("Query", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableSchema(context);
            }
            else if (!String.IsNullOrEmpty(query))
            {
                return this.GetQuerySchema(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                return this.GetProcedureSchema(context);
            }
            if (!String.IsNullOrEmpty(esb))
            {
                return this.GetESBObjectSchema(context);
            }

            throw new Exception(Resources.YZStrings.Aspx_Invalid_Paramaters);
        }

        public virtual JObject GetTableSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String tableName = request.GetString("tableName");
            FlowDataSet dataset = new FlowDataSet();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                dataset.Tables.Add(DataSourceManager.LoadTableSchema(cn, datasourceName, tableName));
            }

            return YZJsonHelper.SerializeSchema(dataset,"", "DataType");
        }

        public virtual JObject GetQuerySchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource", null);
            String query = request.GetString("Query");
            QueryParameterCollection queryParams = JArray.Parse(request.GetString("QueryParams")).ToObject<QueryParameterCollection>();
            FlowDataSet dataset = new FlowDataSet();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                dataset.Tables.Add(DataSourceManager.LoadSchemaByQuery(cn, datasourceName, query, queryParams.CreateNullDBParameters()));
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetProcedureSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String procedureName = request.GetString("ProcedureName");
            FlowDataSet dataset = new FlowDataSet();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable tableParams;
                dataset.Tables.Add(DataSourceManager.LoadProdecureSchema(cn, datasourceName, procedureName, out tableParams));
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetESBObjectSchema(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");
            FlowDataSet dataset = new FlowDataSet();
            //获取参数
            string[] strs = objectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);

            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);
            SourceVisit visit = new SourceVisit(sourceInfo);
            foreach (var item in visit.GetSchema())
            {
                table.Columns.Add(new FlowDataColumn(item.rename,typeof(string)));
            }

            return YZJsonHelper.SerializeSchema(dataset, "", "DataType");
        }

        public virtual JObject GetDataSourceParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
            String esb = request.GetString("ESB", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableParams(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                return this.GetProcedureParams(context);
            }
            if (!String.IsNullOrEmpty(esb))
            {
                return this.GetESBObjectParams(context);
            }

            return null;
        }

        public virtual JObject GetTableParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String tableName = request.GetString("tableName");

            FlowDataTable tableSchema;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                tableSchema = DataSourceManager.LoadTableSchema(cn, datasourceName, tableName);
            }

            FlowDataTable tableParams = new FlowDataTable("Params");
            foreach (FlowDataColumn column in tableSchema.Columns)
            {
                if (column.AllowSearch)
                    tableParams.Columns.Add(column);
            }

            FlowDataSet dataset = new FlowDataSet();
            dataset.Tables.Add(tableParams);

            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = true;
            return rv;
        }

        public virtual JObject GetProcedureParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource",null);
            String procedureName = request.GetString("ProcedureName");
            FlowDataSet dataset = new FlowDataSet();
            FlowDataTable tableParams;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                DataSourceManager.LoadProdecureSchema(cn, datasourceName, procedureName, out tableParams);
                dataset.Tables.Add(tableParams);
            }

            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = false;
            return rv;
        }

        public virtual JObject GetESBObjectParams(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String objectName = request.GetString("ESB");
            FlowDataSet dataset = new FlowDataSet();
            //获取参数
            string[] strs = objectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);


            FlowDataTable table = new FlowDataTable();
            dataset.Tables.Add(table);
            SourceVisit visit = new SourceVisit(sourceInfo);
            List<ColumnInfo> paramList = visit.GetParameter();
            if (paramList!=null&&paramList.Count>0)
            {
                foreach (var item in visit.GetParameter())
                {
                    table.Columns.Add(new FlowDataColumn(item.rename));
                }
            }
            JObject rv = YZJsonHelper.SerializeSchema(dataset, "", "DataType");
            rv["supportOp"] = false;
            return rv;
        }

        public virtual object GetDataSourceData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("Query", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                //return this.GetTableSchema(context);
                throw new NotImplementedException();
            }
            else if (!String.IsNullOrEmpty(query))
            {
                return this.GetQueryData(context);
                throw new NotImplementedException();
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                //return this.GetProcedureSchema(context);
                throw new NotImplementedException();
            }
            if (!String.IsNullOrEmpty(esb))
            {
                //return this.GetESBObjectSchema(context);
                throw new NotImplementedException();
            }

            throw new Exception(Resources.YZStrings.Aspx_Invalid_Paramaters);
        }

        public virtual object GetQueryData(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String datasourceName = request.GetString("DataSource", null);
            String query = request.GetString("Query");
            QueryParameterCollection queryParams = JArray.Parse(request.GetString("QueryParams")).ToObject<QueryParameterCollection>();
            YZClientParamCollection @params = JArray.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(request.GetString("params", YZJsonHelper.Base64EmptyJArray)))).ToObject<YZClientParamCollection>();
            bool clientCursor = request.GetBool("clientCursor", false);

            //应用查询条件
            BPMDBParameterCollection finallyParams = queryParams.CreateNullDBParameters();
            foreach (BPMDBParameter @param in finallyParams)
            {
                YZClientParam clientParam = @params.TryGetItem(@param.Name);
                if (clientParam != null && clientParam.value != null)
                    @param.Value = clientParam.value;
            }

            FlowDataTable table = new FlowDataTable();
            int rowcount;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                table.Load(cn, BPMCommandType.Query, query, finallyParams, clientCursor, request.Start, request.Limit, out rowcount);
            }

            return new
            {
                total = rowcount,
                children = table.ToDataTable()
            };
        }

        public virtual DataTable GetDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            String tableName = request.GetString("TableName", null);
            String procedureName = request.GetString("ProcedureName", null);
            String esb = request.GetString("ESB", null);
            String query = request.GetString("Query", null);

            if (!String.IsNullOrEmpty(tableName))
            {
                return this.GetTableDataNoPaged(context);
            }
            else if (!String.IsNullOrEmpty(procedureName))
            {
                return this.GetProcedureDataNoPaged(context);
            }
            if (!String.IsNullOrEmpty(esb))
            {
                return this.GetESBDataNoPaged(context);
            }

            throw new Exception(Resources.YZStrings.Aspx_Invalid_Paramaters);
        }

        public virtual DataTable GetTableDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string dataSourceName = request.GetString("DataSource", null);
            string tableName = request.GetString("TableName");
            string orderBy = request.GetString("OrderBy",null);
            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter","{}")).ToObject<YZDSFilterCollection>();

            BPMDBParameterCollection @params = new BPMDBParameterCollection();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    paramater.ParameterCompareType = BPMDBParameter.ParseOp(filter.Value.op, ParameterCompareType.Equ) | ParameterCompareType.NecessaryCondition;
                    @params.Add(paramater);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable table = DataSourceManager.LoadTableData(cn, dataSourceName, tableName, @params, orderBy);
                return table.ToDataTable();
            }
        }

        public virtual DataTable GetProcedureDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string dataSourceName = request.GetString("DataSource", null);
            string procedureName = request.GetString("ProcedureName");
            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter", "{}")).ToObject<YZDSFilterCollection>();

            BPMDBParameterCollection @params = new BPMDBParameterCollection();

            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    BPMDBParameter paramater = new BPMDBParameter(filter.Key, typeof(String), filter.Value.value);
                    @params.Add(paramater);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                FlowDataTable table = DataSourceManager.ExecProcedure(cn, dataSourceName, procedureName, @params);
                return table.ToDataTable();
            }
        }

        public virtual DataTable GetESBDataNoPaged(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string esbObjectName = request.GetString("ESB");
            YZDSFilterCollection filters = JObject.Parse(request.GetString("Filter", "{}")).ToObject<YZDSFilterCollection>();

            //获取参数
            string[] strs = esbObjectName.Split(':');
            SourceTypeEnum sourceType = (SourceTypeEnum)Enum.Parse(typeof(SourceTypeEnum), strs[0]);
            SourceInfo sourceInfo = SourceInfoManager.GetSourceInfo(sourceType, strs[1]);
            SourceVisit visit = new SourceVisit(sourceInfo);
            BPMObjectNameCollection names = new BPMObjectNameCollection();
            List<ColumnInfo> values = new List<ColumnInfo>();
            if (filters != null)
            {
                foreach (KeyValuePair<string, YZDSFilter> filter in filters)
                {
                    names.Add(filter.Key);
                    values.Add(new ColumnInfo()
                    {
                        columnName = filter.Key,
                        defaultValue = filter.Value.value
                    });
                }

                foreach (ColumnInfo column in visit.GetParameter())
                {
                    if (!names.Contains(column.rename))
                    {
                        names.Add(column.rename);
                        values.Add(new ColumnInfo()
                        {
                            columnName = column.rename,
                            defaultValue = column.defaultValue
                        });
                    }
                }
            }

            return visit.GetResult(values);
        }
    }
}