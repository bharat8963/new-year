// --- CONFIGURATION ---
const CORRECT_ANSWER = "526"; // Days
let wrongAttempts = 0;

// Real Map Coordinates
const bikaner = [28.0229, 73.3119];
const kota = [25.2138, 75.8648];
let map = null;
let planeMarker = null;

// Interval Cleanup Variables
let snowInterval = null;
let heartInterval = null;
let balloonInterval = null;

// --- INITIALIZATION ---
window.onload = function() {
    createFloatingElements();
    createSnowFall();
    startHeaderTimer();

    // ENTER press par unlock
    document.getElementById("friendship-answer").addEventListener("keydown", function(e){
        if(e.key === "Enter"){
            e.preventDefault();
            checkAnswer();
        }
    });
};

// --- 1. LOCK SCREEN ---
function checkAnswer() {
    const input = document.getElementById('friendship-answer').value.trim();
    const errorMsg = document.getElementById('error-msg');
    const btn = document.querySelector('.btn-security');

    if (input === CORRECT_ANSWER) {
        btn.innerText = "ACCESS GRANTED ✅"; 
        btn.style.background = "white";
        setTimeout(() => {
            document.getElementById('lock-screen').style.transition = "opacity 0.8s";
            document.getElementById('lock-screen').style.opacity = "0";
            setTimeout(() => { 
                document.getElementById('lock-screen').style.display = "none"; 
                showMainPage(); 
            }, 800);
        }, 500);
    } else {
        wrongAttempts++;
        if (wrongAttempts === 1) {
            errorMsg.innerText = " Bhul gyi na😒!";
        } else {
            errorMsg.innerText = "yad kr😒";
        }
        errorMsg.style.display = "block";
        const card = document.querySelector('.security-card');
        card.style.transform = "translateX(10px)";
        setTimeout(()=> card.style.transform = "translateX(-10px)", 50);
        setTimeout(()=> card.style.transform = "translateX(10px)", 100);
        setTimeout(()=> card.style.transform = "translateX(0)", 150);
    }
}

// --- 2. MAIN APP VISIBILITY ---
function showMainPage() {
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('top-header').classList.remove('hidden');
    document.getElementById('music-player').classList.remove('hidden');
    const music = document.getElementById('bgMusic');
    music.volume = 0.5;
    music.play().catch(e => console.log("User interaction needed for music"));
}

// --- 3. PAGE 1: MAKEUP QUIZ ---
function showMakeupQuiz() {
    document.getElementById('makeup-modal').classList.remove('hidden');
}

function checkMakeupAnswer() {
    const ans = document.getElementById('makeup-input').value.trim().toLowerCase();
    const errText = document.getElementById('quiz-error-msg');
    
    if(ans.includes('primer')) {
        document.getElementById('makeup-modal').classList.add('hidden');
        showMsgModal("Sahi Jawab! 💃", "Medam aap aage ja skte he!", () => {
            changePage(1, 2); 
        });
    } else {
        errText.classList.remove('hidden');
        errText.innerHTML = "Nakli Makeup Artist! 🤮<br>Itna basic nahi pata?<br>Foundation se pehle <b>PRIMER</b> lagta hai😏😎 !";
        const card = document.querySelector('#makeup-modal .card');
        card.style.transform = "translateX(10px)";
        setTimeout(()=> card.style.transform = "translateX(-10px)", 50);
        setTimeout(()=> card.style.transform = "translateX(0)", 100);
    }
}

// --- 4. PAGE 2: ENVELOPE & CONTRACT ---
function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    
    setTimeout(() => {
        document.getElementById('envelope-view').style.display = 'none';
        const contract = document.getElementById('contract-view');
        contract.classList.remove('hidden');
        contract.style.display = 'flex'; // YE ADD KARO
        
        // Force reflow
        void contract.offsetWidth;
        
        const paper = document.querySelector('.legal-paper');
        if(paper) {
            paper.classList.add('visible');
        }
    }, 800);
}

function initiateContractSign() {
    document.getElementById('confirm-modal').classList.remove('hidden');
}

function confirmContractAction(isYes) {
    document.getElementById('confirm-modal').classList.add('hidden');
    if (isYes) {
        const thumb = document.getElementById('thumb-print');
        const btn = document.querySelector('.signature-area button');
        thumb.classList.remove('hidden');
        thumb.classList.add('thumb-stamp-anim');
        btn.innerText = ""; 
        setTimeout(() => {
            document.getElementById('moti-modal').classList.remove('hidden');
        }, 1500);
    }
}

function handleMotiResponse(type) {
    document.getElementById('moti-modal').classList.add('hidden');
    if (type === 'gussa') {
        showMsgModal("Aree gussa kyu? 😲", "Moti matlab... 'My Only True Inspiration' 😜\n(hihi)", () => goToPage3());
    } else if (type === 'happy') {
        showMsgModal("Haye! Khush? 😂", "Lagta hai sach mein moti ho gayi hai! 🐘\n(Just kidding cutie!)", () => goToPage3());
    } else if (type === 'chill') {
        showMsgModal("Itna Chill? 😎", "Lagta hai aaj chill mood me he! 🍕😴", () => goToPage3());
    }
}

function goToPage3() {
    changePage(2, 3);
    setTimeout(initRealMap, 500);
}

// --- 5. PAGE 3: REAL MAP LOGIC ---
function initRealMap() {
    if(map) return;
    map = L.map('real-map').setView([26.6, 74.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 18
    }).addTo(map);

    const planeIcon = L.divIcon({
        className: 'plane-marker',
        html: '<i class="fa-solid fa-plane"></i>',
        iconSize: [24, 24], iconAnchor: [12, 12]
    });

    L.marker(bikaner).addTo(map).bindPopup("<b>Bikaner</b><br> 🐪").openPopup();
    L.marker(kota).addTo(map).bindPopup("<b>Kota</b><br> ");

    L.polyline([bikaner, kota], {
        color: '#ff69b4', weight: 3, dashArray: '10, 10', opacity: 0.8
    }).addTo(map);

    // Calculate Distance
    const distMeters = map.distance(bikaner, kota);
    const distKm = Math.round(distMeters / 1000);
    document.getElementById('distance-msg').innerHTML = 
        `Distance: <b>${distKm} km</b> 📏<br>"jada door to nhi he i think hena ❤️"`;

    planeMarker = L.marker(bikaner, { icon: planeIcon }).addTo(map);
    setTimeout(() => {
        const iconElement = document.querySelector('.plane-marker i');
        if(iconElement) iconElement.style.transform = "rotate(135deg)";
    }, 500);
}

function startRealMapJourney() {
    if(!planeMarker) return;
    const start = bikaner;
    const end = kota;
    const steps = 100;
    let currentStep = 0;
    const latStep = (end[0] - start[0]) / steps;
    const lngStep = (end[1] - start[1]) / steps;

    const flyInterval = setInterval(() => {
        currentStep++;
        const newLat = start[0] + (latStep * currentStep);
        const newLng = start[1] + (lngStep * currentStep);
        planeMarker.setLatLng([newLat, newLng]);

        if (currentStep >= steps) {
            clearInterval(flyInterval);
            setTimeout(() => changePage(3, 4), 1000);
        }
    }, 30);
}

// --- 6. PAGE 4: MOOD LOGIC ---
function handleMood(mood) {
    if (mood === 'happy') {
        showMsgModal("Aree Waah! 😁", "Hamesha aise hi daant dikhaya kar! \nChamkile daant! ✨", () => {
            changePage(4, 5);
            setTimeout(initPage5, 500);
        });
    } 
    else if (mood === 'sad') {
        createRainEffect();
        showMsgModal("Kyu ro rhi he? 🥺", "Rona band kar! Ye le Tissue 🧻\nOr makeup kharab mat kar!", () => {
            stopRainEffect();
            changePage(4, 5);
            setTimeout(initPage5, 500);
        });
    } 
    else if (mood === 'angry') {
        document.body.classList.add('shake-screen');
        showMsgModal("Bhaago! 🚨", "😰😰 🦁\nSorry sorry, galti ho gayi!", () => {
            document.body.classList.remove('shake-screen');
            changePage(4, 5);
            setTimeout(initPage5, 500);
        });
    }
}

// --- 7. EFFECTS (RAIN, SNOW, BALLOONS) ---
function createRainEffect() {
    let rainDiv = document.getElementById('rain-layer');
    if(!rainDiv) {
        rainDiv = document.createElement('div');
        rainDiv.id = 'rain-layer';
        rainDiv.className = 'rain-overlay';
        document.body.appendChild(rainDiv);
    }
    rainDiv.style.display = 'block';
    for(let i=0; i<50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        rainDiv.appendChild(drop);
    }
}

function stopRainEffect() {
    const rainDiv = document.getElementById('rain-layer');
    if(rainDiv) {
        rainDiv.style.display = 'none';
        rainDiv.innerHTML = '';
    }
}

function createSnowFall() {
    if(snowInterval) clearInterval(snowInterval);
    
    const snowContainer = document.getElementById('snow-container');
    snowInterval = setInterval(() => {
        const s = document.createElement('div'); 
        s.className = 'snowflake';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.fontSize = Math.random() * 15 + 20 + 'px'; 
        s.style.animationDuration = Math.random() * 5 + 5 + 's';
        snowContainer.appendChild(s); 
        setTimeout(() => s.remove(), 10000);
    }, 300);
}

function createFloatingElements() {
    if(heartInterval) clearInterval(heartInterval);
    if(balloonInterval) clearInterval(balloonInterval);
    
    const heartContainer = document.querySelector('.hearts');
    heartInterval = setInterval(() => {
        const h = document.createElement('div'); 
        h.classList.add('heart');
        h.style.left = Math.random()*100+'vw'; 
        h.style.animationDuration = Math.random()*3+5+'s';
        heartContainer.appendChild(h); 
        setTimeout(()=>h.remove(), 8000);
    }, 800);

    const balloonContainer = document.querySelector('.balloons');
    balloonInterval = setInterval(() => {
        const b = document.createElement('div'); 
        b.classList.add('balloon');
        const colors = ['red', 'blue', 'yellow', 'pink', 'green'];
        b.classList.add(colors[Math.floor(Math.random() * colors.length)]);
        b.style.left = Math.random()*100+'vw'; 
        b.style.animationDuration = Math.random()*5+8+'s';
        b.onclick = function(){ 
            this.classList.add('popped'); 
            setTimeout(()=>this.remove(), 200); 
        };
        balloonContainer.appendChild(b); 
        setTimeout(()=>b.remove(), 13000);
    }, 2000);
}

// --- 8. HELPERS (MODALS & TRANSITIONS) ---
function showMsgModal(title, body, callback) {
    document.getElementById('msg-title').innerText = title;
    document.getElementById('msg-body').innerText = body;
    document.getElementById('msg-modal').classList.remove('hidden');
    document.getElementById('msg-btn').onclick = function() {
        document.getElementById('msg-modal').classList.add('hidden');
        if(callback) callback();
    };
}

function changePage(fromPage, toPage) {
    // Map Cleanup
    if(fromPage === 3 && map) {
        map.off();
        map.remove();
        map = null;
        planeMarker = null;
    }
    
    const wipe = document.getElementById('wipe-screen');
    const wipeText = document.getElementById('wipe-text');
    wipe.style.width = "100%";
    setTimeout(() => { 
        wipeText.style.opacity = "1"; 
        wipeText.style.transform = "scale(1.2)"; 
    }, 1000);
    setTimeout(() => { 
        wipeText.style.opacity = "0"; 
        document.getElementById('p' + fromPage).classList.remove('active'); 
        document.getElementById('p' + toPage).classList.add('active'); 
    }, 2500);
    setTimeout(() => { 
        wipe.style.width = "0%"; 
        wipeText.style.transform = "scale(1)";
    }, 3000);
}

function startHeaderTimer() {
    const timerElem = document.getElementById('header-timer');
    const end = new Date("Jan 1, 2026 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime(); 
        const dist = end - now;
        if (dist < 0) { 
            timerElem.innerText = "2026 IS HERE!"; 
            return; 
        }
        const d = Math.floor(dist / (1000*60*60*24)); 
        const h = Math.floor((dist % (1000*60*60*24)) / (1000*60*60));
        const m = Math.floor((dist % (1000*60*60)) / (1000*60)); 
        const s = Math.floor((dist % (1000*60)) / 1000);
        timerElem.innerText = `(${d}d ${h}h ${m}m ${s}s left)`;
    }, 1000);
}

function toggleMusic() {
    const m = document.getElementById('bgMusic');
    if(m.paused) { 
        m.play(); 
        document.querySelector('.disk').innerText = "💿🔊"; 
    } else { 
        m.pause(); 
        document.querySelector('.disk').innerText = "💿"; 
    }
}

// ================= PAGE 5: MEMORY STACK LOGIC =================

// 1. DATA: 20 Memories (15 Images, 5 Videos)
const memories = [
    { type: 'img', src: 'img1.jpg', text: "Shuruaat yahan se hui thi... 🙈" },
    { type: 'img', src: 'img2.jpg', text: "ye chota bacha kon he haha 😂" },
    { type: 'vid', src: 'vid1.mp4', text: "Ye yad he tan tan tan! 🤣" },
    { type: 'img', src: 'img3.jpg', text: "haha home build" },
    { type: 'img', src: 'img4.jpg', text: "🫣👀👀... " },
    { type: 'img', src: 'img5.jpg', text: "late night chats 🌙🥶" },
    { type: 'vid', src: 'vid2.mp4', text: " 🧐🥳🥳" },
    { type: 'img', src: 'img6.jpg', text: "my art  🐘" },
    { type: 'img', src: 'img7.jpg', text: "🧐🥳" },
    { type: 'img', src: 'img8.jpg', text: "again my art haha" },
    { type: 'vid', src: 'vid3.mp4', text: "hi 😂" },
    { type: 'img', src: 'img9.jpg', text: "ye le again art 🤝" },
    { type: 'vid', src: 'vid6.mp4', text: "new watch haha✨" },
    { type: 'vid', src: 'vid7.mp4', text: "memorees📱" },
    { type: 'vid', src: 'vid4.mp4', text: "preety little baby🥳" },
    { type: 'vid', src: 'vid8.mp4', text: "🤭🤭🤭 " },
    { type: 'vid', src: 'vid9.mp4', text: " jor se bolo jai mata di 🤭" },
    { type: 'vid', src: 'vid10.mp4', text: "singer ✨" },
    { type: 'vid', src: 'vid5.mp4', text: "pubggggggg! ❤️" },
    { type: 'img', src: 'img15.jpg', text: "latest pic 🤭🤭" }
];

let currentMemIndex = 0;

// Initialize Page 5
function initPage5() {
    currentMemIndex = 0;
    renderMemory(currentMemIndex);
    updateProgress();
    document.getElementById('btn-prev').style.display = 'none';
    document.getElementById('btn-next').innerText = "Next  ➡️";
}

// 2. RENDER CARD
function renderMemory(index) {
    const container = document.getElementById('memory-viewer');
    const data = memories[index];
    
    let mediaHtml = '';
    
    if (data.type === 'img') {
        mediaHtml = `<img src="${data.src}" class="mem-img" alt="Memory">`;
    } else {
        mediaHtml = `
            <div class="custom-video-player" onclick="toggleMemoryPlay(event, this)">
                <video class="mem-video" src="${data.src}" loop playsinline preload="metadata"></video>
                <div class="center-play-overlay">▶</div>
                <div class="video-controls" onclick="event.stopPropagation()">
                    <button class="play-btn" onclick="toggleMemoryPlay(event, this.closest('.custom-video-player'))">▶</button>
                    <div class="video-timeline">
                        <div class="video-progress" style="width:0%"></div>
                    </div>
                </div>
            </div>`;
    }

    container.innerHTML = `
        <div class="memory-card anim-fly-in-right">
            <div class="media-wrapper">
                ${mediaHtml}
            </div>
            <div class="mem-caption">
                ${data.text}
            </div>
        </div>
    `;

    // Auto update video progress bar
    if(data.type === 'vid') {
        const vid = container.querySelector('video');
        const bar = container.querySelector('.video-progress');
        vid.ontimeupdate = () => {
            const pct = (vid.currentTime / vid.duration) * 100;
            bar.style.width = pct + "%";
        };
    }
}

// 3. NAVIGATION LOGIC
function nextMemory() {
    const container = document.getElementById('memory-viewer');
    const card = container.querySelector('.memory-card');
    
    // Video Memory Cleanup
    const vid = card.querySelector('video');
    if(vid) {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
    }

    // Add Fly Out Animation
    card.classList.add('anim-fly-out-left');

    setTimeout(() => {
        currentMemIndex++;
        
        // Check if list finished
        if (currentMemIndex >= memories.length) {
            // GO TO PAGE 6 (Final Gift)
            changePage(5, 6);
            
            return;
        }

        renderMemory(currentMemIndex);
        updateProgress();
        
        // Show Back Button if not first
        if(currentMemIndex > 0) document.getElementById('btn-prev').style.display = 'inline-block';
        
        // Change Button Text on Last Item
        if(currentMemIndex === memories.length - 1) {
            document.getElementById('btn-next').innerText = "Finish & Open Gift 🎁";
        }
    }, 400);
}

function prevMemory() {
    if(currentMemIndex > 0) {
        // Video cleanup for previous too
        const container = document.getElementById('memory-viewer');
        const card = container.querySelector('.memory-card');
        const vid = card.querySelector('video');
        if(vid) {
            vid.pause();
            vid.removeAttribute('src');
            vid.load();
        }
        
        currentMemIndex--;
        renderMemory(currentMemIndex);
        updateProgress();
        if(currentMemIndex === 0) document.getElementById('btn-prev').style.display = 'none';
        document.getElementById('btn-next').innerText = "Next Memory ➡️";
    }
}

function updateProgress() {
    document.getElementById('memory-counter').innerText = `Memory ${currentMemIndex + 1} / ${memories.length}`;
    const pct = ((currentMemIndex + 1) / memories.length) * 100;
    document.getElementById('memory-progress-bar').style.width = pct + "%";
}

// 4. CUSTOM VIDEO PLAYER LOGIC
function toggleMemoryPlay(event, wrapper) {
    event.preventDefault();
    event.stopPropagation();
    
    const video = wrapper.querySelector('video');
    const overlay = wrapper.querySelector('.center-play-overlay');
    const btn = wrapper.querySelector('.play-btn');

    if (video.paused) {
        video.play();
        overlay.style.opacity = '0';
        btn.innerText = "❚❚";
    } else {
        video.pause();
        overlay.style.opacity = '1';
        btn.innerText = "▶";
    }
}

// ================= ENHANCED PAGE 6: 3D QUIZ LOGIC =================
const quizQuestions = [
    {
        q: "BTS ka full form kya hai? 💜",
        options: ["Beyond The Scene", "Big Time Stars", "Bangtan Sonyeondan", "Best Talent Show"],
        correct: 2,
        praise: "ARMY Queen! 💜👑 Perfect answer!",
        roast: "Arre ARMY ban gyi ho ya fan? 😂 Study karo!"
    },
    {
        q: "Foundation se PEHLE kya lagta hai? 💄",
        options: ["Lipstick", "Primer", "Mascara", "Blush"],
        correct: 1,
        praise: "Pro Makeup Artist! ✨ Foundation ke liye ready!",
        roast: "Nakli makeup artist! 🤮 Primer bhul gyi gadhi?"
    },
    {
        q: "Humari friendship kitne din se hai? ❤️",
        options: ["300", "526", "700", "1000"],
        correct: 1,
        praise: "Dil se yaad rakha! 🥰 526 days strong! 💪",
        roast: "Bhul gyi meri value? 😭 Calculator nikal lo!"
    },
    {
        q: "BTS me kitne members? 🎤",
        options: ["5", "6", "7", "8"],
        correct: 2,
        praise: "True ARMY! 🔥 7 magic numbers!",
        roast: "Fake fan alert! 🚨 BTS ka count bhul gyi?"
    },
    {
        q: "tekoo kya lgta he mein teekoo kitna janta hun? 😎",
        options: ["msg ke ke btau gi ", "bilkul 0", "kuch keh nhi skte", "pta nhi"],
        correct: 0,
        praise: "Bestie material! 🥳 Oggy forever! ❤️",
        roast: "message krke btana he? "
    },
    {
        q: "Contouring kis liye? ✨",
        options: ["Color ke liye", "Face shape define", "Glow ke liye", "Timepass"],
        correct: 1,
        praise: "Makeup genius! 🎨 Face sculpting queen!",
        roast: "Basic bhi nahi pata? 😩 Contouring seekho!"
    },
    {
        q: "BTS ka iconic song? 🌟",
        options: ["Dynamite", "Butter", "Boy With Luv", "Sab best!"],
        correct: 3,
        praise: "Dil se dil tak! 💜 True BTS lover! 😍",
        roast: "Ek bhi nahi pata? 😭 Playlist bhej dun?"
    }
];

let currentQuizIndex = 0;
let quizScore = 0;

function initPage6() {
    currentQuizIndex = 0;
    quizScore = 0;
    document.getElementById('quiz-intro').classList.remove('hidden');
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-reaction').classList.add('hidden');
    updateQuizScore();
}

function startQuiz() {
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const content = document.getElementById('quiz-content');
    
    if (currentQuizIndex >= quizQuestions.length) {
        const percentage = Math.round((quizScore / quizQuestions.length) * 100);
        let finalMsg = "";
        
        if (percentage === 100) {
            finalMsg = "🎉 PERFECT SCORE! 🏆\nTum toh meri true soulmate ho! 💖✨";
        } else if (percentage >= 70) {
            finalMsg = "😍 Awesome job! 🎊\nBestie level unlocked! 🥳";
        } else if (percentage >= 50) {
            finalMsg = "😂 Not bad! 😜\nPractice karo, next time full marks! 💪";
        } else {
            finalMsg = "🤣 Fail ho gyi! 😭\nPar pyar toh same hai! ❤️😂";
        }
        
        content.innerHTML = `
            <div class="quiz-result">
                <h3>Quiz Complete! 🎊</h3>
                <p style="font-size: 1.5rem; font-weight: bold; color: white;">
                    Final Score: ${quizScore}/${quizQuestions.length} 
                    (${percentage}%)
                </p>
                <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 20px; margin: 20px 0; font-size: 1.2rem;">
                    ${finalMsg}
                </div>
                <button class="btn-primary-3d" onclick="changePage(6, 7)">Next Adventure ➡️✨</button>
            </div>
        `;
        return;
    }
    
    const q = quizQuestions[currentQuizIndex];
    content.innerHTML = `
        <div class="quiz-question">Q${currentQuizIndex + 1}: ${q.q}</div>
        <div class="quiz-options">
            ${q.options.map((opt, i) => 
                `<div class="quiz-option" onclick="checkQuizAnswer(${i})">${opt}</div>`
            ).join('')}
        </div>
    `;
}

function checkQuizAnswer(selectedIndex) {
    const q = quizQuestions[currentQuizIndex];
    const options = document.querySelectorAll('.quiz-option');
    const reactionDiv = document.getElementById('quiz-reaction');
    
    // Disable all options
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selectedIndex === q.correct) {
        // Correct answer
        options[selectedIndex].classList.add('correct');
        quizScore++;
        updateQuizScore();
        
        reactionDiv.innerHTML = `<div class="reaction-praise">${q.praise} 🎉</div>`;
        reactionDiv.classList.remove('hidden');
        
        setTimeout(() => {
            reactionDiv.classList.add('hidden');
            currentQuizIndex++;
            renderQuizQuestion();
        }, 2000);
    } else {
        // Wrong answer
        options[selectedIndex].classList.add('wrong');
        options[q.correct].classList.add('correct');
        
        reactionDiv.innerHTML = `<div class="reaction-roast">${q.roast} 😂</div>`;
        reactionDiv.classList.remove('hidden');
        
        setTimeout(() => {
            reactionDiv.classList.add('hidden');
            currentQuizIndex++;
            renderQuizQuestion();
        }, 2500);
    }
}

function updateQuizScore() {
    document.getElementById('quiz-score').innerText = 
        `Score: ${quizScore}/${quizQuestions.length} 💖`;
}

// ================= PAGE 7: EMOTIONAL LETTER LOGIC =================
function initPage7() {
    // Reset states
    document.getElementById('envelope-letter').classList.remove('opening', 'hidden');
    document.getElementById('letter-paper').classList.add('hidden');
    document.getElementById('letter-paper').classList.remove('visible');
    document.getElementById('signature-placeholder').classList.remove('hidden');
    document.getElementById('signature-canvas').classList.add('hidden');
    
    // Start letter music
    const music = document.getElementById('letterMusic');
    if(music) {
        music.volume = 0.4;
        music.play().catch(e => console.log("Music needs interaction"));
    }
    
    // Create floating hearts
    createLetterHearts();
}

function openLetter() {
    const envelope = document.getElementById('envelope-letter');
    const paper = document.getElementById('letter-paper');
    
    // Animate envelope opening
    envelope.classList.add('opening');
    
    setTimeout(() => {
        envelope.classList.add('hidden');
        paper.classList.remove('hidden');
        
        // Trigger reflow
        void paper.offsetWidth;
        
        paper.classList.add('visible');
    }, 800);
}

function addSignature() {
    const placeholder = document.getElementById('signature-placeholder');
    const canvas = document.getElementById('signature-canvas');
    
    placeholder.classList.add('hidden');
    canvas.classList.remove('hidden');
    
    // Draw signature using canvas
    const ctx = canvas.getContext('2d');
    canvas.width = 250;
    canvas.height = 80;
    
    // Signature animation
    ctx.font = "40px 'Dancing Script', cursive";
    ctx.fillStyle = "#ff1493";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    let text = "Nita";
    let index = 0;
    
    const drawSignature = setInterval(() => {
        if(index <= text.length) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText(text.substring(0, index), canvas.width/2, canvas.height/2);
            index++;
        } else {
            clearInterval(drawSignature);
            // Add sparkles
            addSparkles(ctx, canvas.width, canvas.height);
        }
    }, 200);
}

function addSparkles(ctx, width, height) {
    ctx.fillStyle = "gold";
    for(let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3 + 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createLetterHearts() {
    const container = document.querySelector('.letter-hearts-bg');
    if(!container) return;
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-50px';
        heart.style.fontSize = Math.random() * 20 + 20 + 'px';
        heart.style.animation = `floatUp ${Math.random() * 3 + 4}s linear`;
        heart.style.opacity = '0.7';
        heart.style.pointerEvents = 'none';
        
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 7000);
    }, 800);
}

// CSS Animation (add to CSS)
const floatUpKeyframes = `
@keyframes floatUp {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}
`;
// ================= PAGE 8: CASSETTE PLAYER LOGIC =================
const playlist = [
    {
        title: "Dynamite",
        artist: "BTS",
        file: "songs/dynamite.mp3", // 👈 Tumhara MP3 path
        startTime: 8 // Seconds (skip intro)
    },
    {
        title: "Dil Tu Jaan Tu",
        artist: "Gurnazar",
        file: "songs/dil-tu-jaan-tu.mp3", // 👈 Tumhara MP3 path
        startTime: 15
    },
    {
        title: "Finding Her",
        artist: "Aakash Gandhi",
        file: "songs/finding-her.mp3", // 👈 Tumhara MP3 path
        startTime: 10
    },
    {
        title: "If The World Was Ending",
        artist: "JP Saxe ft. Julia Michaels",
        file: "songs/if-the-world-was-ending.mp3", // 👈 Tumhara MP3 path
        startTime: 12
    },
    {
        title: "Pretty Little Baby",
        artist: "Karan Aujla",
        file: "songs/pretty-little-baby.mp3", // 👈 Tumhara MP3 path
        startTime: 18
    },
    {
        title: "Boy With Luv",
        artist: "BTS ft. Halsey",
        file: "songs/boy-with-luv.mp3", // 👈 Tumhara MP3 path
        startTime: 10
    }
];

let currentSongIndex = 0;
let isPlaying = false;

function initPage8() {
    currentSongIndex = 0;
    isPlaying = false;
    renderSongList();
    loadSong(0);
    
    // Stop animations
    document.querySelectorAll('.reel').forEach(r => r.classList.remove('spinning'));
    document.getElementById('tape-strip').classList.remove('moving');
    document.getElementById('play-btn').innerText = '▶️';
}

function renderSongList() {
    const container = document.getElementById('song-items');
    container.innerHTML = playlist.map((song, index) => `
        <div class="song-item ${index === 0 ? 'active' : ''}" onclick="loadSong(${index})">
            <span class="song-item-number">${index + 1}.</span>
            <div>
                <div>${song.title}</div>
                <div style="font-size: 0.8rem; color: #666;">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

function loadSong(index) {
    const audio = document.getElementById('cassette-audio');
    
    // Stop current song
    if(isPlaying) {
        audio.pause();
        isPlaying = false;
        document.getElementById('play-btn').innerText = '▶️';
        document.querySelectorAll('.reel').forEach(r => r.classList.remove('spinning'));
        document.getElementById('tape-strip').classList.remove('moving');
    }
    
    currentSongIndex = index;
    const song = playlist[index];
    
    // Update UI
    document.getElementById('song-title').innerText = song.title;
    document.getElementById('song-artist').innerText = song.artist;
    
    // Highlight active song
    document.querySelectorAll('.song-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Load audio file
    audio.src = song.file;
    audio.currentTime = song.startTime; // Skip to lyrics
    audio.volume = 0.7;
    
    // Reset progress
    document.getElementById('progress-bar').style.width = '0%';
}

function toggleCassettePlay() {
    const audio = document.getElementById('cassette-audio');
    const playBtn = document.getElementById('play-btn');
    const reels = document.querySelectorAll('.reel');
    const tape = document.getElementById('tape-strip');
    
    if(isPlaying) {
        audio.pause();
        playBtn.innerText = '▶️';
        reels.forEach(r => r.classList.remove('spinning'));
        tape.classList.remove('moving');
        isPlaying = false;
    } else {
        audio.play().catch(() => {
            alert('⚠️ Audio file not found! Check file path.');
        });
        playBtn.innerText = '⏸️';
        reels.forEach(r => r.classList.add('spinning'));
        tape.classList.add('moving');
        isPlaying = true;
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    if(isPlaying) {
        setTimeout(() => toggleCassettePlay(), 300);
    }
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if(isPlaying) {
        setTimeout(() => toggleCassettePlay(), 300);
    }
}

function changeVolume(value) {
    const audio = document.getElementById('cassette-audio');
    audio.volume = value / 100;
}

function updateProgress() {
    const audio = document.getElementById('cassette-audio');
    if(audio.duration && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress-bar').style.width = percent + '%';
    }
}
// ================= PAGE 9: WISHES 2026 LOGIC =================
const wishes2026 = [
    {
        label: "wish 1",
        emoji: "💄",
        text: "2026 mein teri makeup skills aur bhi pro level ho jaaye! Har look viral ho! ✨"
    },
    {
        label: "eyes colse kr or wish kr sugle",
        emoji: "💜",
        text: "BTS ke saath concert mein jaane ka sapna poora ho! Army forever! 🎤"
    },
    {
        label: "Wish 3",
        emoji: "😂",
        text: "Roz hasi aur masti bani rahe! Gussa kam, khushi zyada! 🌈"
    },
    {
        label: "Wish 4",
        emoji: "🤭",
        text: "bdi artist bn or mekoo world ture pe le ja haha"
    },
    {
        label: "Wish 5",
        emoji: "🤝",
        text: "wish all your dreams came true ♾️❤️"
    },
    {
        label: "Wish 6",
        emoji: "✨",
        text: "Har din kuch naya seekho, khush raho aur shine karo! You're amazing! 🌟"
    }
];

let wishesOpened = 0;

function initPage9() {
    wishesOpened = 0;
    renderWishes();
    updateWishProgress();
    document.getElementById('wishes-next-btn').classList.add('hidden');
}

function renderWishes() {
    const grid = document.getElementById('wishes-grid');
    grid.innerHTML = '';
    
    wishes2026.forEach((wish, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'wish-envelope-wrapper';
        wrapper.onclick = () => openWish(index);
        
        wrapper.innerHTML = `
            <div class="wish-envelope-card">
                <div class="wish-envelope-front">
                    <div class="envelope-icon">💌</div>
                    <div class="envelope-label">${wish.label}</div>
                </div>
                <div class="wish-envelope-back">
                    <div class="wish-content">
                        <span class="wish-emoji">${wish.emoji}</span>
                        <p class="wish-text">${wish.text}</p>
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(wrapper);
    });
}

function openWish(index) {
    const wrapper = document.querySelectorAll('.wish-envelope-wrapper')[index];
    
    if (!wrapper.classList.contains('flipped')) {
        wrapper.classList.add('flipped');
        wishesOpened++;
        updateWishProgress();
        
        // Check if all opened
        if (wishesOpened === wishes2026.length) {
            setTimeout(() => {
                document.getElementById('wishes-next-btn').classList.remove('hidden');
                showMsgModal("Sab Wishes Padh Li! 🎉", "2026 amazing hone wala hai! Ready for next adventure? 🚀", null);
            }, 1000);
        }
    }
}

function updateWishProgress() {
    document.getElementById('wishes-opened').innerText = wishesOpened;
    document.getElementById('wishes-total').innerText = wishes2026.length;
}
/*
* ================= PAGE 10: CANVAS 2D + GSAP (FINAL LOGIC) =================
* Needs:
* - GSAP loaded
* - HTML: #p-10 > #p10-canvas and #p10-skip
*/

let P10 = {
  canvas: null,
  ctx: null,
  w: 0,
  h: 0,
  dpr: 1,
  raf: null,
  tl: null,
  running: false,
  _midTimer: null,
  _lastSecondShown: null,

  state: {
    phase: "intro",      // intro | dot | black | live | countdown | finale
    introAlpha: 0,
    dotGlow: 0,
    blackAlpha: 0,

    // live countdown units
    liveDays: 0,
    liveHours: 0,
    liveMinutes: 0,
    liveSeconds: 0,

    // last 10 sec
    count: 10,
    punch: 0,

    // finale
    titleAlpha: 0,
    particles: [],
    confetti: []
  }
};

function initPage10(){
  P10.canvas = document.getElementById("p10-canvas");
  if (!P10.canvas) { console.error("p10-canvas not found"); return; }

  P10.ctx = P10.canvas.getContext("2d", { alpha: true });
  p10Resize();

  // reset
  P10.state.phase = "intro";
  P10.state.introAlpha = 0;
  P10.state.dotGlow = 0;
  P10.state.blackAlpha = 0;
  P10.state.count = 10;
  P10.state.punch = 0;
  P10.state.titleAlpha = 0;
  P10.state.particles = [];
  P10.state.confetti = [];
  P10._lastSecondShown = null;

  // loop
  P10.running = true;
  cancelAnimationFrame(P10.raf);
  p10Loop();

  // GSAP timeline (intro -> dot -> black -> live sync)
  if (P10.tl) P10.tl.kill();
  P10.tl = gsap.timeline();

  P10.tl
    .set(P10.state, { phase: "intro" })
    .to(P10.state, { introAlpha: 1, duration: 1.0, ease: "power2.out" })
    .to(P10.state, { introAlpha: 0, duration: 0.7, ease: "power2.in" }, "+=1.0")

    .set(P10.state, { phase: "dot" })
    .to(P10.state, { dotGlow: 1, duration: 0.9, ease: "power2.out" })
    .to(P10.state, { dotGlow: 0.25, duration: 0.5, yoyo: true, repeat: 2, ease: "sine.inOut" })

    // black screen very short
    .set(P10.state, { phase: "black" })
    .fromTo(P10.state, { blackAlpha: 0 }, { blackAlpha: 1, duration: 0.25, ease: "power2.out" })
    .to(P10.state, { blackAlpha: 0, duration: 0.25, ease: "power2.in" }, "+=0.6")

    // start live sync
    .add(() => p10SyncWithMidnight());

  // Skip
  const skipBtn = document.getElementById("p10-skip");
  if (skipBtn) {
    skipBtn.onclick = () => p10SkipToLast10();
  }

  window.addEventListener("resize", p10Resize);
}

function cleanupPage10(){
  P10.running = false;
  if (P10.tl) P10.tl.kill();
  cancelAnimationFrame(P10.raf);
  window.removeEventListener("resize", p10Resize);
  if (P10._midTimer) clearInterval(P10._midTimer);
}

function p10Resize(){
  P10.dpr = Math.min(window.devicePixelRatio || 1, 2);
  P10.w = window.innerWidth;
  P10.h = window.innerHeight;

  P10.canvas.width = Math.floor(P10.w * P10.dpr);
  P10.canvas.height = Math.floor(P10.h * P10.dpr);
  P10.canvas.style.width = P10.w + "px";
  P10.canvas.style.height = P10.h + "px";

  P10.ctx.setTransform(P10.dpr, 0, 0, P10.dpr, 0, 0);
}

function p10Loop(){
  if (!P10.running) return;

  const ctx = P10.ctx;
  const w = P10.w, h = P10.h;

  // background
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  // soft glow
  const bg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.65);
  bg.addColorStop(0, "rgba(30,40,90,0.25)");
  bg.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // phase draw
  if (P10.state.phase === "intro") p10DrawIntro(ctx);
  if (P10.state.phase === "dot") p10DrawDot(ctx);
  if (P10.state.phase === "black") p10DrawBlack(ctx);
  if (P10.state.phase === "live") p10DrawLiveCountdown(ctx);
  if (P10.state.phase === "countdown") p10DrawCountdown(ctx);
  if (P10.state.phase === "finale") p10DrawFinale(ctx);

  // FX
  p10UpdateFireworks();
  p10DrawFireworks(ctx);

  p10UpdateConfetti();
  p10DrawConfetti(ctx);

  P10.raf = requestAnimationFrame(p10Loop);
}

/* ---------------- PHASE DRAWS ---------------- */

function p10DrawIntro(ctx){
  ctx.save();
  ctx.globalAlpha = P10.state.introAlpha;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255,255,255,0.25)";
  ctx.shadowBlur = 18;

  ctx.font = "700 34px Arial";
  ctx.fillText("Ab time aa chuka hai 2026 ko welcome karne ka…", P10.w/2, P10.h/2 - 12);

  ctx.font = "400 18px Arial";
  ctx.globalAlpha = P10.state.introAlpha * 0.85;
  ctx.fillText("Bas thoda sa wait…", P10.w/2, P10.h/2 + 28);
  ctx.restore();
}

function p10DrawDot(ctx){
  const x = P10.w/2, y = P10.h/2;
  const glow = P10.state.dotGlow;

  ctx.save();

  const g = ctx.createRadialGradient(x, y, 0, x, y, 140);
  g.addColorStop(0, `rgba(255,255,255,${0.85*glow})`);
  g.addColorStop(0.2, `rgba(74,144,226,${0.35*glow})`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 140, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, 10 + glow*10, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
}

function p10DrawBlack(ctx){
  ctx.save();
  ctx.globalAlpha = P10.state.blackAlpha;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, P10.w, P10.h);
  ctx.restore();
}

/* LIVE TOTAL COUNTDOWN (D/H/M/S) */
function p10DrawLiveCountdown(ctx){
  const x = P10.w/2;
  const y = P10.h/2;

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";

  ctx.shadowColor = "rgba(74,144,226,0.35)";
  ctx.shadowBlur = 25;

  ctx.font = "800 38px Arial";
  ctx.fillText("New Year Countdown", x, y - 90);

  ctx.shadowBlur = 40;
  ctx.font = "900 58px Arial";

  const dd = String(P10.state.liveDays).padStart(2, "0");
  const hh = String(P10.state.liveHours).padStart(2, "0");
  const mm = String(P10.state.liveMinutes).padStart(2, "0");
  const ss = String(P10.state.liveSeconds).padStart(2, "0");

  ctx.fillText(`${dd} : ${hh} : ${mm} : ${ss}`, x, y - 20);

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.75;
  ctx.font = "600 16px Arial";
  ctx.fillText("Days : Hours : Minutes : Seconds", x, y + 20);

  ctx.globalAlpha = 0.55;
  ctx.font = "500 14px Arial";
  ctx.fillText("Last 10 seconds pe suspense mode on hoga…", x, y + 55);

  ctx.restore();
}

function p10DrawCountdown(ctx){
  const x = P10.w/2;
  const y = P10.h/2;

  const shake = 10 * P10.state.punch;
  const ox = (Math.random()-0.5) * shake;
  const oy = (Math.random()-0.5) * shake;

  ctx.save();
  ctx.translate(ox, oy);

  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(74,144,226,0.7)";
  ctx.shadowBlur = 40;

  ctx.font = "900 190px Arial";
  ctx.fillText(String(Math.max(P10.state.count, 0)), x, y + 65);

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.7;
  ctx.font = "600 18px Arial";
  ctx.fillText("New Year incoming…", x, y + 120);

  ctx.restore();
}

function p10DrawFinale(ctx){
  if (Math.random() < 0.06) {
    p10Burst(Math.random()*P10.w, Math.random()*P10.h*0.55 + P10.h*0.1);
  }

  ctx.save();
  ctx.globalAlpha = P10.state.titleAlpha;
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";

  ctx.shadowColor = "rgba(255,215,0,0.75)";
  ctx.shadowBlur = 28;

  ctx.font = "900 64px Arial";
  ctx.fillText("Happy New Year 2026", P10.w/2, P10.h*0.33);

  ctx.shadowColor = "rgba(255,105,180,0.55)";
  ctx.shadowBlur = 18;
  ctx.font = "600 20px Arial";
  ctx.fillText("May this year be full of love, luck & smiles.", P10.w/2, P10.h*0.33 + 44);

  ctx.restore();
}

/* ---------------- LOGIC / SYNC ---------------- */

function p10SyncWithMidnight(){
  // target: Jan 1, 2026 00:00:00 local time
  const target = new Date("Jan 1, 2026 00:00:00").getTime();

  if (P10._midTimer) clearInterval(P10._midTimer);
  P10._lastSecondShown = null;

  const tick = () => {
    const diffMs = target - Date.now();

    if (diffMs <= 0) {
      p10TriggerFinale();
      clearInterval(P10._midTimer);
      return;
    }

    // total seconds remaining
    const totalSec = Math.ceil(diffMs / 1000);

    // if last 10 sec -> suspense
    if (totalSec <= 10) {
      P10.state.phase = "countdown";
      P10.state.count = totalSec;

      if (P10._lastSecondShown !== totalSec) {
        P10._lastSecondShown = totalSec;
        gsap.fromTo(P10.state, { punch: 1 }, { punch: 0, duration: 0.25, ease: "power2.out" });
      }
      return;
    }

    // otherwise show LIVE total countdown
    P10.state.phase = "live";

    const days = Math.floor(totalSec / (24 * 3600));
    const rem1 = totalSec % (24 * 3600);
    const hours = Math.floor(rem1 / 3600);
    const rem2 = rem1 % 3600;
    const minutes = Math.floor(rem2 / 60);
    const seconds = rem2 % 60;

    P10.state.liveDays = days;
    P10.state.liveHours = hours;
    P10.state.liveMinutes = minutes;
    P10.state.liveSeconds = seconds;
  };

  tick();
  P10._midTimer = setInterval(tick, 100); // smooth + stable
}

function p10SkipToLast10(){
  // stop live syncing (optional)
  if (P10._midTimer) clearInterval(P10._midTimer);

  // force last 10 sec suspense
  P10.state.phase = "countdown";
  P10.state.count = 10;
  P10._lastSecondShown = null;

  // run 10..0 locally
  let sec = 10;
  const local = setInterval(() => {
    sec--;
    P10.state.count = Math.max(sec, 0);

    gsap.fromTo(P10.state, { punch: 1 }, { punch: 0, duration: 0.25, ease: "power2.out" });

    if (sec <= 0) {
      clearInterval(local);
      p10TriggerFinale();
    }
  }, 1000);
}

function p10TriggerFinale(){
  if (P10.state.phase === "finale") return;

  P10.state.phase = "finale";

  gsap.to(P10.state, { titleAlpha: 1, duration: 1.2, ease: "elastic.out(1,0.55)" });

  for (let i=0;i<7;i++){
    p10Burst(Math.random()*P10.w, Math.random()*P10.h*0.5 + P10.h*0.1);
  }

  p10SpawnConfetti(220);
}

/* ---------------- Fireworks Particles ---------------- */

function p10Burst(x, y){
  const hue = Math.floor(Math.random()*360);
  for (let i=0; i<70; i++){
    const a = Math.random()*Math.PI*2;
    const sp = 2 + Math.random()*7;
    P10.state.particles.push({
      x, y,
      vx: Math.cos(a)*sp,
      vy: Math.sin(a)*sp,
      life: 1,
      decay: 0.012 + Math.random()*0.02,
      hue
    });
  }
}

function p10UpdateFireworks(){
  const arr = P10.state.particles;
  for (let i=arr.length-1; i>=0; i--){
    const p = arr[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.09;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.life -= p.decay;
    if (p.life <= 0) arr.splice(i,1);
  }
}

function p10DrawFireworks(ctx){
  const arr = P10.state.particles;
  ctx.save();
  for (const p of arr){
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = `hsl(${p.hue}, 100%, 60%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.3, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------- Confetti ---------------- */

function p10SpawnConfetti(n){
  const colors = ["#FFD700","#FF69B4","#00BFFF","#00FF88","#FF6347","#A78BFA"];
  for (let i=0;i<n;i++){
    P10.state.confetti.push({
      x: Math.random()*P10.w,
      y: -20 - Math.random()*P10.h*0.2,
      vx: (Math.random()-0.5)*2,
      vy: 2 + Math.random()*4,
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-0.5)*0.2,
      size: 6 + Math.random()*6,
      color: colors[Math.floor(Math.random()*colors.length)]
    });
  }
}

function p10UpdateConfetti(){
  const c = P10.state.confetti;
  for (let i=c.length-1; i>=0; i--){
    const o = c[i];
    o.x += o.vx;
    o.y += o.vy;
    o.rot += o.vr;
    o.vy *= 0.999;
    o.vy += 0.02;
    if (o.y > P10.h + 40) c.splice(i,1);
  }
}

function p10DrawConfetti(ctx){
  const c = P10.state.confetti;
  ctx.save();
  for (const o of c){
    ctx.translate(o.x, o.y);
    ctx.rotate(o.rot);
    ctx.fillStyle = o.color;
    ctx.fillRect(-o.size/2, -o.size/2, o.size, o.size*0.6);
    ctx.setTransform(P10.dpr,0,0,P10.dpr,0,0);
  }
  ctx.restore();
}
