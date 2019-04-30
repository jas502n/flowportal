﻿using System;
using System.Collections.Generic;

using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Web;

namespace com.baidu.ai
{
    public static class baidu
    {



        private static String clientId = "2AtnkoIltwSIHcu6tw7AUGc8";
        private static String clientSecret = "hv2uwt2yO5FQERnUZ1wOGLisy1WNH79U";

        public static String getAccessToken()
        {
          
            WebClient webClient = new WebClient();
            webClient.Encoding = Encoding.UTF8;
            webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
            webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");

            YZUrlBuilder uri = new YZUrlBuilder("https://aip.baidubce.com/oauth/2.0/token");
            uri.QueryString["grant_type"] = "client_credentials";
            uri.QueryString["client_id"] = clientId;
            uri.QueryString["client_secret"] = clientSecret;
            DateTime now = DateTime.Now;
            byte[] dataResult = webClient.DownloadData(uri.ToString());
            string strResult = Encoding.UTF8.GetString(dataResult);
            string access_token= Convert.ToString(JObject.Parse(strResult)["access_token"]);
            return access_token;
        }

        public static string  getVat_invoice(string basestr)
        {
            string access_token = getAccessToken();
            WebClient webClient = new WebClient();
            webClient.Encoding = Encoding.UTF8;
            webClient.Headers.Add(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded");

            YZUrlBuilder uri = new YZUrlBuilder("https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice");
            uri.QueryString["access_token"] = access_token;
            string param = "image=" + basestr;
            byte[] bytes = Encoding.UTF8.GetBytes(param);
   
            byte[] dataResult = webClient.UploadData(uri.ToString(), "POST", bytes);
            string strResult = Encoding.UTF8.GetString(dataResult);


            return strResult;


       
           
        }
    }
}