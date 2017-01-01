/*
beastify():
* removes every node in the document.body,
* then inserts the chosen beast
* then removes itself as a listener 
*/

function beastify(request) {
	switch(request.type){
		case "pack":
		saveData('packtype',request.data);
		initPack(request.data);
		break;
	}
}
if(!browser.runtime.onMessage.hasListener(beastify));
browser.runtime.onMessage.addListener(beastify);

var packstop = true;
function initPack(act){
	packstop = false;
	document.body.addEventListener("mousemove",pack);
	document.body.addEventListener("click",getpack);
	  browser.runtime.sendMessage({"content": '开始提取：'+act});
}
var pre=null,old='';
function pack(e){
	if(pre){
		pre.style.border=old;
	}
	pre = e.target;
	old = pre.style.border;
	pre.style.border = "1px solid red";
}

function getpack(e){
	var val = pre.innerHTML;
	var gettingAllStorageItems = browser.storage.local.get(null);
	gettingAllStorageItems.then((results) => {
		saveData(results[0]["packtype"],val);
	})
	browser.runtime.sendMessage({"content": '结束提取：'+pre.innerText.substr(0,20)});
	stopPack();
}

function stopPack(){
	packstop = true;
	document.body.removeEventListener("mousemove",pack)
	document.body.removeEventListener("click",getpack);
	pre.style.border=old;
	pre = null;
}


function saveData(key ,value){
	
	var o = {};
	o[key]=value;
	var storingNote = browser.storage.local.set(o);
	storingNote.then(null,console.log);
}

