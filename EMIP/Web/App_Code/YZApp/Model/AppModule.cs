namespace YZAppAdmin
{
    /// <summary>
    /// AppModule首页应用
    /// </summary>

    public class AppModule
    {
        public int Id { get; set; }//应用ID
        public string AppName { get; set; }//应用名称
        public string Icon { get; set; }//应用图标
        public string IconColor { get; set; }//图标颜色
        public string IconSize { get; set; }//图标大小
        public string AppUrl { get; set; }//应用路径
        public string Enable { get; set; }//是否启用
        public string Sort { get; set; }//排序
        public string Type { get; set; }//类别
        public string ViewType { get; set; }//应用类别
        public string BADGE { get; set; }//角标
        public string Json { get; set; }
    }
}