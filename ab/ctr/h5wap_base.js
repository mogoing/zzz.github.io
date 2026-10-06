//用户操作类
var H5LoginUserOpt = {
    initFlag:false,
    userinfo:{},
    checkInit:function(){return this.initFlag},
    successCallback:function(userinfo){},
    errorCallback:function(data){},
    init:function(func){
        var _this = this;
        func = typeof func != 'function'?function(msg){}:func;
        if(this.checkH5Login(true)){
            _this.getSign(function(data){
                _this.initFlag = true;
                if(data.code===10000){
                    var msg = _this.getH5UserInfo();
                    _this.userinfo = msg;
                    _this.userinfo['sign'] = data.sign;
                    _this.userinfo['userurl'] = "uid="+msg['userId']+"&access_token="+msg['accessToken']+"&clientid="+msg['clientId'];
                    func.call(_this,data);
                    typeof _this.successCallback=='function' && _this.successCallback(_this.userinfo);
                }else{
                    typeof _this.errorCallback=='function' && _this.errorCallback(data);
                }
            })
        }else{
            typeof _this.errorCallback=='function' && _this.errorCallback({code:0});
        }
    },
    checkH5Login: function (hide_login){
        if(!Html5Model.USER.isLogin()){
            if(!hide_login){
                Html5Model.USER.login();
            }
            return false;
        }
        return true;
    },getH5UserInfo:function(){
        return Html5Model.USER.getUserInfo();
    },getSign:function(func){
        func = typeof func != 'function'?function(){}:func;
        Html5Model.USER.getSign(func);
    },edituser:function (){
        if(!this.checkH5Login()){return false;}
        return Html5Model.USER.openUserEdit(H5WapTools.check4399Client()?0:1);
    },realnameuser:function(){
        if(!this.checkH5Login()){return false;}
        return Html5Model.USER.openRealName(H5WapTools.check4399Client()?0:1);
    }
}

var H5Api = {
    message:function(url_param,callback){
        callback = callback || function(data){}
        $.ajax({
            url:'//pl.4399.com/h5/messages/interface.php?'+url_param+'&timestamp='+new Date().getTime(),
            dataType:"jsonp",
            jsonp : 'callback',
            callbackParameter:"jsoncallback",
            timeout:5000,  
            scriptCharset:"utf-8",
            success:function(data){
                callback(data)
            }
        });
    }
}

var H5Dialog = {
    init_flag:false,
    init:function(){
        if(this.init_flag){return true};
        $("head").append('<link rel="stylesheet" href="/css/2023/limitdialog.css" />');
        var html =[];
        html.push('<div class="md-dialog-baidutips-wrap" id="dia_comment">');
        html.push('    <div class="md-dialog-baidu">');
        html.push('        <div class="md-dialog-bd-tit" id="dia_comment_title">温馨提示</div>');
        html.push('        <div class="md-dialog-bd-content" id="dia_comment_info"></div>');
        html.push('        <div class="md-dialog-bdbtns">');
        html.push('            <a href="" class="md-bdcancle-btn" id="dia_comment_btn2">取消</a>');
        html.push('            <a href="" class="md-bdsure-btn" id="dia_comment_btn1">确定</a>');
        html.push('        </div>');
        html.push('    </div>');
        html.push('</div>');
        $("body").append(html.join(""));
        this.init_flag = true;
    },alert:function(info,btn1_func,btn2_func,btn1_val,btn2_val,title){
        var _this = this;
        _this.init();
        if(typeof btn1_func !='function'){
            btn1_func = function(){return false;}
        }
        title = title || "温馨提示";
        btn1_val = btn1_val || "确定";
        btn2_val = btn2_val || "取消";
        if(typeof btn2_func !='function'){
            btn2_func = function(){$("#dia_comment").hide();return false;}
        }
        $("#dia_comment_title").html(title);
        $("#dia_comment_info").html(info);
        $("#dia_comment_btn1").html(btn1_val).unbind("click").bind("click",function(){_this.cancel();btn1_func();return false;});
        $("#dia_comment_btn2").html(btn2_val).unbind("click").bind("click",function(){_this.cancel();btn2_func();return false;});
        $("#dia_comment").css("display","block");
    },cancel:function(){$("#dia_comment").hide();}
}