var currentTab=null;

function onError(error) {
  console.log(error);
}

function changetoword(){
	$("#content").hide()
	$("#contenword").show();
	$("#contenword").html($("#content").val())
}

function changeTohtml(){
	$("#content").show()
	$("#contenword").hide();
	$("#contenword").html($("#content").val())
}
function clickDOM(e){
	
	var chosenBeast =e.target.getAttribute("value");
	browser.tabs.sendMessage(currentTab.id, {type:"pack",data: chosenBeast});
}

function notify(tip){
	 browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/beasts-48.png"),
    "title": "提示",
    "message": tip
  });
}

function submitData(){
	var p = {};
	p.title = $("#title").val();
	p.content = $("#content").val();
	p.label = $("#labels").val();
	if(p.title.length==0 || p.content.length==0) return notify("缺少数据");
	notify("提交数据");
	$.post("http://localhost/addon/index",p,function(res){
		console.log(res,"fsdhjsdlghlfd")
	if(res=="ok"){
		notify("提交成功");
		$("#title").val("");
		$("#content").val("");
		browser.storage.local.clear();
	}else notify("提交出错");
	}).error(function(){
		notify("无法提交");
	});
}
$(document).ready(function(){
	$(".word").click(changetoword);
	$(".source").click(changeTohtml);
	$(".beast").click(clickDOM);
	$(".submit").click(submitData);
	initialize();
})

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
	 
    var noteKeys = Object.keys(results);
    for(noteKey of noteKeys) {
		var curValue = results[noteKey];
		displayNote(noteKey,curValue);
    }
	updateActiveTab();
  }, onError);
}

function displayNote(key,value){
	if(['title',"content"].indexOf(key)==-1) return;
	if(key=="title"){
		var s=$("<div></div>").html(value).text();
		$("#title").val(s);
	}else{
		$("#"+key).val(value)
	}
}

function updateActiveTab(tabs) {
  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];
    }
  }
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
}

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);
// update when the extension loads initially

