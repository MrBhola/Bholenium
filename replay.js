chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "replay") {
        const { actions } = message;

        actions.forEach((action, index) => {
            setTimeout(() => {
                const element = document.querySelector(action.selector);

                if (element) {
                    if (action.action === "Click") {
                        // Focus on the element before clicking to simulate natural interaction
                        element.focus();
                        element.click();
                    } else if (action.action === "Input" && action.value) {
                        // Set value and dispatch relevant events
                        element.focus();
                        element.value = action.value;
                        element.dispatchEvent(new Event("input", { bubbles: true }));
                        element.dispatchEvent(new Event("blur", { bubbles: true }));
                    }
                } else {
                    console.warn(`Element not found for selector: ${action.selector}`);
                }
            }, index * 1000); // Replay actions with a delay for sequential execution
        });
    }
});
