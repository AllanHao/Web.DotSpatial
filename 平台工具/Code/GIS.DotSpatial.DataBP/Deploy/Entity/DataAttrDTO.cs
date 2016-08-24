using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NHExt.Runtime.Model;
namespace GIS.DotSpatial.DataBP.Deploy{
 [Serializable]
public partial class DataAttrDTO : NHExt.Runtime.Model.BaseDTO
{

public DataAttrDTO()
 {
 
}
/// <summary>
/// ID
/// </summary>
private string  _ID ;
/// <summary>
/// ID
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="ID",Description = "ID",EntityRefrence=false,IsViewer=false)]
public virtual string  ID
{
get{
return _ID;
}
set{
this._ID=value;
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
	public override void SetValue(object obj, string memberName)
	{
		switch(memberName){
case "ID" :
	this._ID = this.TransferValue<string>(obj);
	break;
case "Name" :
	this._Name = this.TransferValue<string>(obj);
	break;
		default:
			base.SetValue(obj,memberName);
			break;
		}
	}


 }
}
