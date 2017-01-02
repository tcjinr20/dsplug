



var currentTab;
var currentBookmark = false;

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  browser.browserAction.setIcon({
    path: currentBookmark ? {
      32: "icons/beasts-32.png"
    } : {
      32: "icons/beasts-48.png"
    },
    tabId: currentTab.id
  });
	
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark() {
	currentBookmark = !currentBookmark;
	updateIcon();
}

browser.browserAction.onClicked.addListener(toggleBookmark);
browser.tabs.executeScript(null, {
		file: "content_scripts/fy.js"
	});
function updateActiveTab(tabs) {
  function updateTab(tabs) {
    if (tabs[0]) {
      currentTab = tabs[0];

        updateIcon();
    }
  }
  
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
}

// TODO listen for bookmarks.onCreated and bookmarks.onRemoved once Bug 1221764 lands

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// update when the extension loads initially
updateActiveTab();

browser.runtime.onMessage.addListener(function(param){
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/beasts-48.png"),
    "title": "提示",
    "message": param.content
  });
})



