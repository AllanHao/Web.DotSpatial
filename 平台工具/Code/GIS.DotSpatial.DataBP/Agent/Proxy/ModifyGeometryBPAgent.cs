using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GIS.DotSpatial.DataBP.Agent
{
    public partial class ModifyGeometryBPProxy : NHExt.Runtime.Model.BizAgent
    {
		private string _guid ="0bf1e872-8278-471c-8015-954672d137c7";
		public override string Guid {
			get{
				return _guid;
			}
		}
		private string _proxyName = "GIS.DotSpatial.DataBP.Agent.ModifyGeometryBPProxy";
		public override string ProxyName{
			get{
				return this._proxyName;
			}
		}

/// <summary>
/// 数据DTO
/// </summary>
private GIS.DotSpatial.DataBP.Deploy.DataDTO  _DataDTO ;
/// <summary>
/// 数据DTO
/// </summary>
public virtual GIS.DotSpatial.DataBP.Deploy.DataDTO DataDTO
{
get{
return _DataDTO;
}
set{
 _DataDTO= value;
}
}
public ModifyGeometryBPProxy()
{
	this.invoker.RemoteIP = this.RemoteIP;
	this.invoker.DllName = "GIS.DotSpatial.DataBP.dll";
    this.invoker.NS = "GIS.DotSpatial.DataBP";
    this.invoker.ProxyName = "ModifyGeometryBP";
 

 
}

public override object DoProxy()
{
	this.invoker.SourcePage = this.SourcePage;
	this.invoker.ParamList.Add(this._DataDTO);
	List<NHExt.Runtime.AOP.IAgentAspect> aspectList = NHExt.Runtime.AOP.AspectManager.BuildAgentAspect(this.ProxyName);
	foreach (NHExt.Runtime.AOP.IAgentAspect aspect in aspectList) {
		aspect.BeforeDo(this,invoker.ParamList);
	}
	object obj = this.invoker.Do();
	if(this.IsTask){
		return default(GIS.DotSpatial.DataBP.Deploy.DataDTO);
	}
	GIS.DotSpatial.DataBP.Deploy.DataDTO result;
	if (this.invoker.CallerType == NHExt.Runtime.Session.CallerTypeEnum.WCF)
	{
		string xml = string.Empty;
		if(obj != null){
			xml = obj.ToString();
		}
		NHExt.Runtime.Logger.LoggerHelper.Info("远程wcf返回数据为:" + xml, NHExt.Runtime.Logger.LoggerInstance.RuntimeLogger);
		try{
			result = NHExt.Runtime.Serialize.XmlSerialize.DeSerialize<GIS.DotSpatial.DataBP.Deploy.DataDTO>(xml);
		}
		catch(Exception ex){
			 throw new NHExt.Runtime.Exceptions.RuntimeException("反序列化WCF返回数据错误，实体类型“"+typeof(GIS.DotSpatial.DataBP.Deploy.DataDTO).FullName+"”,返回数据为"+xml);
		}
	}
	else
	{
		result= (GIS.DotSpatial.DataBP.Deploy.DataDTO)obj;
	}
	foreach (NHExt.Runtime.AOP.IAgentAspect aspect in aspectList)
	{
		aspect.AfterDo(this,result);
	}
	return result;


	}
	public GIS.DotSpatial.DataBP.Deploy.DataDTO Do()
	{
		 GIS.DotSpatial.DataBP.Deploy.DataDTO obj = ( GIS.DotSpatial.DataBP.Deploy.DataDTO)this.DoProxy();
		 return obj;
	}

	public override void SetValue(object obj, string memberName)
	{
		switch(memberName){
case "DataDTO" :
	this._DataDTO = this.TransferValue<GIS.DotSpatial.DataBP.Deploy.DataDTO>(obj);
	break;
		default:
			base.SetValue(obj,memberName);
			break;
		}
	}

 
    }
}

