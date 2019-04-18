using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace WeChatSync
{
     class HttpWebResponseUtility
    {
        private static readonly string DefaultUserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
        public static HttpWebResponse CreateGetHttpResponse(string url, int? timeout, string userAgent, CookieCollection cookies)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException("url");
            }
            HttpWebRequest httpWebRequest = WebRequest.Create(url) as HttpWebRequest;
            httpWebRequest.Method = "GET";
            httpWebRequest.UserAgent = HttpWebResponseUtility.DefaultUserAgent;
            if (!string.IsNullOrEmpty(userAgent))
            {
                httpWebRequest.UserAgent = userAgent;
            }
            if (timeout.HasValue)
            {
                httpWebRequest.Timeout = timeout.Value;
            }
            if (cookies != null)
            {
                httpWebRequest.CookieContainer = new CookieContainer();
                httpWebRequest.CookieContainer.Add(cookies);
            }
            return httpWebRequest.GetResponse() as HttpWebResponse;
        }
        public static HttpWebResponse CreatePostHttpResponse(string url, IDictionary<string, string> parameters, int? timeout, string userAgent, Encoding requestEncoding, CookieCollection cookies)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException("url");
            }
            if (requestEncoding == null)
            {
                throw new ArgumentNullException("requestEncoding");
            }
            HttpWebRequest httpWebRequest = null;
            if (url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
            {
                ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(HttpWebResponseUtility.CheckValidationResult);
                httpWebRequest = (WebRequest.Create(url) as HttpWebRequest);
                httpWebRequest.ProtocolVersion = HttpVersion.Version10;
            }
            else
            {
                httpWebRequest = (WebRequest.Create(url) as HttpWebRequest);
            }
            httpWebRequest.Method = "POST";
            httpWebRequest.ContentType = "application/x-www-form-urlencoded";
            if (!string.IsNullOrEmpty(userAgent))
            {
                httpWebRequest.UserAgent = userAgent;
            }
            else
            {
                httpWebRequest.UserAgent = HttpWebResponseUtility.DefaultUserAgent;
            }
            if (timeout.HasValue)
            {
                httpWebRequest.Timeout = timeout.Value;
            }
            if (cookies != null)
            {
                httpWebRequest.CookieContainer = new CookieContainer();
                httpWebRequest.CookieContainer.Add(cookies);
            }
            if (parameters != null && parameters.Count != 0)
            {
                StringBuilder stringBuilder = new StringBuilder();
                int num = 0;
                foreach (string current in parameters.Keys)
                {
                    if (num > 0)
                    {
                        stringBuilder.AppendFormat("&{0}={1}", current, parameters[current]);
                    }
                    else
                    {
                        stringBuilder.AppendFormat("{0}={1}", current, parameters[current]);
                    }
                    num++;
                }
                byte[] bytes = requestEncoding.GetBytes(stringBuilder.ToString());
                using (Stream requestStream = httpWebRequest.GetRequestStream())
                {
                    requestStream.Write(bytes, 0, bytes.Length);
                }
            }
            return httpWebRequest.GetResponse() as HttpWebResponse;
        }
        public static HttpWebResponse CreatePostHttpResponse(string url, string parameters, int? timeout, string userAgent, Encoding requestEncoding, CookieCollection cookies)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException("url");
            }
            if (requestEncoding == null)
            {
                throw new ArgumentNullException("requestEncoding");
            }
            HttpWebRequest httpWebRequest = null;
            if (url.StartsWith("https", StringComparison.OrdinalIgnoreCase))
            {
                ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(HttpWebResponseUtility.CheckValidationResult);
                httpWebRequest = (WebRequest.Create(url) as HttpWebRequest);
                httpWebRequest.ProtocolVersion = HttpVersion.Version10;
            }
            else
            {
                httpWebRequest = (WebRequest.Create(url) as HttpWebRequest);
            }
            httpWebRequest.Method = "POST";
            httpWebRequest.ContentType = "application/x-www-form-urlencoded";
            if (!string.IsNullOrEmpty(userAgent))
            {
                httpWebRequest.UserAgent = userAgent;
            }
            else
            {
                httpWebRequest.UserAgent = HttpWebResponseUtility.DefaultUserAgent;
            }
            if (timeout.HasValue)
            {
                httpWebRequest.Timeout = timeout.Value;
            }
            if (cookies != null)
            {
                httpWebRequest.CookieContainer = new CookieContainer();
                httpWebRequest.CookieContainer.Add(cookies);
            }
            if (parameters == null || parameters != "")
            {
                byte[] bytes = requestEncoding.GetBytes(parameters);
                using (Stream requestStream = httpWebRequest.GetRequestStream())
                {
                    requestStream.Write(bytes, 0, bytes.Length);
                }
            }
            return httpWebRequest.GetResponse() as HttpWebResponse;
        }
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            return true;
        }
    }

}
