using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GIS.DotSpatial.DataBP.Agent
{
    public partial class InsertDataBPProxy : NHExt.Runtime.Model.BizAgent
    {
		private string _guid ="c7b93019-c02f-4e63-93d6-711a2e617a66";
		public override string Guid {
			get{
				return _guid;
			}
		}
		private string _proxyName = "GIS.DotSpatial.DataBP.Agent.InsertDataBPProxy";
		public override string ProxyName{
			get{
				return this._proxyName;
			}
		}

/// <summary>
/// 类型(1:点;2:线;3:面)
/// </summary>
private int  _Type ;
/// <summary>
/// 类型(1:点;2:线;3:面)
/// </summary>
public virtual int Type
{
get{
return _Type;
}
set{
 _Type= value;
}
}

/// <summary>
/// 坐标串
/// </summary>
private List<GIS.DotSpatial.DataBP.Deploy.Position> _PosList ;
/// <summary>
/// 坐标串
/// </summary>
public virtual List<GIS.DotSpatial.DataBP.Deploy.Position> PosList
{
get{
return _PosList;
}
set{
 _PosList= value;
}
}

public InsertDataBPProxy()
{
	this.invoker.RemoteIP = this.RemoteIP;
	this.invoker.DllName = "GIS.DotSpatial.DataBP.dll";
    this.invoker.NS = "GIS.DotSpatial.DataBP";
    this.invoker.ProxyName = "InsertDataBP";
 

 
}

public override object DoProxy()
{
	this.invoker.SourcePage = this.SourcePage;
	this.invoker.ParamList.Add(this._Type);
	this.invoker.ParamList.Add(this._PosList);
	List<NHExt.Runtime.AOP.IAgentAspect> aspectList = NHExt.Runtime.AOP.AspectManager.BuildAgentAspect(this.ProxyName);
	foreach (NHExt.Runtime.AOP.IAgentAspect aspect in aspectList) {
		aspect.BeforeDo(this,invoker.ParamList);
	}
	object obj = this.invoker.Do();
	if(this.IsTask){
		return default(bool);
	}
	bool result;
	if (this.invoker.CallerType == NHExt.Runtime.Session.CallerTypeEnum.WCF)
	{
		string xml = string.Empty;
		if(obj != null){
			xml = obj.ToString();
		}
		NHExt.Runtime.Logger.LoggerHelper.Info("远程wcf返回数据为:" + xml, NHExt.Runtime.Logger.LoggerInstance.RuntimeLogger);
		try{
			result = NHExt.Runtime.Serialize.XmlSerialize.DeSerialize<bool>(xml);
		}
		catch(Exception ex){
			 throw new NHExt.Runtime.Exceptions.RuntimeException("反序列化WCF返回数据错误，实体类型“"+typeof(bool).FullName+"”,返回数据为"+xml);
		}
	}
	else
	{
		result= (bool)obj;
	}
	foreach (NHExt.Runtime.AOP.IAgentAspect aspect in aspectList)
	{
		aspect.AfterDo(this,result);
	}
	return result;


	}
	public bool Do()
	{
		 bool obj = ( bool)this.DoProxy();
		 return obj;
	}

	public override void SetValue(object obj, string memberName)
	{
		switch(memberName){
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

