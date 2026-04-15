const quizData = [
    {
        step: 1,
        question: "Where is your home located?",
        type: "input",
        inputType: "number",
        placeholder: "Enter NY ZIP Code",
        name: "zipcode"
    },
    {
        step: 2,
        question: "What service do you need?",
        type: "options",
        options: ["New Installation", "Repair & Maintenance"],
        name: "service_type"
    },
    {
        step: 3,
        question: "Do you own this home?",
        type: "options",
        options: ["Yes, I own it", "No, I am renting"],
        name: "homeowner"
    },
    {
        step: 4,
        question: "What is your current heating system?",
        type: "options",
        options: ["Natural Gas", "Oil", "Electric Baseboard", "Propane", "Existing Heat Pump"],
        name: "current_heating"
    },
    {
        step: 5,
        question: "What is your primary goal?",
        type: "options",
        options: ["Lower Energy Bills", "Get State Rebates", "Fix Broken System", "Routine Maintenance"],
        name: "goal"
    },
    {
        step: 6,
        question: "When do you need this done?",
        type: "options",
        options: ["ASAP (Emergency)", "Within 1-3 Months", "Just Researching"],
        name: "timeline"
    },
    {
        step: 7,
        question: "Excellent! We found local pros in your area.",
        subtitle: "Where should we send your free estimates?",
        type: "contact",
        name: "contact_info"
    }
];

let currentStep = 0;
const leadData = {};

function startQuiz() {
    // Hide Hero text, show Quiz
    document.getElementById('hero-content').style.display = 'none';
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.style.display = 'block';
    
    renderStep();
}

function renderStep() {
    const content = document.getElementById('quiz-content');
    const progress = document.getElementById('progress-fill');
    
    // Update progress bar
    progress.style.width = `${((currentStep) / quizData.length) * 100}%`;
    
    const stepData = quizData[currentStep];
    
    let html = `<div class="quiz-question">${stepData.question}</div>`;
    
    if (stepData.subtitle) {
        html += `<p style="color:var(--gray); margin-bottom:20px; font-size:18px;">${stepData.subtitle}</p>`;
    }

    if (stepData.type === 'options') {
        html += `<div class="quiz-options">`;
        stepData.options.forEach(option => {
            html += `<button class="quiz-option" onclick="handleOption('${stepData.name}', '${option}')">
                        <span style="flex-grow: 1">${option}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                     </button>`;
        });
        html += `</div>`;
    } else if (stepData.type === 'input') {
        html += `
            <input type="${stepData.inputType}" id="quiz-input-val" class="quiz-input" placeholder="${stepData.placeholder}" autocomplete="postal-code">
            <button class="quiz-btn" onclick="handleInput('${stepData.name}')">Continue</button>
        `;
    } else if (stepData.type === 'contact') {
        html += `
            <div style="display:flex; gap:15px; margin-bottom:15px;">
                <input type="text" id="fname" class="quiz-input" style="margin-bottom:0;" placeholder="First Name" required>
                <input type="text" id="lname" class="quiz-input" style="margin-bottom:0;" placeholder="Last Name" required>
            </div>
            <input type="email" id="email" class="quiz-input" style="margin-bottom:15px;" placeholder="Email Address" required>
            <input type="tel" id="phone" class="quiz-input" style="margin-bottom:15px;" placeholder="Phone Number" required>
            
            <button class="quiz-btn" onclick="submitLead()" style="background:var(--secondary);">Get My Free Quotes</button>
            
            <div class="tcpa-text">
                <input type="checkbox" id="tcpa" checked>
                <label for="tcpa">
                    By clicking 'Get My Free Quotes', I agree to the Privacy Policy and consent to receive automated calls/texts from NewYorkHeatPump and its network of local HVAC contractors at the phone number provided, even if I am on a Do Not Call list. Consent is not a condition of purchase.
                </label>
            </div>
        `;
    }
    
    // Add fade-in animation by resetting content gently
    content.style.opacity = 0;
    content.innerHTML = html;
    
    // Trigger layout reflow
    void content.offsetWidth;
    
    content.style.transition = 'opacity 0.3s ease';
    content.style.opacity = 1;
    
    // Focus input if available
    const inputEl = document.getElementById('quiz-input-val');
    if(inputEl) inputEl.focus();
}

function handleOption(key, value) {
    leadData[key] = value;
    nextStep();
}

function handleInput(key) {
    const val = document.getElementById('quiz-input-val').value;
    if (!val) {
        alert("Please enter a valid response.");
        return;
    }
    leadData[key] = val;
    nextStep();
}

function nextStep() {
    currentStep++;
    if (currentStep < quizData.length) {
        renderStep();
    }
}

function submitLead() {
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const tcpa = document.getElementById('tcpa').checked;
    
    if(!fname || !lname || !email || !phone) {
        alert("Please fill in all fields so we can send your quotes.");
        return;
    }
    
    if(!tcpa) {
        alert("You must agree to the terms to receive quotes.");
        return;
    }
    
    leadData['firstName'] = fname;
    leadData['lastName'] = lname;
    leadData['email'] = email;
    leadData['phone'] = phone;
    
    // 1. Change button to "Sending..." to prevent multiple clicks
    const submitBtn = document.querySelector('button[onclick="submitLead()"]');
    if (submitBtn) {
        submitBtn.innerHTML = "Sending...";
        submitBtn.disabled = true;
    }
    
    // 2. Here is where the data is sent! (n8n, Zapier, Make, etc.)
    const WEBHOOK_URL = "https://your-n8n-server.com/webhook/heatpump-lead"; // ⚠️ ضع رابط الـ Webhook الخاص بك هنا
    
    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(leadData)
    })
    .then(response => {
        // 3. Show Success Message immediately after sending
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div style="padding: 40px 20px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" style="margin-bottom:20px;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h2 style="font-size:32px; font-weight:800; color:var(--dark); margin-bottom:15px;">You're All Set!</h2>
                <p style="color:var(--gray); font-size:18px;">Our local NY partners will be in touch shortly to provide your free quotes and check your rebate eligibility.</p>
            </div>
        `;
        document.getElementById('progress-fill').style.width = '100%';
    })
    .catch(error => {
        console.error("Error sending lead:", error);
        alert("Connection error. Please try again.");
        if (submitBtn) {
            submitBtn.innerHTML = "Get My Free Quotes";
            submitBtn.disabled = false;
        }
    });
}
