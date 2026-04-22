console.log("HireLeap Extension Loaded");

let lastJobText = "";

/* ==========================================
   DEMO USER TYPE
   guest | free | pro
   Change manually for now
========================================== */
let USER_TYPE = "free";

/* ==========================================
   OBSERVER
========================================== */
const observer = new MutationObserver(() => {
  detectJob();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

/* ==========================================
   CHECK JOB PAGE
========================================== */
function isJobDetailPage() {
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const url = window.location.href.toLowerCase();

  if (host.includes("linkedin.com")) {
    return (
      path.includes("/jobs/view/") ||
      path.includes("/jobs/search-results/") ||
      url.includes("currentjobid=")
    );
  }

  if (host.includes("indeed.")) return path.includes("/viewjob");
  if (host.includes("naukri.com")) return path.includes("/job-listings");
  if (host.includes("shine.com")) return path.includes("/jobs/");
  if (host.includes("dice.com")) return path.includes("/job-detail/");
  if (host.includes("glassdoor"))
    return path.includes("/joblisting") || path.includes("/job/");
  if (host.includes("monster.com")) return path.includes("/job-openings/");
  if (host.includes("ziprecruiter")) return path.includes("/jobs/");

  return false;
}

/* ==========================================
   MAIN DETECTION
========================================== */
function detectJob() {
  if (!isJobDetailPage()) {
    removePopup();
    return;
  }

  const jdText = getJobText();

  if (!jdText) return;

  if (jdText === lastJobText) return;

  lastJobText = jdText;

  removePopup();

  showPopup(jdText);
}

/* ==========================================
   SCRAPE JOB DESCRIPTION
========================================== */
function getJobText() {
  const selectors = [
    ".jobs-description-content__text",
    ".jobs-box__html-content",
    ".jobs-search__job-details--container",
    ".jobs-description",
    "#jobDescriptionText",
    ".jobsearch-jobDescriptionText",
    ".styles_job-desc-container__txpYf",
    ".job-desc",
    ".job-description",
    "[class*='description']",
    "article",
    "main",
  ];

  for (let selector of selectors) {
    const el = document.querySelector(selector);

    if (el && el.innerText && el.innerText.trim().length > 150) {
      return el.innerText.trim();
    }
  }

  return null;
}

/* ==========================================
   FLOATING BUTTON
========================================== */
function showPopup(jdText) {
  removePopup();

  const popup = document.createElement("div");
  popup.id = "hireleap-popup";

  popup.innerHTML = `
    <div style="font-size:24px;">🚀</div>

    <div style="font-size:22px;font-weight:700;margin-top:10px;line-height:1.3;">
      Analyze this job with HireLeap
    </div>

    <button id="hlAnalyzeBtn">
      Analyze Now
    </button>
  `;

  popup.style.cssText = `
    position:fixed;
    bottom:28px;
    right:28px;
    width:310px;
    background:linear-gradient(135deg,#5B5CF0,#7C3AED);
    color:white;
    padding:20px;
    border-radius:18px;
    box-shadow:0 15px 35px rgba(0,0,0,.20);
    z-index:999999999;
    font-family:Arial,sans-serif;
  `;

  document.body.appendChild(popup);

  document.getElementById("hlAnalyzeBtn").onclick = async () => {
    removePopup();

    if (USER_TYPE === "guest") {
      showGuestPanel();
      return;
    }

    const fakeData = {
      score: 84,
      strengths: ["SQL", "Excel", "Analytics"],
      missingSkills: ["Power BI", "Stakeholder Management", "Python"],
      tips: [
        "Add measurable achievements",
        "Mention dashboard projects",
        "Use keywords from JD",
        "Highlight reporting experience",
      ],
    };

    if (USER_TYPE === "free") {
      showFreePanel(fakeData);
    }

    if (USER_TYPE === "pro") {
      showProPanel(fakeData);
    }
  };

  const btn = document.getElementById("hlAnalyzeBtn");

  btn.style.cssText = `
    margin-top:16px;
    width:100%;
    padding:13px;
    border:none;
    border-radius:12px;
    background:white;
    color:#5B5CF0;
    font-weight:700;
    font-size:15px;
    cursor:pointer;
  `;
}

function removePopup() {
  const old = document.getElementById("hireleap-popup");
  if (old) old.remove();
}

/* ==========================================
   PANEL BASE
========================================== */
function createBasePanel() {
  removePanel();

  const panel = document.createElement("div");
  panel.id = "hireleap-panel";

  panel.innerHTML = `
    <div class="hl-top">
      <div>
        <div class="hl-brand">🚀 HireLeap</div>
        <div class="hl-sub">AI Job Assistant</div>
      </div>

      <div id="hlClose">✕</div>
    </div>

    <div id="hlContent"></div>
  `;

  document.body.appendChild(panel);

  injectCSS();

  document.getElementById("hlClose").onclick = removePanel;

  return document.getElementById("hlContent");
}

function removePanel() {
  const old = document.getElementById("hireleap-panel");
  if (old) old.remove();
}

/* ==========================================
   GUEST USER
========================================== */
function showGuestPanel() {
  const content = createBasePanel();

  content.innerHTML = `
    <div class="hl-card center">

      <div class="hl-big">Unlock Your Dream Job Faster</div>

      <div class="hl-muted">
        Sign up free and get:
      </div>

      <div class="hl-list">
        ✔ Match Score <br>
        ✔ Missing Skills <br>
        ✔ Resume Improvements <br>
        ✔ Interview Questions <br>
        ✔ Market Insights
      </div>

      <button class="hl-main-btn" id="signupBtn">
        Create Free Account
      </button>

      <div class="hl-note">
        Trusted by ambitious jobseekers.
      </div>

    </div>
  `;

  document.getElementById("signupBtn").onclick = () => {
    window.open("https://hireleap.app/signup", "_blank");
  };
}

/* ==========================================
   FREE USER
========================================== */
function showFreePanel(data) {
  const content = createBasePanel();

  content.innerHTML = `
    <div class="hl-score">${data.score}%</div>
    <div class="hl-center-label">Good Match</div>

    <div class="hl-section-title">Missing Skills</div>

    ${data.missingSkills
      .map((x) => `<div class="hl-row">${x}</div>`)
      .join("")}

    <div class="hl-section-title">Quick Tips</div>

    ${data.tips.map((x) => `<div class="hl-row">${x}</div>`).join("")}

    <div class="hl-lock-card">
      🔒 Resume Rewrite <br>
      🔒 Mock Interviews <br>
      🔒 ATS Optimization <br>
      🔒 Salary Insights
    </div>

    <button class="hl-main-btn" id="upgradeBtn">
      Upgrade to Pro
    </button>
  `;

  document.getElementById("upgradeBtn").onclick = () => {
    window.open("https://hireleap.app/pricing", "_blank");
  };
}

/* ==========================================
   PRO USER
========================================== */
function showProPanel(data) {
  const content = createBasePanel();

  content.innerHTML = `
    <div class="hl-score">${data.score}%</div>
    <div class="hl-center-label">Strong Match</div>

    <div class="hl-section-title">Strengths</div>
    ${data.strengths.map((x) => `<div class="hl-chip">${x}</div>`).join("")}

    <div class="hl-section-title">Missing Skills</div>
    ${data.missingSkills
      .map(
        (x) => `
      <div class="hl-flex">
        <span>${x}</span>
        <button class="mini-btn">+ Add</button>
      </div>
    `
      )
      .join("")}

    <div class="hl-section-title">Improve Chances</div>
    ${data.tips.map((x) => `<div class="hl-row">${x}</div>`).join("")}

    <div class="hl-premium-box">
      🎯 Personalized Resume Rewrite Ready <br><br>
      🎤 Mock Interview Questions Ready <br><br>
      📈 Market Demand High
    </div>

    <button class="hl-main-btn" id="openAppBtn">
      Open HireLeap Dashboard
    </button>
  `;

  document.getElementById("openAppBtn").onclick = () => {
    window.open("https://hireleap.app/dashboard", "_blank");
  };
}

/* ==========================================
   CSS
========================================== */
function injectCSS() {
  if (document.getElementById("hireleap-style")) return;

  const style = document.createElement("style");
  style.id = "hireleap-style";

  style.innerHTML = `
#hireleap-panel{
position:fixed;
top:0;
right:0;
width:420px;
height:100vh;
background:#ffffff;
z-index:9999999999;
box-shadow:-8px 0 35px rgba(0,0,0,.12);
padding:22px;
overflow-y:auto;
font-family:Arial,sans-serif;
animation:slide .35s ease;
}

@keyframes slide{
from{right:-450px;}
to{right:0;}
}

.hl-top{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.hl-brand{
font-size:24px;
font-weight:700;
color:#111827;
}

.hl-sub{
font-size:13px;
color:#6B7280;
margin-top:4px;
}

#hlClose{
font-size:22px;
cursor:pointer;
}

.hl-card{
background:#F8F9FF;
padding:24px;
border-radius:18px;
}

.center{text-align:center;}

.hl-big{
font-size:26px;
font-weight:700;
line-height:1.3;
margin-bottom:12px;
}

.hl-muted{
color:#6B7280;
margin-bottom:16px;
}

.hl-list{
line-height:2;
margin-bottom:20px;
font-size:15px;
}

.hl-main-btn{
width:100%;
padding:14px;
background:#5B5CF0;
color:white;
border:none;
border-radius:14px;
font-weight:700;
font-size:15px;
cursor:pointer;
margin-top:14px;
}

.hl-note{
font-size:13px;
color:#6B7280;
margin-top:12px;
}

.hl-score{
width:130px;
height:130px;
border-radius:50%;
border:10px solid #14B8A6;
display:flex;
align-items:center;
justify-content:center;
margin:auto;
font-size:32px;
font-weight:700;
color:#111827;
}

.hl-center-label{
text-align:center;
margin:14px 0 24px;
font-weight:700;
color:#14B8A6;
}

.hl-section-title{
font-size:17px;
font-weight:700;
margin:22px 0 12px;
}

.hl-row{
padding:12px;
background:#F8F9FF;
border-radius:12px;
margin-bottom:10px;
}

.hl-lock-card{
background:#F3F4F6;
padding:18px;
border-radius:16px;
margin-top:22px;
line-height:2;
color:#555;
}

.hl-chip{
display:inline-block;
padding:8px 12px;
background:#EEF2FF;
color:#5B5CF0;
border-radius:999px;
margin:5px;
font-size:14px;
}

.hl-flex{
display:flex;
justify-content:space-between;
align-items:center;
padding:12px;
background:#F8F9FF;
border-radius:12px;
margin-bottom:10px;
}

.mini-btn{
border:none;
background:#5B5CF0;
color:white;
padding:7px 10px;
border-radius:8px;
cursor:pointer;
}

.hl-premium-box{
background:#EEF2FF;
padding:18px;
border-radius:16px;
line-height:1.8;
margin-top:20px;
}
`;

  document.head.appendChild(style);
}


setInterval(() => {
  detectJob();
}, 3000);