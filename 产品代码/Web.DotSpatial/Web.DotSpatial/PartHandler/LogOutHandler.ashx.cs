using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace GAIA.Web.Emer.PartHandler
{
    /// <summary>
    /// LogOutHandler 的摘要说明
    /// </summary>
    public class LogOutHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                NHExt.Runtime.Proxy.AgentInvoker invoker = new NHExt.Runtime.Proxy.AgentInvoker();
                invoker.AssemblyName = "IWEHAVE.ERP.Auth.ServiceBP.Agent.LogOutBPProxy";
                invoker.DllName = "IWEHAVE.ERP.Auth.ServiceBP.Agent.dll";
                invoker.SourcePage = "GAIA.Auth.Portal.Default";
                bool obj = invoker.Do<bool>();
            }
            catch (Exception)
            {

            }
            finally
            {
                string logOutUrl = ConfigurationManager.AppSettings["LogOutUrl"];
                if (!string.IsNullOrEmpty(logOutUrl))
                {
                    context.Response.Redirect(logOutUrl);
                }
                else
                {
                    context.Response.Redirect("/Login.aspx");
                }
            }
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