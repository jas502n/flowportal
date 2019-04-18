using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Mobile.Form
{
    partial class FormHandler
    {
        private void Form_我的流程1(Model model, JObject form, JArray formitems, BPMTask task, BPMProcStep step, FlowDataSet formdataset, CommentItemCollection comments)
        {
            JObject fieldset;
            JArray items;
            JObject field;
            int index;

            //在头部加入一行
            fieldset = this.TryGetFieldSet(form, "Header");
            items = fieldset["items"] as JArray;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = "AAA";
            field["html"] = "AAAValue";

            //在表Purchase中加入一行
            fieldset = this.TryGetFieldSet(form, "Purchase");
            items = fieldset["items"] as JArray;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = "BBB";
            field["html"] = "BBBValue";

            //在表Purchase前加入一个fieldset
            fieldset = this.TryGetFieldSet(form, "Purchase");
            index = formitems.IndexOf(fieldset);

            fieldset = new JObject();
            formitems.Insert(index, fieldset);
            fieldset["xtype"] = "fieldset";

            items = new JArray();
            fieldset["items"] = items;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = "CCC";
            field["html"] = "CCCValue";

            //在末尾加入一行
            fieldset = new JObject();
            formitems.Add(fieldset);
            fieldset["xtype"] = "fieldset";

            items = new JArray();
            fieldset["items"] = items;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = "DDD";
            field["html"] = "DDDValue";

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = "EEE";
            field["html"] = "EEEValue";
        }
    }
}
