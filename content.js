// Generate a unique selector for an element
function getUniqueSelector(element) {
    if (element.id) {
        return { target: `#${element.id}`, type: 'id' };
    }
    // Fall back to XPath
    return { target: getXPath(element), type: 'xpath' };
}

// Function to get the XPath of an element
function getXPath(element) {
    if (element.id !== '') {
        return `id("${element.id}")`;
    }
    if (element === document.body) {
        return '/html/body';
    }

    let index = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + `[${index + 1}]`;
        }
        if (siblings[i].nodeType === 1 && siblings[i].tagName === element.tagName) {
            index++;
        }
    }
}


// Send interaction logs to the interactionStore  "chrome.runtime.onMessage."
function sendInteractionLog(action, element, value) {
    const { target, type } = getUniqueSelector(element);
    chrome.runtime.sendMessage({
        type: "interaction",
        action,
        selector: { target, type },
        value: value || null,  // used for user inputs
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
