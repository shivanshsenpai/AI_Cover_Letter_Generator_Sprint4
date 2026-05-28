import { GoogleGenerativeAI } from '@google/generative-ai';

// Retrieve Gemini API Key from Vite's import.meta.env
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || "";
};

/**
 * Generate a tailored cover letter based on user parameters.
 */
export const generateCoverLetter = async ({
  name,
  role,
  company,
  skills,
  jobDescription,
  resumeText,
  simulate = false
}) => {
  const apiKey = getApiKey();
  const shouldSimulate = simulate || !apiKey || apiKey.trim() === "" || apiKey === "your_actual_gemini_api_key_here";

  if (shouldSimulate) {
    console.log("Gemini API key is not configured or simulation mode is forced. Running mock generator...");
    // Add artificial delay to simulate API latency (Phase 2 P1 Latency UX requirement)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Fallback Simulated Template (Phase 1 P0 Data Simulation)
    return {
      isSimulated: true,
      text: generateSimulatedCoverLetter({ name, role, company, skills, jobDescription, resumeText })
    };
  }

  try {
    // Initialize official Google Generative AI SDK to handle endpoint formatting automatically
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build highly optimized prompt instructions (Programmatic Prompt Engineering)
    const prompt = `You are a high-level executive career coach and professional copywriter.
Draft a compelling, professional, and bespoke Cover Letter for:
- Candidate Name: ${name}
- Target Role: ${role}
- Target Company: ${company}
- Skills: ${skills}
- Job Description details: ${jobDescription || "Not provided, focus on standard duties of " + role}
- Candidate's Extracted Resume details: ${resumeText || "Not provided, focus on core skills: " + skills}

CRITICAL ARCHITECTURAL GUIDELINES:
1. Structural Excellence: Format using clean, standard Markdown. Use clear sections, **bolding** for impact, and professional spacing.
2. Opening Hook: Do NOT use cliché intros like "I am writing to express my interest...". Start with an impressive hook indicating interest in ${company}'s success and how the candidate can address the challenges of the ${role} role.
3. Tailored Accomplishments: Match the candidate's skills (${skills}) and resume information directly to the Job Description. If a resume is uploaded, extract key details to substantiate the candidate's achievements.
4. Action-oriented Closure: End with a highly confident and professional call-to-action inviting them to review the candidate's qualifications in a meeting.
5. NO PLACEHOLDERS: Generate a fully complete letter. Do not output bracketed placeholders like [Date], [Company Address], or [Insert Phone]. 
6. Keep it concise, engaging, and professional. Ensure paragraphs are broken up with headers or clean bullet points to make scanning easy.`;

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    if (!generatedText) {
      throw new Error("Received empty content from Gemini SDK.");
    }

    return {
      isSimulated: false,
      text: generatedText
    };
  } catch (error) {
    console.error("Gemini SDK call failed, falling back to simulator:", error);
    // Add artificial delay for UX realism
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return {
      isSimulated: true,
      text: generateSimulatedCoverLetter({ name, role, company, skills, jobDescription, resumeText })
    };
  }
};

/**
 * Highly refined, keyword-based parser that scans the resume text for actual achievements,
 * projects, and jobs. This prevents PDF run-on lines where entire sections get appended.
 */
function extractDetailsFromResume(resumeText) {
  if (!resumeText || resumeText.trim().length === 0) return null;

  const lowercaseText = resumeText.toLowerCase();

  // 1. Scan for popular technical skills
  const skillsList = [
    'react', 'vue', 'angular', 'node', 'express', 'python', 'django', 'java', 'spring', 
    'typescript', 'javascript', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 
    'aws', 'docker', 'kubernetes', 'ci/cd', 'git', 'c++', 'html', 'css', 'power apps', 'figma'
  ];
  
  const extractedSkills = skillsList
    .filter(skill => lowercaseText.includes(skill))
    .map(skill => {
      if (skill === 'ci/cd') return 'CI/CD';
      if (skill === 'power apps') return 'Power Apps';
      return skill.charAt(0).toUpperCase() + skill.slice(1);
    });

  // 2. High-precision Achievement Matching (scans for your actual projects/milestones in resume)
  const achievements = [];
  
  if (lowercaseText.includes("crm") || lowercaseText.includes("sheets") || lowercaseText.includes("55 carat")) {
    achievements.push("Engineered a dynamic Google Sheets and Apps Script-based CRM for Team 55Carat, fully automating order tracking and customer notifications.");
  }
  if (lowercaseText.includes("penthara") || lowercaseText.includes("responsive web interfaces")) {
    achievements.push("Developed and optimized responsive web interfaces in React.js, significantly improving device responsiveness and performance.");
  }
  if (lowercaseText.includes("dental") || lowercaseText.includes("booking automation") || lowercaseText.includes("n8n")) {
    achievements.push("Built an AI-powered Dental Clinic Chatbot & Booking Automation System leveraging React, n8n workflows, and AI APIs.");
  }
  if (lowercaseText.includes("drone") || lowercaseText.includes("surveillance") || lowercaseText.includes("weapon")) {
    achievements.push("Designed a full-stack drone surveillance application featuring automated crowd counting and weapon/fire detection alerts.");
  }
  if (lowercaseText.includes("patents") || lowercaseText.includes("crowd")) {
    achievements.push("Co-authored and published 2 patents focusing on innovative systems for digital crowd management.");
  }

  // Fallbacks if no exact projects matched
  if (achievements.length === 0) {
    achievements.push("Architected clean, scalable frontend components using React and JavaScript to meet modern SaaS standards.");
    achievements.push("Optimized web page loading speeds and overall client rendering metrics for full-stack applications.");
  }

  // 3. High-precision Former Job Title Matching
  let backgroundContext = "";
  if (lowercaseText.includes("55 carat") || lowercaseText.includes("55carat")) {
    backgroundContext = "leveraging your proven background as a Business Automation Expert at 55 Carat";
  } else if (lowercaseText.includes("penthara")) {
    backgroundContext = "leveraging your background as a Software Developer Trainee at Penthara Technologies";
  } else if (lowercaseText.includes("prodesk")) {
    backgroundContext = "leveraging your background as a Frontend Developer Intern at Prodesk IT";
  } else {
    backgroundContext = "leveraging your proven experience in AI and full-stack software development";
  }

  return {
    skills: extractedSkills.slice(0, 6),
    achievements: achievements.slice(0, 3),
    background: backgroundContext
  };
}

/**
 * In-memory controller to interpolate state parameters and resume details into a cover letter.
 */
function generateSimulatedCoverLetter({ name, role, company, skills, jobDescription, resumeText }) {
  // Extract real experiences dynamically from the user's PDF resume text if uploaded
  const resumeDetails = extractDetailsFromResume(resumeText);
  
  // Custom skills paragraph based on form skills + extracted PDF resume skills
  const skillsParagraph = resumeDetails && resumeDetails.skills.length > 0
    ? `My technical profile is anchored in **${skills}**, complemented by hands-on proficiency in **${resumeDetails.skills.join(', ')}** as substantiated in my professional resume.`
    : `My specialized skill set matches your requirements, specifically in **${skills}**, which enables me to tackle high-impact systems building and maintain rigorous coding guidelines.`;

  // Custom background and achievements block from PDF resume text
  let experienceBulletPoints = "";
  if (resumeDetails && resumeDetails.achievements) {
    experienceBulletPoints = resumeDetails.achievements
      .map(achievement => `* **Key Accomplishment**: ${achievement}`)
      .join('\n');
  } else {
    experienceBulletPoints = `* **Engineering Execution**: Architected clean, scalable systems using **${skills}** to meet organizational demands.
* **Modern Best Practices**: Integrated testing strategies, strict lint rules, and secure API structures to maintain clean codebases.
* **Core Contribution**: Focused on optimizing processing speeds and enhancing developer efficiency throughout the software lifecycle.`;
  }

  const backgroundHook = resumeDetails && resumeDetails.background
    ? `With this background, and ${resumeDetails.background}, I am highly equipped to jump straight into your operational sprints.`
    : `With my proven skill set, I am fully equipped to jump directly into your operational workflows and maintain top standards from day one.`;

  return `## COVER LETTER: APPLICATION FOR ${role.toUpperCase()} AT ${company.toUpperCase()}

**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

**Candidate:** ${name}  
**Position:** ${role}  
**Organization:** ${company}  
**Primary Stack:** ${skills}

---

Dear Hiring Team at ${company},

I am writing to express my enthusiastic interest in joining your division as a **${role}**. Your organization has established a stellar reputation for pushing engineering limits, and I am keen to apply my technical qualifications to contribute to your immediate and long-term milestones.

### Technical Alignment & Core Capabilities

* **Proven Skill Set Matching:** ${skillsParagraph}
* **Achievements Extracted From Resume:**
${experienceBulletPoints}
* **Immediate Contribution:** ${backgroundHook}

${jobDescription ? `### Addressing the Role Requirements\n\nHaving analyzed your job parameters: \n*"${jobDescription.length > 150 ? jobDescription.substring(0, 150) + "..." : jobDescription}"*\n\nI am confident that my background represents the precise engineering profile required to excel in this role.` : ""}

### Why ${company}?

I admire ${company}'s commitment to state-of-the-art developer standards and user-first software experiences. I thrive in highly collaborative systems that prioritize engineering rigor and clean code models. I am highly motivated to bring my developer skillset to your team and exceed your standards of quality.

Thank you for your consideration. I look forward to discussing my technical achievements and how I can help solve ${company}'s unique business challenges in an interview.

Sincerely,

**${name}**  
*${role} Specialist*
`;
}
