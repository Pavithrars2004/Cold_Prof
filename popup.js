document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const rewrittenText = document.getElementById('rewrittenText');

  const OPENAI_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // your actual API key

  async function rewriteEmail(text) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a professional email rewriting assistant." },
            { role: "user", content: `Rewrite this email professionally:\n\n${text}` }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error("No response from OpenAI");
      }
    } catch (error) {
      console.error("Error in rewriteEmail:", error);
      alert("Failed to rewrite email: " + error.message);
      return null;
    }
  }

  // When popup opens, get selected text from the current tab and rewrite it
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => window.getSelection().toString()
    }, async (results) => {
      if (results && results[0] && results[0].result) {
        const selectedText = results[0].result.trim();
        if (!selectedText) {
          rewrittenText.value = "No text selected on the page.";
          return;
        }

        rewrittenText.value = "Rewriting... please wait.";
        const rewritten = await rewriteEmail(selectedText);
        rewrittenText.value = rewritten || "";
      } else {
        rewrittenText.value = "Failed to get selected text.";
      }
    });
  });

  // Copy button copies rewritten email
  copyBtn.addEventListener('click', () => {
    if (!rewrittenText.value.trim()) {
      alert("No rewritten text to copy!");
      return;
    }
    rewrittenText.select();
    document.execCommand('copy');
    alert("Rewritten email copied to clipboard!");
  });
});
