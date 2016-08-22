using DotSpatial.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DotSpatial.Topology;

namespace GIS.DotSpatial.DataBP
{
    public partial class InsertDataBP
    {
        private bool DoExtend()
        {
            if (this.Type <= 0)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }
            if (this.PosList == null || this.PosList.Count <= 0)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入点串");
            }
            string path = System.Configuration.ConfigurationManager.AppSettings["DataUrl"];
            IFeatureSet fs = null;
            IGeometry geo = null;
            Shapefile sf = null;
            List<Coordinate> cooArray = new List<Coordinate>();
            foreach (var pos in this.PosList)
            {
                cooArray.Add(new Coordinate(new double[] { pos.X, pos.Y }));
            }
            switch (this.Type)
            {
                case 1:
                    path += "P.shp";
                    sf = new PointShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new Point(cooArray[0]);

                    IFeature p = fs.AddFeature(geo);
                    p.DataRow["ID"] = InsertDataBP.BuildID();
                    fs.SaveAs(path, true);
                    break;
                case 2:
                    path += "L.shp";
                    sf = new LineShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new LineString(cooArray);
                    IFeature l = fs.AddFeature(geo);
                    l.DataRow["ID"] = InsertDataBP.BuildID();
                    fs.SaveAs(path, true);
                    break;
                case 3:
                    path += "R.shp";
                    sf = new PolygonShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new Polygon(cooArray);
                    IFeature r = fs.AddFeature(geo);
                    r.DataRow["ID"] = InsertDataBP.BuildID();
                    fs.SaveAs(path, true);
                    break;
                default:
                    throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }
            return true;
        }
        internal static string BuildID()
        {
            string id = DateTime.Now.ToString("yyMMddHHmmssfff");
            return id;
        }
    }
}
