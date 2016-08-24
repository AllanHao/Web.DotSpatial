using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NHExt.Runtime.Model;
namespace GIS.DotSpatial.DataBP.Deploy{
 [Serializable]
public partial class DataDTO : NHExt.Runtime.Model.BaseDTO
{

public DataDTO()
 {
 
}
/// <summary>
/// ID
/// </summary>
private string  _CID ;
/// <summary>
/// ID
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="CID",Description = "ID",EntityRefrence=false,IsViewer=false)]
public virtual string  CID
{
get{
return _CID;
}
set{
this._CID=value;
}
}
/// <summary>
/// 名称
/// </summary>
private string  _Name ;
/// <summary>
/// 名称
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="Name",Description = "名称",EntityRefrence=false,IsViewer=false)]
public virtual string  Name
{
get{
return _Name;
}
set{
this._Name=value;
}
}
/// <summary>
/// 数据类型(1:点;2:线;3:面)
/// </summary>
private int  _Type ;
/// <summary>
/// 数据类型(1:点;2:线;3:面)
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="Type",Description = "数据类型(1:点;2:线;3:面)",EntityRefrence=false,IsViewer=false)]
public virtual int  Type
{
get{
return _Type;
}
set{
this._Type=value;
}
}
/// <summary>
/// 坐标串
/// </summary>
private List<GIS.DotSpatial.DataBP.Deploy.Position> _PosList = new List<GIS.DotSpatial.DataBP.Deploy.Position>();
/// <summary>
/// 坐标串
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="PosList",Description = "坐标串",EntityRefrence=true,IsViewer=false)]
public virtual List<GIS.DotSpatial.DataBP.Deploy.Position> PosList
{
   get { 
   return _PosList; 
   }
  set { 
		_PosList =value;
	}
 }
	public override void SetValue(object obj, string memberName)
	{
		switch(memberName){
case "CID" :
	this._CID = this.TransferValue<string>(obj);
	break;
case "Name" :
	this._Name = this.TransferValue<string>(obj);
	break;
case "Type" :
	this._Type = this.TransferValue<int>(obj);
	break;
case "PosList" :
	this._PosList = this.TransferValue<List<GIS.DotSpatial.DataBP.Deploy.Position> >(obj);
	break;

		default:
			base.SetValue(obj,memberName);
			break;
		}
	}


 }
}
