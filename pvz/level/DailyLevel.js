// 每日关卡，总算兼容了 IE
(function(Seed, IsTrue) {
	var __NOW_DATE__ = new Date(), __Today_Date__ = __NOW_DATE__.toLocaleDateString();
	var OWEA = (function(){
			var res = window['MD5'] || window['btoa'] || (function (str) { return str.toString(); });
			return res;
		})();

	var ReadSeed, UsedSeed; // 特判是否是首次
	if(!IsTrue) ReadSeed = prompt("是否使用特定种子？若是请输入，若不是请点取消"), UsedSeed = (ReadSeed != null) ? (ReadSeed) : (__Today_Date__);
	else ReadSeed = UsedSeed = Seed;

	Math.imul = Math.imul || function(a, b) { // 函数补丁
	  var ah = (a >>> 16) & 0xffff;
	  var al = a & 0xffff;
	  var bh = (b >>> 16) & 0xffff;
	  var bl = b & 0xffff;
	  // the shift by 0 fixes the sign on the high part
	  // the final |0 converts the unsigned value into a signed value
	  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
	};

	var MurmurHash3 = function(string) {
		let i = 0, hash;
		for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
			let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
			hash = Math.imul(bitwise_xor_from_character, 3432918353);
			hash = hash << 13 | hash >>> 19;
		} return function () {
		   // Return the hash that you can use as a seed
			hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
			hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
			return (hash ^= hash >>> 16) >>> 0;
		}
	};
	var Mulberry32 = function(string) {
		return function () {
			let for_bit32_mul = string += 0x6D2B79F5;
			let cast32_one = for_bit32_mul ^ for_bit32_mul >>> 15;
			let cast32_two = for_bit32_mul | 1;
			for_bit32_mul = Math.imul(cast32_one, cast32_two);
			for_bit32_mul ^= for_bit32_mul + Math.imul(for_bit32_mul ^ for_bit32_mul >>> 7, for_bit32_mul | 61);
			return ((for_bit32_mul ^ for_bit32_mul >>> 14) >>> 0) / 4294967296;
		}
	};
	var Generate_Seed = MurmurHash3(OWEA(UsedSeed)), Seed_Random = Mulberry32(Generate_Seed());


	//均匀填充函数
	var $Smooth_Fill = function (l, r, B, E, Arr, f) { //均匀填充
		var a = (E - B) / (r - l); f = f || parseInt;
		for (; l <= r; l++, B += a) Arr[l] = f(B);
		return Arr;
	};
	var $Set_Top = function (l, r, B, E, T, Arr) { //寻极点，均匀填充
		if (T <= 0 || l >= r) return Arr = $Smooth_Fill(l, r, B, E, Arr, Math.round);
		var A = [], S = [l], LastF = B, ThisF;
		for (var i = l + 1; i <= r - 1; i++) A[A.length] = i;
		A.sort(function () { return Seed_Random() - 0.5; });
		for (var i = 0; i <= r - l - 2 && T > 0; i++, T--) S[S.length] = A[i]; //随机选择断点
		S.sort(function (a, b) {return a - b;}); //选择断点
		for (var i = 1; i < S.length; i++) ThisF = Math.max((E - B) * (2 * (Seed_Random() - 0.25)) + B, B / 2), Arr = $Smooth_Fill(S[i - 1], S[i] - 1, LastF, ThisF, Arr, Math.round), LastF = ThisF; //连接
		Arr = $Smooth_Fill(S[S.length - 1], r, LastF, E, Arr, Math.round); //连接最后一个点
		// console.log(S, A, Arr);
		return Arr;
	};



	//选项图书馆
	var Level_library = {
		AllPlantsCard: [oPeashooter, oSunFlower, oCherryBomb, oWallNut, oPotatoMine, oSnowPea, oChomper, oRepeater, oPuffShroom, oSunShroom, oFumeShroom, oGraveBuster, oHypnoShroom, oScaredyShroom, oIceShroom, oDoomShroom, oLilyPad, oSquash, oThreepeater, oTangleKelp, oJalapeno, oSpikeweed, oTorchwood, oTallNut, oSeaShroom, oPlantern, oCactus, oBlover, oSplitPea, oStarfruit, oPumpkinHead, oFlowerPot, oCoffeeBean, oGarlic, oGatlingPea, oGloomShroom, oTwinSunflower, oSpikerock],
		//oSmallZombie, oSmallConeheadZombie, oSmallFootballZombie
		AllZombiesCard_LD: [oZombie, oZombie2, oZombie3, oConeheadZombie, oPoleVaultingZombie, oBucketheadZombie, oNewspaperZombie, oScreenDoorZombie, oFootballZombie, oDancingZombie, oZomboni, oImp, oJackinTheBoxZombie, oBalloonZombie],
		//oSmallSnorkelZombie, oSmallDuckyTubeZombie1
		AllZombiesCard_WATER: [oDuckyTubeZombie1, oDuckyTubeZombie2, oDuckyTubeZombie3, oSnorkelZombie, oDolphinRiderZombie],
		MustZombies: [oFlagZombie, oBackupDancer],
		MapKind: [0, 1, 1, 2, 2, 2, 1, 2, 2],
		MapCName: ["", "白天庭院", "黑夜庭院", "白天泳池", "黑夜泳池", "水路反转", "贫瘠之地", "白天六路草地", "黑夜六路草地"],
		MAPLINE_TYPE_LF: [null, 0, 0, 1, 1, 2, 3, 4, 4],
		MapLF_Hard_Base: [1.4, 0.8, 0.6, 1.7, 1.5],
		MapLine_LF: { //植物陆地属性
			0: [0, 1, 1, 1, 1, 1],
			1: [0, 1, 1, 2, 2, 1, 1],
			2: [0, 2, 2, 1, 1, 2, 2],
			3: [0, 0, 1, 1, 1, 0], 
			4: [0, 1, 1, 1, 1, 1, 1]
		},
		MAPLINE_TYPE_ZF: [null, 0, 0, 1, 1, 2, 0, 3, 3],
		MapLine_ZF: { //僵尸可出怪的陆地属性
			0: [0, 1, 1, 1, 1, 1],
			1: [0, 1, 1, 2, 2, 1, 1],
			2: [0, 2, 2, 1, 1, 2, 2],
			3: [0, 1, 1, 1, 1, 1, 1]
		},
		MAIN_BG_IMG: "images/interface/background",
		MAIN_BG_SUF: ".jpg",
		BG_Img: [null, "1", "2", "3", "4", "9", "1unsodded2", "7", "8"],
		BGM: [null, "UraniwaNi", "Ultimate battle", "Kitanai Sekai", "Loonboon", "Kitanai Sekai", "Watery Graves", "Kitanai Sekai", "Loonboon"],
		DKind: [null, 1, 0, 1, 0, 1, 1, 1, 0],
		Can_Tombstone: {2: true}, //是否有墓碑、迷雾
		CanHaveFog: [0, 0, 0, 0, 1, 0, 0, 0, 0],
		Dif_Sun: [0, 50, 50, 50, 50, 50, 75, 100, 150, 200, 250],

		Map_Hard_Base: { //难度倍率，对应状态
			MapLF: [1.2, 0.75, 0.7, 1.3, 1.3],
			Can_Tombstone: {2: 1.15},
			DKind: 0.85,
			HaveFog: 1.1
		},
		AZDif_Y: function (x) { return Math.pow(x, 1.375);}, // x * Math.sqrt(x) || 1; x ^ 1.5 = x * √x
		GetShowDif: function (Dif, Data, self){
			self = self || this, Dif *= self["Map_Hard_Base"]["MapLF"][Data.LFType];
			Dif *= Data.MAZ_OneSun; //1~3倍，难度升级
			(Data.Can_Tombstone) && (Dif *= self["Map_Hard_Base"]["Can_Tombstone"][Data.MapType]);
			(Data.DKind) && (Dif *= self["Map_Hard_Base"]["DKind"]);
			(Data.CanHaveFog) && (Dif *= self["Map_Hard_Base"]["HaveFog"][Data.LFType]);
			return (Dif.toFixed) ? (Dif.toFixed(2)) : (Dif);
		},
		Set_Diff: function(ret, Lib){
			Lib = Lib || this;
			ret.MF_Difficulty = (Seed_Random() * 10 + 1); //整体难度
			ret.MIDifficulty = Math.floor(ret.MF_Difficulty); //整体难度-整数
			ret.MAZ_Difficulty = Lib.AZDif_Y(ret.MF_Difficulty); //AZ出怪攻击难度
			ret.MAZ_OneSun = Seed_Random() * (4 - 1) + 1; //个体攻击单位，1肉体2皮制3铁质
			ret.MShow_Difficulty = Lib.GetShowDif(ret.MF_Difficulty, ret); //综合评估难度
			ret.MShow_AZ_Difficulty = 1; //出怪评估难度
			(Lib.CanHaveFog[ret.MapType]) && (ret.Fog = Math.min(10, Math.floor(3 + Seed_Random() * ret.MIDifficulty))); //雾
			return ret;
		}
	};

	var LevelData = (function(){
		//白天 黑夜 泳池 黑夜泳池 水路反转
		var ret = {}, MapType = Math.floor(Seed_Random() * 8 + 1), Lib = Level_library;
		//地图基础属性
		ret.MapType = MapType;
		ret.MapKind = Lib.MapKind[MapType], ret.MapCName = Lib.MapCName[MapType];
		//LF:植物地图属性，ZF:僵尸出怪属性
		ret.LFType = Lib.MAPLINE_TYPE_LF[MapType], ret.LF = Lib.MapLine_LF[ret.LFType];
		ret.ZFType = Lib.MAPLINE_TYPE_ZF[MapType], ret.ZF = Lib.MapLine_ZF[ret.ZFType];
		//音乐与背景确认
		ret.BG_Img = Lib.MAIN_BG_IMG + Lib.BG_Img[MapType] + Lib.MAIN_BG_SUF;
		ret.BGM = Lib.BGM[MapType], ret.DKind = Lib.DKind[MapType];
		//确认游戏基本数据，比如波数、难度与墓碑
		ret.FlagNum = Math.floor(Seed_Random() * 4 + 1) * 10; //波数

		Lib.Set_Diff(ret); //主要难度、出怪难度

		ret.Can_Tombstone = !!Lib.Can_Tombstone[MapType];
		ret.Card = Lib.AllPlantsCard, ret.Zombies = [Lib.AllZombiesCard_LD, Lib.AllZombiesCard_WATER, Lib.MustZombies];
		ret.SunNum = 25 + 25 * ret.MIDifficulty;
		return ret;
	})();



	var oGame = {}, oPlant = {};
	var Card_Chose = function (dif, Data, S) { return Data.Card; }; //暂时不限制卡片
	var $Find = function (Arr, f) {
		var ret = -1, q = Arr.length - 1;
		for (var i = q; i >= 0; --i) if (f(Arr[i])) ret = i;
		return ret;
	};

	var Zombie_Chose = function (dif, Data, S) { //处理出现的僵尸
		//所有能出现的僵尸
		var is_water = $Find(Data.ZF, function (n) {return n == 2}) != -1, LvlWeight = 0, CanChose = [], Chose = [], _ = 0;
		for(i = 0; i < Data.Zombies[0].length; i++) LvlWeight += Data.Zombies[0][i].prototype.Lvl, CanChose.push(Data.Zombies[0][i]);
		for(i = 0; is_water && i < Data.Zombies[1].length; i++) LvlWeight += Data.Zombies[1][i].prototype.Lvl, CanChose.push(Data.Zombies[1][i]);


		//出怪占比最小值：(x^1.5)% 最大值：(1.25(0.75𝑥)^2+50)%
		var ChoseMin = Math.pow(Data.MF_Difficulty, 1.5), ChoseMax = 1.25 * Math.pow(0.75 * Data.MF_Difficulty, 2) + 50, ChoseWeight = parseInt(LvlWeight * (Seed_Random() * (ChoseMax - ChoseMin) + ChoseMin) / 100); //百分比
		Data.MShow_AZ_Difficulty = 0.5 + ChoseWeight / LvlWeight; //出怪难度


		CanChose.sort(function (t, l) {return Seed_Random() - 0.5;}), S.AllZombieLvl = LvlWeight; //随机排序

		for(var i = CanChose.length - 1, d = 0; i >= 0; i--){ //选择可以选择的
			if(ChoseWeight - (d = CanChose[i].prototype.Lvl) >= 0) Chose.push(CanChose[i]), ChoseWeight -= d, CanChose.splice(i, 1);
			else break;
		}
		CanChose.sort(function (t, l) {return t.prototype.Lvl - l.prototype.Lvl;}); //如果有剩下的，按照lvl排序
		while(ChoseWeight >= 0 && CanChose.length) Chose.push(CanChose[0]), ChoseWeight -= CanChose[0].prototype.Lvl, CanChose.splice(0, 1); //选择

		return Chose;
	};

	//函数级增长，10波为一阶段

	var Summon_Flag = function (dif, Data, S, P) { //生成波数
		P.AZ = [], P.FlagToSumNum = {a1: [], a2: []};

		//计算预计难度、倍率等
		var BigFlagNum = parseInt(Data.FlagNum / 10), MinFlagDouble = 1.25, FlagDouble = Math.pow(BigFlagNum / 10, 1.125) + MinFlagDouble;
		var MaxHard = Data.MAZ_OneSun * Data.MAZ_Difficulty * FlagDouble, MinHard = Data.MAZ_OneSun * Data.MAZ_Difficulty * MinFlagDouble;
		var OHard = Seed_Random() * ((MaxHard + 1) - MinHard) + MinHard, WF = 10, j = 0;

		//确定每十波的僵尸目标
		var Task_Every_BigWave = (function(){ //平均，再不平均分配
			var ret = [], MinAdd = OHard / BigFlagNum / FlagDouble, MaxAdd = OHard / BigFlagNum, j = 0; //最高增加与最低增加
			for (var i = 0; i < BigFlagNum - 1; ++i) j += (MaxAdd - MinAdd) * Seed_Random() + MinAdd, ret[i] = parseInt(j);
			ret[ret.length] = parseInt(OHard); //最后一个必然是目标值
			return ret;
		})();

		//生成波数
		P.FlagToSumNum.a2[0] = Math.round(Data.MAZ_OneSun); //第二波之前的
		for (var i = 0; i < Data.FlagNum; i += WF, j++) { //10为一波
			P.FlagToSumNum.a1 = $Smooth_Fill(i, i + WF - 1, i, i + WF - 1, P.FlagToSumNum.a1, parseInt); //填充这十波波数
			P.FlagToSumNum.a2 = $Set_Top(i + 1, i + WF - 1, P.FlagToSumNum.a2[i], Task_Every_BigWave[j], Math.floor(Data.MAZ_OneSun * Seed_Random()), P.FlagToSumNum.a2); //填充出怪
			P.FlagToSumNum.a2[i + WF] = Task_Every_BigWave[j];
		};
		for (var i = 0; i < BigFlagNum; i++) P.FlagToSumNum.a2[WF * (i + 1)] = parseInt(Task_Every_BigWave[i] * Math.sqrt(Data.MAZ_OneSun)); //大波
		for (var i = 1; i < P.FlagToSumNum.a2.length; i++) Data.MShow_AZ_Difficulty += (P.FlagToSumNum.a2[i] / i / Data.MAZ_OneSun); //评估难度
		// console.log(top.Data = Data, FlagDouble, MaxHard, MinHard, Task_Every_BigWave, P.FlagToSumNum, Data.MShow_AZ_Difficulty);


		//生成僵尸预览数量、必须出现的波数、最早出现的波数。
		S.ZName.sort(function (t, l) {return Seed_Random() - 0.5;});
		for(var i = 0, nxtfir = 1, len = S.ZName.length, Est = P.FlagNum / len * Math.max(1, Seed_Random() + 0.5); i < len; i++){ //争取在波数一半~结束时怪出完
			var d = S.ZName[i], p = d.prototype, view = 1, first = 1, must = []; //id，预览，首次，必须
			view = Math.ceil(p.Lvl * (0.5 + Seed_Random())), first = Math.floor(nxtfir), nxtfir = Math.min(P.FlagNum, nxtfir + Math.max(Est / 2, Est * Seed_Random())); //计算下次出现的波数

			Data.MShow_AZ_Difficulty += ((p.OrnHP + p.HP) / 100 * p.Lvl) * (1 / (first / P.FlagNum)) / Data.MAZ_OneSun;

			for(var j = first, num = 0; j <= P.FlagNum; j++, num = 0){
				while(Math.floor(Seed_Random() * 100 * (1 / Data.MF_Difficulty)) == 0 && num < Data.MIDifficulty * 2) must.push(j), num++;
			};
			for(var j = 1, num = 0; j <= BigFlagNum; j++, num = 0){
				while(Math.floor(Seed_Random() * BigFlagNum * 2) == 0 && num < Data.MIDifficulty) must.push(j * 10), num++;
			};
			P.AZ.push([d, view, first, must]);
		}

		//最后处理剩余僵尸、僵尸列表
		S.ZName.sort(function (t, l) {return t.prototype.Lvl - l.prototype.Lvl;}), Data.CanTom = [], Data.CanWat = [];
		for(var i = 0; i < Data.Zombies[1].length; i++) Data.CanWat[Data.Zombies[1][i].prototype.EName] = true;
		for(var i = 0; i < S.ZName.length; i++) Data.CanTom.push(S.ZName[i]);
		for(var i = 0; i < Data.Zombies[2].length; i++) S.ZName.push(Data.Zombies[2][i]);
		for(var i = 0; i < S.ZName.length; i++) (Data.CanWat[S.ZName[i].prototype.EName]) && (Data.CanWat.push(S.ZName[i]));

		S.UserDefinedFlagFunc = (function(dif, Data, S, P) { //墓碑、水怪
			return (function(a) {
				if(oP.FlagZombies % 10 == 0){
					if(Data.Can_Tombstone){
						try{AppearTombstones(6, 9, Math.ceil(Data.MIDifficulty / 3));}catch(e){};
					}
				};
				if(oP.FlagZombies == oP.FlagNum){
					(Data.MapKind == 2) && (oP.SetTimeoutWaterZombie(5, 9, Data.MIDifficulty, Data.CanWat));
					if (Data.Can_Tombstone) try{oP.SetTimeoutTomZombie(LevelData.CanTom)}catch(e){};
				};
			});
		})(dif, Data, S, P);
	};


	var Hard_Summon = function (dif, Data, S, P) {
		S.PName = Card_Chose(dif, Data, S);
		S.ZName = Zombie_Chose(dif, Data, S);
		Summon_Flag(dif, Data, S, P);
	};

	var Sunnum_Level = function (Data, S, P) {
		var dif = Data.MF_Difficulty, Mapkind = Data.MapKind, MapType = Data.MapType, FlagNum = Data.FlagNum;
		S.SunNum = Data.SunNum;
		S.PicArr = [Data.BG_Img, "images/interface/trophy.png","images/interface/PointerDown.gif"];
		S.Coord = Data.MapKind, S.backgroundImage = Data.BG_Img, S.StartGameMusic = Data.BGM;
		S.LF = Data.LF, S.ZF = Data.ZF, S.DKind = Data.DKind;
		P.FlagNum = Data.FlagNum, S.CanSelectCard = 1;
		S.LargeWaveFlag = {}, P.FlagToMonitor = {};
		for(var i = 10, j = parseInt(Data.FlagNum / 10); i <= Data.FlagNum; i += 10, j--){
			var flagfuc = (i == Data.FlagNum) ? ShowFinalWave : ShowLargeWave;
			S.LargeWaveFlag[i] = $("imgFlag" + j);
			P.FlagToMonitor[i - 1] = [flagfuc, 0];
		};
		S.HaveFog = Data.Fog;

		Hard_Summon(dif, Data, S, P);

		S.MShow_AZ_Difficulty = Data.MShow_AZ_Difficulty.toFixed(2);//修复位数
		S.LevelName = '每日关卡（' + Data.MapCName + ' 评估难度: ' + Data.MIDifficulty + '×' + Data.MShow_Difficulty + '×' + S.MShow_AZ_Difficulty + '）', S.LvlEName = "DailyLevel";
	};


	Sunnum_Level(LevelData, oGame, oPlant);


	if (LevelData.MIDifficulty * Number(LevelData.MShow_Difficulty) * Number(oGame.MShow_AZ_Difficulty) >= 32768) {
		if(!IsTrue) IsTrue = confirm("本关难度预计较大，是否重新生成？")
		if(IsTrue) return arguments.callee(OWEA(UsedSeed) + Seed_Random(), IsTrue);
	};


	oS.Init({
		PName: oGame.PName,
		ZName: oGame.ZName,
		PicArr: oGame.PicArr,
		Coord: oGame.Coord,
		LF: oGame.LF,
		ZF: oGame.ZF,
		SunNum: oGame.SunNum,
		LvlEName: oGame.LvlEName,
		LevelName: oGame.LevelName,
		CanSelectCard: oGame.CanSelectCard,
		StartGameMusic: oGame.StartGameMusic,
		backgroundImage: oGame.backgroundImage,
		DKind: oGame.DKind,
		HaveFog: oGame.HaveFog,
		LargeWaveFlag: oGame.LargeWaveFlag,
		UserDefinedFlagFunc: oGame.UserDefinedFlagFunc,
		InitLawnMower : function() {
			var R = oGd.$LF.length - 1;
			for(var i = 1; i <= R; i++){
				CustomSpecial((oGd.$LF[i] == 2) ? oPoolCleaner : oLawnCleaner, i, -1);
			}
		}
	}, {
		AZ: oPlant.AZ,
		FlagNum: oPlant.FlagNum,
		FlagToSumNum: oPlant.FlagToSumNum,
		FlagToMonitor: oPlant.FlagToMonitor,
		FlagToEnd: function() {
			NewImg("imgSF", "images/interface/trophy.png", "left:43.5%;top:220px", EDAll, {
				onclick: function() {
					SelectModal(0);
					PlayAudio("winmusic");
				}
			});
			NewImg("PointerUD", "images/interface/PointerDown.gif", "top:185px;left:51%", EDAll)
		}
	},{
		__NOW_DATE__: __NOW_DATE__,
		__Today_Date__: __Today_Date__,
		OWEA: OWEA,
		MurmurHash3: MurmurHash3,
		Mulberry32: Mulberry32,
		Generate_Seed: Generate_Seed,
		Seed_Random: Seed_Random,
		Hard_Summon: Hard_Summon,
		Sunnum_Level: Sunnum_Level,
		Level_library: Level_library,
		LevelData: LevelData,
		oGame: oGame,
		oPlant: oPlant,
		Card_Chose: Card_Chose,
		Zombie_Chose: Zombie_Chose,
		Summon_Flag: Summon_Flag
	});
})();