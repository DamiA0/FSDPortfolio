// =============================================================
//  data.js: ALL your portfolio content lives here.
//  To update the site: edit this file, save, then push to GitHub.
//
//  TIP: skill names must be spelled the SAME everywhere
//  (skills, projects' "stack", modules' "skills") so that
//  clicking a skill can show everywhere you've used it.
// =============================================================

const PORTFOLIO = {
  name: "Solomon Adepoju",
  shortName: "Solomon",
  roles: ["Full-Stack Developer", "Python & JavaScript Developer", "AI-Powered App Builder", "Business-Minded Problem Solver"],
  location: "Milton Keynes, UK · Open to relocation",
  intro:
    "I build web applications end to end, from the interface people use to the data and services behind it. " +
    "My Business Technology degree taught me to start from the business problem, then pick the right technology to solve it.",

  email: "sadepoju0@outlook.com",
  github: "https://github.com/DamiA0",
  linkedin: "", // e.g. "https://www.linkedin.com/in/your-name"
  cv: "",       // put your CV in the folder as "cv.pdf" and write "cv.pdf" here

  // Quick facts shown as counters under the intro
  stats: [
    { value: 3, label: "Years studying business & technology" },
    { value: 22, label: "University modules completed" },
    { value: 2, label: "Live projects deployed" },
  ],

  about: [
    "I'm a self-taught full-stack developer based in Milton Keynes. Since graduating, I've been building real, deployed " +
      "projects and learning the whole journey: planning, building the front end and back end, handling data, and putting " +
      "it live on my own domain.",
    "My degree combined technology with business: web application development, SQL, cloud computing with AWS, systems " +
      "analysis, data analytics and project management. That means I can talk to stakeholders, turn requirements into " +
      "a working product, and understand why it matters to the business.",
  ],

  // What employers look for: grouped so a recruiter can scan quickly
  skills: [
    { group: "Languages", items: ["Python", "JavaScript", "HTML", "CSS", "SQL"] },
    { group: "Front end", items: ["Responsive design", "Accessibility", "Progressive Web Apps"] },
    { group: "Back end & data", items: ["REST/JSON APIs", "Database design", "Web scraping", "Vector databases"] },
    { group: "Cloud & DevOps", items: ["Git & GitHub", "Vercel", "Cloudflare", "AWS", "Continuous deployment"] },
    { group: "AI & data", items: ["Machine learning models", "Computer vision", "Data analysis", "Power BI", "Excel"] },
    { group: "Professional", items: ["Requirements gathering", "Systems analysis", "Agile / Scrum", "Project management", "GDPR & data protection"] },
  ],

  projects: [
    {
      title: "MatchTheFit: AI hoodie visual search",
      year: "2026",
      summary: "Upload a photo of a hoodie you like and MatchTheFit finds similar hoodies for sale, with prices and links to buy.",
      problem: "Finding a hoodie you've seen in a photo is slow: text search can't describe colour, fit and graphics well.",
      built: [
        "An image pipeline that isolates the garment (SegFormer) and describes it: colour, zip or pullover, fit, pattern and logo.",
        "Similarity search: each catalogue image becomes an embedding (FashionSigLIP) stored in a vector database (ChromaDB), with filters such as price and colour.",
        "A product catalogue collected responsibly from Shopify stores' public product feeds and affiliate feeds, respecting robots.txt and site terms.",
        "Deployed live on its own custom domain with Cloudflare DNS.",
      ],
      learned: "How to take AI models from a notebook to a live product, and how to collect data legally and politely.",
      stack: ["Python", "Machine learning models", "Computer vision", "Vector databases", "Web scraping", "REST/JSON APIs", "Cloudflare"],
      live: "https://app.matchthefit.co.uk",
      code: "https://github.com/DamiA0/FSDPortfolio", // change to the repo link, e.g. "https://github.com/DamiA0/matchthefit"
    },
    {
      title: "This portfolio: an interactive, installable PWA",
      year: "2026",
      summary: "The site you're on: interactive, accessible, works offline and installs like an app on phones and desktops.",
      problem: "I wanted one place to show my work that's easy to update and shows how I build and deploy.",
      built: [
        "Hand-written HTML, CSS and JavaScript with no framework, all driven by a single data file.",
        "Interactive features: a skill explorer, project filters, a mini terminal, a theme toggle and scroll animations.",
        "Progressive Web App: web app manifest, service worker caching and an install button.",
        "Continuous deployment: every push to GitHub redeploys automatically on Vercel, with HTTPS.",
      ],
      learned: "Service workers, accessibility (keyboard navigation and reduced motion) and keeping content separate from code.",
      stack: ["JavaScript", "HTML", "CSS", "Responsive design", "Accessibility", "Progressive Web Apps", "Git & GitHub", "Vercel", "Continuous deployment"],
      live: "",
      code: "https://github.com/DamiA0/FSDPortfolio",
    },
  ],

  // Your real MMU units. "key: true" shows a ★ and puts it first.
  // Each module lists the skills it covered. Delete any you don't feel confident about.
  education: {
    degree: "BSc (Hons) Business Technology",
    school: "Manchester Metropolitan University",
    dates: "2021 – 2024",
    years: [
      {
        label: "Year 1",
        dates: "2021–22",
        modules: [
          { name: "Programming Fundamentals", key: true,
            about: "Core programming: variables, logic, loops, functions and debugging.",
            skills: ["Programming fundamentals", "Problem solving", "Debugging"] },
          { name: "Web Application Development", key: true,
            about: "Building web pages and simple web apps, front end and back end.",
            skills: ["HTML", "CSS", "Web development"] },
          { name: "Systems Analysis and Design", key: true,
            about: "Turning business needs into system designs with models and diagrams.",
            skills: ["Systems analysis", "Requirements gathering", "UML modelling"] },
          { name: "Data Management", key: true,
            about: "How organisations store and organise data, and designing databases.",
            skills: ["Database design", "Data modelling"] },
          { name: "Business Information Systems",
            about: "How information systems support business processes and decisions.",
            skills: ["Business process analysis"] },
          { name: "The Technology Professional",
            about: "Professional skills for working in technology teams.",
            skills: ["Teamwork", "Communication"] },
          { name: "Introduction to Industry 4.0",
            about: "Automation, IoT, AI and data in modern industry.",
            skills: ["Emerging technology awareness"] },
          { name: "Global Business Landscape",
            about: "How global markets and businesses operate.",
            skills: ["Commercial awareness"] },
        ],
      },
      {
        label: "Year 2",
        dates: "2022–23",
        modules: [
          { name: "Advanced Web Application Development", key: true,
            about: "Larger, data-driven web applications with server-side logic.",
            skills: ["Web development", "Back-end development", "Database design"] },
          { name: "Structured Query Language", key: true,
            about: "Querying and managing relational databases with SQL.",
            skills: ["SQL", "Database design"] },
          { name: "Cloud Computing with AWS", key: true,
            about: "Cloud concepts and services on Amazon Web Services.",
            skills: ["AWS", "Cloud computing"] },
          { name: "Data Analytics", key: true,
            about: "Cleaning, analysing and interpreting business data.",
            skills: ["Data analysis", "Excel"] },
          { name: "Decision Support Systems and Data Visualisation", key: true,
            about: "Dashboards and visual reports that help people make decisions.",
            skills: ["Power BI", "Data visualisation", "Excel"] },
          { name: "Managing Technology Projects", key: true,
            about: "Planning and running technology projects.",
            skills: ["Agile / Scrum", "Project management"] },
          { name: "Technology Regulations, Ethics, Sustainability and Security",
            about: "Law, ethics and security in technology.",
            skills: ["GDPR & data protection", "Cyber security awareness"] },
          { name: "Technology Lifecycle Management",
            about: "How technology is introduced, maintained and retired.",
            skills: ["Software lifecycle"] },
        ],
      },
      {
        label: "Year 3",
        dates: "2023–24",
        modules: [
          { name: "Business Technology Project", key: true,
            about: "Final-year project: researching, planning and delivering a technology solution.",
            skills: ["Independent project delivery", "Research", "Web development"] },
          { name: "Project Management", key: true,
            about: "Project planning, risk and delivery methods.",
            skills: ["Project management", "Risk management"] },
          { name: "Digital Business Development",
            about: "Developing a digital business idea and product.",
            skills: ["Digital product development", "Commercial awareness"] },
          { name: "Digital Business Implementation",
            about: "Taking a digital business from plan to launch.",
            skills: ["Digital product development", "Stakeholder management"] },
          { name: "Digital Strategy for Business Transformation",
            about: "Using technology to change how organisations work.",
            skills: ["Digital transformation", "Stakeholder management"] },
          { name: "Immersive Technologies",
            about: "Virtual, augmented and mixed reality.",
            skills: ["Emerging technology awareness"] },
        ],
      },
    ],
  },
};