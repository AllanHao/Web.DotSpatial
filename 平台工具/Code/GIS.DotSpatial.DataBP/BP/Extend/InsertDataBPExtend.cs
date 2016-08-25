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
        private GIS.DotSpatial.DataBP.Deploy.DataDTO DoExtend()
        {
            if (this.DataDTO == null)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入待新增的数据DTO");
            }
            if (this.DataDTO.Type <= 0)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }
            if (this.DataDTO.PosList == null || this.DataDTO.PosList.Count <= 0)
            {
                throw new NHExt.Runtime.Exceptions.BizException("没有传入点串");
            }
            string path = System.Configuration.ConfigurationManager.AppSettings["DataUrl"];
            IFeatureSet fs = null;
            IGeometry geo = null;
            Shapefile sf = null;
            List<Coordinate> cooArray = new List<Coordinate>();
            foreach (var pos in this.DataDTO.PosList)
            {
                cooArray.Add(new Coordinate(new double[] { pos.X, pos.Y }));
            }
            string id = InsertDataBP.BuildID();
            switch (this.DataDTO.Type)
            {
                case 1:
                    path += "P.shp";
                    sf = new PointShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new Point(cooArray[0]);

                    IFeature p = fs.AddFeature(geo);
                    if (!p.DataRow.Table.Columns.Contains("ID"))
                    {
                        System.Data.DataColumn col = new System.Data.DataColumn();
                        col.ColumnName = "ID";
                        col.DataType = typeof(string);

                        p.DataRow.Table.Columns.Add(col);
                    }
                    p.DataRow["ID"] = id;
                    fs.SaveAs(path, true);
                    break;
                case 2:
                    path += "L.shp";
                    sf = new LineShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new LineString(cooArray);
                    IFeature l = fs.AddFeature(geo);
                    if (!l.DataRow.Table.Columns.Contains("ID"))
                    {
                        System.Data.DataColumn col = new System.Data.DataColumn();
                        col.ColumnName = "ID";
                        col.DataType = typeof(string);

                        l.DataRow.Table.Columns.Add(col);
                    }
                    l.DataRow["ID"] = id;
                    fs.SaveAs(path, true);
                    break;
                case 3:
                    path += "R.shp";
                    sf = new PolygonShapefile(path);
                    fs = new FeatureSet(sf.Features);
                    geo = new Polygon(cooArray);
                    IFeature r = fs.AddFeature(geo);
                    if (!r.DataRow.Table.Columns.Contains("ID"))
                    {
                        System.Data.DataColumn col = new System.Data.DataColumn();
                        col.ColumnName = "ID";
                        col.DataType = typeof(string);

                        r.DataRow.Table.Columns.Add(col);
                    }
                    r.DataRow["ID"] = id;
                    fs.SaveAs(path, true);
                    break;
                default:
                    throw new NHExt.Runtime.Exceptions.BizException("没有传入数据类型");
            }
            this.DataDTO.CID = id;
            return this.DataDTO;
        }
        internal static string BuildID()
        {
            string id = DateTime.Now.ToString("yyMMddHHmmssfff");
            return id;
        }

    }
}
