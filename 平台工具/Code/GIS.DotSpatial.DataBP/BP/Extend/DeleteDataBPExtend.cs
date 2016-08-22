using DotSpatial.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GIS.DotSpatial.DataBP
{
    public partial class DeleteDataBP
    {
        private bool DoExtend()
        {
            if (this.Type <= 0)
            {
                throw new NHExt.Runtime.Exceptions.BizException("û�д�����������");
            }
            if (string.IsNullOrEmpty(this.ID))
            {
                throw new NHExt.Runtime.Exceptions.BizException("��ɾ��������ID����Ϊ��");
            }
            string path = System.Configuration.ConfigurationManager.AppSettings["DataUrl"];
            Shapefile sf = null;
            FeatureSet fs = null;
            switch (this.Type)
            {
                case 1:
                    path += "P.shp";
                    sf = new PointShapefile(path);
                    break;
                case 2:
                    path += "L.shp";
                    sf = new LineShapefile(path);
                    break;
                case 3:
                    path += "R.shp";
                    sf = new PolygonShapefile(path);
                    break;
                default:
                    throw new NHExt.Runtime.Exceptions.BizException("û�д�����������");
            }
            fs = new FeatureSet(sf.Features);
            IFeature feature = fs.Features.ToList().Find((f) => { return (f.DataRow["ID"] == null ? "" : f.DataRow["ID"].ToString()) == this.ID; });
            if (feature != null)
            {
                fs.Features.Remove(feature);
                fs.SaveAs(path, true);
                return true;
            }
            return false;

        }
    }
}
