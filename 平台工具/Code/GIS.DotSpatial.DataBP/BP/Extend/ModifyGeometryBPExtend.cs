using DotSpatial.Data;
using DotSpatial.Topology;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GIS.DotSpatial.DataBP
{
    public partial class ModifyGeometryBP
    {
        private GIS.DotSpatial.DataBP.Deploy.DataDTO DoExtend()
        {
            if (this.DataDTO == null || this.DataDTO.PosList == null)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入待修改的数据");
            }
            if (this.DataDTO.Type <= 0)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }
            if (string.IsNullOrEmpty(this.DataDTO.CID))
            {
                throw new NHExt.Runtime.Exceptions.BizException("待删除的数据ID不能为空");
            }
            string path = System.Configuration.ConfigurationManager.AppSettings["DataUrl"];
            Shapefile sf = null;
            FeatureSet fs = null;
            switch (this.DataDTO.Type)
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
                    throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }

            fs = new FeatureSet(sf.Features);
            IFeature feature = fs.Features.ToList().Find((f) => { return (f.DataRow["ID"] == null ? "" : f.DataRow["ID"].ToString()) == this.DataDTO.CID; });
            if (feature != null)
            {
                List<Coordinate> cooArray = new List<Coordinate>();
                foreach (var pos in this.DataDTO.PosList)
                {
                    cooArray.Add(new Coordinate(new double[] { pos.X, pos.Y }));
                }
                feature.Coordinates = cooArray;
                fs.SaveAs(path, true);
            }
            return this.DataDTO;
        }
    }
}
