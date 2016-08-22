using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GIS.DotSpatial.DataBP
{
    public partial class DeleteDataBP : NHExt.Runtime.Model.BizProxy
    {
		private string _guid ="ccf250fc-26a3-4d15-994a-ea1a813de521";
		public override string Guid {
			get{
				return this._guid;
			}
		}
		private string _proxyName = "GIS.DotSpatial.DataBP.DeleteDataBP";
		public override string ProxyName{
			get{
				return this._proxyName;
			}
		}
		private NHExt.Runtime.Session.CallerTypeEnum _callerType = NHExt.Runtime.Session.CallerTypeEnum.Reflect;

        public override NHExt.Runtime.Session.CallerTypeEnum CallerType
        {
			get{
				 return this._callerType;
			}
		}


public DeleteDataBP()
 {
 
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

internal bool Do()
{
    NHExt.Runtime.Proxy.ProxyContext ctx = new NHExt.Runtime.Proxy.ProxyContext();
    ctx.ProxyGuid = this._guid;
    return this.DoCommon(ctx);
}

internal void DoTask(bool autoRun = false)
{
	this._callerType = NHExt.Runtime.Session.CallerTypeEnum.Reflect;
	NHExt.Runtime.Proxy.ProxyContext ctx = new NHExt.Runtime.Proxy.ProxyContext();
    ctx.ProxyGuid = this._guid;
	 NHExt.Runtime.Logger.LoggerHelper.Info("系统调度任务，使用线程调度服务");
    NHExt.Runtime.Proxy.TaskThreadPool.ThreadPool.AddThreadItem((state) =>
    {
        NHExt.Runtime.Proxy.ProxyContext pCtx = state as NHExt.Runtime.Proxy.ProxyContext;
		this.DoCommon(pCtx);
    }, ctx , autoRun);
}

public override object Do(NHExt.Runtime.Proxy.ProxyContext ctx)
{
	this._callerType = NHExt.Runtime.Session.CallerTypeEnum.Reflect;
	var obj = this.TypeConvert(this.DoCommon(ctx));
	return obj;
}

public override NHExt.Runtime.Model.WCFCallDTO DoWCF(NHExt.Runtime.Proxy.ProxyContext ctx)
{
	string xml = string.Empty;
	NHExt.Runtime.Model.WCFCallDTO callDTO = new NHExt.Runtime.Model.WCFCallDTO();
	try
	{
		this._callerType = NHExt.Runtime.Session.CallerTypeEnum.WCF;

		NHExt.Runtime.Proxy.ProxyContext transferCtx = NHExt.Runtime.Proxy.ProxyContextFactory.CreateInstance(ctx.AuthContext, ctx.CallerType);
        transferCtx.TransferFromBase(ctx);
        var obj = this.TypeConvert(this.DoCommon(transferCtx));
		if (obj != null) {
			xml = NHExt.Runtime.Serialize.XmlSerialize.Serialize(obj);
		}else{
			xml = string.Empty;
		}
		callDTO.Success = true;
	}
	catch(Exception ex){
		xml = ex.Message;
	}
	callDTO.Result = xml;
	return callDTO;
}
private bool DoCommon(NHExt.Runtime.Proxy.ProxyContext ctx)
{
	using (NHExt.Runtime.Session.Transaction trans = NHExt.Runtime.Session.Transaction.New(NHExt.Runtime.Enums.TransactionSupport.Support, ctx.UseReadDB))
	{
		List<NHExt.Runtime.AOP.IProxyAspect> aspectList = new List<NHExt.Runtime.AOP.IProxyAspect>();
		try
		{
			this.InitParameter(ctx);
			ctx.ProxyStack.Add(new NHExt.Runtime.Auth.ProxyProperty() { ProxyGuid = this.Guid, ProxyName = this.ProxyName });
			aspectList = NHExt.Runtime.AOP.AspectManager.BuildProxyAspect(this.ProxyName);
			foreach (NHExt.Runtime.AOP.IProxyAspect insector in aspectList)
			{
				insector.BeforeDo(this,ctx);
			}
			var obj = this.DoExtend();

			NHExt.Runtime.Session.Session.Current.Commit();
				 
			foreach (NHExt.Runtime.AOP.IProxyAspect insector in aspectList)
			{
				insector.AfterDo(this,obj);
			}
			trans.Commit();
			return obj;
		}
		catch  
		{
			trans.RollBack();
			throw ;
		}
		finally{
			ctx.ProxyStack.RemoveAt(ctx.ProxyStack.Count -1);
		}
	}
}

private bool TypeConvert(bool obj)
{

return obj;

}
protected override void InitParameter(NHExt.Runtime.Proxy.ProxyContext ctx){
	base.InitParameter(ctx);
	if(ctx != null){
if(this.CallerType == NHExt.Runtime.Session.CallerTypeEnum.WCF){
	this._ID = NHExt.Runtime.Serialize.XmlSerialize.DeSerialize<string >(ctx.ParamList[0].ToString());
	ctx.ParamList[0] = this._ID;
}
else{
	if(ctx.ParamList.Count > 0){
	this._ID = (string )ctx.ParamList[0];
	}else{
		ctx.ParamList.Add(this._ID);
	}
}
if(this.CallerType == NHExt.Runtime.Session.CallerTypeEnum.WCF){
	this._Type = NHExt.Runtime.Serialize.XmlSerialize.DeSerialize<int >(ctx.ParamList[1].ToString());
	ctx.ParamList[1] = this._Type;
}
else{
	if(ctx.ParamList.Count > 1){
	this._Type = (int )ctx.ParamList[1];
	}else{
		ctx.ParamList.Add(this._Type);
	}
}
	}
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
