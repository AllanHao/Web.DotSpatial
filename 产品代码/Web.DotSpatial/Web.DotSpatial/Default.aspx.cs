using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Web.DotSpatial
{
    public partial class Default : NHExt.Runtime.GAIA.Page.AuthPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public override string PageGuid
        {
            get { return "Web.DotSpatial.Default"; }
        }
    }
}