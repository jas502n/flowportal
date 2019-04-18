using System;
using System.Web;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using System.Web.Security;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Attachment
{
    public partial class UploadHandler : UploadServiceBase
    {
        public virtual object SaveAttachment(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            //华为手机，fileExt格式 .png?112714368714
            if (!String.IsNullOrEmpty(fileExt))
            {
                int index = fileExt.IndexOf('?');
                if (index != -1)
                    fileExt = fileExt.Substring(0, index);
            }

            AttachmentInfo attachment = new AttachmentInfo();
            attachment.Name = fileName;
            attachment.Ext = fileExt;

            attachment = AttachmentManager.SaveAsAttachment(file, attachment);

            return new
            {
                success = true,
                fileid = attachment.FileID,
                attachment = attachment
            };
        }

        public virtual object SaveAudio(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            int duration = request.GetInt32("duration");

            AttachmentInfo attachment = new AttachmentInfo();
            attachment.Name = fileName;
            attachment.Ext = fileExt;
            attachment.LParam1 = duration;

            attachment = AttachmentManager.SaveAsAttachment(file, attachment);

            return new
            {
                success = true,
                fileid = attachment.FileID
            };
        }

        public virtual object OSFileSystemUpload(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
                string root = request.GetString("root");
                string path = request.GetString("path");
                string rootPath = context.Server.MapPath(YZSoft.FileSystem.OSDirectoryManager.GetRootPath(root));
                string filePath = Path.Combine(rootPath, path, fileName);

            file.SaveAs(filePath);
            FileInfo fileinfo = new FileInfo(filePath);

            return new
            {
                success = true,
                LastUpdate = fileinfo.LastWriteTime
            };
        }

        public virtual object SaveHeadshot(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("temporaryUid", request.GetString("account", ""));
            string userPath = this.GetUserPath(context, account);
            string fileId = "Headshot" + fileExt;
            string saveFile = Path.Combine(userPath, "Headshot", fileId);
            string savePath = Path.GetDirectoryName(saveFile);

            this.EmptyFolder(savePath);
            Directory.CreateDirectory(savePath);

            file.SaveAs(saveFile);
            //this.MakeThumbnail(saveFile, new Mode("S", 33, 45, ScaleMode.Fit));
            this.MakeThumbnail(saveFile, new Mode("S", ScaleMode.Fit, 44, 60, System.Drawing.Imaging.ImageFormat.Png));
            this.MakeThumbnail(saveFile, new Mode("M", ScaleMode.Fit, 110, 150, System.Drawing.Imaging.ImageFormat.Png));

            return new
            {
                success = true,
                fileid = account
            };
        }

        public virtual object SaveSignImage(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("temporaryUid", request.GetString("account", ""));
            string userPath = this.GetUserPath(context, account);
            string fileId = "Sign" + fileExt;
            string saveFile = Path.Combine(userPath, "Sign", fileId);
            string savePath = Path.GetDirectoryName(saveFile);

            this.EmptyFolder(savePath);
            Directory.CreateDirectory(savePath);

            file.SaveAs(saveFile);
            this.MakeThumbnail(saveFile, new Mode("S", ScaleMode.Fit, 80, 30, System.Drawing.Imaging.ImageFormat.Png));
            this.MakeThumbnail(saveFile, new Mode("M", ScaleMode.Fit, 160, 60, System.Drawing.Imaging.ImageFormat.Png));

            return new
            {
                success = true,
                fileid = account
            };
        }

        public virtual JObject XSD2DataSetSchema(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            DataSet dataSet = new DataSet();

            if (String.Compare(fileExt, ".xml", true) == 0)
                dataSet.ReadXml(file.InputStream, XmlReadMode.Auto);
            else
                dataSet.ReadXmlSchema(file.InputStream);

            FlowDataSet flowDataSet = new FlowDataSet();
            flowDataSet.LoadDefine(dataSet);

            return YZJsonHelper.SerializeSchema(flowDataSet);
        }

        public virtual BPMProcess LoadFloFile(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);

            BPMProcess process = new BPMProcess();
            file.InputStream.Seek(0, SeekOrigin.Begin);
            process.Load(file.InputStream);

            return process;
        }

        public virtual object LoadBPAFile(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            JObject jProcess;

            using (System.IO.StreamReader rd = new System.IO.StreamReader(file.InputStream))
                jProcess = JObject.Parse(rd.ReadToEnd());

            return new {
                processDefine = jProcess,
                fileName = Path.GetFileNameWithoutExtension(fileName),
                ext = fileExt
            };
        }

        public virtual object Excel2DataSet(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            int titleRowIndex = request.GetInt32("titleRowIndex", 1);
            int dataRowIndex = request.GetInt32("dataRowIndex", 2);

            DataSet dataset = YZExcelLoader.LoadExcel(file.InputStream, fileName, titleRowIndex-1, dataRowIndex-1,true);
            string id = YZTempStorageManager.CurrentStore.Save(new
            {
                data = dataset,
                schema = YZJsonHelper.GetColumnCaptionInfo(dataset)
            });

            return new
            {
                id = id
            };
        }

        public virtual object SaveExcel(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("temporaryUid", request.GetString("account", ""));
            string userPath = this.GetUserPath(context, account);
            string fileId = fileName;
            string saveFile = Path.Combine(userPath, "ExcelSource", fileId);
            string savePath = Path.GetDirectoryName(saveFile);

            this.EmptyFolder(saveFile);
            Directory.CreateDirectory(savePath);

            file.SaveAs(saveFile);

            return new
            {
                success = true,
                filePath = saveFile,
                fileid = account
            };
        }

        public virtual object SaveNotesSpeak(HttpContext context, HttpPostedFile file, string fileName, long fileSize, string fileExt)
        {
            YZRequest request = new YZRequest(context);
            int duration = request.GetInt32("duration");

            AttachmentInfo attachment = new AttachmentInfo();
            attachment.Name = fileName;
            attachment.Ext = fileExt;

            attachment = AttachmentManager.SaveAsAttachment(file, attachment);

            YZSoft.Apps.Speak speak = new Apps.Speak();
            speak.Account = YZAuthHelper.LoginUserAccount;
            speak.FileID = attachment.FileID;
            speak.Duration = duration;
            speak.Comments = Resources.YZStrings.Aspx_NewRecordPerfix + attachment.FileID;
            speak.CreateAt = DateTime.Now;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    YZSoft.Apps.SpeakManager.Insert(provider, cn, speak);
                }
            }

            return new
            {
                success = true,
                fileid = attachment.FileID,
                speak = speak
            };
        }
    }
}
