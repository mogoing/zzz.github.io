
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title></title>
<style type=text/css>
body{font-size:13px;font-family:Arial,Verdana}
ul{margin-left:-35px;*margin-left:0;margin-top:0;list-style-type:none}
ul li{display:inline}
.dC{overflow-y:hidden;overflow-x:auto;height:435px;padding:0;margin:0;white-space:nowrap}
#dB{height:7%;line-height:20px;text-align:center}
a:link{color:#00f;text-decoration:none} 
a:hover{color:#f00;text-decoration:underline} 

/*以下为iz对战界面*/
.iz_bigcontainer{position:relative;width:860px;height:435px;overflow:hidden}
.iz_smallcontainer{width:215px; height:145px;float:left;overflow:hidden;cursor:pointer}
.iz_top{position:relative;width:205px;height:90px;margin-top:6px;margin-left:5px;overflow:hidden}
.iz_topleft{float:left;position:relative;width:90px;height:76px}
.iz_bgimg{position:absolute;width:100%;height:100%}
.iz_plant{position:absolute;width:13px}
.iz_containerimg{position:absolute;width:210px;height:135px}
.iz_topright{
	float:left;font-family:tahoma,verdana;
	font-size:12px;line-height:13px;width:105px;
}
.iz_topright span{margin-left:3px;display:block}
.iz_bottom{position:relative;margin-left:8px;width:205px;height:35px;font-size:12px}
.iz_bottom div{display:inline-block;height:30px;overflow:hidden;
	word-wrap: break-word;word-break: break-all;white-space: pre-wrap !important;}
</style>
</head>
<body style="overflow:scroll" topmargin="0" leftmargin="0" oncontextmenu="return false" ondragstart="return false" onselectstart="return false">
<div class="dC" id="uC"></div>
<div id="dB"></div>
</body>
<script>
var DataURL=parent.$User.Server.DataURL,
SearchInx=0,SearchV='',SearchOrderBy='CreateT',SearchOrderByAD='desc',
SearchP=1,MaxP=1,
getImZombie=function(T,C,ID,UN,hp,zp,cp,SNum,mapkind){
	var oS=parent.oS,LvlVar=oS.LvlVar;
	LvlVar==undefined&&(LvlVar=parent.oS.LvlVar={});
	LvlVar.ImZombie={T:T,C:C,ID:ID,UN:UN,hp:hp,zp:zp,cp:cp,SNum:SNum,Mapkind:mapkind};
	if (mapkind < 1000) parent.SelectModal('GetImZombieCreateGame');
	else parent.SelectModal('GetImZombieCreateGame' + mapkind);
},
//----本子程序用来显示分页----
//Num:总记录数 PNum:总页面数 CPage:当前页面 Link:跳转页面 VName:页面参数的名字 selName:控件的编号,避免重复
ShowPage=function(Num,PNum,CPage,Link,VName,selName){
	var ShowStr,TmpPage,MaxPage;
	MaxP=PNum;
	Link+=(Link.search(/\?/)>-1)?'&':'?';
	ShowStr=Num+"记录&nbsp;"+CPage+"/"+PNum+"页";
	//ShowStr+="&nbsp;<a href='"+Link+VName+"=1'><b><<</b></a>";
	ShowStr+="&nbsp;<a href=\"javascript:;\" onclick=\"SearchLvl(undefined,'','','',1)\"><b><<</b></a>";
	if(CPage>1)
		for(TmpPage=(CPage-10>1)?CPage-10:1;TmpPage<CPage;TmpPage++)
			//ShowStr+=" <a href='"+Link+VName+"="+TmpPage+"'>"+TmpPage+"</a>";
			ShowStr+=" <a href=\"javascript:;\" onclick=\"SearchLvl(undefined,'','','',"+TmpPage+")\">"+TmpPage+"</a>";
	//ShowStr+="&nbsp;<a href='"+Link+VName+"="+CPage+"'><u><b>"+CPage+"</b></u></a>";
	ShowStr+="&nbsp;<a href=\"javascript:;\" onclick=\"SearchLvl(undefined,'','','',"+CPage+")\"><u><b>"+CPage+"</b></u></a>";
	MaxPage=(CPage+10>PNum)?PNum:CPage+10;
	if(CPage<PNum)
		for(TmpPage=CPage+1;TmpPage<=MaxPage;TmpPage++)
			//ShowStr+=" <a href='"+Link+VName+"="+TmpPage+"'>"+TmpPage+"</a>";
			ShowStr+=" <a href=\"javascript:;\" onclick=\"SearchLvl(undefined,'','','',"+TmpPage+")\">"+TmpPage+"</a>";
	//ShowStr+=" <a href='"+Link+VName+"="+PNum+"'><b>>></b></a>";
	ShowStr+=" <a href=\"javascript:;\" onclick=\"SearchLvl(undefined,'','','',"+PNum+")\"><b>>></b></a>";
	ShowStr+=' <input type="text" id="selPage'+selName+'" size="2" style="border-style: solid; border-width: 1">';
	//ShowStr+=" <input type='button' value='翻页' onclick=\"location.href='"+Link+VName+"='+document.getElementById('selPage"+selName+"').value\">";
	ShowStr+=" <input type='button' value='翻页' onclick=\"SearchLvl(undefined,'','','',document.getElementById('selPage"+selName+"').value)\">";
	return(ShowStr);
},
SearchLvl=function(SInx,SV,SOrderBy,SOrderByAD,SP){
	switch(SInx){
		case 1: case 2: //我创建的 我玩过的
			if(parent.$User.Visitor.UserName=='游客'){
				alert('请登录进行查询！'); return;
			}break;
		case 3: //序号
			if(SV==''){
				alert('请输入序号值！'); return;
			}break;
		 case 4: //创建人
			if(SV==''){
				alert('请输入创建人值！'); return;
			}break;
		case 5:  //标题
			if(SV==''){
				alert('请输入标题值！'); return;
			}break;
	}
	var EScript=document.getElementById('EScript');
	EScript&&EScript.parentNode.removeChild(EScript);
	EScript=document.createElement('script');
	document.getElementsByTagName('head')[0].appendChild(EScript);
	SInx!=undefined&&(SearchInx=SInx);
	SearchV=SV||SearchV;
	SearchOrderBy=SOrderBy||SearchOrderBy;
	SearchOrderByAD=SOrderByAD||SearchOrderByAD;
	SP!=undefined&&(
		isNaN(Math.floor(SP))?(
			SP=1
		):(
			SP<1&&(SP=1),
			SP>MaxP&&(SP=MaxP)
		),
		SearchP=SP
	);
	//SearchV=String(SearchV).replace(/'/ig,"\\\'");
	//document.getElementById('uC').innerHTML='';
	EScript.src="/asp/GetImZombieCreateGame222.asp?SearchInx="+SearchInx+"&SearchV="+escape(SearchV)+"&SearchOrderBy="+SearchOrderBy+"&SearchOrderByAD="+SearchOrderByAD+"&p="+SearchP
},
//点击标题头按钮进行排序
ChangeOrderAD=function(inx,E){
	var s, ArC=["标题","阳光","作者","日期","访问","过关","好评","中评","差评"],
		AD, orderbyad, Cookie=parent.getCookie("JSPVZIZList");
	if(Cookie==1){ //文字列表模式
		s=E.innerHTML;
		AD='<span style="color:blue;font-weight:bold">'
		if(s.search('↑')>-1){
			AD+='↓'; orderbyad='desc';
		}else{
			AD+='↑'; orderbyad='asc';
		}
		AD+="</span>";
		E.innerHTML=ArC[inx]+AD;
	}else{ //图形列表模式
		orderbyad=parent.window.$('sOrder2').value;
		inx=parent.window.$('sOrder1').selectedIndex;
	}
	SearchLvl(SearchInx,SearchV,['GameTitle','SunNum','UserName','CreateT','VNum','FNum','好评','中评','差评'][inx],orderbyad,SearchP);
};

SearchLvl();
</script>
</html>