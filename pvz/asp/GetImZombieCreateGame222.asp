
//写图形对战列表列表
var str='',

WriteSmallContainer=function(OnTop, ID, T, SNum, UN, Time, Visit, Finished, hp, zp, cp, C, mapkind){
	/*置顶 id 标题 阳光 作者 时间 访问 完成 好 中 差评 阵型字符 地图类型*/

//返回植物的缩小后的高度
var GetHeight=function(pid){
	switch(pid){
		case '24':return(21);//高坚果
		case '05':case '43': return(12);//土豆
		case '17':return(13);//睡莲
		case '29':return(15);//分裂
		case '31':return(10);//南瓜
		case '07':case '09':case '14':return(16); //大嘴花 小喷 胆小 睡莲 分裂
		default:return(14);//其它
	}
},
//传递地图类型返回植物底部y坐标数组
arr=function(mapkind){
	switch(mapkind){
		case 0:
			return [0,23,35,49,61,74,87];
		case 1: case 2: case 3:
			return [0,23,33,45,55,67,76]; //根据行返回植物底部y，分别保存五路、六路y坐标
	}
},
//传递类型返回x坐标
acc=function(mapkind){
	return [0,3,12,21,30,40,49,58,67,76];
},

//保存现有的植物数字，超出范围的不布局
JPlant={
	"01": 0, "02": 0, "03": 0, "04": 0, "05": 0, "06": 0, "07": 0, "08": 0, "09": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0, "24": 0, "25": 0, "26": 0, "27": 0, "28": 0, "29": 0, "30": 0, "31": 0, "34": 0, "36": 0, "37": 0, "41": 0, "42": 0, "43": 0, "47": 0, "57": 0
},

//返回
GetPStr=function(str,mapkind){ //4位数字，行+列+两位植物id
	var ar=arr(mapkind),
		ac=acc(mapkind), //根据列返回植物左侧x
		r=str.substr(0,1), //行
		c=str.substr(1,1), //列
		pid=str.substr(2,2); //植物序号

	if(isNaN(Number(pid)) || !(pid in JPlant))return("");
	JC[c]=0;
	return '<img class="iz_plant" border="0" src="../images/iz/'+pid+'.png" style="left:'+ac[c]+'px;top:'+(ar[r]-GetHeight(pid))+'px">';
},
//传递所有植物的字符串，返回植物的html
GetPlantStr=function(S,mapkind){
	var n, L=S.length-1, s1=[], ss='';
	try{
	for(n=0; n<=L; n+=4) if (!isNaN(S.substr(n,4))) s1.push(GetPStr(S.substr(n,4),mapkind)); else break;
	for(n=s1.length-1; n>=0; n--) ss += s1[n];
	for(n=9;n>0;n--)
		if(n in JC){
			ss='<img src="../images/iz/Stripe.png" style="position:absolute;left:'+(acc(mapkind)[n+1]+2)+'px;top:9px;width:3px">'+ss;
			break;
		}
	return ss;
	}catch(e){return ''}
},
JC={}; //保存某列是否有植物

		//T,C,ID,UN,hp,zp,cp,SNum,mapkind

//计算背景图片，非设定的mapkind设置为无法显示
var iz_bgimg='';
switch(mapkind){
	case 0: case 1: case 2: case 3: 
		iz_bgimg='<img class="iz_bgimg" border="0" src="../images/iz/bg'+mapkind+'.png">'; break;
	default:
		iz_bgimg='<img class="iz_bgimg" border="0" src="../images/iz/bgX.png" style="background-size:100% 100%">';
}
		
	document.getElementById('uC').innerHTML+=
		'<div class="iz_smallcontainer" title="'+T+'" onclick="getImZombie(\''+T+'\',\''+C+'\','+ID+',\''+UN+'\','+hp+','+zp+','+cp+','+SNum+','+mapkind+')">'+
		'<img src="../images/iz/idcard.png" class="iz_containerimg">'+
		'<div class="iz_top">'+
		'	<div class="iz_topright">'+
		'		<span><label style="color:#22579c">编号</label> <label style="color: '+['black','blue'][OnTop]+';">'+ID+'</label></span>'+
		'		<span><label style="color:#22579c">作者</label> '+UN+'</span>'+
		'		<span><label style="color:#22579c">创建</label> '+Time+'</span>'+
		'		<span><label style="color:#22579c">阳光</label> '+SNum+'</span>'+
		'		<span><label style="color:#22579c">访问</label> '+Visit+'</span>'+
		'		<span><label style="color:#22579c">过关</label> '+Finished+'</span>'+
		'		<span>'+
		'			<label style="color:#22579c">好评 </label>'+
		'			<label style="color:#008080">'+hp+' </label>'+
		'			<label style="color:#22579c">中评 </label>'+
		'			<label style="color:#FF9326">'+zp+' </label>'+
		'			<label style="color:#22579c">差评 </label>'+
		'			<label style="color:#F00">'+cp+' </label>'+
		'		</span>'+
		'	</div>'+
		'	<div class="iz_topleft">'+iz_bgimg+
		GetPlantStr(C,mapkind)+
		'	</div>'+
		'</div>'+
		'<div class="iz_bottom">'+
		'	<div style="color:#22579c;width:24px;">标题</div>'+
		'	<div style="width:170px;">'+(T==''?'<label style="color:gray"><无标题游戏></label>':(T.length>208?T.substr(0,200)+'..':T))+'</div>'+
		'</div>'+
		'</div>';
};
document.getElementById('uC').innerHTML='';
WriteSmallContainer(0, 140437, 'undefined', 150, 'zcc', '08/18/2025', 19, 7, 0, 0, 1, '1101', 0);
WriteSmallContainer(0, 116178, '&#33853;&#33521;&#32548;&#32439;undefined', 300, '错误之星', '02/23/2024', 299, 45, 2, 0, 0, '1147214331474143514112532247324342475257', 1);
WriteSmallContainer(0, 116117, '&#19975;&#31809;&#27492;&#37117;&#23490;undefined', 950, '错误之星', '02/22/2024', 139, 54, 1, 0, 0, '1157215131514156515112552202325642035253', 1);
WriteSmallContainer(0, 116050, '&#22825;&#29983;&#19975;&#29289;&#20197;&#20859;&#20154;undefined', 950, '错误之星', '02/22/2024', 129, 54, 1, 0, 0, '1102214731044104515212522204325142525206', 2);
WriteSmallContainer(0, 116049, '&#22823;&#26790;&#35841;&#20808;&#35273;undefined', 1000, '错误之星', '02/22/2024', 110, 18, 0, 0, 0, '1136211431034105511412072221322242145225', 1);
top.$('fRiddleAlreadyCreateGame').style.backgroundColor='transparent';top.$('dRiddle1').getElementsByTagName('div')[0].style.width='862px';
var v1=5,v2=1,v3=1;
document.getElementById('dB').innerHTML=ShowPage(v1,v2,v3,'','p',1);