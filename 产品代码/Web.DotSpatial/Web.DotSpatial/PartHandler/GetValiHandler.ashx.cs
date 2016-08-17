using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GAIA.Web.Emer.PartHandler
{
    /// <summary>
    /// GetValiHandler 的摘要说明
    /// </summary>
    public class GetValiHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            byte[] buffer = null;
            string code = string.Empty;

            #region 获取登录验证码
            code = NHExt.WebUtil.VerificationCodeHelper.GetVerCode(ref buffer);
            context.Session["rgimg"] = code;
            #endregion

            context.Response.ContentType = "image/Gif";
            context.Response.BinaryWrite(buffer);
            context.Response.End();
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