console.log("HireLeap Extension Loaded");

let popupShown = false;
let lastJobText = "";

const observer = new MutationObserver(() => {
  detectJob();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// function isJobDetailPage() {
//   const url = window.location.href.toLowerCase();
//   if (host.includes("dice.com")) {
//     return path.includes("/job-detail/");
//   }

//   // URL patterns for job detail pages
//   const detailPatterns = [
//     "/jobs/view/", // LinkedIn
//     "currentjobid=", // LinkedIn mobile
//     "/job-listings-", // Naukri
//     "/jobs/", // Shine / ZipRecruiter / others
//     "/job?", // Indeed variants
//     "/job/", // Generic
//     "/jd/", // Foundit / others
//     "/position/",
//     "/vacancy/",
//     "/careers/",
//   ];

//   const matched = detailPatterns.some((p) => url.includes(p));

//   // also require actual JD text block
//   const jd = getJobText();

//   return matched && jd && jd.length > 200;
// }
function isJobDetailPage() {
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();

  if (host.includes("linkedin.com")) {
    return (
      path.includes("/jobs/view/") ||
      path.includes("/jobs/search-results/") ||
      window.location.href.includes("currentJobId=")
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

function detectJob() {
  if (!isJobDetailPage()) {
    removePopup();
    lastJobText = "";
    return;
  }

  const jdText = getJobText();

  if (!jdText) return;

  if (jdText === lastJobText) return;

  lastJobText = jdText;

  removePopup();
  showPopup(jdText);
  setTimeout(() => {
    showPopup(jdText);
  }, 1200);
}

function getJobText() {
  const selectors = [
    // LinkedIn
    ".jobs-description-content__text",
    ".jobs-box__html-content",
    ".jobs-search__job-details--container",
    ".jobs-description",
    "[class*='jobs-description']",

    // Indeed
    "#jobDescriptionText",
    ".jobsearch-jobDescriptionText",

    // Naukri
    ".styles_job-desc-container__txpYf",
    ".job-desc",

    /* Monster / Foundit */
    ".job-description",
    ".jobDescription",
    // Glassdoor
    '[class*="jobDescriptionContent"]',
    '[class*="JobDetails"]',
    '[class*="job-details"]',
    '[class*="description"]',
    ".desc",
    // Monster
    ".job_description",
    ".jobDescriptionSection",
    "[class*='job_description']",

    /* Dice */

    ".job-description",
    ".jobDescription",
    ".jobdetail",
    ".job-detail",
    ".job-details",
    "[class*='job-description']",
    "[class*='jobDescription']",
    "[class*='jobdetail']",
    "[class*='job-detail']",
    "[class*='job-details']",
    "[class*='description']",
    "[class*='details']",
    "[data-testid*='job-description']",
    "[data-testid*='description']",
    "article",
    "main",

    /* Wellfound */
    ".styles_description",
    "[class*='description']",

    /* Shine */
    ".jobDetail",
    ".job_description",
    ".jobDescription",
    "[class*='jobDetail']",
    "[class*='jobDescription']",
    "[class*='jd']",
    "[class*='description']",

    /* Internshala */
    ".text-container",

    /* Generic fallback */
    "article",
    "main",
  ];

  for (let selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.length > 150) {
      console.log("JD Found:", selector);
      return el.innerText;
    }
  }

  return null;
}

// function getJobText() {

//     const selectors = [

//         /* LinkedIn */
//         ".jobs-description-content__text",
//         ".jobs-box__html-content",
//         ".jobs-description",

//         /* Indeed */
//         "#jobDescriptionText",
//         ".jobsearch-JobComponent-description",

//         /* Naukri */
//         ".styles_job-desc-container__txpYf",
//         ".dang-inner-html",
//         ".job-desc",

//         /* Glassdoor */
//          ".JobDetails_jobDescription__uW_fK",
//         ".jobDescriptionContent",
//         ".desc",
//         "[data-test='jobDescription']",
//         "[class*='jobDescription']",
//         "[class*='description']",

//         /* Monster */
//         ".job-description",

//         /* ZipRecruiter */
//         ".job_description",

//         /* Dice */
//         ".job-description",

//         /* Wellfound */
//         ".styles_description",

//         /* Generic fallback */
//         "article",
//         "main"
//     ];

//     for (let selector of selectors) {

//         const el = document.querySelector(selector);

//         if (el && el.innerText.trim().length > 200) {
//             return el.innerText.trim();
//         }
//     }

//     return null;
// }

/* ------------------------------
   SHOW POPUP
------------------------------ */

function showPopup(jdText) {
  removePopup();

  const popup = document.createElement("div");
  popup.id = "hireleap-popup";

  popup.setAttribute(
    "style",
    `
        position:fixed !important;
        bottom:30px !important;
        right:30px !important;
        width:320px !important;
        background:#0A66C2 !important;
        color:white !important;
        padding:18px !important;
        border-radius:14px !important;
        box-shadow:0 10px 30px rgba(0,0,0,.25) !important;
        z-index:999999999 !important;
        font-family:Arial,sans-serif !important;
        display:block !important;
        visibility:visible !important;
        opacity:1 !important;
        pointer-events:auto !important;
    `,
  );

  popup.innerHTML = `
        <div style="font-size:24px;">🚀</div>

        <div style="
            font-size:24px;
            font-weight:700;
            margin:8px 0 14px 0;
            line-height:1.2;
        ">
            Analyze this job with HireLeap
        </div>

        <button id="goHireLeap"
            style="
                background:white;
                color:#0A66C2;
                border:none;
                padding:12px 18px;
                border-radius:8px;
                font-size:16px;
                font-weight:bold;
                cursor:pointer;
            ">
            Analyze
        </button>
    `;

  document.body.appendChild(popup);

  document.getElementById("goHireLeap").onclick = function () {
    window.open(
      "https://www.hireleap.app/dashboard?jd=" + encodeURIComponent(jdText),
      "_blank",
    );
  };
}

function removePopup() {
  const old = document.getElementById("hireleap-popup");
  if (old) old.remove();
}
setInterval(() => {
  detectJob();
}, 3000);
