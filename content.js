// Generate a unique selector for an element
function getUniqueSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.name) return `[name="${element.name}"]`;
    return element.tagName.toLowerCase();
}

// Send interaction logs to the background
function sendInteractionLog(action, element, value) {
    const selector = getUniqueSelector(element);
    chrome.runtime.sendMessage({
        type: "interaction",
        action,
        selector,
        value: value || null,
    });
}

// Record click and input interactions
document.body.addEventListener("click", (e) => {
    sendInteractionLog("Click", e.target, null);
});

document.body.addEventListener("blur", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        sendInteractionLog("Input", e.target, e.target.value);
    }
}, true); // Use the `true` option to capture blur during the capturing phase
