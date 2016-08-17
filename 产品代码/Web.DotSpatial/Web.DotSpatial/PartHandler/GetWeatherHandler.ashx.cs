using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;
using System.Text;

namespace GAIA.Web.Emer.PartHandler
{
    /// <summary>
    /// GetWeatherHandler 的摘要说明
    /// </summary>
    public class GetWeatherHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("City", string.Empty);
            dic.Add("Weather", string.Empty);
            dic.Add("Icon", string.Empty);
            dic.Add("Temperture", string.Empty);
            string result = string.Empty;
            string city = context.Request.Form["City"];
            if (!string.IsNullOrEmpty(city))
            {
                string url = "http://www.webxml.com.cn/WebServices/WeatherWebService.asmx";
                try
                {
                    string[] arguments = new string[1];
                    arguments[0] = city;
                    object resW = NHExt.Runtime.Web.WebServiceInvoker.Invoke(url, "getWeatherbyCityName", arguments);
                    string[] objArray = (string[])resW;
                    /*
                     返回数据： 一个一维数组 String(22)，共有23个元素。
                        String(0) 到 String(4)：省份，城市，城市代码，城市图片名称，最后更新时间。
                     *  String(5) 到 String(11)：当天的 气温，概况，风向和风力，天气趋势开始图片名称(以下称：图标一) ,天气趋势结束图片名称(以下称：图标二)，现在的天气实况，天气和生活指数。
                     *  String(12) 到 String(16)：第二天的 气温，概况，风向和风力，图标一，图标二。
                     *  String(17) 到 String(21):第三天的 气温，概况，风向和风力，图标一，图标二。
                     *  String(22) 被查询的城市或地区的介绍 
                     */
                    if (objArray != null)
                    {
                        dic["City"] = objArray[1];
                        dic["Weather"] = objArray[6];
                        dic["Icon"] = objArray[8];
                        dic["Temperture"] = objArray[5];
                        if (string.IsNullOrEmpty(dic["City"]))
                        {
                            url = "http://php.weather.sina.com.cn/search.php?city=" + city;
                            string[] weathers = GetWeather(url);
                            dic["City"] = city;
                            dic["Weather"] = weathers[0];
                            dic["Icon"] = null;
                            dic["Temperture"] = weathers[1];
                        }
                    }
                }
                catch (Exception ex)
                {
                    url = "http://php.weather.sina.com.cn/search.php?city=" + city;
                    string[] weathers = GetWeather(url);
                    dic["City"] = city;
                    dic["Weather"] = weathers[0];
                    dic["Icon"] = null;
                    dic["Temperture"] = weathers[1];
                }
            }
            result = NHExt.WebUtil.JsonHelper.ObjectToJSON(dic);
            context.Response.ContentType = "text/plain";
            context.Response.Write(result);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        public string[] GetWeather(string url)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream stream = response.GetResponseStream();
            string html = new StreamReader(stream, Encoding.GetEncoding("gb2312")).ReadToEnd();
            int start = html.IndexOf("<h5>今天白天</h5>");
            int end = html.LastIndexOf("<ul class=\"m_right\">");
            html = html.Substring(start, end - start);
            int startindex = html.IndexOf("'") + 1;
            int endindex = html.IndexOf("'", startindex + 1);
            string weather = html.Substring(startindex, endindex - startindex);
            string amTem = html.Substring(html.IndexOf("℃") - 3, 4);
            if (amTem.Substring(0, 1) == ">") amTem = amTem.Substring(1);
            string pmTem = html.Substring(html.LastIndexOf("℃") - 3, 4);
            if (pmTem.Substring(0, 1) == ">") pmTem = pmTem.Substring(1);
            return new string[] { weather, amTem + "/" + pmTem };
        }
    }
}