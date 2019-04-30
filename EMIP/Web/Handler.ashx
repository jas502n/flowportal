<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;

public class Handler : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        com.baidu.ai.baidu.getVat_invoice("123");
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}