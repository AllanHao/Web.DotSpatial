using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GIS.DotSpatial.DataBP.Agent
{
    public partial class DeleteDataBPProxy : NHExt.Runtime.Model.BizAgent
    {
		private string _guid ="ccf250fc-26a3-4d15-994a-ea1a813de521";
		public override string Guid {
			get{
				return _guid;
			}
		}
		private string _proxyName = "GIS.DotSpatial.DataBP.Agent.DeleteDataBPProxy";
		public override string ProxyName{
			get{
				return this._proxyName;
			}
		}

/// <summary>
/// ID
/// </summary>
private string  _ID ;
/// <summary>
/// ID
/// </summary>
public virtual string ID
{
get{
return _ID;
}
set{
 _ID= value;
}
}

/// <summary>
/// 数据类型
/// </summary>
private int  _Type ;
/// <summary>
/// 数据类型
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

public DeleteDataBPProxy()
{
	this.invoker.RemoteIP = this.RemoteIP;
	this.invoker.DllName = "GIS.DotSpatial.DataBP.dll";
    this.invoker.NS = "GIS.DotSpatial.DataBP";
    this.invoker.ProxyName = "DeleteDataBP";
 

 
}

public override object DoProxy()
{
	this.invoker.SourcePage = this.SourcePage;
	this.invoker.ParamList.Add(this._ID);
	this.invoker.ParamList.Add(this._Type);
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
case "ID" :
	this._ID = this.TransferValue<string>(obj);
	break;
case "Type" :
	this._Type = this.TransferValue<int>(obj);
	break;
		default:
			base.SetValue(obj,memberName);
			break;
		}
	}

 
    }
}

