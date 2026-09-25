(function(){
var Visitor=$User.Visitor,dAdventure=$('dAdventure'),UserAuthority=0,Progress=1;
if(!dAdventure)return;dAdventure.innerHTML='';
dAdventure.className='adventure0';
window.frames['IF2'].ChatInterval=10000;
window.frames['ChatView'].UserName='游客827007242';
$('dName').innerHTML=($User.Visitor.UserAuthority=UserAuthority)==255?'<span style="color:#0F0;font-weight:bold">Guest!</span>':'Guest!';
$User.Server.DataURL='http://lonelystar.org/';
})();