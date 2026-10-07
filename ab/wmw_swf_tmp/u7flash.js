/**
 * Created by lulu on 2017/2/22.
 */
/*!
 * Nokersang
 */




/****** jQuery插件部分开始 ******/

(function($){

    /*
     * noker_labelChange插件方法说明：
     * 示例：$("??").noker_labelChange({s:$("??"),a:"mouseover",c:"active",b:2});
     * 参数：s=用于标签切换时对应显示出来的JQ对象组，必写
     * 参数：a=切换方式，仅允许"mouseover"和"click"，默认为"mouseover"
     * 参数：c=激活标签所具备的class样式名，默认为"mouseover"
     * 参数：b=默认激活标签的索引值，可不写
     * 注意本插件需要联合HTML及CSS一同实现效果
     */
    $.fn.noker_labelChange=function(o){
        var t=this;
        var d={s:null,a:"mouseover",c:"active",b:0};
        var o=$.extend(d,o);
        if(!o.s||o.s.length!=t.length){
            //alert("Tags correspondence does not hold, check!");
        }else{
            o.s.hide().eq(o.b%t.length).show();
            t.eq(o.b%t.length).addClass(o.c);
            t.bind(o.a,function(){
                o.s.hide().eq(t.removeClass(o.c).index($(this).addClass(o.c))).show();
                return false;
            });
        }
        return this;
    };

})(jQuery);

/****** JavaScript函数部分开始 ******/

<!-- 页面头部 -->
var search_temp_str="";
var search_temp_timer=null;

//自动完成探测及处理
function auto_complete_check(word){
    if(word.length){
        $.get("/flash/autocomplete?q="+encodeURI(word),function(data){
            if(data.gameinfo.length){
                var temp_str="";
                $.each(data.gameinfo,function(i,n){
                    temp_str+="<a href=\""+n[5]+"\"><img src=\""+n[4]+"\">"+n[0]+"<br /><span>"+n[1]+" - "+n[2]+" &nbsp; "+n[3]+"</span></a>";
                });
                $("#web_header .header_search_auto_box").html(temp_str).show().find("a").unbind().hover(function(){
                    $(this).addClass("hover");
                },function(){
                    $(this).removeClass("hover");
                });
            }else{
                $("#web_header .header_search_auto_box").hide();
            }
        },"json");
    }else{
        $("#web_header .header_search_auto_box").hide();
    }
};

//搜索字符串检查
function check_search_key(){
    if($("#web_header .header_no_active").length==1){alert("请输入搜索关键字！");$("#web_header .header_search_key").focus();return false;}
    if($("#web_header .header_search_key").val().length>0){return true;}else{alert("请输入搜索关键字！");$("#web_header .header_search_key").focus();return false;}
}

//前往搜索页
function go_search_page(){
    location="/flash/search/"+encodeURI($("#web_header .header_search_key").val());
}

//登录条初始化函数
function login_bar_init(){
    var goto=window.web_header_login_goto?web_header_login_goto:location.href;
    $.get("/passport/login_bar",function(data){
        if(data.logined){
            $("#web_header .header_login_bar").html(data.greetings+"，<a href=\"http://www.yo4399.com/my/\" class=\"header_name\"><strong>"+data.username+"</strong> (LV"+data.level+")</a> &nbsp;|&nbsp; <a href=\"http://www.yo4399.com/my/\">个人中心</a> &nbsp;|&nbsp; <a href=\"http://www.yo4399.com/my/msg/"+(data.msg_unread>0?"unread":"inbox")+"/\">收件箱"+(data.newmsg>0?"<strong>("+data.newmsg+")</strong>":"")+"</a> &nbsp;|&nbsp; <a href=\"#\" class=\"header_logout\">退出</a>");
            $("#web_header a.header_logout").one("click",function(){
                $.get("/passport/logout",function(){
                    if($("#web_header .header_login_bar").length){login_bar_init();};
                    if($("#comment_new .name").length){refresh_comment_userinfo();};
                    if($("#bbs_box .login_bar").length){refresh_forum_userinfo();};
                });
                return false;
            });
        }else{
            $("#web_header .header_login_bar").html(data.greetings+"，欢迎来到yo4399网！<a href=\"http://www.yo4399.com/passport/login?next="+goto+"\">请登录</a>，新用户？<a href=\"http://www.yo4399.com/passport/register_1\">免费注册</a>");
        }
    },"json");
}

jQuery(function($){

//初始化登录条
//login_bar_init();

//搜索框初始化 因为报错，暂时注释掉  by mrwhen
    /*if($("#web_header .header_search_key").val().length==0){
        $("#web_header .header_search_key").val("输入游戏名称搜索").one("focus",function(){
            $(this).val("").removeClass("header_no_active");
        });
    }else{
        $("#web_header .header_search_key").removeClass("header_no_active");
    }*/

//搜索回车提交
    $("#web_header .header_search_key").keypress(function(e){
        if(e.keyCode==13){
            if($("#web_header .header_search_auto_box:visible a.active").length){
                location.href=$("#web_header .header_search_auto_box:visible a.active").attr("href");
            }else{
                if(check_search_key()){
                    go_search_page();
                }
            }
        };
    });

//搜索按钮提交及hover效果
    $("#web_header .header_search_button").click(function(){
        if(check_search_key()){go_search_page();}
    }).hover(function(){
        $(this).addClass("header_search_button_hover");
    },function(){
        $(this).removeClass("header_search_button_hover");
    });

//自动完成功能
    $("#web_header .header_search_key").keyup(function(e){
        if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=13){
            auto_complete_check($("#web_header .header_search_key").val());
        }else{
            if($("#web_header .header_search_auto_box:visible").length){
                if(e.keyCode==38){
                    if($("#web_header .header_search_auto_box a.active").length){
                        if($("#web_header .header_search_auto_box a.active").index()==0){
                            $("#web_header .header_search_auto_box a.active").removeClass("active");
                            $("#web_header .header_search_auto_box a:last").addClass("active");
                        }else{
                            $("#web_header .header_search_auto_box a.active").removeClass("active").prev().addClass("active");
                        };
                    }else{
                        $("#web_header .header_search_auto_box a:last").addClass("active");
                    };
                }else if(e.keyCode==40){
                    if($("#web_header .header_search_auto_box a.active").length){
                        if($("#web_header .header_search_auto_box a.active").index()==$("#web_header .header_search_auto_box a").length-1){
                            $("#web_header .header_search_auto_box a.active").removeClass("active");
                            $("#web_header .header_search_auto_box a:first").addClass("active");
                        }else{
                            $("#web_header .header_search_auto_box a.active").removeClass("active").next().addClass("active");
                        };
                    }else{
                        $("#web_header .header_search_auto_box a:first").addClass("active");
                    };
                };
            };
        };
    }).blur(function(){
        window.setTimeout(function(){$("#web_header .header_search_auto_box").hide();},300);
    });

//热门搜索关键词读取
    $("#web_header .header_hot_word").load("/flash/topsearch");

//导航条分割线插入
    $("<span></span>").insertBefore("#header_nav_link a:gt(0)");

});







//逗游ActiveX控件初始化
var doyo_activex=null;

function init_doyo_activex(){
    try{doyo_activex = new ActiveXObject("DoyoATL.DydLink.1");}catch(e){};
}

//遮盖层调用
function showbestrow(page,callback){
    $("<div id=\"showbestrow\" style=\"position:absolute;z-index:100;\"></div>").appendTo("body");
    $("<div id=\"bestrowcont\" style=\"position:absolute;z-index:101;\"></div>").insertAfter("#showbestrow");
    $("#showbestrow").css({left:"0",top:"0",background:"#000",filter:"alpha(opacity=30)","opacity":"0.3",width:document.documentElement.scrollWidth,height:document.documentElement.clientHeight>document.documentElement.scrollHeight?document.documentElement.clientHeight:document.documentElement.scrollHeight});
    $("select").css("visibility","hidden");
    $("#bestrowcont").load(page,function(){
        var bleft=($(window).width()-$("#bestrowcont").width())/2;if(parseInt(bleft)<30){bleft=30};
        var btop=($(window).height()-$("#bestrowcont").height())/2+$(window).scrollTop();if(parseInt(btop)<30){btop=30};
        $("#bestrowcont").css({left:bleft,top:btop});
        $("#showbestrow").css({width:document.documentElement.scrollWidth,height:document.documentElement.clientHeight>document.documentElement.scrollHeight?document.documentElement.clientHeight:document.documentElement.scrollHeight}).one("click",function(){
            $("#bestrowcont .close").click();
        });
        $("#bestrowcont .close").one("click",function(){
            $("#bestrowcont,#showbestrow").remove();
            $("select").css("visibility","visible");
            $(window).unbind("resize",first_resetbestrow);
            return false;
        }).hover(function(){
            $(this).addClass("close_hover");
        },function(){
            $(this).removeClass("close_hover");
        });
    });
    $(window).one("resize",first_resetbestrow);
};
function first_resetbestrow(){
    $("#showbestrow").css({width:$(window).width(),height:$(window).height()});
    window.setTimeout(second_resetbestrow,0);
}
function second_resetbestrow(){
    var bleft=($(window).width()-$("#bestrowcont").width())/2;if(parseInt(bleft)<30){bleft=30};
    var btop=($(window).height()-$("#bestrowcont").height())/2+$(window).scrollTop();if(parseInt(btop)<30){btop=30};
    $("#bestrowcont").css({left:bleft,top:btop});
    $("#showbestrow").css({width:document.documentElement.scrollWidth,height:document.documentElement.clientHeight>document.documentElement.scrollHeight?document.documentElement.clientHeight:document.documentElement.scrollHeight});
    $(window).one("resize",first_resetbestrow);
}

//点评用户显示处刷新
function refresh_comment_userinfo(){
    $("#comment_new .name").load("/Bbs/Comment/loginslice?ran="+Math.random());
}

//文本区域字符串插入处理
function insert_phiz(obj,instr){
    obj.focus();
    if($.browser.msie){
        document.selection.createRange().text+=instr;
    }else{
        var c=obj[0].selectionStart;
        var p=c+instr.length;
        obj.val(obj.val().substr(0,c)+instr+obj.val().substr(c,obj.val().length));
        obj[0].setSelectionRange(p,p);
    }
}

//官网AJAX登录调用
function call_web_login(){
    showbestrow("/passport/login_box");
}

//复制页面地址
function copy_page_url(sURL,sTitle){if($.browser.msie){window.clipboardData.setData("text",sTitle+" "+sURL);alert("标题和链接复制成功，您可以推荐给QQ/MSN上的好友了！");}else{window.prompt("你使用的是非IE核心浏览器，请按下 Ctrl+C 复制代码到剪贴板",sTitle+" "+sURL);}}

//加入收藏夹
function AddFavorite(sUrl,sTitle){if(document.all){try{window.external.addFavorite(sUrl,sTitle);}catch(e1){try{window.external.addToFavoritesBar(sUrl,sTitle);}catch(e2){alert("请使用Ctrl+D添加收藏");}}}else if(window.sidebar){window.sidebar.addPanel(sTitle,sUrl,"");}else{alert("请使用Ctrl+D添加收藏");}}

//设为首页
function SetHome(obj,sURL){try{obj.style.behavior="url(#default#homepage)";obj.setHomePage(sURL);}catch(e){if(window.netscape){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");}catch(e){alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入\"about:config\"并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为\"true\",双击即可。");}var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);prefs.setCharPref("browser.startup.homepage",sURL);}}}

//Cookie相关函数
function expTime(millisecond){if(millisecond.length==0){millisecond=0};var exp=new Date();exp.setTime(exp.getTime()+parseInt(millisecond));return exp.toGMTString();}

function createCookie(name,value,expires,path,domain,secure){document.cookie=name+"="+encodeURI(value)+(expires?(';expires='+expires):'')+(path?(';path='+path):'')+(domain?(';domain='+domain):'')+((secure)?';secure':'');}

function deleteCookie(name,path,domain){if(getCookie(name)){document.cookie=name+"="+((path)?(";path="+path):'')+((domain)?(";domain="+domain):'')+";expires=Mon,01-Jan-2006 00:00:01 GMT";}}

function getCookie(name){var arg=name+"=";var alen=arg.length;var theCookie=''+document.cookie;var inCookieSite=theCookie.indexOf(arg);if(inCookieSite==-1||name==""){return '';}var begin=inCookieSite+alen;var end=theCookie.indexOf(';',begin);if(end==-1){end=theCookie.length;}return decodeURI(theCookie.substring(begin,end));}

var lazy_load_timer=null;//图片延迟加载timer
var lazy_load_obj=null;//图片延迟加载对象

//图片后显处理函数
function lazy_load_img(){
    window.clearTimeout(lazy_load_timer);
    lazy_load_timer=window.setTimeout(function(){
        var o_list=lazy_load_obj.filter(":visible");
        if(o_list.length){
            var v_h=$(window).height()+$(document).scrollTop()+300;
            o_list.each(function(i){
                if($(this).offset().top<v_h){
                    $(this).attr("src",$(this).attr("osrc"));
                    lazy_load_obj=lazy_load_obj.not($(this).removeAttr("osrc"));
                }
            });
        }
        if(!lazy_load_obj.length){
            lazy_load_img_remove();
        }
    },0)
}

//图片后显处理函数解除绑定
function lazy_load_img_remove(){
    lazy_load_timer=null;
    lazy_load_obj=null;
    $(self).unbind("scroll",lazy_load_img);//解除窗口滚动事件绑定
    $(self).unbind("resize",lazy_load_img);//解除窗口大小调整事件绑定
    if($.isFunction(self.other_lazy_load_img_remove)){other_lazy_load_img_remove();}//解除其他对象操作绑定
}

//图片后显处理函数初始化
function lazy_load_img_init(){
    lazy_load_obj=$("img[osrc]");
    $(self).scroll(lazy_load_img);//窗口滚动事件绑定
    $(self).resize(lazy_load_img);//窗口大小调整事件绑定
    if($.isFunction(self.other_lazy_load_img_init)){other_lazy_load_img_init();}//其他对象操作绑定
    lazy_load_img();//执行一次先
}

/****** jQuery $(document).ready()部分开始 ******/

jQuery(function($){

//图片后显处理初始化
    lazy_load_img_init();

});
