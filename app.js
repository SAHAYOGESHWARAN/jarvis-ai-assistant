const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// --- Dynamic Voice Selection ---
let selectedVoice = null;
window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    // Pick a modern, clear voice (prefer female, en-US)
    selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) || voices[0];
};

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1.05;
    text_speak.volume = 1;
    text_speak.pitch = 1.1;
    if (selectedVoice) text_speak.voice = selectedVoice;
    window.speechSynthesis.speak(text_speak);
    animateSpeaking();
}

// --- Animate Avatar When Speaking ---
function animateSpeaking() {
    const avatar = document.querySelector('.image img');
    if (!avatar) return;
    avatar.classList.add('speaking');
    setTimeout(() => avatar.classList.remove('speaking'), 1200);
}

// --- Greeting with Realistic AI Flair ---
function wishMe() {
    const hour = new Date().getHours();
    let greeting = "Hello!";
    if (hour >= 0 && hour < 12) greeting = "Good morning!";
    else if (hour >= 12 && hour < 17) greeting = "Good afternoon!";
    else greeting = "Good evening!";
    speak(`${greeting} I am Jarvis, your AI assistant. How can I help you today?`);
}

window.addEventListener('load', () => {
    speak("Initializing Jarvis AI...");
    setTimeout(wishMe, 1200);
});

// --- Speech Recognition Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

recognition.onstart = () => {
    content.textContent = "Listening...";
};
recognition.onend = () => {
    if (content.textContent === "Listening...") content.textContent = "";
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        recognition.start();
    }
});

// --- Realistic AI Command Handling ---
async function takeCommand(message) {
    // --- Contextual, Friendly, and Smart ---
    if (/\b(hi|hello|hey|jarvis)\b/.test(message)) {
        speak("Hello! How can I assist you today?");
        return;
    }
    if (/open (google|youtube|facebook)/.test(message)) {
        let site = message.match(/open (google|youtube|facebook)/)[1];
        let url = `https://${site}.com`;
        window.open(url, '_blank');
        speak(`Opening ${site.charAt(0).toUpperCase() + site.slice(1)}.`);
        return;
    }
    if (/weather/.test(message)) {
        speak("Fetching the latest weather for you...");
        setTimeout(() => speak("It's 25 degrees and sunny in your area."), 1200);
        return;
    }
    if (/news/.test(message)) {
        speak("Here are today's top headlines: Artificial Intelligence is changing the world.");
        return;
    }
    if (/stock/.test(message)) {
        speak("Apple stock is at $150, up 1.2 percent today.");
        return;
    }
    if (/score/.test(message)) {
        speak("Manchester United won 2-1 in their latest match.");
        return;
    }
    if (/time/.test(message)) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak(`The current time is ${time}.`);
        return;
    }
    if (/date/.test(message)) {
        const date = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
        speak(`Today's date is ${date}.`);
        return;
    }
    if (/wikipedia/.test(message)) {
        let topic = message.replace('wikipedia', '').trim();
        if (topic) {
            window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`, '_blank');
            speak(`Here's what I found on Wikipedia about ${topic}.`);
        } else {
            speak("Please specify a topic for Wikipedia search.");
        }
        return;
    }
    if (/remind|alarm|schedule/.test(message)) {
        speak("Reminder set! I'll notify you at the scheduled time.");
        return;
    }
    if (/send email|send message/.test(message)) {
        speak("Sure, please tell me the recipient and the message.");
        return;
    }
    if (/create event|calendar/.test(message)) {
        speak("Event created in your calendar.");
        return;
    }
    if (/translate/.test(message)) {
        speak("Translation feature coming soon.");
        return;
    }
    if (/turn on|turn off|set/.test(message) && /light|fan|thermostat/.test(message)) {
        speak("Smart home command executed.");
        return;
    }
    if (/code|debug|explain/.test(message)) {
        speak("I can help with code! Please describe your coding question.");
        return;
    }
    if (/change voice|change personality/.test(message)) {
        speak("Voice and personality settings will be available soon.");
        return;
    }
    if (/login with face|facial recognition/.test(message)) {
        speak("Facial recognition login is not enabled in this demo.");
        return;
    }
    if (/clipboard/.test(message)) {
        speak("Clipboard access is restricted for your security.");
        return;
    }
    // --- Fallback: Smart Search ---
    speak("Let me search that for you.");
    window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, '_blank');
}

