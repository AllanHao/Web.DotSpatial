using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NHExt.Runtime.Model;
namespace GIS.DotSpatial.DataBP.Deploy{
 [Serializable]
public partial class Position : NHExt.Runtime.Model.BaseDTO
{

public Position()
 {
 
}
/// <summary>
/// X坐标
/// </summary>
private double  _X ;
/// <summary>
/// X坐标
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="X",Description = "X坐标",EntityRefrence=false,IsViewer=false)]
public virtual double  X
{
get{
return _X;
}
set{
this._X=value;
}
}
/// <summary>
/// Y坐标
/// </summary>
private double  _Y ;
/// <summary>
/// Y坐标
/// </summary>
[NHExt.Runtime.EntityAttribute.ColumnDescription(Code="Y",Description = "Y坐标",EntityRefrence=false,IsViewer=false)]
public virtual double  Y
{
get{
return _Y;
}
set{
this._Y=value;
}
}
	public override void SetValue(object obj, string memberName)
	{
		switch(memberName){
case "X" :
	this._X = this.TransferValue<double>(obj);
	break;
case "Y" :
	this._Y = this.TransferValue<double>(obj);
	break;
		default:
			base.SetValue(obj,memberName);
			break;
		}
	}


 }
}
