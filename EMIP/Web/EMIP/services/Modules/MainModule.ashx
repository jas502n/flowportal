<%@ WebHandler Language="C#" Class="YZSoft.Mobile.Modules.MainModule" %>

using System;
using System.Web;
using System.Text;

namespace YZSoft.Mobile.Modules
{
    public class MainModule : YZServiceHandler
    {       
        public object GetModuleTree(HttpContext context)
        { 
            object[] modules = new object[]{
                new {
                    xclass = "YZSoft.social.MainPanel",
                    //xclass = "Ext.Container",
                    config = new {
                        title = "消息",
                        iconCls = "yz-glyph yz-glyph-tab-message"
                    }
                },
                new {
                    xclass = "YZSoft.task.MainPanel",
                    //xclass = "Ext.Container", 
                    config = new {
                        title = "工作",
                        iconCls = "yz-glyph yz-glyph-tab-task",
                        tab = new {
                            flex = 1,
                            cls = "yz-badge-module"
                        }
                    }
                },
                new {
                    xclass = "YZSoft.apps.MainPanel",
                    //xclass = "Ext.Container",
                    config = new {
                        title = "应用",
                        iconCls = "yz-glyph yz-glyph-tab-apps"
                    }
                },
                new {
                    xclass = "YZSoft.personal.MainPanel",
                    //xclass = "Ext.Container", 
                    config = new {
                        title = "我的",
                        iconCls = "yz-glyph yz-glyph-tab-personal"
                    }
                }
            };

            return YZSecurityManager.ApplayPermision(modules);
        }
    }
}