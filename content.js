chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selection = window.getSelection().toString();
    sendResponse({ selectedText: selection });
  }
});
