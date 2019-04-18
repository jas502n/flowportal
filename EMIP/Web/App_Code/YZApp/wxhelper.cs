using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace WeChatSync
{
    public static class wxhelper
    {

        /// <summary>
        /// 写入日志
        /// </summary>
        /// <param name="log">请求的参数</param>
        public static void WriteLog(string wjlj,string log)
        {
            string LogFolder = wjlj;
            string wjm = DateTime.Now.ToLongDateString();
            string lj = LogFolder + "\\" + wjm + ".txt";
            if (File.Exists(lj))
            {
                StreamWriter sw = File.AppendText(lj);
                sw.Write(log);
                sw.Close();
            }
            else
            {
                FileStream fs = new FileStream(lj, FileMode.OpenOrCreate, FileAccess.Write);
                StreamWriter sw = new StreamWriter(fs);
                sw.BaseStream.Seek(0, SeekOrigin.End);
                sw.Write(log);
                sw.Flush();
                sw.Close();
                fs.Close();
            }
        }

        /// <summary>
        /// 获取Access_Token
        /// </summary>
        /// <returns></returns>
        public static string Get_Access_Token(string Corpid,string Corpsecret)
        {
            string access_token = "";
            try
            {
                string loginUrl = string.Format("https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={0}&corpsecret={1}", Corpid, Corpsecret);
                HttpWebRequest request = WebRequest.Create(loginUrl) as HttpWebRequest;
                request.Method = "GET";
                HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                Stream resStream = response.GetResponseStream();
                StreamReader sr = new StreamReader(resStream, Encoding.UTF8);
                string htmlCode = sr.ReadToEnd();
                Hashtable r = (Hashtable)JSON.Decode(htmlCode);
                access_token = r["access_token"].ToString();
            }
            catch (Exception)
            {
                
            }
            return access_token;
        }
        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="access_token"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public static Hashtable HttpUploadFile(string access_token, string path)
        {
            HttpWebRequest httpWebRequest = WebRequest.Create("https://qyapi.weixin.qq.com/cgi-bin/media/upload?type=file&access_token=" + access_token) as HttpWebRequest;
            CookieContainer cookieContainer = new CookieContainer();
            httpWebRequest.CookieContainer = cookieContainer;
            httpWebRequest.AllowAutoRedirect = true;
            httpWebRequest.Method = "POST";
            string str = DateTime.Now.Ticks.ToString("X");
            httpWebRequest.ContentType = "multipart/form-data;charset=utf-8;boundary=" + str;
            byte[] bytes = Encoding.UTF8.GetBytes("\r\n--" + str + "\r\n");
            byte[] bytes2 = Encoding.UTF8.GetBytes("\r\n--" + str + "--\r\n");
            int num = path.LastIndexOf("\\");
            string arg = path.Substring(num + 1);
            StringBuilder stringBuilder = new StringBuilder(string.Format("Content-Disposition:form-data;name=\"file\";filename=\"{0}\"\r\nContent-Type:application/octet-stream\r\n\r\n", arg));
            byte[] bytes3 = Encoding.UTF8.GetBytes(stringBuilder.ToString());
            FileStream fileStream = new FileStream(path, FileMode.Open, FileAccess.Read);
            byte[] array = new byte[fileStream.Length];
            fileStream.Read(array, 0, array.Length);
            fileStream.Close();
            Stream requestStream = httpWebRequest.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Write(bytes3, 0, bytes3.Length);
            requestStream.Write(array, 0, array.Length);
            requestStream.Write(bytes2, 0, bytes2.Length);
            requestStream.Close();
            HttpWebResponse httpWebResponse = httpWebRequest.GetResponse() as HttpWebResponse;
            Stream responseStream = httpWebResponse.GetResponseStream();
            StreamReader streamReader = new StreamReader(responseStream, Encoding.UTF8);
            string json = streamReader.ReadToEnd();
            return (Hashtable)JSON.Decode(json);
        }
        /// <summary>
        /// 覆盖部门
        /// </summary>
        /// <param name="media_id"></param>
        /// <param name="access_token"></param>
        /// <returns></returns>
        public static Hashtable FullConvertDept(string media_id, string access_token)
        {
            Hashtable hashtable = new Hashtable();
            hashtable["media_id"] = media_id;
            string parameters = JSON.Encode(hashtable);
            string url = "https://qyapi.weixin.qq.com/cgi-bin/batch/replaceparty?access_token=" + access_token;
            HttpWebResponse httpWebResponse = HttpWebResponseUtility.CreatePostHttpResponse(url, parameters, null, null, Encoding.UTF8, null);
            Stream responseStream = httpWebResponse.GetResponseStream();
            StreamReader streamReader = new StreamReader(responseStream, Encoding.Default);
            string json = streamReader.ReadToEnd();
            return (Hashtable)JSON.Decode(json);
        }
        /// <summary>
        /// 覆盖人员
        /// </summary>
        /// <param name="media_id"></param>
        /// <param name="access_token"></param>
        /// <returns></returns>
        public static Hashtable FullConvertMember(string media_id, string access_token)
        {
            Hashtable hashtable = new Hashtable();
            hashtable["media_id"] = media_id;
            string parameters = JSON.Encode(hashtable);
            string url = "https://qyapi.weixin.qq.com/cgi-bin/batch/replaceuser?access_token=" + access_token;
            HttpWebResponse httpWebResponse = HttpWebResponseUtility.CreatePostHttpResponse(url, parameters, null, null, Encoding.UTF8, null);
            Stream responseStream = httpWebResponse.GetResponseStream();
            StreamReader streamReader = new StreamReader(responseStream, Encoding.Default);
            string json = streamReader.ReadToEnd();
            return (Hashtable)JSON.Decode(json);
        }
        /// <summary>
        /// 增量人员
        /// </summary>
        /// <param name="media_id"></param>
        /// <param name="access_token"></param>
        /// <returns></returns>
        public static Hashtable UpdateConvertMember(string media_id, string access_token)
        {
            Hashtable hashtable = new Hashtable();
            hashtable["media_id"] = media_id;
            string parameters = JSON.Encode(hashtable);
            string url = "https://qyapi.weixin.qq.com/cgi-bin/batch/syncuser?access_token=" + access_token;
            HttpWebResponse httpWebResponse = HttpWebResponseUtility.CreatePostHttpResponse(url, parameters, null, null, Encoding.UTF8, null);
            Stream responseStream = httpWebResponse.GetResponseStream();
            StreamReader streamReader = new StreamReader(responseStream, Encoding.Default);
            string json = streamReader.ReadToEnd();
            return (Hashtable)JSON.Decode(json);
        }




        /// <summary>
        /// 获取异步结果
        /// </summary>
        /// <param name="media_id"></param>
        /// <param name="access_token"></param>
        /// <returns></returns>
        public static string Getresult(string jobid, string access_token)
        {
         
            string url = "https://qyapi.weixin.qq.com/cgi-bin/batch/getresult?access_token=" + access_token+"&jobid="+ jobid;
            HttpWebResponse httpWebResponse = HttpWebResponseUtility.CreateGetHttpResponse(url,1000000,"",null);
            Stream responseStream = httpWebResponse.GetResponseStream();
            StreamReader streamReader = new StreamReader(responseStream, Encoding.Default);
            string json = streamReader.ReadToEnd();
            return json;
        }

    }
}
