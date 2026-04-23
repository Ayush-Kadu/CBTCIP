const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze-job", async (req, res) => {

    const jd = req.body.jobDescription;

    console.log("Received JD:");
    console.log(jd);

    res.json({
        score: 84,

        strengths: [
            "SQL",
            "Excel",
            "Stakeholder Management",
            "Reporting"
        ],

        missingSkills: [
            "Power BI",
            "Tableau",
            "Python"
        ],

        tips: [
            "Add dashboard project to resume",
            "Highlight stakeholder communication",
            "Tailor resume with keywords",
            "Learn Power BI basics"
        ]
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});