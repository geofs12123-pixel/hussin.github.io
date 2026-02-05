/**
 * GhostNumbers Core Logic v4.0
 * Lines: 210+ Clean & Professional Code
 */

// 1. Firebase Configuration - YOUR REAL DATA
const firebaseConfig = {
    apiKey: "AIzaSyB4hT2P6yllJiAH780hqXsORcnAEdVJP2c",
    authDomain: "ghostnumbers-36e8e.firebaseapp.com",
    projectId: "ghostnumbers-36e8e",
    storageBucket: "ghostnumbers-36e8e.firebasestorage.app",
    messagingSenderId: "670601465258",
    appId: "1:670601465258:web:35b33f4e2c9cd265df6fd3",
    measurementId: "G-SNRDL0W9Y5"
};

// Global State
let currentUser = null;
let activeNumber = null;
let autoRefreshTimer = null;

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// 2. Data Structures
const countries = [
    { name: 'USA', code: '+1', flag: '🇺🇸', available: 42 },
    { name: 'UK', code: '+44', flag: '🇬🇧', available: 28 },
    { name: 'Canada', code: '+1', flag: '🇨🇦', available: 15 },
    { name: 'Germany', code: '+49', flag: '🇩🇪', available: 19 },
    { name: 'France', code: '+33', flag: '🇫🇷', available: 22 },
    { name: 'Holland', code: '+31', flag: '🇳🇱', available: 11 },
    { name: 'Spain', code: '+34', flag: '🇪🇸', available: 7 },
    { name: 'Sweden', code: '+46', flag: '🇸🇪', available: 9 }
];

const apps = ["Telegram", "WhatsApp", "Google", "Instagram", "Viber", "Netflix", "Amazon", "PayPal", "Discord", "Twitter", "Snapchat", "TikTok", "Microsoft", "Steam"];

// 3. Auth Management
function initAuthSystem() {
    const loginBtn = document.getElementById('login-btn');
    
    loginBtn.addEventListener('click', async () => {
        try {
            const result = await auth.signInWithPopup(provider);
            currentUser = result.user;
            updateUIAfterLogin(currentUser);
            console.log("Welcome:", currentUser.displayName);
        } catch (error) {
            console.error("Auth Error:", error.message);
            alert("Connection Error: Check your internet or Firebase Authorized Domains (127.0.0.1)");
        }
    });

    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            updateUIAfterLogin(user);
        }
    });
}

function updateUIAfterLogin(user) {
    const btn = document.getElementById('login-btn');
    if (btn && user) {
        btn.innerHTML = `<img src="${user.photoURL}" style="width:20px;height:20px;border-radius:50%; margin-right:8px;"> ${user.displayName.split(' ')[0]}`;
        btn.style.background = "#f0fdf4";
        btn.style.borderColor = "#22c55e";
        btn.style.color = "#166534";
    }
}

// 4. Content Rendering
function renderPublicCountries() {
    const grid = document.getElementById('free-countries');
    if (!grid) return;

    countries.forEach(country => {
        const card = document.createElement('div');
        card.className = 'country-card animate-pop';
        card.innerHTML = `
            <div style="font-size: 45px">${country.flag}</div>
            <h3 style="margin-top:15px; font-weight:800;">${country.name}</h3>
            <p style="color:#64748b; font-size:12px;">${country.available} Active Numbers</p>
        `;
        card.onclick = () => loadVirtualNumbers(country.name, country.code);
        grid.appendChild(card);
    });
}

function loadVirtualNumbers(name, code) {
    const display = document.getElementById('numbers-display');
    const list = document.getElementById('numbers-list');
    const title = document.getElementById('selected-country-name');

    title.innerText = `${name} Virtual Numbers`;
    list.innerHTML = "";
    display.style.display = 'block';

    for (let i = 0; i < 10; i++) {
        const randomNum = `${code} ${Math.floor(100+Math.random()*899)}-${Math.floor(1000+Math.random()*8999)}`;
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.style.cssText = "background:#eff3ff; padding:15px; border-radius:12px; border:none; font-weight:700; color:var(--main-blue); cursor:pointer; margin:5px;";
        btn.innerText = randomNum;
        btn.onclick = () => openSMSPanel(randomNum);
        list.appendChild(btn);
    }
    display.scrollIntoView({ behavior: 'smooth' });
}

function openSMSPanel(num) {
    activeNumber = num;
    const interface = document.getElementById('sms-interface');
    document.getElementById('active-num').innerText = num;
    interface.style.display = 'block';
    refreshSMS();
    interface.scrollIntoView({ behavior: 'smooth' });
}

// 5. SMS Simulator
function refreshSMS() {
    const viewport = document.getElementById('messages-viewport');
    viewport.innerHTML = `
        <div style="text-align:center; padding:50px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size:30px; color:var(--main-blue)"></i>
            <p style="margin-top:15px; font-weight:600;">Intercepting global SMS signals...</p>
        </div>
    `;

    setTimeout(() => {
        viewport.innerHTML = "";
        const msgCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < msgCount; i++) {
            const app = apps[Math.floor(Math.random() * apps.length)];
            const code = Math.floor(100000 + Math.random() * 899999);
            const time = i * 2 + 1;
            
            const msg = document.createElement('div');
            msg.className = 'msg-bubble animate-pop';
            msg.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:var(--main-blue); font-size:16px;">${app}</strong>
                    <span style="font-size:11px; color:#94a3b8;">${time} min ago</span>
                </div>
                <p style="margin-top:8px;">Verification code: <b style="letter-spacing:1px; font-size:19px; color:#1e293b;">${code}</b></p>
            `;
            viewport.appendChild(msg);
        }
    }, 1500);
}

// 6. Private System & Payment Logic
function openPrivateModal() {
    document.getElementById('private-modal').style.display = 'flex';
}

function closePrivateModal() {
    document.getElementById('private-modal').style.display = 'none';
}

function selectPrivate(country, price) {
    // SECURITY CHECK: Must be logged in
    if (!currentUser) {
        alert("⚠️ Access Denied: You must login with Google to purchase private numbers.");
        closePrivateModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const area = document.getElementById('payment-area');
    document.getElementById('price-tag').innerText = price.toFixed(2);
    area.style.display = 'block';
    area.scrollIntoView({ behavior: 'smooth' });
}

function copyCryptoAddress() {
    const addr = document.querySelector('.crypto-address span').innerText;
    navigator.clipboard.writeText(addr).then(() => {
        const btn = document.querySelector('.copy-addr-btn');
        btn.innerHTML = `<i class="fas fa-check"></i> Wallet Address Copied!`;
        btn.style.background = "#059669";
        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-copy"></i> Copy Wallet Address`;
            btn.style.background = "#1e293b";
        }, 3000);
    });
}

// 7. Utility & Helpers
function copyNum() {
    if (!activeNumber) return;
    navigator.clipboard.writeText(activeNumber).then(() => {
        const btn = document.querySelector('.action-btn');
        btn.innerHTML = `<i class="fas fa-check"></i> Copied`;
        setTimeout(() => btn.innerHTML = `<i class="fas fa-copy"></i> Copy Number`, 2000);
    });
}

function showSection(name) {
    const home = document.getElementById('home-section');
    const myNum = document.getElementById('my-numbers-section');
    home.style.display = name === 'home' ? 'block' : 'none';
    myNum.style.display = name === 'home' ? 'none' : 'block';
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initAuthSystem();
    renderPublicCountries();
    console.log("GhostNumbers Engine v4.0 Active.");
});

// Close modal on outside click
window.onclick = (event) => {
    const modal = document.getElementById('private-modal');
    if (event.target == modal) closePrivateModal();
};