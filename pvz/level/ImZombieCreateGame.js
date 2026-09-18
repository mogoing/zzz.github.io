(function (){
	/*
		ChoseMode: 选关界面
		NGrass: 黑夜草地
		NPool: 黑夜泳池
		DReversal: 水路反转
		NGrassDouble: 黑夜六行草地
	*/
	var IZMode = (oS.NowLevel != null) ? (oS.NowLevel) : ("ChoseMode"); // 读取当前关卡模式
	var Change_Level = function (ModeName) { oS.NowLevel = ModeName, SelectModal(oS.Lvl), oS.NowLevel = ModeName; }; // 以特定模式重新载入本关
	var $FJ = function (a, b) { // 覆盖数组
		var ret = {};
		for (var i in a) ret[i] = a[i];
		for (var i in b) ret[i] = b[i];
		return ret;
	};


	// 三种创建的模板
	var oSys = {
		MapKind: "0", 
		Coord: 1, LF: [0, 1, 1, 1, 1, 1], 
		// PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oScaredyShroom, oSquash, oThreepeater, oSpikeweed, oTorchwood, oTallNut, oCactus, oSplitPea, oStarfruit, oGarlic], 
		PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oHypnoShroom, oScaredyShroom, oSquash, oThreepeater, oSpikeweed, oTorchwood, oTallNut, oCactus, oSplitPea, oStarfruit, oPumpkinHead, oFlowerPot, oGarlic, oGatlingPea, oGloomShroom, oSpikerock, oRepeater2], 
		ZName: [oZombie], 
		PicArr: ["images/interface/background2.jpg", "images/interface/trophy.png"], 
		backgroundImage: "images/interface/background2.jpg", 
		BrainsNum: 5, ProduceSun: false, 
		SunNum: 9990, DKind: 0, 
		LevelName: "我是僵尸对战版创建模式-黑夜草地", 
		LvlEName: "ImZombieCreateGame", 
		LoadMusic: "Mountains", StartGameMusic: "Mountains", 
		LargeWaveFlag: { 10 : $("imgFlag3"), 20 : $("imgFlag1") }, 
		InitLawnMower: function () { var a = oS.R + 1; while (--a) CustomSpecial(oBrains, a, -1); }, 
		LvlClearFunc: function () {
			oS.ScrollScreen = oS.LvlVar.ScrollScreen;
			delete oS.LvlVar.ScrollScreen;
			delete oS.NowLevel; // 清除关卡阶段数据
		}, 
		ArP: { ArC: [1, 4], ArR: [1, 5] }, 
		LoadAccess: function (a) { 
			!oS.LvlVar ? (oS.LvlVar = { ScrollScreen: oS.ScrollScreen }) : (oS.LvlVar.ScrollScreen = oS.ScrollScreen); // 关卡数据
			$("tGround").style.left = "-115px";
			oS.ScrollScreen = function () { // 移动重写
				$("tGround").style.left = 0;
				ClearChild($("dButton1"), $("dButton2")); (function () { (EDAll.scrollLeft += 25) < 500 ? oSym.addTask(2, arguments.callee, []) : SetVisible($("dMenu"), $("dSelectCard"), $("dCardList"));})();
			}; a(0);
		}, 
		PlantsList: {
			NameList: { // 植物数据
				"default": "01", // 默认
				oPeashooter: "01", // 普通植物 1 ~ 40
				oSunFlower: "02", 
				oCherryBomb: "03", 
				oWallNut: "04", 
				oPotatoMine: "05", 
				oSnowPea: "06", 
				oChomper: "07", 
				oRepeater: "08", 
				oPuffShroom: "09", 
				oSunShroom: "10", 
				oFumeShroom: "11", 
				oGraveBuster: "12", 
				oHypnoShroom: "13", 
				oScaredyShroom: "14", 
				oIceShroom: "15", 
				oDoomShroom: "16", 
				oLilyPad: "17", 
				oSquash: "18", 
				oThreepeater: "19", 
				oTangleKelp: "20", 
				oJalapeno: "21", 
				oSpikeweed: "22", 
				oTorchwood: "23", 
				oTallNut: "24", 
				oSeaShroom: "25", 
				oPlantern: "26", 
				oCactus: "27", 
				oBlover: "28", 
				oSplitPea: "29", 
				oStarfruit: "30", 
				oPumpkinHead: "31", 
				oFlowerPot: "34", 
				oCoffeeBean: "36", 
				oGarlic: "37", 
				oGatlingPea: "41", // 紫卡: 41 ~ 48 
				oTwinSunflower: "42", 
				oGloomShroom: "43", 
				oSpikerock: "47", 
				oBrains: "51", // 其他植物: 50 ~ 70
				oLawnCleaner: "52", 
				oPoolCleaner: "53", 
				oNutBowling: "54", 
				oHugeNutBowling: "55", 
				oBoomNutBowling: "56", 
				oRepeater2: "57" 
			}, 
			IDList: {}, // 自动生成
			GetIDList: function () { // 生成对应的 IDList
				var self = oS.PlantsList;
				self.IDList = {}; // 清除
				for (var ID in self.NameList) if (self.NameList[ID] != "default") self.IDList[self.NameList[ID]] = ID;
			}
		}, 
		StartGame: function () {
			oP.Monitor({
				ar: [], 
				f: function () {
					var a = NewEle("DivTeach", "div", "line-height:40px;font-size:14px;top:380px", 0, EDAll); // 选择阵型列数
					var b = function (c) {
						CreateChooseZombiesBoard(); // 生成面板
						ClearChild($("DivTeach")), ImmediatelyCool(); // 取消冻结全部植物
						SetVisible($("tdShovel"), $("dFlagMeter")); // 显示铲子
						NewImg("iStripe", "images/interface/Stripe.png", "left:" + (GetX1X2(c)[0] - 11) + "px;top:65px", EDAll); // 生成线
						NewEle("btnClickChooseZombie", "button", "position:absolute;left:790px;top:330px;height:50px;width:100px;font-family:幼圆;font-weight:bold;font-size:18px;z-index:100", { // 选择僵尸
							innerHTML: "选择僵尸", onclick: function () { PlayAudio("tap"), SetNone($("dCardList")), SetBlock(dChooseZombie); }
						}, EDAll);
						NewEle("btnClickSave", "button", "position:absolute;left:790px;top:250px;height:50px;width:100px;font-family:幼圆;font-weight:bold;font-size:18px;z-index:100", { // 保存按钮
							innerHTML: "保存布局", 
							onclick: function () {
								var g = oGd.$, k, m = "", i, l, f, d = oS.ArP.ArC[1] - 1, h = oS.ArP.ArR[1], r = 0, z = "", j = oS.PlantsList.NameList;
								var LevelExtraObj = {
									ChosenZombie: GetFinalChooseZombie(), // 玩家允许选择的僵尸
									SetLine: c - 1, // 本关规定的列数
									_MaxPLine: 0, // （内部使用）实际使用的列数，不会上传到关卡里
								};

								for (k in g) if (g.hasOwnProperty(k)) z = (i = k.split("_"))[0] + i[1] + $SEql(g[k].EName, j), m = z + m, r = Math.max(r, i[1]); // 生成植物数据，采用倒叙生成
								LevelExtraObj._MaxPLine = r; // 更新Extra数据

								if ($User.Visitor.UserName == "游客") return alert("只有登录用户可以保存进度！\n请登陆后再保存进度！"); // 未登录用户

								if ($P.length < h * d * (5 / 10)) return alert("植物数量必须达到设置范围的 50%！\n\n请布置完整后再次保存！"); // 植物没满

								if (r <= 0 || r >= c) return alert("植物超过种植范围限制或者阵型不符合规范！\n\n请调整阵型后再次保存！"); // 植物种植在了线外
								
								if (LevelExtraObj.ChosenZombie == "Error") return alert("请至少选择一种僵尸！"); // 玩家取消了所有将士，返回

								if ((f = prompt("请输入阳光数量，范围50-2000且必须是25的倍数\n例如：150,175,200,225,250,275,300,325,350", "150")) == null) return; // 用户未输入, 返回
								
								if (isNaN(f = Number(f)) || f % 25 != 0 || f < 50 || f > 2000) return alert("请输入一个范围在50-2000之间且是25的倍数的数字！"); // 输入阳光
								
								if ((l = prompt("请输入自定义游戏的标题(50字符内)\n未输入则使用默认标题", "")) != null) {
									$("btnClickSave").innerHTML = "正在保存", $("btnClickSave").disabled = "disabled"; // 按钮样式
									Ajax("asp/ImZombieCreateGame.asp", "post", "mapkind=" + oS.MapKind + "&SNum=" + f + "&T=" + escape(l) + "&C=" + escape(m) + ObjectEncode(DeleteExtraData(LevelExtraObj)), function (c){eval(c)}); // 发送请求
								}
							}
						}, EDAll);
						oS.ArP.ArC = [1, c]; // 规定种植范围
						oS.ArP.ArR = [1, oS.R]; // 行
					};
					innerText(NewEle("spanT", "span", "position:absolute;left:120px;width:620px;text-align:left; font-family: 幼圆; font-size: 14px;line-height:50px", 0, a), "选择摆放植物的列数："); // 选列

					// 选择按钮
					innerText(NewEle("btnClick3", "button", "position:absolute;left:300px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(3) }
					}, a), "2列");
					innerText(NewEle("btnClick4", "button", "position:absolute;left:350px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(4) }
					}, a), "3列");
					innerText(NewEle("btnClick5", "button", "position:absolute;left:400px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(5) }
					}, a), "4列");
					innerText(NewEle("btnClick6", "button", "position:absolute;left:450px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(6) }
					}, a), "5列");
					innerText(NewEle("btnClick7", "button", "position:absolute;left:500px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(7) }
					}, a), "6列");
					innerText(NewEle("btnClick8", "button", "position:absolute;left:550px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(8) }
					}, a), "7列");
					innerText(NewEle("btnClick9", "button", "position:absolute;left:600px;top:10px;height:30px;width:40px;font-family:幼圆;font-size:14px", {
						onclick: function () { b(9) }
					}, a), "8列");
				}
			});
		}
	};
	var oPlt = {
		AZ: [[oZombie, 4, 1]], 
		FlagNum: 20, 
		FlagToSumNum: { a1: [19], a2: [1, 2] }, 
		FlagToMonitor: { 9 : [ShowLargeWave, 0], 19 : [ShowFinalWave, 0] }, 
		FlagToEnd: function () {
			NewImg("imgSF", "images/interface/trophy.png", "left:260px;top:233px", EDAll, { onclick: function () { SelectModal(0) } });
			NewImg("PointerUD", "images/interface/PointerDown.gif", "top:198px;left:269px", EDAll)
		}
	};
	var oWin = { // 全局函数覆盖
		GrowPlant: function (k, d, c, e, b) {
			var i = oS.ChoseCard, f = ArCard[i], g = f.PName, j = g.prototype, h = j.coolTime, a;
			j.CanGrow(k, e, b) && (PlayAudio(oGd.$LF[e] != 2 ? "plant" + Math.floor(1 + Math.random() * 2) : "plant_water"), CustomSpecial(g, e, b, 1), oSym.addTask(20, SetHidden, [SetStyle($("imgGrowSoil"), {
				left: d - 30 + "px", top: c - 40 + "px", zIndex: 3 * e, visibility: "visible"
			})]));
			CancelPlant(); // 无冷却
		}, 
		ViewPlantTitle: function (a) {
			var c = $("dTitle"), b = ArCard[a].PName.prototype;
			c.innerHTML = b.CName + "<br>" + b.Tooltip;
			SetStyle(c, {top: 60 * a + "px", left: (EDAlloffsetLeft + 100) + "px"});
		}, 
		ChooseZombiesData: { // 用于存储用户选择的僵尸种类（应该同步更新）
			"ZombieList": [oImp, oZombie, oFlagZombie, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oBackupDancer, oDuckyTubeZombie1, oDuckyTubeZombie2, oDuckyTubeZombie3, oSnorkelZombie, oDolphinRiderZombie, oBalloonZombie, oZomboni, oJackinTheBoxZombie, oSmallZombie, oSmallFlagZombie, oSmallConeheadZombie, oSmallFootballZombie, oSmallDuckyTubeZombie1, oSmallSnorkelZombie], 
			"ZombieMap": { // 僵尸对应的MAP，对于一般来说，以后更新僵尸了也不应该修改原有的数字顺序，应当新增数字
				"oImp": 0, // 普通僵尸
				"oZombie": 1, 
				"oFlagZombie": 2, 
				"oConeheadZombie": 3, 
				"oPoleVaultingZombie": 4, 
				"oBucketheadZombie": 5, 
				"oNewspaperZombie": 6, 
				"oScreenDoorZombie": 7, 
				"oFootballZombie": 8, 
				"oDancingZombie": 9, 
				"oBackupDancer": 10, 
				"oDuckyTubeZombie1": 11, 
				"oDuckyTubeZombie2": 12, 
				"oDuckyTubeZombie3": 13, 
				"oSnorkelZombie": 14, 
				"oDolphinRiderZombie": 15, 
				"oBalloonZombie": 16, 
				"oZomboni": 17, 
				"oJackinTheBoxZombie": 18, 
				"oSmallZombie": 101, // 小僵尸
				"oSmallFlagZombie": 102, 
				"oSmallConeheadZombie": 103, 
				"oSmallFootballZombie": 104, 
				"oSmallDuckyTubeZombie1": 105, 
				"oSmallSnorkelZombie": 106, 
			}, 
			"NormalList": { // 默认选择的僵尸列表
				"NGrass": [oImp, oZombie, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oBackupDancer, oBalloonZombie], 
				"NPool": [oImp, oZombie, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oBackupDancer, oDuckyTubeZombie1, oDuckyTubeZombie2, oDuckyTubeZombie3, oSnorkelZombie, oDolphinRiderZombie, oBalloonZombie], 
				"DReversal": [oImp, oZombie, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oBackupDancer, oDuckyTubeZombie1, oDuckyTubeZombie2, oDuckyTubeZombie3, oSnorkelZombie, oDolphinRiderZombie, oBalloonZombie], 
				"NGrassDouble": [oImp, oZombie, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oBackupDancer, oBalloonZombie], 
			}, 
			// 所有僵尸的选择状态（选或者没选）
			"ZombiesState": {}, 
		}, 
		GetFinalChooseZombie: function () { // 获取玩家选择的僵尸卡片
			var NormalList = ChooseZombiesData.NormalList[IZMode] || [], State = ChooseZombiesData.ZombiesState || {}, HasUsed = {}, ZombieMap = ChooseZombiesData.ZombieMap;
			var ZName, ZombieNum = 0, ret = { // 用来表示玩家选择的僵尸变动的数组
				"Deny_Use_Zombie": [], "Allow_Use_Zombie": []
			};
			for (var _ in NormalList) if (State[ZName = NormalList[_].prototype.EName] != 1 && NormalList[_].prototype.CanSelect == 1) ret.Deny_Use_Zombie.push(ZombieMap[ZName]), HasUsed[ZName] = 1; else HasUsed[ZName] = 1;
			for (var _ in State) if (HasUsed[_] != 1 && State[_] == 1) ret.Allow_Use_Zombie.push(ZombieMap[_]);
			for (var _ in NormalList) if (State[ZName = NormalList[_].prototype.EName] == 1 && NormalList[_].prototype.CanSelect == 1) ++ZombieNum;
			ZombieNum += ret.Allow_Use_Zombie.length;
			if (ZombieNum == 0) return "Error"; // 如果玩家一种僵尸都没选择，那么返回错误
			if (ret.Deny_Use_Zombie.length == 0 && ret.Allow_Use_Zombie.length == 0) return {}; // 如果玩家没有进行任何修改，返回空数组
			return ret; // 返回修改的数组
		}, 
		CreateChooseZombiesBoard: function () { // 生成选择僵尸种类界面的函数
			var dChooseZombie = NewEle("dChooseZombie", "div", "z-index:200;display:none;position:absolute;left:0px;top:0px", 0, EDAll,{"class":"Almanac_ZombieBack"});
			var dChooseZombieTitle = NewEle("dChooseZombieTitle", "div", "position:relative;text-align:center;line-height:88px;height:88px;width:100%;font-size:30px;font-weight:bold;font-family:黑体;color:#fff", { innerHTML: "选  择  僵  尸" }, dChooseZombie, {"class":"dRiddleTitle"});
			var dChooseZombieBack = NewEle("dChooseZombieBack", "input", "position:absolute;left:5px;top:550px;width:225px;height:35px;border-radius:12.5px;white-space:pre;background:rgba(0,0,0,0.733);color:rgb(255,255,255);font-family:楷体;font-size:22px;font-weight:bold;cursor:pointer;visibility:visible;", { onclick: function () { PlayAudio("tap"), SetBlock($("dCardList")), SetNone(dChooseZombie); } }, dChooseZombie, {"type": "button", "value": "保存选卡并返回"});
			var dChooseZombieBoard = NewEle("dChooseZombieBoard", "div", "position:relative;width:850px;height:455px;left:25px;", 0, dChooseZombie, {"class":"dPCard"});

			{ // 负责生成每张卡片
				var NormalLeft = 20, NormalTop = 30, LeftAdd = 140, TopAdd = 80, LineMax = 6;
				var Left = NormalLeft, Top = NormalTop, LineNum = 0, Obj, ZidMap = {}, NormalList = [];
				var ZList = ChooseZombiesData.ZombieList, ZChoose = ChooseZombiesData.ZombiesState; // 引用对象 
				var SelectZombieCard = function (Did, CloseAudio) { // 选择僵尸卡片
					!CloseAudio && PlayAudio("tap");
					if (ZChoose[ZList[Did].prototype.EName] != 1) {
						if (ZList[Did].prototype.CanSelect) SetVisible($("dState_" + Did), $("dScreen_" + Did)), SetHidden($("dPrice_" + Did)), $("dImg_" + Did).style.top = "-60px";
						ZChoose[ZList[Did].prototype.EName] = 1;
					} else {
						if (ZList[Did].prototype.CanSelect) SetHidden($("dState_" + Did), $("dScreen_" + Did)), SetVisible($("dPrice_" + Did)), $("dImg_" + Did).style.top = "0px";
						ZChoose[ZList[Did].prototype.EName] = 0;
					}
				};

				// 生成卡片元素
				for (var _ = 0; _ < ChooseZombiesData.ZombieList.length; ++_) {
					Obj = ChooseZombiesData.ZombieList[_].prototype, ZChoose[Obj.EName] = 0, ZidMap[Obj.EName] = _; // 获取当前的卡片数据
					if (Obj.CanSelect == 0) { ZChoose[Obj.EName] = 1; continue; } // 如果该卡不能被选中，那么就跳过本次生成
					var dCard = NewEle("dCard_" + _, "div", "position:absolute;width:100;height:60;overflow:hidden;left:" + Left + "px;top:" + Top + "px;cursor:pointer;", { value: _, "onmouseout": function() { SetHidden($("dTitle")); }, "onmousemove": function (event) { ViewCardTitle(ZList[this.value], event); }, "onclick": function () { SelectZombieCard(this.value); } }, dChooseZombieBoard);
					var dImg = NewImg("dImg_" + _, Obj.PicArr[Obj.CardGif], "width:100;height:120;", dCard);
					var dPrice = NewEle("dPrice_" + _, "span", "text-align:right;cursor:pointer;position:absolute;left:62px;top:40px;width:34px;height:20px;font-family:Fixedsys;font-size:11pt;font-weight:bold", { "innerText": Obj.SunNum }, dCard);
					var dScreen = NewEle("dScreen_" + _, "div", "z-index:1;visibility:hidden;cursor:pointer;position:absolute;left:0px;top:5px;width:100px;height:55px;background:#000;filter:alpha(opacity=0.6);opacity:0.6;border-radius:3px;", 0, dCard);
					var dState = NewEle("dState_" + _, "span", "z-index:1;visibility:hidden;text-align:center;cursor:pointer;position:absolute;left:0px;top:15px;width:100px;font-family:Fixedsys;font-size:18pt;font-weight:bold;color:#00FF00", { "innerText": "已选择" }, dCard);
					Left += LeftAdd, ++LineNum; // 偏移下一个卡片的位置
					if (LineNum % LineMax == 0) LineNum = 0, Left = NormalLeft, Top += TopAdd; // 如果超过，则下一个就换行
				}

				// 接下来是默认选卡
				NormalList = ChooseZombiesData.NormalList[IZMode];
				for (var _ in ZChoose) ZChoose[_] = 0;
				if (NormalList) for (var _ in NormalList) SelectZombieCard(ZidMap[NormalList[_].prototype.EName], true);
			}
		}, 
		DeleteExtraData: function (Obj) { // 用于删除关卡特殊属性中不必要的对象，达到化简字符串的效果
			if (JSON.stringify(Obj.ChosenZombie) == "{}") delete Obj.ChosenZombie; // 没有改变僵尸
			if (Obj.SetLine == Obj._MaxPLine) delete Obj.SetLine;
			delete Obj._MaxPLine; // 删除内部数据
			return Obj;
		}, 
		ObjectEncode: function (Obj) { // 加密对象，只允许有ASCII码，且不允许出现 "#"
			var StringData = JSON.stringify(Obj), ret = ""; // 加密对象
			if (StringData == "{}") return "";
			for (var i = 0; i < StringData.length - 1; i += 2) ret += String.fromCharCode(20000 + StringData.charCodeAt(i) * 128 + StringData.charCodeAt(i + 1));
			if (StringData.length % 2 == 1) ret += String.fromCharCode(20000 + StringData.charCodeAt(StringData.length - 1) * 128);
			return "_" + ret + "_";
		}
	};

	// 根据不同模式开始不同关卡

	$SEql(IZMode, { // 每个阶段函数
		"ChoseMode": function () { // 选择模式
			oS.Init($FJ(oSys, {
				PicArr: [], 
				LoadAccess: function () {
					!oS.LvlVar ? (oS.LvlVar = { ScrollScreen: oS.ScrollScreen }) : (oS.LvlVar.ScrollScreen = oS.ScrollScreen); // 关卡数据

					NewEle("dChoosePanel", "div", "display:block;position:absolute;left:0px;top:0px", 0, EDAll, {"class":"Almanac_ZombieBack"});
					NewEle("dChooseTitle", "div", "position:relative;text-align:center;line-height:88px;height:88px;width:100%;font-size:30px;font-weight:bold;font-family:黑体;color:#fff", { innerHTML: "选 择 模 式" }, $("dChoosePanel"), {"class":"dRiddleTitle"});

					NewEle("dBack", "div", "position:absolute;width:89px;height:26px;top:564px;left:700px;background-position:center top;background:url(images/interface/Almanac_CloseButton.png);cursor:pointer;text-align:center;line-height:26px;color:#000080;font-size:12px;", { onmouseover: function () { this.style.backgroundPosition='bottom'; }, onmouseout: function () { this.style.backgroundPosition='top'; }, onclick: function () { Return_Block(); }, innerText: "返 回" }, EDAll, {"class": "button"});

					NewEle("dGrassDiv", "div", "left:100px;top:100px;background-image:url(images/interface/background2.jpg);display:block;position:absolute;z-index:100;cursor:pointer;background-position:-25px,0px;background-size:324px,139px;background-repeat:no-repeat;width:275px;height:139px;border:5px solid rgba(255,255,255,0.5);border-radius:15px;background-clip:padding-box;", { onclick: function () { Change_Level("NGrass"); } }, EDAll);
					NewEle("dGrassTXT", "div", "text-align:center;line-height:60px;font-size:30px;font-weight:bold;font-family:黑体;color:#fff;position:relative;top:15px;", { innerHTML: "黑夜草地<br><font style=\"font-size:20px\">点此选择该模式</font>" }, $("dGrassDiv"));

					NewEle("dPoolDiv", "div", "left:100px;top:250px;background-image:url(images/interface/background4.jpg);display:block;position:absolute;z-index:100;cursor:pointer;background-position:-25px,0px;background-size:324px,139px;background-repeat:no-repeat;width:275px;height:139px;border:5px solid rgba(255,255,255,0.5);border-radius:15px;background-clip:padding-box;", { onclick: function () { Change_Level("NPool"); } }, EDAll);
					NewEle("dPoolTXT", "div", "text-align:center;line-height:60px;font-size:30px;font-weight:bold;font-family:黑体;color:#fff;position:relative;top:15px;", { innerHTML: "黑夜泳池<br><font style=\"font-size:20px\">点此选择该模式</font>" }, $("dPoolDiv"));

					NewEle("dReversalDiv", "div", "left:100px;top:400px;background-image:url(images/interface/background9.jpg);display:block;position:absolute;z-index:100;cursor:pointer;background-position:-25px,0px;background-size:324px,139px;background-repeat:no-repeat;width:275px;height:139px;border:5px solid rgba(255,255,255,0.5);border-radius:15px;background-clip:padding-box;", { onclick: function () { Change_Level("DReversal"); } }, EDAll);
					NewEle("dReversalTXT", "div", "text-align:center;line-height:60px;font-size:30px;font-weight:bold;font-family:黑体;color:#000;position:relative;top:15px;", { innerHTML: "水路反转<br><font style=\"font-size:20px\">点此选择该模式</font>" }, $("dReversalDiv"));

					NewEle("NGrassDoubleDiv", "div", "left:500px;top:100px;background-image:url(images/interface/background8.jpg);display:block;position:absolute;z-index:100;cursor:pointer;background-position:-25px,0px;background-size:324px,139px;background-repeat:no-repeat;width:275px;height:139px;border:5px solid rgba(255,255,255,0.5);border-radius:15px;background-clip:padding-box;", { onclick: function () { Change_Level("NGrassDouble"); } }, EDAll);
					NewEle("NGrassDoubleTXT", "div", "text-align:center;line-height:60px;font-size:30px;font-weight:bold;font-family:黑体;color:#fff;position:relative;top:15px;", { innerHTML: "黑夜六行草地<br><font style=\"font-size:20px\">点此选择该模式</font>" }, $("NGrassDoubleDiv"));

					SetVisible($("dMenu")); // 显示菜单按钮
				}, 
				LvlClearFunc: function () { oS.ScrollScreen = oS.LvlVar.ScrollScreen; delete oS.LvlVar.ScrollScreen; }
			}), $FJ(oPlt, {}), $FJ(oWin, {
				Return_Block: function () {
					SelectModal(0), HiddenOptions(); SetBlock($("dSurface"), $("iSurfaceBackground")); ShowRiddleGame();
				}
			}));
		}, 
		"NGrass": function () { // 黑夜草地 NGrass
			oS.Init($FJ(oSys, { MapKind: "0" }), $FJ(oPlt, {}), $FJ(oWin, {}));
		}, 
		"NPool": function () { // 黑夜泳池 NPool
			oS.Init($FJ(oSys, {
				MapKind: "1", 
				// PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oScaredyShroom, oLilyPad, oSquash, oThreepeater, oTangleKelp, oSpikeweed, oTorchwood, oTallNut, oSeaShroom, oCactus, oSplitPea, oStarfruit, oGarlic], 
				PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oHypnoShroom, oScaredyShroom, oLilyPad, oSquash, oThreepeater, oTangleKelp, oSpikeweed, oTorchwood, oTallNut, oSeaShroom, oCactus, oSplitPea, oStarfruit, oPumpkinHead, oFlowerPot, oGarlic, oGatlingPea, oGloomShroom, oSpikerock, oRepeater2], 
				Coord: 2, LF: [0, 1, 1, 2, 2, 1, 1], // 泳池样式
				PicArr: ["images/interface/background4.jpg", "images/interface/trophy.png"], 
				backgroundImage: "images/interface/background4.jpg", 
				LevelName: "我是僵尸对战版创建模式-黑夜泳池", 
				BrainsNum: 6, ArP: { ArC: [1, 4], ArR: [1, 6] }
			}), $FJ(oPlt, {}), $FJ(oWin, {}));
		}, 
		"DReversal": function () { // 水路反转 DReversal
			oS.Init($FJ(oSys, {
				MapKind: "2", 
				// PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oScaredyShroom, oLilyPad, oSquash, oThreepeater, oTangleKelp, oSpikeweed, oTorchwood, oTallNut, oSeaShroom, oCactus, oSplitPea, oStarfruit, oGarlic], 
				PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oHypnoShroom, oScaredyShroom, oLilyPad, oSquash, oThreepeater, oTangleKelp, oSpikeweed, oTorchwood, oTallNut, oSeaShroom, oCactus, oSplitPea, oStarfruit, oPumpkinHead, oFlowerPot, oGarlic, oGatlingPea, oGloomShroom, oSpikerock, oRepeater2], 
				Coord: 2, LF: [0, 2, 2, 1, 1, 2, 2], // 泳池样式
				PicArr: ["images/interface/background9.jpg", "images/interface/trophy.png"], 
				backgroundImage: "images/interface/background9.jpg", 
				LevelName: "我是僵尸对战版创建模式-水路反转", 
				BrainsNum: 6, ArP: { ArC: [1, 4], ArR: [1, 6] }
			}), $FJ(oPlt, {}), $FJ(oWin, {}));
		}, 
		"NGrassDouble": function () { // 黑夜六行草地 NGrassDouble
			oS.Init($FJ(oSys, {
				MapKind: "3", 
				// PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oScaredyShroom, oSquash, oThreepeater, oSpikeweed, oTorchwood, oTallNut, oCactus, oSplitPea, oStarfruit, oGarlic], 
				PName: [oPeashooter, oSunFlower, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oFumeShroom, oHypnoShroom, oScaredyShroom, oSquash, oThreepeater, oSpikeweed, oTorchwood, oTallNut, oCactus, oSplitPea, oStarfruit, oPumpkinHead, oFlowerPot, oGarlic, oGatlingPea, oGloomShroom, oSpikerock, oRepeater2], 
				Coord: 2, LF: [0, 1, 1, 1, 1, 1, 1], // 泳池样式
				PicArr: ["images/interface/background8.jpg", "images/interface/trophy.png"], 
				backgroundImage: "images/interface/background8.jpg", 
				LevelName: "我是僵尸对战版创建模式-黑夜六行草地", 
				BrainsNum: 6, ArP: { ArC: [1, 4], ArR: [1, 6] }
			}), $FJ(oPlt, {}), $FJ(oWin, {}));
		}, 
		"default": function () { // 未知模式
			oS.Init({ LvlClearFunc: oSys.LvlClearFunc }, {}, {}); SelectModal(0);
		}
	})();
})();