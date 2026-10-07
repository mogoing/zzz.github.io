/* 空壳 SDK（本地无广告版）：立即初始化完成，不发起任何外部请求 */
(function(){
  function noop(){}
  var sdk = {
    InitAds: function(opts){
      setTimeout(function(){
        try {
          if (window["gamemonetize"] && typeof window["gamemonetize"]["onInit"] === "function") window["gamemonetize"]["onInit"]();
          if (window["gamemonetize"] && typeof window["gamemonetize"]["onResumeGame"] === "function") window["gamemonetize"]["onResumeGame"]();
        } catch(e){}
      }, 60);
      return true;
    },
    onInit: noop, onError: noop, onResumeGame: noop, onPauseGame: noop,
    showBanner: noop, hideBanner: noop, showInterstitial: noop, showRewarded: noop
  };
  window["gamemonetize"] = sdk;
  window["gamemonetize-sdk"] = sdk;
  window["sdk"] = { customLog: noop };
  window["SDK_OPTIONS"] = window["SDK_OPTIONS"] || {};
})();
