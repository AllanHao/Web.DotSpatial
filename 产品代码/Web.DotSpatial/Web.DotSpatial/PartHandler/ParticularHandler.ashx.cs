using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GAIA.Web.Emer.PartHandler
{
    /// <summary>
    /// ParticularHandler 的摘要说明
    /// </summary>
    public class ParticularHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add("Result", "True");
            dic.Add("ErrorEx", string.Empty);
            string result = string.Empty;
            if (!string.IsNullOrEmpty(context.Request.Form["LOGIN"]))
            {
                string authCode = System.Configuration.ConfigurationManager.AppSettings["SkipAuthCode"];
                if (authCode != "1") //验证码校验
                {
                    if (string.IsNullOrEmpty(context.Request.Form["VCode"]))
                    {
                        dic["Result"] = "False";
                        dic["ErrorEx"] = "验证码不能为空";
                    }
                    else if (context.Session["rgimg"] == null)
                    {
                        dic["Result"] = "False";
                        dic["ErrorEx"] = "服务器验证码失效，请刷新重试！";
                    }
                    else if (context.Request.Form["VCode"].ToUpper() != context.Session["rgimg"].ToString().ToUpper())
                    {
                        dic["Result"] = "False";
                        dic["ErrorEx"] = "验证码错误";
                    }
                }
                //校验用户名密码
                string userCode = context.Request.Form["UserCode"];
                string userPwd = context.Request.Form["UserPwd"];
                long org = Convert.ToInt64(context.Request.Form["Org"]);
                if (string.IsNullOrEmpty(userCode))
                {
                    dic["Result"] = "False";
                    dic["ErrorEx"] = "用户名为空";
                }
                if (string.IsNullOrEmpty(userPwd))
                {
                    dic["Result"] = "False";
                    dic["ErrorEx"] = "密码为空";
                }
                if (org <= 0)
                {
                    dic["Result"] = "False";
                    dic["ErrorEx"] = "没有选择组织";
                }
                if (dic["Result"] == "True")
                {
                    try
                    {
                        NHExt.Runtime.Proxy.AgentInvoker invoker = new NHExt.Runtime.Proxy.AgentInvoker();
                        invoker.AssemblyName = "IWEHAVE.ERP.Auth.ServiceBP.Agent.LoginBPProxy";
                        invoker.DllName = "IWEHAVE.ERP.Auth.ServiceBP.Agent.dll";
                        invoker.AppendField(new NHExt.Runtime.Proxy.PropertyField() { FieldName = "UserCode", FieldValue = userCode });
                        invoker.AppendField(new NHExt.Runtime.Proxy.PropertyField() { FieldName = "UserPwd", FieldValue = userPwd });
                        invoker.AppendField(new NHExt.Runtime.Proxy.PropertyField() { FieldName = "OrgID", FieldValue = org });
                        invoker.SourcePage = "IWEHAVE.Login";
                        Object obj = invoker.Do();
                        if (obj != null)
                        {
                            dic["Result"] = "True";
                        }
                        else
                        {
                            dic["Result"] = "False";
                            dic["ErrorEx"] = "用户名或密码错误";
                        }
                    }
                    catch (Exception)
                    {

                        dic["Result"] = "False";
                        dic["ErrorEx"] = "用户名或密码错误";
                    }
                    finally
                    {
                        context.Session["rgimg"] = null;
                    }

                }
            }
            else
            {
                dic["Result"] = "False";
                dic["ErrorEx"] = "没有请求数据";
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
    }
}