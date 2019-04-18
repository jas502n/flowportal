using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;

/// <summary>
///PageResult 的摘要说明
/// </summary>
[DataContract]
public class PageResult
{
    [DataMember(Name = "total", Order = 0)]
    public int TotalRows { get; set; }

    [DataMember(Name = YZJsonProperty.children, Order = 1)]
    public DataTable Table { get; set; }

    public void RegularColumnsName(string[] columnNames)
    {
        RegularColumnsName(this.Table, columnNames);
    }

    public static void RegularColumnsName(DataTable table,string[] columnNames)
    {
        if (columnNames == null)
            return;

        foreach (string columnName in columnNames)
        {
            table.Columns[columnName].ColumnName = columnName;
        }
    }
}