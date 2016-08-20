using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace Web.DotSpatial.Handler
{
    /// <summary>
    /// OpenlayerProxy 的摘要说明
    /// </summary>
    public class OpenlayerProxy : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (string.IsNullOrEmpty(context.Request["URL"])) return;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(context.Request["URL"]);
            request.UserAgent = context.Request.UserAgent;
            request.ContentType = context.Request.ContentType;
            request.Method = context.Request.HttpMethod;

            byte[] trans = new byte[1024];
            int offset = 0;
            int offcnt = 0;

            if (request.Method.ToUpper() == "POST")
            {
                Stream nstream = request.GetRequestStream();
                while (offset < context.Request.ContentLength)
                {
                    offcnt = context.Request.InputStream.Read(trans, offset, 1024);
                    if (offcnt > 0)
                    {
                        nstream.Write(trans, 0, offcnt);
                        offset += offcnt;
                    }
                }
                nstream.Close();
            }
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            //Encoding enc = Encoding.GetEncoding(65001);  
            context.Response.ContentType = response.ContentType;
            StreamReader loResponseStream = new StreamReader(response.GetResponseStream());
            string lcHtml = loResponseStream.ReadToEnd();
            context.Response.Write(lcHtml);
            response.Close();
            loResponseStream.Close();

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}