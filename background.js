chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rewriteEmail",
    title: "Rewrite as Professional Email",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "rewriteEmail") {
    chrome.storage.local.set({ originalText: info.selectionText });
    chrome.action.openPopup();
  }
});
