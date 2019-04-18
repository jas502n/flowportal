using System.Collections.Generic;

namespace YZAppAdmin
{
    /// <summary>
    /// AppModule首页应用
    /// </summary>

    public class AppItem
    {
        /// <summary>
        /// 应用名称
        /// </summary>
        public string AppName { get; set; }
        /// <summary>
        /// 图标名称
        /// </summary>
        public string Icon { get; set; }
        /// <summary>
        /// 图标颜色
        /// </summary>
        public string IconColor { get; set; }
        /// <summary>
        /// 图标大小
        /// </summary>
        public string IconSize { get; set; }
        /// <summary>
        /// 应用路径
        /// </summary>
        public string AppUrl { get; set; }
        /// <summary>
        /// 应用类别
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 角标
        /// </summary>
        public int Badge { get; set; }

        /// <summary>
        /// 其他
        /// </summary>
        public string Json { get; set; }
    }

    public class ApplistItem
    {
        /// <summary>
        /// 组名
        /// </summary>
        public string GroupName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<AppItem> App { get; set; }
    }

}