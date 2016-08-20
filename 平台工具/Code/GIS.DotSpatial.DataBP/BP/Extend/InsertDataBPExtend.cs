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
            string path = "";
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
                    path = "";
                    sf = new PointShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new Point(cooArray[0]);
                    fs.AddFeature(geo);
                    fs.SaveAs(path, true);
                    break;
                case 2:
                    path = "";
                    sf = new LineShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new LineString(cooArray);
                    fs.AddFeature(geo);
                    fs.SaveAs(path, true);
                    break;
                case 3:
                    path = "";
                    sf = new PolygonShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new LinearRing(cooArray);
                    fs.AddFeature(geo);
                    fs.SaveAs(path, true);
                    break;
                default:
                    throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }
            return true;
        }
    }
}
