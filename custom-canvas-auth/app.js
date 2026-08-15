// =========================================================
// STEP 1: MICROSOFT ENTRA ID (MSAL) CONFIGURATION
// =========================================================
const msalConfig = {
    auth: {
        clientId: "4596fbf3-7ef3-4f3e-a8f6-f6c95b2dece2", 
        authority: "https://login.microsoftonline.com/common",
        redirectUri: window.location.href
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
let employeeName = "";
let employeeId = "";
let msalAccessToken = "";

let currentLocale = "en-US";
window.directLineObj = null;
window.chatStore = null;

function restartChat() {
    if(window.directLineObj) {
        window.directLineObj.end();
        window.directLineObj = null;
        window.chatStore = null;
        document.getElementById('webchat').innerHTML = ""; 
        startChat(); 
    }
}

function changeLanguage(e) {
    currentLocale = e.target.value;
    if(window.directLineObj) {
        renderMyWebChat();
    }
}

function downloadTranscript() {
    if(!window.chatStore) return alert("No active chat.");
    const activities = window.chatStore.getState().activities;
    let text = "=== CHAT HISTORY ===\n\n";
    activities.filter(a => a.type === 'message').forEach(a => {
        const sender = a.from.role === 'user' ? employeeName : "BOT";
        text += `[${sender}]: ${a.text || ""}\n`;
    });
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url; a.download = "History.txt"; a.click();
}

// =========================================================
// WIDGET TOGGLE LOGIC
// =========================================================
let isChatStarted = false;
function toggleChat() {
    const container = document.getElementById('chatbot-container');
    container.classList.toggle('open');
    if (!isChatStarted) {
        isChatStarted = true;
        signInWithMicrosoft();
    }
}

// =========================================================
// MICROSOFT LOGIN LOGIC (REAL SSO)
// =========================================================
async function signInWithMicrosoft() {
    try {
        // Trigger the secure Microsoft popup window
        const loginResponse = await msalInstance.loginPopup({
            scopes: ["openid", "profile", "User.Read"]
        });
        
        console.log("Successfully logged in as:", loginResponse.account.name);
        
        // Extract real verified identity & Token for SSO
        employeeName = loginResponse.account.name;
        employeeId = loginResponse.account.username;
        msalAccessToken = loginResponse.accessToken;

        // Hide login, show chat
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('webchat').style.display = 'flex';
        document.getElementById('webchat').style.flexDirection = 'column';

        // Launch the chat
        startChat();
        
    } catch (error) {
        console.error("Microsoft Login Failed:", error);
        alert("Authentication failed. Please try again or contact IT.");
    }
}

// =========================================================
// WORD-BY-WORD STREAMING SIMULATION SCRIPT
// =========================================================
function wrapWords(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        const text = element.nodeValue;
        if (text.trim() === '') return;
        
        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < words.length; i++) {
            if (words[i] === '') continue;
            const span = document.createElement('span');
            span.textContent = words[i];
            span.style.display = 'none';
            span.className = 'type-word';
            fragment.appendChild(span);
        }
        element.parentNode.replaceChild(fragment, element);
    } else {
        if (element.classList && element.classList.contains('webchat__screen-reader-text')) return;
        Array.from(element.childNodes).forEach(wrapWords);
    }
}

function typeEffect(container) {
    wrapWords(container);
    const words = container.querySelectorAll('.type-word');
    if (words.length === 0) {
        container.style.visibility = 'visible';
        return;
    }

    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    container.appendChild(cursor);

    container.style.visibility = 'visible';

    let i = 0;
    function typeNext() {
        if (i >= words.length) {
            setTimeout(() => cursor.remove(), 800);
            return;
        }
        
        words[i].style.display = 'inline';
        
        const scrollable = document.querySelector('.webchat__basic-transcript__scrollable');
        if(scrollable) scrollable.scrollTop = scrollable.scrollHeight;
        
        i++;
        
        const delay = Math.random() * 80 + 40;
        setTimeout(typeNext, delay);
    }

    typeNext();
}

function injectFeedbackButtons(container) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '8px';
    wrapper.style.justifyContent = 'flex-end';
    wrapper.style.paddingRight = '10px';
    wrapper.style.marginTop = '4px';
    wrapper.style.opacity = '0.6';

    const btnUp = document.createElement('button');
    btnUp.textContent = '👍';
    btnUp.style.background = 'none';
    btnUp.style.border = 'none';
    btnUp.style.cursor = 'pointer';
    btnUp.style.fontSize = '14px';
    btnUp.title = 'Helpful';
    btnUp.onclick = () => alert('Feedback submitted: Helpful!');

    const btnDown = document.createElement('button');
    btnDown.textContent = '👎';
    btnDown.style.background = 'none';
    btnDown.style.border = 'none';
    btnDown.style.cursor = 'pointer';
    btnDown.style.fontSize = '14px';
    btnDown.title = 'Not Helpful';
    btnDown.onclick = () => alert('Feedback submitted: Not Helpful');

    wrapper.appendChild(btnUp);
    wrapper.appendChild(btnDown);

    container.appendChild(wrapper);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { 
                let bubbles = [];
                if (node.classList && node.classList.contains('webchat__bubble--from-bot')) {
                    bubbles.push(node);
                } else {
                    bubbles = Array.from(node.querySelectorAll('.webchat__bubble--from-bot'));
                }

                bubbles.forEach(bubble => {
                    const contentContainer = bubble.querySelector('.webchat__bubble__content');
                    
                    if (contentContainer && !contentContainer.dataset.typed) {
                        contentContainer.dataset.typed = "true";
                        
                        setTimeout(() => {
                            typeEffect(contentContainer);
                            // FEATURE 2: Message Feedback (Thumbs up/down)
                            setTimeout(() => injectFeedbackButtons(bubble), 1000);
                        }, 50);
                    }
                });
            }
        });
    });
});

observer.observe(document.getElementById('chatbot-container'), { childList: true, subtree: true });


// =========================================================
// INITIALIZE WEB CHAT AFTER AUTH
// =========================================================
function renderMyWebChat() {
    const styleOptions = {
        botAvatarInitials: 'IT',
        userAvatarInitials: 'You',
        bubbleBackground: 'transparent',
        bubbleFromUserBackground: 'transparent',
        bubbleBorderColor: 'transparent',
        bubbleFromUserBorderColor: 'transparent',
        hideUploadButton: false,
        primaryFont: "'Segoe UI', -apple-system, sans-serif"
    };

    window.WebChat.renderWebChat(
        {
            directLine: window.directLineObj, 
            store: window.chatStore, 
            userID: employeeId, 
            username: employeeName,
            locale: currentLocale,
            styleOptions: styleOptions,
            webSpeechPonyfillFactory: window.WebChat.createBrowserWebSpeechPonyfillFactory()
        },
        document.getElementById('webchat')
    );
}

async function startChat() {
    if (window.directLineObj) return;
    
    try {
        // Exchange the provided Secret for a fresh Token from Microsoft
        // TODO: Replace with your actual Copilot Studio Secret or fetch it from a secure backend
        const providedSecret = "YOUR_COPILOT_STUDIO_SECRET_HERE";
        
        const res = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${providedSecret}` }
        });
        
        if (!res.ok) throw new Error("Provided string is likely an expired token, not a Secret.");
        const data = await res.json();
        
        // Always create a fresh connection
        window.directLineObj = window.WebChat.createDirectLine({ token: data.token });
        
    } catch (error) {
        console.error("Critical Security Error: Backend server unreachable.", error);
        alert("System Error: Unable to securely connect to the IT Helpdesk server.");
        document.getElementById('login-view').style.display = 'flex';
        document.getElementById('webchat').style.display = 'none';
        return; 
    }

    window.directLineObj.connectionStatus$.subscribe(status => {
        if (status === 2) { 
            sessionStorage.setItem(`chatHistory_${employeeId}`, window.directLineObj.conversationId);
        }
    });

    // Send silent startConversation event and play sound effects
    window.chatStore = window.WebChat.createStore({}, ({ dispatch }) => next => action => {
        if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
            dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                    name: 'startConversation', 
                    type: 'event',
                    value: {
                        username: employeeName,
                        employeeId: employeeId,
                        authStatus: "Entra ID Authenticated"
                    }
                }
            });
        }
        
        // FEATURE 6: Sound Effects (Earcons)
        if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
            const activity = action.payload.activity;
            if (activity.type === 'message' && activity.from && activity.from.role === 'bot') {
                // Play a quiet notification pop
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Audio autoplay blocked by browser'));
            }
        }
        return next(action);
    });

    renderMyWebChat();
}
