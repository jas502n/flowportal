using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Drawing;
using System.Reflection;
using YZNPOI.HSSF.Util;
using YZNPOI.HSSF.UserModel;
using YZNPOI.HSSF.Model;
using YZNPOI.HSSF.Record;
using YZNPOI.HSSF.Record.Aggregates;
using YZNPOI.HSSF.Record.Chart;
using YZNPOI.POIFS.FileSystem;
using YZNPOI.SS.UserModel;
using YZNPOI.SS.Util;
using YZNPOI.SS.Formula;
using YZNPOI.SS.Formula.PTG;
//using YZNPOI.HSSF.Record.Formula;
using System.Data;
using System.Data.SqlClient;

/// <summary>
///YZExcelService 的摘要说明

/// </summary>
public class YZExcelGenerateBase
{
    #region 内部方法

    protected static void MergeCells(HSSFSheet sheetfill, GridDefine grid, GroupCollection groups, int index, int startRow, int count)
    {
        if (groups == null || groups.Count <= index)
            return;

        Group group = groups[index];
        GridCellFill fill = grid.GridCellFills[group.ColumnName];
        if (fill == null || count == 0)
            return;

        int startRowIndex = startRow;
        int rowIndex = startRowIndex;
        string curvalue = Convert.ToString(YZExcelHelper2003.GetCellValue(null, sheetfill.GetRow(startRowIndex).GetCell(fill.ColumnIndex) as HSSFCell));
        for (int i = 0; i < count; i++)
        {
            string value = null;
            rowIndex = startRow + i;

            value = Convert.ToString(YZExcelHelper2003.GetCellValue(null, sheetfill.GetRow(rowIndex).GetCell(fill.ColumnIndex) as HSSFCell));
            if (String.Compare(value, curvalue, true) == 0)
                continue;

            rowIndex--;
            if (rowIndex - startRowIndex >= 1)
            {
                CellRangeAddress range = new CellRangeAddress(startRowIndex, rowIndex, fill.ColumnIndex, fill.ColumnIndex);
                sheetfill.AddMergedRegion(range);
                if (index < groups.Count - 1)
                    MergeCells(sheetfill, grid, groups, index + 1, startRowIndex, rowIndex - startRowIndex + 1);
            }

            startRowIndex = rowIndex + 1;
            curvalue = value;
        }

        if (rowIndex - startRowIndex >= 1)
        {
            CellRangeAddress range = new CellRangeAddress(startRowIndex, rowIndex, fill.ColumnIndex, fill.ColumnIndex);
            sheetfill.AddMergedRegion(range);

            if (index < groups.Count - 1)
                MergeCells(sheetfill, grid, groups, index + 1, startRowIndex, rowIndex - startRowIndex + 1);
        }
    }

    protected static void ShiftRows(HSSFSheet sheet, int startRowIndex, int offset)
    {
        HSSFSheet sheetfill = sheet;
        int firstRowIndex = Math.Min(startRowIndex, startRowIndex + offset);
        int lastRowIndex = Math.Max(startRowIndex, startRowIndex + offset) - 1;
        CellRangeAddressCollection savedRegions = new CellRangeAddressCollection();

        for (int i = 0; i < sheet.NumMergedRegions; i++)
        {
            CellRangeAddress region = sheet.GetMergedRegion(i);

            if (region.FirstRow >= firstRowIndex && region.LastRow <= lastRowIndex)
            {
                sheet.RemoveMergedRegion(i);
                i--;
                continue;
            }

            if ((region.FirstRow < firstRowIndex && region.LastRow >= firstRowIndex) ||
                (region.LastRow > lastRowIndex && region.FirstRow <= lastRowIndex))
            {
                savedRegions.Add(region);
                sheet.RemoveMergedRegion(i);
                i--;
                continue;
            }
        }

        if (sheet.LastRowNum >= startRowIndex)
            sheet.ShiftRows(startRowIndex, sheet.LastRowNum, offset, true, true);

        foreach (CellRangeAddress region in savedRegions)
        {
            region.LastRow += offset;
            sheet.AddMergedRegion(region);
        }
    }

    protected static void CopyRow(int blockRowCount, int tagRowBlockIndex, HSSFRow srcRow, HSSFRow tagRow)
    {
        tagRow.Height = srcRow.Height;
        //tagRow.RowStyle = srcRow.RowStyle;

        for (int i = 0; i < srcRow.LastCellNum; i++)
        {
            // Grab a copy of the old/new cell
            HSSFCell srcCell = (HSSFCell)srcRow.GetCell(i);
            HSSFCell tagCell = (HSSFCell)tagRow.CreateCell(i);

            // If the old cell is null jump to next cell
            if (srcCell == null)
                continue;

            // Copy style from old cell and apply to new cell
            tagCell.CellStyle = srcCell.CellStyle;

            // If there is a cell comment, copy
            if (tagCell.CellComment != null) tagCell.CellComment = srcCell.CellComment;

            // If there is a cell hyperlink, copy
            if (srcCell.Hyperlink != null) tagCell.Hyperlink = srcCell.Hyperlink;

            // Set the cell data type
            tagCell.SetCellType(srcCell.CellType);

            // Set the cell data value
            switch (srcCell.CellType)
            {
                case CellType.BLANK:
                    tagCell.SetCellValue(srcCell.StringCellValue);
                    break;
                case CellType.BOOLEAN:
                    tagCell.SetCellValue(srcCell.BooleanCellValue);
                    break;
                case CellType.ERROR:
                    tagCell.SetCellErrorValue(srcCell.ErrorCellValue);
                    break;
                case CellType.FORMULA:
                    int sheetIndex = srcRow.Sheet.Workbook.GetSheetIndex(srcRow.Sheet);
                    Ptg[] ptgs = HSSFFormulaParser.Parse(srcCell.CellFormula, srcRow.Sheet.Workbook as HSSFWorkbook, FormulaType.CELL, sheetIndex);
                    foreach (Ptg ptg in ptgs)
                    {
                        if (ptg is RefPtgBase)
                        {
                            RefPtgBase refptg = ptg as RefPtgBase;
                            if (refptg.Row >= srcRow.RowNum - tagRowBlockIndex && refptg.Row <= srcRow.RowNum - tagRowBlockIndex + blockRowCount)
                                refptg.Row += tagRow.RowNum - srcRow.RowNum;
                        }
                        else if (ptg is AreaPtgBase)
                        {
                            AreaPtgBase aptg = ptg as AreaPtgBase;
                            if (aptg.FirstRow >= srcRow.RowNum - tagRowBlockIndex && aptg.FirstRow <= srcRow.RowNum - tagRowBlockIndex + blockRowCount)
                            {
                                aptg.FirstRow += tagRow.RowNum - srcRow.RowNum;
                                aptg.LastRow += tagRow.RowNum - srcRow.RowNum;
                            }
                        }
                    }
                    tagCell.CellFormula = HSSFFormulaParser.ToFormulaString(srcRow.Sheet.Workbook as HSSFWorkbook, ptgs);
                    break;
                case CellType.NUMERIC:
                    tagCell.SetCellValue(srcCell.NumericCellValue);
                    break;
                case CellType.STRING:
                    tagCell.SetCellValue(srcCell.RichStringCellValue);
                    break;
                case CellType.Unknown:
                    tagCell.SetCellValue(srcCell.StringCellValue);
                    break;
            }
        }
    }

    protected static void SetCellValueDate(HSSFCell cell, DateTime date, string emptyText)
    {
        if (date == DateTime.MinValue)
            cell.SetCellValue(emptyText);
        else
            cell.SetCellValue(date);
    }

    #endregion

    #region 内部类

    public class GridCellFill
    {
        public int RowOffset;
        public int ColumnIndex;
        public string CellVarName;
        public string FillColumnName;
        public string RenderFunction;
        public string EmptyText;
    }

    public class GridCellFillCollection : List<GridCellFill>
    {
        public GridCellFill this[string columnName]
        {
            get
            {
                foreach (GridCellFill fill in this)
                {
                    if (String.Compare(fill.FillColumnName, columnName, true) == 0)
                        return fill;
                }

                return null;
            }
        }
    }

    public class RowCollection : List<HSSFRow>
    {
    }

    public class CellRangeAddressCollection : List<CellRangeAddress>
    {
    }

    public class PtgCollection : List<Ptg>
    {
        public bool InRange(HSSFSheet ptgsheet, HSSFSheet testSheet, int startRowIndex, int endRowIndex)
        {
            foreach (Ptg ptg in this)
            {
                HSSFSheet sheet = PtgCollection.GetPtgSheet(ptgsheet, ptg);
                if (sheet != testSheet)
                    return false;

                if (ptg is RefPtgBase)
                {
                    RefPtgBase refPtg = ptg as RefPtgBase;

                    if (refPtg.Row < startRowIndex || refPtg.Row > endRowIndex)
                        return false;
                }

                if (ptg is AreaPtgBase)
                {
                    AreaPtgBase areaPtg = ptg as AreaPtgBase;

                    if (areaPtg.FirstRow < startRowIndex || areaPtg.LastRow > endRowIndex)
                        return false;
                }
            }

            return true;
        }

        public static HSSFSheet GetPtgSheet(HSSFSheet sheet,Ptg ptg)
        {
            if (ptg is RefPtg)
            {
                return sheet;
            }
            if (ptg is Ref3DPtg)
            {
                Ref3DPtg ptg3 = (Ref3DPtg)ptg;
                int idx = sheet.book.GetSheetIndexFromExternSheetIndex(ptg3.ExternSheetIndex);
                if (idx == -1)
                    return null;

                return sheet.Workbook.GetSheetAt(idx) as HSSFSheet;
            }
            if (ptg is Area2DPtgBase)
            {
                return sheet;
            }
            if (ptg is Area3DPtg)
            {
                Area3DPtg aptg = (Area3DPtg)ptg;
                int idx = sheet.book.GetSheetIndexFromExternSheetIndex(aptg.ExternSheetIndex);
                if (idx == -1)
                    return null;

                return sheet.Workbook.GetSheetAt(idx) as HSSFSheet;
            }
            return null;
        }
    }

    public class GridBlockTemplate
    {
        public string Name;
        public int StartRow;
        public string Condition;
        private RowCollection _rows;
        private CellRangeAddressCollection _mergedRegions;
        private SeriesTemplateCollection _seriesTemplates;
        public GridDefine Grid;

        public GridBlockTemplate(GridDefine grid)
        {
            this.Grid = grid;
        }
        
        public RowCollection Rows
        {
            get
            {
                if (this._rows == null)
                    this._rows = new RowCollection();

                return this._rows;
            }
            set
            {
                this._rows = value;
            }
        }

        public CellRangeAddressCollection MergedRegions
        {
            get
            {
                if (this._mergedRegions == null)
                    this._mergedRegions = new CellRangeAddressCollection();

                return this._mergedRegions;
            }
            set
            {
                this._mergedRegions = value;
            }
        }

        public SeriesTemplateCollection SeriesTemplates
        {
            get
            {
                if (this._seriesTemplates == null)
                    this._seriesTemplates = new SeriesTemplateCollection();

                return this._seriesTemplates;
            }
            set
            {
                this._seriesTemplates = value;
            }
        }

        public bool Contains(HSSFSheet seriesSheet,HSSFChart.HSSFSeries series)
        {
            LinkedDataRecordCollection linkedDataRecords = new LinkedDataRecordCollection();
            linkedDataRecords.Add(series.GetDataValues());

            if (!linkedDataRecords.InRange(seriesSheet, this.Grid.Sheet, this.StartRow, this.StartRow + this.Grid.BlockRowCount - 1))
                return false;

            return true;
        }
    }

    public class GridBlockTemplateCollection : List<GridBlockTemplate>
    {
        public GridBlockTemplate GetTemplate(DataTable table, int rowIndex)
        {
            foreach (GridBlockTemplate template in this)
            {
                //如设置了过滤条件,则过滤出所需数据
                if (String.IsNullOrEmpty(template.Condition))
                    return template;

                DataView view = new DataView(table);
                view.RowFilter = template.Condition.Replace("$totalRow", table.Rows.Count.ToString());
                DataTable rvTable = view.ToTable();
                if (rvTable.Rows.Count == 1)
                    return template;
            }

            if (this.Count != 0)
                return this[this.Count - 1];
            else
                return null;
        }
    }

    public class Group
    {
        public string ColumnName;
    }

    public class GroupCollection : List<Group>
    {
    }

    public class LinkedDataRecordCollection : List<LinkedDataRecord>
    {
        public void Offset(int offset)
        {
            foreach (LinkedDataRecord link in this)
            {
                Ptg[] ptgs = link.FormulaOfLink;
                foreach (Ptg ptg in ptgs)
                {
                    if (ptg is RefPtgBase)
                    {
                        RefPtgBase refPtg = ptg as RefPtgBase;

                        refPtg.Row += offset;
                        link.FormulaOfLink = ptgs;
                    }

                    if (ptg is AreaPtgBase)
                    {
                        AreaPtgBase areaPtg = ptg as AreaPtgBase;

                        areaPtg.FirstRow += offset;
                        areaPtg.LastRow += offset;
                        link.FormulaOfLink = ptgs;
                    }
                }
            }
        }

        public bool InRange(HSSFSheet ptgsheet,HSSFSheet testSheet,int startRowIndex, int endRowIndex)
        {
            PtgCollection ptgs = new PtgCollection();
            foreach (LinkedDataRecord link in this)
                ptgs.AddRange(link.FormulaOfLink);

            return ptgs.InRange(ptgsheet, testSheet, startRowIndex, endRowIndex);
        }
    }

    public class SeriesTemplate
    {
        public HSSFChart Chart;
        public HSSFChart.HSSFSeries Series;

        public HSSFChart.HSSFSeries CloneSeries(HSSFSheet  sheet, int offset)
        {
            LinkedDataRecordCollection linkedDataRecords = new LinkedDataRecordCollection();
            HSSFChart.HSSFSeries series = this.Chart.CreateSeries();
            series.GetDataName().FormulaOfLink = (Ptg[])this.Series.GetDataName().FormulaOfLink.Clone();
            series.GetDataValues().FormulaOfLink = (Ptg[])this.Series.GetDataValues().FormulaOfLink.Clone();
            linkedDataRecords.Add(series.GetDataName());
            linkedDataRecords.Add(series.GetDataValues());
            linkedDataRecords.Offset(offset);
            return series;
        }
    }

    public class SeriesTemplateCollection : List<SeriesTemplate>
    {
    }

    public class GridDefine : IComparable
    {
        public HSSFSheet Sheet;
        public string SheetName;
        public int StartRow;
        public int BlockRowCount;
        public string FillTableName;
        public int MinRows;
        private GridCellFillCollection _gridCellFills;
        private GridBlockTemplateCollection _gridBlockTemplates;
        private GroupCollection _groups;

        public GridCellFillCollection GridCellFills
        {
            get
            {
                if (this._gridCellFills == null)
                    this._gridCellFills = new GridCellFillCollection();

                return this._gridCellFills;
            }
            set
            {
                this._gridCellFills = value;
            }
        }

        public GridBlockTemplateCollection GridBlockTemplates
        {
            get
            {
                if (this._gridBlockTemplates == null)
                    this._gridBlockTemplates = new GridBlockTemplateCollection();

                return this._gridBlockTemplates;
            }
            set
            {
                this._gridBlockTemplates = value;
            }
        }

        public GroupCollection Groups
        {
            get
            {
                if (this._groups == null)
                    this._groups = new GroupCollection();

                return this._groups;
            }
            set
            {
                this._groups = value;
            }
        }

        public int TemplateEndRow
        {
            get
            {
                int rv = this.StartRow;
                foreach (GridBlockTemplate template in this.GridBlockTemplates)
                {
                    rv = Math.Max(rv, template.StartRow);
                }

                return rv + this.BlockRowCount - 1;
            }
        }

        #region IComparable 成员

        public int CompareTo(object obj)
        {
            GridDefine grid2 = obj as GridDefine;
            if (grid2 == null)
                return Int32.MinValue;

            return grid2.StartRow - this.StartRow;
        }

        #endregion
    }

    public class GridDefineCollection : List<GridDefine>
    {
    }

    public class ColumnDefine
    {
        public string Text;
        public string ColumnName;
        public int Width;
        public HorizontalAlignment Align;
        public HSSFCellStyle Style;
    }

    public class ColumnDefineCollection : List<ColumnDefine>
    {
    }

    #endregion
}