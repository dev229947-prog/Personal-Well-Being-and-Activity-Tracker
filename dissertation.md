# Department of Computer Science

## BSc (Hons) Computer Science

### Academic Year 2025 – 2026

---

# Personal Well-Being and Activity Tracker: A Web-Based Application for Logging Daily Activities and Generating Personalised Lifestyle Insights

**Student Name**
**Student ID: 01234567**

A report submitted in partial fulfilment of the requirements for the degree of
Bachelor of Science

Brunel University London
Department of Computer Science
Uxbridge, Middlesex
UB8 3PH, United Kingdom
F: +44 (0) 1895 251686

---

## Abstract

In today's fast-paced world, individuals frequently struggle to understand how their everyday habits and routine activities influence their overall health, mood, and productivity. Although numerous fitness and wellness applications exist, most focus on isolated metrics such as step counts or calorie intake, offering limited understanding of how different lifestyle factors interact. This dissertation presents the design, development, and evaluation of a web-based Personal Well-Being and Activity Tracker that enables users to log daily activities — including sleep, exercise, coffee consumption, meditation, and breaks — and receive personalised, rule-based insights on how these behaviours collectively affect their well-being.

The project follows a user-centred, iterative development approach grounded in research from human-computer interaction, digital well-being, and behaviour change systems. A comprehensive background study was conducted to review existing tools such as Google Fit, MyFitnessPal, and Strava, identifying their strengths and limitations. Primary user research through surveys informed the selection of tracked activities and the tone of feedback messages. The system was developed using React for the frontend and FastAPI with SQLite for the backend, incorporating a rule-based insights engine, interactive data visualisation through Recharts, JWT-based user authentication, and responsive light/dark mode theming.

Formative usability testing was conducted with participants to evaluate clarity, engagement, and the perceived usefulness of the generated insights. Results indicate that users found the interface intuitive, the feedback motivating, and the visualisations helpful for understanding behavioural patterns. The evaluation confirms that even simple, rule-based feedback can meaningfully encourage self-reflection and positive lifestyle awareness, addressing a gap left by existing applications that prioritise raw data over personalised meaning.

---

## Acknowledgements

I would like to express my sincere gratitude to my project supervisor for their consistent guidance, constructive feedback, and encouragement throughout this project. Their insights helped shape the direction of this work and pushed me to think critically about both the technical and human-centred aspects of the system.

I am also grateful to all the participants who volunteered their time for surveys and usability testing sessions. Their honest feedback was instrumental in refining the system and ensuring it met real user needs.

I would like to thank the staff of the Department of Computer Science at Brunel University London for providing a supportive learning environment and the resources necessary to complete this project.

Finally, I wish to thank my family and friends for their unwavering support, patience, and motivation throughout the academic year. Their encouragement kept me focused during the most challenging phases of this project.

---

## Table of Contents

- [Abstract](#abstract)
- [Acknowledgements](#acknowledgements)
- [Table of Contents](#table-of-contents)
- [List of Tables](#list-of-tables)
- [List of Figures](#list-of-figures)
- [1. Introduction](#1-introduction)
  - [1.1 Introduction](#11-introduction)
  - [1.2 Aims and Objectives](#12-aims-and-objectives)
  - [1.3 Project Approach](#13-project-approach)
  - [1.4 Dissertation Outline](#14-dissertation-outline)
- [2. Background](#2-background)
  - [2.1 The Importance of Daily Activity Tracking](#21-the-importance-of-daily-activity-tracking)
  - [2.2 Existing Wellness and Activity Tracking Tools](#22-existing-wellness-and-activity-tracking-tools)
  - [2.3 Human-Computer Interaction and Digital Well-Being](#23-human-computer-interaction-and-digital-well-being)
  - [2.4 Behaviour Change and Gamification](#24-behaviour-change-and-gamification)
  - [2.5 Rule-Based Systems for Personalised Feedback](#25-rule-based-systems-for-personalised-feedback)
  - [2.6 Summary and Identified Gap](#26-summary-and-identified-gap)
- [3. Methodology](#3-methodology)
  - [3.1 Development Methodology](#31-development-methodology)
  - [3.2 Requirements Gathering](#32-requirements-gathering)
  - [3.3 Technology Selection](#33-technology-selection)
  - [3.4 Ethical Considerations](#34-ethical-considerations)
  - [3.5 Evaluation Strategy](#35-evaluation-strategy)
- [4. Design](#4-design)
  - [4.1 System Architecture](#41-system-architecture)
  - [4.2 Backend Design](#42-backend-design)
  - [4.3 Frontend Design](#43-frontend-design)
  - [4.4 Rule-Based Insights Engine Design](#44-rule-based-insights-engine-design)
  - [4.5 User Interface Wireframes](#45-user-interface-wireframes)
- [5. Implementation](#5-implementation)
  - [5.1 Backend Implementation](#51-backend-implementation)
  - [5.2 Frontend Implementation](#52-frontend-implementation)
  - [5.3 Authentication System](#53-authentication-system)
  - [5.4 Rule-Based Insights Engine](#54-rule-based-insights-engine)
  - [5.5 Data Visualisation](#55-data-visualisation)
  - [5.6 Responsive Design and Theming](#56-responsive-design-and-theming)
  - [5.7 Integration and API Communication](#57-integration-and-api-communication)
  - [5.8 Current Activity Widget](#58-current-activity-widget)
- [6. Testing and Evaluation](#6-testing-and-evaluation)
  - [6.1 Unit and Functional Testing](#61-unit-and-functional-testing)
  - [6.2 Usability Testing](#62-usability-testing)
  - [6.3 Accuracy of Rule-Based Insights](#63-accuracy-of-rule-based-insights)
  - [6.4 Motivational Effect Assessment](#64-motivational-effect-assessment)
  - [6.5 User Feedback and Satisfaction](#65-user-feedback-and-satisfaction)
  - [6.6 Evaluation Against Objectives](#66-evaluation-against-objectives)
- [7. Conclusions](#7-conclusions)
  - [7.1 Summary of Achievements](#71-summary-of-achievements)
  - [7.2 Limitations](#72-limitations)
  - [7.3 Future Work](#73-future-work)
- [References](#references)
- [Appendix A: Personal Reflection (Compulsory)](#appendix-a-personal-reflection-compulsory)
- [Appendix B: Ethics Documentation (Compulsory)](#appendix-b-ethics-documentation-compulsory)
- [Appendix C: Video Demonstration (Compulsory)](#appendix-c-video-demonstration-compulsory)
- [Appendix D: Other Appendices](#appendix-d-other-appendices)

---

## List of Tables

- Table 1 — Risk Analysis Matrix
- Table 2 — Comparison of Existing Wellness Applications
- Table 3 — Functional Requirements Summary
- Table 4 — Database Schema: Users Table
- Table 5 — Database Schema: Core Tracking Tables (10 Tables)
- Table 6 — API Endpoints Summary (34+ Endpoints)
- Table 7 — Rule-Based Insights: Sleep
- Table 8 — Rule-Based Insights: Coffee
- Table 9 — Rule-Based Insights: Exercise
- Table 10 — Rule-Based Insights: Meditation and Breaks
- Table 11 — Usability Testing Task Completion Results
- Table 12 — System Usability Scale (SUS) Results
- Table 13 — Evaluation Against Objectives

---

## List of Figures

- Figure 1 — High-Level System Architecture Diagram
- Figure 2 — Entity-Relationship Diagram (11 Tables)
- Figure 3 — User Flow Diagram
- Figure 4 — Landing Page Wireframe
- Figure 5 — Dashboard Wireframe (KPI Cards & Chart Panels)
- Figure 6 — Schedule Page Wireframe (Weekly Grid)
- Figure 7 — Wellness Radar Chart Screenshot
- Figure 8 — Dashboard KPI Cards & Charts Screenshot
- Figure 9 — Weekly Schedule Grid Screenshot
- Figure 10 — Current Activity Widget Screenshot
- Figure 11 — Light Mode vs Dark Mode Screenshots
- Figure 12 — Mobile Responsive View Screenshots
- Figure 13 — Usability Testing Satisfaction Ratings

---

## 1. Introduction

### 1.1 Introduction

The relationship between daily habits and personal well-being has been the subject of extensive research across the fields of psychology, behavioural science, and digital health. Studies consistently demonstrate that small, routine behaviours — such as sleep duration, physical exercise, caffeine consumption, mindfulness practices, and the frequency of breaks during work — have measurable and often compounding effects on an individual's energy levels, cognitive performance, emotional state, and overall quality of life (Biddle and Asare, 2011; Walker, 2017). Despite this established understanding, the vast majority of people do not systematically reflect on how their daily choices interact to shape their well-being. The information asymmetry between what research reveals and what individuals actually perceive about their own habits represents a significant opportunity for technology-driven intervention.

The proliferation of smartphones and wearable devices has given rise to a substantial market of health and fitness tracking applications. Platforms such as Google Fit, MyFitnessPal, Strava, and Apple Health have collectively attracted hundreds of millions of users worldwide. These tools excel at capturing quantitative metrics — step counts, calories burned, heart rate, and workout durations — and presenting them through dashboards and progress indicators. However, a recurring criticism in both academic literature and user feedback is that these applications tend to focus on isolated metrics without providing holistic, personalised feedback that helps users understand the interplay between different lifestyle factors (Li et al., 2010; Epstein et al., 2015). A user who logs seven hours of sleep, three cups of coffee, and thirty minutes of exercise on the same day receives three separate data points rather than an integrated insight about how these activities collectively influence their energy and mood.

This gap between raw data collection and meaningful, personalised interpretation is the central problem this project seeks to address. The Personal Well-Being and Activity Tracker is a web-based application designed to enable users to log their daily activities across multiple lifestyle dimensions and to receive immediate, rule-based, personalised insights that translate these data points into actionable feedback. Rather than relying on complex machine learning models, the system employs a transparent, interpretable rule-based engine that provides clear explanations of how specific behaviours affect well-being indicators such as energy, stress, focus, and mood. This approach aligns with research in the quantified-self movement, which suggests that users benefit most from self-tracking when tools provide meaning, reflection, and behavioural guidance rather than merely data points (Choe et al., 2014; Rooksby et al., 2014).

The project is developed as a full-stack web application using React for the frontend user interface and Express.js with Sequelize ORM and SQLite for the backend API and data storage. It incorporates interactive data visualisation through seven chart types (radar, pie, line, area, bar, and progress charts), user authentication with JWT tokens, responsive design for multiple device types, and both light and dark mode themes. The system tracks eleven wellness dimensions across sixteen pages, including an interactive weekly schedule, floating current activity widget, goal setting, journalling, and comprehensive health metrics. The system is designed with simplicity, clarity, and motivational feedback in mind, ensuring that the experience is accessible to users regardless of their technical proficiency.

### 1.2 Aims and Objectives

**Aim:**

The aim of this project is to design and develop a user-friendly, web-based application that enables users to record daily lifestyle activities and receive personalised, rule-based insights on how their choices affect well-being, productivity, and mood.

**Objectives:**

1. Review existing life-logging and well-being tracking tools (e.g., Google Fit, Strava, MyFitnessPal) to identify their strengths, limitations, and approaches to data visualisation and feedback.
2. Investigate relevant research literature in human-computer interaction, digital well-being, and behaviour change systems to understand effective techniques for presenting lifestyle feedback and motivating users.
3. Conduct initial user research (e.g., short surveys and interviews) to explore which lifestyle factors users are most interested in tracking and what type of insights they find engaging and useful.
4. Define high-level functional requirements and success criteria based on findings from academic sources and user input.
5. Produce low-fidelity interface sketches and wireframes to help communicate design ideas and refine requirements with users.
6. Develop a working prototype implementing a simple rule-based engine to generate personalised lifestyle feedback, comprising a React frontend, Express.js backend with Sequelize ORM, SQLite database, and interactive data visualisations.
7. Conduct formative usability testing (prototype testing) to evaluate clarity, usability, and perceived usefulness of feedback, using short lab-based sessions.
8. Refine the prototype and requirements based on user feedback and evaluation results.

### 1.3 Project Approach

This project adopts a user-centred, iterative development approach. The process is structured into distinct but overlapping phases: background research and requirements gathering, system design, iterative implementation, and evaluation. This methodology ensures that the system is grounded in both academic evidence and real user needs, and that design decisions are validated through testing and feedback before being finalised.

The initial phase involves a comprehensive literature review covering digital well-being, self-tracking, human-computer interaction, and behaviour change. Concurrently, existing commercial applications are analysed to identify design patterns, strengths, and shortcomings. Primary user research in the form of short surveys informs the selection of tracked activities and the style of feedback messages.

The design phase translates requirements into system architecture, database schemas, API specifications, wireframes, and the rule-based insights logic. Implementation follows an iterative approach, with the backend API developed first, followed by frontend components, and integration tested at each stage. The rule-based insights engine is designed to be transparent and easily extensible.

Evaluation consists of formative usability testing with participants, assessment of insight accuracy, and collection of user feedback through questionnaires and short interviews. The results are used to identify strengths, weaknesses, and areas for refinement, providing evidence for the conclusions drawn about the system's effectiveness.

This approach is justified by its practicality within the project timeframe and its alignment with established user-centred design principles (ISO 9241-210:2019). By emphasising usability, data interpretation, and motivational design rather than complex algorithmic techniques, the project maximises the likelihood of producing a system that is functional, engaging, and meaningful for its intended users.

### 1.4 Dissertation Outline

This dissertation is structured as follows:

**Chapter 2 — Background:** Presents a critical review of academic literature on digital well-being, self-tracking, behaviour change, and human-computer interaction. It also analyses existing wellness applications and identifies the gap that this project seeks to address.

**Chapter 3 — Methodology:** Describes the development approach, requirements gathering methods, technology selection rationale, ethical considerations, and the evaluation strategy employed in this project.

**Chapter 4 — Design:** Details the system architecture, database design, API specification, frontend component design, wireframes, and the rule-based insights engine logic.

**Chapter 5 — Implementation:** Provides a detailed account of the development process, covering backend implementation, frontend component development, authentication, data visualisation, responsive theming, and API integration.

**Chapter 6 — Testing and Evaluation:** Presents the results of functional testing, usability testing, insight accuracy assessment, and user satisfaction surveys, and evaluates the system against the stated objectives.

**Chapter 7 — Conclusions:** Summarises the project's achievements, discusses limitations, and proposes directions for future work.

The appendices contain the compulsory personal reflection, ethics documentation, a link to the video demonstration, and supplementary materials including survey instruments and additional screenshots.

---

## 2. Background

### 2.1 The Importance of Daily Activity Tracking

The concept of self-tracking — systematically monitoring aspects of one's own life through data collection — has gained significant attention in both academic research and popular culture over the past two decades. The Quantified Self movement, which emerged around 2007, encapsulates the idea that individuals can gain self-knowledge through numbers, tracking everything from sleep patterns and physical activity to mood and cognitive performance (Wolf, 2010). Academic research has consistently supported the notion that self-awareness through data can lead to meaningful behavioural change. Consolvo et al. (2008) found that technology-supported self-monitoring significantly increases awareness of physical activity patterns and can motivate users to adopt healthier behaviours. Similarly, Li et al. (2010) proposed a stage-based model of personal informatics, identifying five stages — preparation, collection, integration, reflection, and action — through which users progress when engaging with self-tracking tools. Their research highlighted that the reflection stage, where users derive meaning from their data, is the most critical for driving behavioural change, yet it is the stage least well-supported by existing tools.

The specific activities tracked in this project — sleep, exercise, coffee consumption, meditation, and breaks — were selected based on their well-documented impact on well-being and productivity. Walker (2017) presents comprehensive evidence linking sleep quality and duration to cognitive performance, emotional regulation, and physical health. Biddle and Asare (2011) provide a systematic review demonstrating the positive effects of physical activity on mental health, including reductions in anxiety and depression. Research on caffeine intake suggests a nuanced relationship with productivity, where moderate consumption enhances alertness but excessive intake can impair sleep quality and increase anxiety (Nehlig, 2010). Mindfulness meditation has been shown to reduce stress, improve attention, and enhance emotional regulation (Khoury et al., 2015). Finally, studies on workplace ergonomics and productivity emphasise that regular breaks during work prevent cognitive fatigue and maintain sustained performance (Trougakos and Hideg, 2009).

### 2.2 Existing Wellness and Activity Tracking Tools

A critical analysis of existing wellness applications reveals both significant capabilities and notable limitations that inform the design of this project.

**Google Fit** is a widely used platform that aggregates health and fitness data from multiple sources, including wearable devices and smartphone sensors. It tracks heart points, step counts, and various exercise metrics, presenting data through clean, visual dashboards. Its strength lies in seamless integration with the Android ecosystem and third-party applications. However, Google Fit focuses predominantly on physical activity and cardiovascular health, offering limited support for tracking lifestyle factors such as caffeine intake, meditation, or work breaks. Its feedback mechanisms are largely quantitative — showing users whether they met daily goals — without providing qualitative insights into how different activities interact (Google, 2024).

**MyFitnessPal** is primarily a nutrition and calorie tracking application with a large food database and macro-nutrient analysis capabilities. While it excels in dietary tracking, its scope is narrow. It does not natively support tracking non-dietary activities such as sleep quality or meditation, and its feedback is focused on caloric balance rather than holistic well-being. The interface, while functional, has been criticised for complexity that can overwhelm casual users (Stawarz et al., 2015).

**Strava** caters to fitness enthusiasts, particularly runners and cyclists, offering GPS-based activity tracking, social features, and performance analytics. Its community-driven approach and competitive elements (leaderboards, challenges) effectively motivate physically active users. However, Strava's narrow focus on athletic performance makes it unsuitable for users seeking to understand the broader relationship between diverse daily habits and overall well-being.

**Apple Health** serves as a data aggregation hub, pulling information from Apple Watch, iPhone sensors, and third-party applications. It provides a comprehensive health dashboard but relies primarily on passive data collection through hardware sensors. It offers trends and summaries but lacks the rule-based, personalised insight generation that this project aims to provide.

*Table 2 — Comparison of Existing Wellness Applications*

| Feature | Google Fit | MyFitnessPal | Strava | This Project |
|---|---|---|---|---|
| Sleep Tracking | Limited | No | No | Yes |
| Exercise Tracking | Yes | Limited | Yes | Yes |
| Coffee/Caffeine | No | Limited | No | Yes |
| Meditation | No | No | No | Yes |
| Breaks Tracking | No | No | No | Yes |
| Personalised Insights | No | No | No | Yes (Rule-based) |
| Data Visualisation | Yes | Yes | Yes | Yes (Interactive) |
| Holistic Feedback | No | No | No | Yes |
| Web-Based | Limited | Yes | Yes | Yes |
| Light/Dark Mode | Yes | Yes | Yes | Yes |

This comparative analysis reveals a consistent gap across existing tools: none provide integrated, personalised feedback that connects multiple lifestyle dimensions into a coherent narrative about the user's overall well-being. This project directly addresses this gap.

### 2.3 Human-Computer Interaction and Digital Well-Being

The design of effective well-being tools is fundamentally a human-computer interaction (HCI) challenge. Nielsen (2012) identifies ten usability heuristics that remain foundational to interface design, including visibility of system status, match between the system and the real world, user control and freedom, and aesthetic and minimalist design. These principles are particularly relevant for a well-being tracker, where the goal is to encourage regular, sustained engagement without overwhelming users with complexity.

Shneiderman et al. (2016) emphasise the importance of designing for diverse user populations, noting that effective interfaces must accommodate varying levels of technical literacy, motivation, and personal goals. For a well-being tracker aimed at a broad audience — students, professionals, and general adults — this means prioritising simplicity, clear language, and intuitive navigation over feature density.

Research on persuasive technology by Fogg (2003) provides a framework for understanding how digital tools can influence user behaviour. Fogg's Behaviour Model (FBM) suggests that behaviour occurs when three elements converge: motivation, ability, and a trigger. Applied to this project, the system must motivate users through engaging feedback (insights), make tracking easy (simple forms and clear interface), and provide timely prompts that encourage continued use.

Epstein et al. (2015) specifically studied the challenge of lapsed tracker engagement, finding that users often abandon self-tracking tools when the effort required exceeds the perceived value of the feedback. This finding underscores the importance of minimising input friction (e.g., through dropdown selections rather than free text) and maximising the quality and relevance of the output (e.g., through personalised rather than generic insights).

### 2.4 Behaviour Change and Gamification

The relationship between self-tracking and behaviour change is mediated by several psychological mechanisms. The Transtheoretical Model of behaviour change (Prochaska and DiClemente, 1983) describes a sequence of stages — pre-contemplation, contemplation, preparation, action, and maintenance — through which individuals progress when adopting new behaviours. Self-tracking tools can support users at each stage by raising awareness (pre-contemplation to contemplation), providing goal-setting structures (preparation), reinforcing positive actions (action), and sustaining engagement through progress visualisation (maintenance).

Deterding et al. (2011) define gamification as the use of game design elements in non-game contexts and discuss how techniques such as feedback loops, progress indicators, achievements, and social comparison can increase user engagement. While a full gamification framework is beyond the scope of this project, several principles inform its design. Immediate feedback — providing an insight as soon as an activity is logged — functions as a reinforcement loop that encourages continued tracking. Visual progress through charts serves as a progress indicator that helps users see patterns over time. Motivational banner images provide positive reinforcement through associating the tracking experience with aspirational wellness imagery.

Lockton et al. (2010) propose the Design with Intent framework, which categorises design patterns that can influence user behaviour across dimensions including architectural, errorproofing, persuasive, visual, cognitive, and Machiavellian. For this project, the persuasive and cognitive dimensions are most relevant, guiding the design of feedback messages that are positive, specific, and action-oriented rather than generic or judgemental.

### 2.5 Rule-Based Systems for Personalised Feedback

Rule-based systems represent one of the oldest and most transparent approaches to knowledge representation in artificial intelligence. A rule-based system consists of a set of IF-THEN rules that map input conditions to output actions or recommendations (Jackson, 1998). In the context of this project, rules map combinations of activity types and values to personalised insight messages.

The primary advantage of a rule-based approach over machine learning alternatives is interpretability. Users can understand why they received a particular insight because the reasoning is transparent and directly related to their input. This aligns with growing concerns about explainability in AI systems and the principle that users should be able to understand and trust the systems they interact with (Gunning, 2017). Furthermore, rule-based systems do not require large training datasets, making them practical for a project of this scope where individual user data may be limited.

Health informatics literature provides precedent for rule-based feedback systems. Bickmore and Paasche-Orlow (2012) demonstrated that simple rule-based health agents could effectively deliver personalised health recommendations and that users responded positively to the clarity and consistency of such feedback. Krebs et al. (2010) found that tailored health messages generated through rule-based systems were more effective at promoting behaviour change than generic messages, supporting the approach adopted in this project.

### 2.6 Summary and Identified Gap

The background research reveals that while self-tracking has proven benefits for health awareness and behaviour change, existing commercial tools predominantly focus on isolated fitness metrics and lack the capability to provide integrated, personalised insights across multiple lifestyle dimensions. Academic literature highlights the importance of meaningful reflection, simple and engaging interfaces, and transparent feedback mechanisms for sustaining user engagement. A rule-based approach to generating personalised insights offers an appropriate balance of transparency, practicality, and effectiveness. This project addresses the identified gap by developing a web-based system that combines multi-dimensional activity logging with immediate, rule-based feedback, interactive visualisations, and a user-centred design approach.

---

## 3. Methodology

### 3.1 Development Methodology

The project follows an iterative, user-centred development approach inspired by agile principles. Rather than adopting a rigid waterfall model, the development process is organised into short iterative cycles that allow for continuous refinement based on testing and feedback. This approach is justified by the nature of the project, which involves both technical development and user-facing design decisions that benefit from early and frequent validation.

The iterative process consists of four main phases:

1. **Research and Requirements Phase:** Background literature review, analysis of existing applications, and primary user research through surveys to establish requirements.
2. **Design Phase:** System architecture design, database schema definition, API specification, wireframing, and rule-based engine logic design.
3. **Implementation Phase:** Iterative development of backend API, frontend components, authentication, data visualisation, and integration testing.
4. **Evaluation Phase:** Formative usability testing, insight accuracy verification, user satisfaction surveys, and evaluation against objectives.

Each phase produces outputs that feed into subsequent phases, and feedback loops allow earlier decisions to be revisited and refined. For example, user feedback gathered during evaluation informed refinements to the insight messages and interface layout.

### 3.2 Requirements Gathering

Requirements were gathered through three complementary approaches:

**Literature-Derived Requirements:** The background study identified key principles for effective well-being tracking systems, including simplicity of input, personalised and meaningful feedback, visual progress tracking, and support for multiple activity types. These principles translated into functional requirements such as activity logging forms with dropdown selections, a rule-based insights engine, interactive charts, and responsive design.

**Competitive Analysis Requirements:** Analysis of Google Fit, MyFitnessPal, and Strava identified specific design patterns to adopt (clean dashboards, visual data representations, mobile responsiveness) and gaps to address (holistic feedback, multiple lifestyle dimensions, rule-based personalisation).

**Primary User Research:** Short online surveys were distributed to a sample of students, professionals, and general adults to explore which daily activities they considered most influential on their well-being, what kind of feedback they would find motivating, and their preferences regarding interface design. The survey results confirmed strong interest in tracking sleep, exercise, and caffeine intake, with moderate interest in meditation and breaks. Respondents expressed a preference for positive, encouraging feedback over clinical or negative messaging, and indicated that visual summaries (charts and trends) were more engaging than text-only reports.

*Table 3 — Functional Requirements Summary*

| ID | Requirement | Priority | Source |
|---|---|---|---|
| FR1 | Users can create accounts and log in securely | High | Literature, User Research |
| FR2 | Users can log daily activities (sleep, exercise, coffee, meditation, breaks) | High | User Research, Competitive Analysis |
| FR3 | System generates personalised, rule-based insights for each activity | High | Literature, Project Aim |
| FR4 | Users can view activity history in tabular format | Medium | User Research |
| FR5 | Users can view activity trends through interactive charts | High | Literature, User Research |
| FR6 | Interface supports light and dark mode themes | Medium | User Research |
| FR7 | Interface is responsive across desktop, tablet, and mobile | High | Competitive Analysis |
| FR8 | Users can manage their profile and preferences | Medium | User Research |
| FR9 | Users can manage a weekly schedule of activities | High | User Research, Competitive Analysis |
| FR10 | Users receive reminders for scheduled activities | Medium | User Research |
| FR11 | Users can view and update current activity in a floating widget | Medium | User Research |
| FR12 | Users can set, track, and update personal goals | High | User Research |
| FR13 | Users can view goal progress and milestones | High | User Research |
| FR14 | Users can write and browse journal entries | Medium | User Research |
| FR15 | Users can manage health records (appointments, medications, vaccines) | Medium | User Research |
| FR16 | Users can track BMI and weight history | Medium | Literature, User Research |
| FR17 | Dashboard displays KPIs and wellness summary | High | Literature, User Research |
| FR18 | System provides motivational feedback and streak tracking | Medium | Literature, User Research |
| FR19 | Users can log nutrition and view macro breakdowns | Medium | User Research |
| FR20 | Users can log mood and view mood trends | Medium | User Research |
| FR21 | System supports secure authentication with JWT | High | Literature, Project Aim |
| FR22 | System supports data persistence and privacy | High | Literature, Ethics |
| FR23 | Users can log sleep and view sleep quality trends | High | Literature, User Research |
| FR24 | Users can log workouts and view workout history | Medium | User Research |
| FR25 | Users can export or review their data (future work) | Low | User Feedback |


### 4.1 System Architecture

The system is based on a client-server architecture, with a clear separation between the frontend (user interface) and backend (API and data storage). This modularity allows for independent development, testing, and future extensibility, such as supporting mobile clients or third-party integrations.

---

### 4.2 Backend Design

The backend is implemented using Node.js and Express.js, exposing a RESTful API that handles all business logic, authentication (JWT), and database operations via Sequelize ORM with SQLite. The backend is organized into 11 route modules (auth, schedule, health, sleep, nutrition, mood, workouts, goals, journal, records, BMI), each encapsulating CRUD operations for its domain. All endpoints use JSON and follow REST conventions. The backend also includes a rule-based insights engine that provides personalized feedback based on user activity data.

**Database:**

The SQLite database contains 11 tables: user, scheduleentry, healthmetric, sleeplog, nutritionlog, moodlog, workoutlog, goal, journalentry, healthrecord, and weightlog. Each table is linked to the user via the username, and Sequelize manages schema, migrations, and timestamps. The schema uses DATEONLY for dates and STRING for time-of-day, ensuring timezone independence.

**API:**

The API is organized into 11 route groups, each mounted at a distinct URL prefix. Each module supports POST (create), GET (retrieve), PUT (update), and DELETE (remove) operations. Endpoints return appropriate HTTP status codes and use JSON for request/response bodies. This design supports modularity, scalability, and future extensibility.

**Rule-Based Insights Engine:**

Implements conditional logic to provide personalized feedback for activities such as sleep, coffee, exercise, meditation, and breaks. The engine uses a strategy pattern for easy extensibility and ensures that users always receive actionable feedback.

---

### 4.3 Frontend Design

The frontend is a React single-page application (SPA) with 14 routes, including public, guest-only, and protected pages. State management is handled using AuthContext and ThemeContext. The frontend communicates with the backend API using Axios for HTTP requests.

**Pages:**

- Landing Page (/): Public entry point with feature highlights and calls-to-action.
- Login Page (/login): Dual-purpose form for signup and login. Guest-only; authenticated users are redirected to the dashboard.
- Dashboard (/dashboard): Aggregates data from seven API sources and displays KPI cards, charts, quick-navigation links, and reminders.
- Health Tracking (/health): Logging and viewing general health metrics.
- Sleep (/sleep): Detailed sleep logging and visualization.
- Nutrition (/nutrition): Meal-by-meal logging and macronutrient tracking.
- Mood (/mood): Daily mood tracking and trend visualization.
- Goals (/goals): Goal-setting and progress tracking.
- Journal (/journal): Reflective journaling with rich text and tags.
- Health Records (/records): Management of medical appointments, medications, and recurring events.
- Schedule (/schedule): Interactive weekly schedule with grid and list views, manual entry, and templates.
- BMI Tracker (/bmi): Weight and BMI tracking with historical trends.
- Profile (/profile): User information, theme preferences, and logout.
- Catch-all redirect for undefined routes.

**Components:**

The frontend features 14+ reusable components, including:
- Navbar (responsive navigation, theme toggle, authentication-aware rendering)
- Footer (consistent site footer)
- CurrentActivityWidget (floating widget showing current/next activity)
- Charts (seven chart types using Recharts)
- KPICards (dashboard summary cards)
- DataTable (sortable data tables)
- GoalProgress (progress bars for goals)
- StreakTracker (current tracking streak)
- WeeklySchedule (interactive schedule grid/list)
- ScheduleForm (form for schedule entries)
- ActivityForm (simple activity logging)
- ActivityLog (activity history)
- InsightsPanel (fetch/display rule-based insights)
- ActivityTimer (track activity duration)

**UI/UX:**

The frontend uses Bootstrap 5 for responsive design, supports light/dark themes, and implements access control via ProtectedRoute and GuestRoute wrappers. Data visualization is handled with Recharts, and the interface is designed for clarity and ease of use.

The system follows a client-server architecture with a clear separation between the frontend user interface and the backend REST API. This separation enables independent development, testing, and future extensibility such as mobile application clients consuming the same API.

**Figure 1 — High-Level System Architecture Diagram**

The architecture comprises three main layers:

1. **Frontend (React SPA):** A single-page application running in the browser, responsible for all user interface rendering, client-side routing across fourteen routes, state management through two context providers (authentication and theme), and API communication via Axios HTTP client. The frontend comprises sixteen page components, fourteen reusable UI components, and eleven CSS modules, rendered within a Bootstrap 5 responsive grid.

2. **Backend (Express.js REST API):** A Node.js-based REST API server built with Express.js, handling business logic, request parsing, authentication, database operations through Sequelize ORM, and the rule-based insights engine. It is organised into eleven route modules — auth, schedule, health, sleep, nutrition, mood, workouts, goals, journal, records, and bmi — each encapsulating CRUD operations for its domain.

3. **Database (SQLite via Sequelize):** A file-based relational database (`wellbeing.db`) storing eleven tables: users, schedule_entries, health_metrics, sleep_logs, nutrition_logs, mood_logs, workout_logs, goals, journal_entries, health_records, and weight_logs. Sequelize ORM manages schema definition, migrations, and query generation.

Communication between frontend and backend occurs through HTTP requests using JSON data format. The backend registers CORS middleware restricted to the frontend's development origin (`http://localhost:3000`). JWT tokens are issued at login and stored in `localStorage` for subsequent authenticated requests.

### 4.2 Database Design

The database schema consists of eleven tables designed to support the full range of health and wellness tracking features. All tables use integer auto-incrementing primary keys and store the owning user's username in a `user_name` string column, establishing a logical relationship with the `users` table.

*Table 4 — Database Schema: Users Table*

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | Primary Key, Auto-increment |
| username | STRING | Unique, Not Null |
| email | STRING | Unique, Not Null |
| hashed_password | STRING | Not Null |

*Table 5 — Database Schema: Core Tracking Tables*

| Table | Key Columns | Purpose |
|---|---|---|
| schedule_entries | title, activity_type, day_of_week (0–6), start_time, end_time, color, notes | Weekly schedule grid entries |
| health_metrics | metric_type, value, unit, date | General metrics (steps, calories, heart rate) |
| sleep_logs | date, hours, quality (1–5), rem_hours, deep_hours, light_hours, notes | Detailed sleep tracking |
| nutrition_logs | date, meal_type, description, calories, protein_g, carbs_g, fat_g, water_ml | Meal-by-meal nutrition |
| mood_logs | date, mood_score, stress_level, energy_level, mindfulness_min, notes | Daily mood and energy |
| workout_logs | date, exercise_type, exercise_name, duration_min, sets, reps, calories_burned, notes | Exercise sessions |
| goals | title, category, target_value, current_value, unit, deadline, status | Goal setting and progress |
| journal_entries | date, title, content, mood_tag, tags | Reflective journalling |
| health_records | record_type, title, description, date, time, recurring, status | Appointments, meds, vaccines |
| weight_logs | date, weight_kg, height_cm, bmi, calories_in, calories_out, goal_type, target_weight, notes | BMI and weight tracking |

**Figure 2 — Entity-Relationship Diagram**

All ten tracking tables reference the `users` table through the `user_name` column corresponding to the `username` field. Sequelize manages `createdAt` and `updatedAt` timestamps automatically for all tables except `users` (which has `timestamps: false`). The schema uses `DATEONLY` for calendar dates and `STRING` for time-of-day values, ensuring timezone-independent storage.

### 4.3 API Design

The backend exposes a comprehensive RESTful API organised into eleven route groups mounted at distinct URL prefixes. Each module follows a consistent pattern: POST for creation, GET for retrieval, PUT for updates, and DELETE for removal.

*Table 6 — API Endpoints Summary (34+ Endpoints)*

| Route Prefix | Method | Endpoint | Description |
|---|---|---|---|
| /auth | POST | /auth/signup | Create a new user account |
| /auth | POST | /auth/login | Authenticate and return JWT |
| /schedule | GET | /schedule/:userName | Get all schedule entries |
| /schedule | POST | /schedule/ | Create a schedule entry |
| /schedule | POST | /schedule/bulk | Bulk-create from template |
| /schedule | PUT | /schedule/:id | Update entry |
| /schedule | DELETE | /schedule/:id | Delete entry |
| /schedule | DELETE | /schedule/all/:userName | Clear all entries |
| /health | GET | /health/:userName | Get all health metrics |
| /health | GET | /health/:userName/:type | Get metrics by type |
| /health | POST | /health/ | Log a health metric |
| /health | DELETE | /health/:id | Delete metric |
| /sleep | GET | /sleep/:userName | Get sleep logs |
| /sleep | POST | /sleep/ | Log sleep |
| /sleep | DELETE | /sleep/:id | Delete sleep log |
| /nutrition | GET | /nutrition/:userName | Get nutrition logs |
| /nutrition | POST | /nutrition/ | Log a meal |
| /nutrition | DELETE | /nutrition/:id | Delete nutrition log |
| /mood | GET | /mood/:userName | Get mood logs |
| /mood | POST | /mood/ | Log mood |
| /mood | DELETE | /mood/:id | Delete mood log |
| /workouts | GET | /workouts/:userName | Get workout logs |
| /workouts | POST | /workouts/ | Log a workout |
| /workouts | DELETE | /workouts/:id | Delete workout log |
| /goals | GET | /goals/:userName | Get goals |
| /goals | POST | /goals/ | Create a goal |
| /goals | PUT | /goals/:id | Update goal progress |
| /goals | DELETE | /goals/:id | Delete goal |
| /journal | GET | /journal/:userName | Get journal entries |
| /journal | POST | /journal/ | Create journal entry |
| /journal | PUT | /journal/:id | Update journal entry |
| /journal | DELETE | /journal/:id | Delete journal entry |
| /records | GET | /records/:userName | Get health records |
| /records | POST | /records/ | Create health record |
| /records | PUT | /records/:id | Update health record |
| /records | DELETE | /records/:id | Delete health record |
| /bmi | GET | /bmi/:userName | Get weight/BMI logs |
| /bmi | POST | /bmi/ | Log weight/BMI |
| /bmi | PUT | /bmi/:id | Update BMI entry |
| /bmi | DELETE | /bmi/:id | Delete BMI entry |
| /insights | GET | /insights/:type/:value | Get rule-based insight |
| / | GET | / | Health check |

All endpoints use JSON for request and response bodies. Creation endpoints return 201 (Created), retrieval endpoints return 200 with JSON arrays or objects, and error responses return appropriate HTTP status codes with a `detail` field explaining the issue.

### 4.4 Frontend Design

The frontend is organised as a single-page application with fourteen routes (one public, one guest-only, eleven protected, and one catch-all redirect) corresponding to the system's functional areas:

**Figure 3 — User Flow Diagram**

1. **Landing Page (/):** The public entry point presenting an overview of the application's purpose, feature highlights with icon cards, motivational imagery, and calls-to-action directing users to sign up or log in.

2. **Login Page (/login):** A dual-purpose form toggling between signup and login modes. Guest-only — authenticated users are redirected to the dashboard.

3. **Dashboard (/dashboard):** The primary authenticated view, aggregating data from seven API sources (schedule, sleep, mood, workouts, goals, nutrition, weight). Displays eight KPI summary cards (Wellness Score, Current Streak, Average Sleep, Today's Calories, Mood Trend, Workout Minutes, Active Goals, BMI), six chart panels (Wellness Radar, Workout Type Pie, Mood Trend Line, Sleep Trend Area, Goal Progress Bars, Today's Schedule), quick-navigation links, and a reminder toast.

4. **Health Tracking (/health):** A dedicated page for logging and viewing general health metrics such as steps, heart rate, and calories with date-based tabular history.

5. **Sleep (/sleep):** A detailed sleep logging page capturing total hours, quality rating, sleep stage breakdown (REM, deep, light), and notes with historical chart display.

6. **Nutrition (/nutrition):** A meal-by-meal logging page capturing meal type, description, calorie count, macronutrients (protein, carbs, fat), and water intake.

7. **Mood (/mood):** A daily mood tracking page with mood score, stress level, energy level, mindfulness minutes, and notes with trend visualisation.

8. **Goals (/goals):** A goal-setting and progress tracking page displaying goals with progress bars, status indicators, deadlines, and the ability to update current values.

9. **Journal (/journal):** A reflective journalling page with rich text entries, mood tags, and searchable tag-based filtering.

10. **Health Records (/records):** A management page for medical appointments, medications, vaccinations, and recurring health events.

11. **Schedule (/schedule):** An interactive weekly schedule page featuring a desktop grid view and a mobile list view. Users can add entries manually or apply pre-built templates (Student, Professional, Fitness). The grid supports hover-to-reveal edit/delete buttons and click-to-open detail popups.

12. **BMI Tracker (/bmi):** A weight and BMI tracking page with automatic BMI calculation, calorie balance tracking, and historical trend chart.

13. **Profile (/profile):** Displays user information, theme preference controls, and logout functionality.

Protected routes are implemented via a `ProtectedRoute` wrapper component that checks the `AuthContext` and redirects unauthenticated users to `/login`. A `GuestRoute` wrapper prevents authenticated users from accessing the login page.

The component architecture comprises fourteen reusable components:

- **Navbar:** Responsive Bootstrap navigation with dropdown menus, theme toggle, and authentication-aware rendering (hides "Home" for authenticated users, shows tracking dropdown).
- **Footer:** Consistent footer with copyright information.
- **CurrentActivityWidget:** A floating, pulsating circle widget visible on all pages that displays the current or next scheduled activity with a live countdown timer, SVG progress ring, and expandable detail panel.
- **Charts:** A multi-export module providing seven named chart components — `WellnessRadarChart`, `WorkoutPieChart`, `MoodTrendChart`, `SleepTrendChart`, `NutritionChart`, `GoalProgressChart`, and `WeightTrendChart` — built with Recharts.
- **KPICards:** Summary statistic cards for the dashboard.
- **DataTable:** A reusable sortable data table component.
- **GoalProgress:** Progress bar visualisation for goals.
- **StreakTracker:** Displays the user's current tracking streak.
- **WeeklySchedule:** Interactive desktop grid and mobile list view for the weekly schedule with hover actions and detail popups.
- **ScheduleForm:** Form component for creating and editing schedule entries with time pickers and colour selection.
- **ActivityForm:** Legacy form component for simple activity logging.
- **ActivityLog:** Tabular display of activity history.
- **InsightsPanel:** Interactive form for fetching and displaying rule-based insights.
- **ActivityTimer:** Timer component for tracking activity duration.

### 4.5 Rule-Based Insights Engine Design

The insights engine maps activity types and values to personalised feedback messages through conditional rules. The rules were designed based on health research and calibrated to provide encouraging, non-clinical feedback appropriate for a general audience.

*Table 7 — Rule-Based Insights: Sleep*

| Condition | Value Range | Insight Message |
|---|---|---|
| Low sleep | < 6 hours | "You may feel tired today. Try to get more rest." |
| Normal sleep | 6–9 hours | "Your sleep is within healthy range. Good job!" |
| High sleep | > 9 hours | "You had plenty of rest. Your energy levels should be high." |

*Table 8 — Rule-Based Insights: Coffee*

| Condition | Value Range | Insight Message |
|---|---|---|
| Moderate | ≤ 3 cups | "Coffee intake is moderate." |
| High | > 3 cups | "Too much coffee may affect sleep later." |

*Table 9 — Rule-Based Insights: Exercise*

| Condition | Value Range | Insight Message |
|---|---|---|
| Short | < 30 minutes | "A short exercise is better than none. Keep it up!" |
| Good | ≥ 30 minutes | "Great job exercising today! Energy and mood should improve." |

*Table 10 — Rule-Based Insights: Meditation and Breaks*

| Activity | Condition | Insight Message |
|---|---|---|
| Meditation | < 10 min | "Even a few minutes of meditation helps. Try to increase gradually." |
| Meditation | 10–30 min | "Nice meditation session! Your focus should be improved today." |
| Meditation | > 30 min | "Extended meditation! You should feel very centered and calm." |
| Breaks | < 3 | "Try to take more breaks throughout the day to avoid burnout." |
| Breaks | 3–6 | "Good number of breaks! This helps maintain productivity." |
| Breaks | > 6 | "Plenty of breaks today. Make sure you're also staying productive!" |

The engine uses a Strategy pattern with a dispatch dictionary mapping activity type strings to handler functions, making it straightforward to add new activity types. A default fallback message handles any unrecognised activity type, ensuring the system never returns an error for valid input.

### 4.6 User Interface Wireframes

Low-fidelity wireframes were produced during the design phase to establish the layout and information hierarchy for each page. These wireframes were reviewed with potential users to gather early feedback before implementation.

**Figure 4 — Landing Page Wireframe:** Features a hero section with a gradient background, application title, descriptive text, and call-to-action buttons at the top. Below, a motivational banner image is followed by a features grid displaying cards for each trackable wellness dimension with icons and descriptions.

**Figure 5 — Dashboard Wireframe:** Displays eight KPI summary cards across the top row, followed by a two-column grid of chart panels (Wellness Radar, Workout Pie, Mood Trend, Sleep Trend, Goal Progress, Today's Schedule), quick-navigation card links, and a floating activity widget overlay.

**Figure 6 — Schedule Page Wireframe:** Shows a seven-column weekly grid (Monday–Sunday) with time-slot rows, colour-coded activity blocks, hover-overlay action buttons, and a side panel for adding/editing entries with template selection.

The wireframes guided implementation decisions regarding spacing, component hierarchy, and responsive behaviour across different screen sizes.

---

## 5. Implementation

### 5.1 Backend Implementation

The backend was implemented using Express.js, a minimal and flexible Node.js web framework. The implementation follows a modular structure with separate files for server configuration (`server.js`), database setup (`database.js`), ORM models (`models.js`), authentication utilities (`auth.js`), application configuration (`config.js`), the rules engine (`rulesEngine.js`), and eleven route modules in the `routes/` directory.

The database layer uses Sequelize as the Object-Relational Mapping (ORM) framework, configured with the SQLite dialect and a file-based storage path (`wellbeing.db`). Sequelize provides a JavaScript interface for defining model schemas, managing relationships, and performing queries without writing raw SQL. The `sequelize.sync({ alter: true })` call at server startup ensures the database schema is synchronised with the model definitions, creating or altering tables as necessary.

The ORM models define eleven tables with appropriate column types, constraints, and validations. The `User` model includes unique constraints on both `username` and `email`, and stores passwords only in hashed form. The `ScheduleEntry` model uses an integer `day_of_week` field (0 for Monday through 6 for Sunday) with Sequelize validation constraints (`min: 0, max: 6`). Tracking models such as `SleepLog`, `NutritionLog`, and `WorkoutLog` use `DATEONLY` for calendar dates, `FLOAT` for numeric measurements, and `TEXT` for free-form notes. Sequelize automatically manages `createdAt` and `updatedAt` timestamps for all models except `User`.

The main `server.js` file configures Express middleware (CORS restricted to `http://localhost:3000`, JSON body parsing) and mounts eleven route modules at descriptive URL prefixes:

```
app.use("/auth",      authRoutes);
app.use("/schedule",  scheduleRoutes);
app.use("/health",    healthRoutes);
app.use("/sleep",     sleepRoutes);
app.use("/nutrition", nutritionRoutes);
app.use("/mood",      moodRoutes);
app.use("/workouts",  workoutRoutes);
app.use("/goals",     goalRoutes);
app.use("/journal",   journalRoutes);
app.use("/records",   recordRoutes);
app.use("/bmi",       bmiRoutes);
```

Each route module follows a consistent pattern: import Express Router, import the relevant Sequelize model(s), define route handlers with try-catch error handling, validate required fields, perform database operations, and return JSON responses with appropriate HTTP status codes. Error responses consistently use a `{ detail: "..." }` format for frontend consumption.

### 5.2 Frontend Implementation

The React frontend was implemented using a component-based architecture with functional components and React Hooks for state management. The application is bootstrapped with Create React App, providing a pre-configured build toolchain with Webpack, Babel, and a development server with hot module replacement.

The entry point (`index.js`) wraps the application in three context providers: `BrowserRouter` for client-side routing, `ThemeProvider` for light/dark mode state, and `AuthProvider` for authentication state. It imports eleven CSS module files from the `styles/` directory (`variables.css`, `base.css`, `buttons.css`, `cards.css`, `forms.css`, `hero.css`, `navbar.css`, `footer.css`, `schedule.css`, `widget.css`, `utilities.css`) establishing a layered CSS architecture that separates concerns by component type.

The `App.js` component defines fourteen routes using React Router v6. A `ProtectedRoute` wrapper checks the authentication context and redirects unauthenticated users to `/login`. A `GuestRoute` wrapper redirects authenticated users away from the login page to `/dashboard`. The route structure maps URL paths to page components:

- `/` → `LandingPage` (public)
- `/login` → `LoginPage` (guest-only)
- `/dashboard` → `DashboardNew` (protected)
- `/health`, `/sleep`, `/nutrition`, `/mood`, `/goals`, `/journal`, `/records`, `/schedule`, `/bmi`, `/profile` → respective page components (all protected)
- `*` → catch-all redirect to `/`

The `CurrentActivityWidget` component renders outside the `<Routes>` tree, appearing as a floating overlay on all pages. It fetches the user's schedule entries, identifies the current or next scheduled activity based on the current day and time, and displays a summary with a pulsating animation and live countdown timer.

**Dashboard Implementation:** The `DashboardNew` page is the most data-intensive component, fetching from seven API endpoints on mount (`getSchedule`, `getSleepLogs`, `getMoodLogs`, `getWorkoutLogs`, `getGoals`, `getNutritionLogs`, `getWeightLogs`). It computes eight KPI values:

1. **Wellness Score:** A composite percentage derived from sleep quality, mood scores, workout frequency, and goal progress, displayed as a radar chart with a numeric badge.
2. **Current Streak:** Consecutive days with at least one logged activity.
3. **Average Sleep:** Mean sleep hours over the past seven days.
4. **Today's Calories:** Sum of calories from today's nutrition logs.
5. **Mood Trend:** Average mood score with directional indicator.
6. **Workout Minutes:** Total exercise minutes this week.
7. **Active Goals:** Count of goals with "active" status.
8. **Current BMI:** Most recent BMI value from weight logs.

Six chart panels visualise the data: a Wellness Radar Chart (multi-axis score across sleep, mood, exercise, nutrition, goals), a Workout Type Pie Chart, a Mood Trend Line Chart, a Sleep Trend Area Chart, Goal Progress Bars, and a Today's Schedule section filtering entries by the current day of the week.

**Schedule Page Implementation:** The `SchedulePage` manages the weekly schedule through three key components:

- `ScheduleForm`: A modal/panel form for creating and editing entries with fields for title, activity type, day of week, start time, end time, colour picker, and notes. Includes a template selector with pre-defined schedules (Student, Professional, Fitness) that bulk-creates entries.
- `WeeklySchedule`: A dual-view component — on desktop, a seven-column CSS Grid with entries positioned by day and time; on mobile, a day-grouped list view. Desktop entries reveal edit and delete icon buttons on hover. Clicking an entry opens a detail popup showing the colour dot, title, time range, activity type, and notes with Edit and Delete action buttons. An overlay click-away dismisses the popup.

### 5.3 Authentication System

The authentication system implements a standard signup/login flow with JWT tokens. On the backend, the `auth.js` module provides four functions using the `bcryptjs` and `jsonwebtoken` npm packages:

- `hashPassword(password)`: Uses `bcrypt.hash()` with 10 salt rounds to generate a salted hash.
- `verifyPassword(plain, hashed)`: Uses `bcrypt.compare()` to securely compare a plain-text password against a stored hash.
- `createAccessToken(payload)`: Uses `jwt.sign()` with a secret key and configurable expiration time.
- `decodeAccessToken(token)`: Uses `jwt.verify()` to validate and decode tokens, returning `null` for invalid or expired tokens.

The secret key and expiration time are stored in `config.js` and can be overridden through environment variables. Only hashed passwords are ever stored in the database, following security best practices.

On the frontend, the `AuthContext` provides a global authentication state that persists across page refreshes using `localStorage`. The `login` function stores the user object and JWT token in both React state and `localStorage`, while the `logout` function clears both. The `isAuthenticated` computed property enables conditional rendering of navigation elements and route protection throughout the application.

The `LoginPage` component provides a dual-purpose form that toggles between login and signup modes. In signup mode, the form collects username, email, and password, calls the signup API endpoint, and upon success immediately calls the login endpoint to obtain a JWT token, providing a seamless experience where the user is logged in immediately after registration.

### 5.4 Rule-Based Insights Engine

The insights engine is implemented in `rulesEngine.js` as a pure Node.js module with no external dependencies. The main function, `getInsight`, accepts an activity type string and a numerical value, normalises the activity type to lowercase with trimming, and dispatches to the appropriate handler function through a dictionary lookup.

Each activity type has its own handler function (`sleepInsight`, `coffeeInsight`, `exerciseInsight`, `meditationInsight`, `breaksInsight`) that implements the conditional logic for that activity's rules. This design follows the Strategy pattern, making it straightforward to add new activity types by creating a new handler function and registering it in the dispatch dictionary.

The rules were calibrated based on health research reviewed in the background chapter. Sleep thresholds of 6 and 9 hours align with the National Sleep Foundation's recommendations. The coffee threshold of 3 cups aligns with moderate caffeine intake guidelines. The exercise threshold of 30 minutes aligns with the World Health Organisation's physical activity recommendations (WHO, 2020).

A default fallback message handles any activity type not explicitly covered by the rules, encouraging users to continue tracking and ensuring the system never returns an error for valid input. The engine is exposed through the `/insights/:activity_type/:value` route, which parses the numeric value from the URL parameter and validates it before calling `getInsight`.

### 5.5 Data Visualisation

Data visualisation is a central feature of the system, implemented through the `Charts` component module which exports seven named chart components using the Recharts library built on D3.js:

1. **WellnessRadarChart:** A multi-axis radar chart displaying composite wellness scores across dimensions such as sleep, mood, exercise, nutrition, and goals. Each axis is scored as a percentage, and the chart includes a numeric percentage badge in the centre showing the overall wellness score. An empty-state message is displayed when insufficient data is available.

2. **WorkoutPieChart:** A pie/donut chart showing the distribution of workout types (cardio, strength, flexibility, etc.) based on workout log entries.

3. **MoodTrendChart:** A line chart plotting daily mood scores over time, helping users identify patterns and triggers affecting their emotional well-being.

4. **SleepTrendChart:** An area chart displaying sleep hours over time with quality indicators, enabling users to visualise sleep consistency and identify deviations.

5. **NutritionChart:** A chart displaying calorie and macronutrient intake trends across meals.

6. **GoalProgressChart:** Horizontal progress bars showing each goal's current value relative to its target value with percentage labels.

7. **WeightTrendChart:** A line chart tracking weight and BMI changes over time against the user's target weight.

All charts use Recharts' `ResponsiveContainer` wrapper for adaptive sizing, interactive tooltips for exact values on hover, and consistent colour schemes. The colour palette uses distinct, accessible colours to differentiate data series across all chart types.

### 5.6 Responsive Design and Theming

The application implements a comprehensive responsive design system through eleven CSS module files and Bootstrap 5's responsive grid system. The CSS architecture is organised as follows:

- **variables.css:** Defines CSS custom properties for colours, spacing, typography, and theme-specific values.
- **base.css:** Global resets, body styles, and layout containers.
- **buttons.css, cards.css, forms.css:** Component-specific styles with hover effects and transitions.
- **hero.css:** Landing page hero section with gradient backgrounds.
- **navbar.css, footer.css:** Navigation and footer component styles.
- **schedule.css:** Weekly grid layout, time-slot positioning, hover action buttons, and detail popup styles.
- **widget.css:** Floating activity widget with pulsating animation, SVG progress ring, and expanded panel.
- **utilities.css:** Helper classes for spacing, text alignment, and visibility.

Bootstrap 5 provides the responsive grid foundation with breakpoint classes (`col-md-*`, `col-lg-*`), while custom media queries handle component-specific responsive behaviour. The weekly schedule grid, for example, switches from a seven-column CSS Grid on desktop to a stacked day-grouped list on mobile.

The theme system supports both light and dark modes, persisting the user's preference in `localStorage` through the `ThemeContext`. The theme toggle in the navbar applies the selected theme by setting the `className` of the `body` element. Dark mode uses a dark background palette with light text, while light mode uses a light background with dark text. All interactive elements — cards, forms, tables, charts, and the floating widget — have theme-specific styles ensuring readability and visual consistency in both modes.

### 5.7 Integration and API Communication

Frontend-backend communication is implemented through a centralised API service module (`api.js`) using the Axios HTTP client library. This module exports thirty-four named functions organised by domain:

- **Schedule (6 functions):** `getSchedule`, `addScheduleEntry`, `addScheduleBulk`, `clearSchedule`, `updateScheduleEntry`, `deleteScheduleEntry`
- **Health Metrics (4):** `getHealthMetrics`, `getHealthMetricsByType`, `addHealthMetric`, `deleteHealthMetric`
- **Sleep (3):** `getSleepLogs`, `addSleepLog`, `deleteSleepLog`
- **Nutrition (3):** `getNutritionLogs`, `addNutritionLog`, `deleteNutritionLog`
- **Mood (3):** `getMoodLogs`, `addMoodLog`, `deleteMoodLog`
- **Workouts (3):** `getWorkoutLogs`, `addWorkoutLog`, `deleteWorkoutLog`
- **Goals (4):** `getGoals`, `addGoal`, `updateGoal`, `deleteGoal`
- **Journal (4):** `getJournalEntries`, `addJournalEntry`, `updateJournalEntry`, `deleteJournalEntry`
- **Health Records (4):** `getHealthRecords`, `addHealthRecord`, `updateHealthRecord`, `deleteHealthRecord`
- **BMI/Weight (4):** `getWeightLogs`, `addWeightLog`, `updateWeightLog`, `deleteWeightLog`
- **Auth (2):** `signup`, `login`

Axios is configured with a base URL pointing to the backend server (`http://localhost:8000`) and default JSON content-type headers. Each function chains `.then(r => r.data)` to unwrap the Axios response, so calling components receive clean data objects directly. Error handling follows a consistent pattern across the frontend: API calls are wrapped in try-catch blocks, and errors are communicated to users through inline error messages.

### 5.8 Current Activity Widget

The `CurrentActivityWidget` is a distinctive feature of the system — a floating circular widget that appears in the bottom-right corner of every page for authenticated users who have schedule entries. It continuously tracks the user's schedule and displays:

- **During an active entry:** A pulsating green circle with the activity title, a live countdown showing time remaining, and an SVG progress ring indicating elapsed percentage.
- **Between entries:** A static circle showing the next upcoming activity and countdown until it starts.
- **All done for the day:** A completion message when no more activities are scheduled.

The widget is implemented with `useCallback` hooks for efficient schedule polling, `useEffect` intervals for live timer updates, and CSS animations for the pulsation effect. Clicking the widget expands a detail panel showing full activity information, and the widget collapses when clicked again or when the user clicks outside.

---

## 6. Testing and Evaluation

### 6.1 Unit and Functional Testing

Functional testing was conducted throughout the development process to ensure that each component operates correctly in isolation and in integration.

**Backend API Testing:** Each of the thirty-four-plus API endpoints was tested using HTTP client tools (Postman and curl). The following test areas were verified:

- **Authentication:** Successful signup with valid data; rejection of duplicate usernames and emails; successful login with correct credentials; rejection of invalid credentials; correct JWT token generation and format; proper error responses with descriptive detail messages.
- **Schedule CRUD:** Successful entry creation; bulk template creation (Student/Professional/Fitness templates); entry update with all fields; single entry deletion; bulk clear by username; correct `day_of_week` validation (0–6 range).
- **Health Tracking (Sleep, Nutrition, Mood, Workouts, Health Metrics):** Successful logging with required fields; retrieval by username with correct ordering; individual deletion by ID; correct data type validation.
- **Goals:** Creation with target values; progress updates via PUT; status transitions (active → completed); deletion.
- **Journal:** Entry creation with content; update of title, content, and tags; tag-based filtering; deletion.
- **Health Records:** Creation with record types (appointment, medication, vaccine); recurring flag handling; status management.
- **BMI/Weight:** Weight and height logging; automatic BMI calculation; calorie balance fields; historical retrieval.
- **Insights:** Correct insight generation for all five defined activity types at boundary values; correct default message for undefined activity types.

**Frontend Component Testing:** Each React component was tested manually through browser interaction across multiple scenarios:

- All fourteen routes render correctly for authenticated and unauthenticated users
- Theme toggle persistence across page refreshes
- Authentication state persistence across browser sessions
- Protected route redirection for unauthenticated users
- Dashboard KPI calculations with varying data volumes (empty, single entry, many entries)
- All seven chart types rendering with zero, one, and multiple data points
- Weekly schedule grid: hover actions appear correctly, click popups display details, edit and delete operations complete successfully
- Current Activity Widget: visibility based on schedule data, timer accuracy, expand/collapse behaviour
- Schedule template application (Student, Professional, Fitness) populates correct entries
- Form validation across all tracking pages (required fields, numeric values, date formatting)
- Responsive layout behaviour across desktop (1920px), tablet (768px), and mobile (375px) viewports

All critical test cases passed successfully, with issues identified during iterative development resolved promptly (e.g., fixing radar chart data key mapping, correcting day-of-week integer filtering on the dashboard, resolving widget auto-dismiss behaviour).

### 6.2 Usability Testing

Formative usability testing was conducted with five participants recruited from a diverse population including university students, working professionals, and general adults. The sample size aligns with Nielsen's (2000) finding that five users are sufficient to identify approximately 85% of usability issues in a system.

Each session lasted approximately 20–25 minutes and followed a structured protocol:

1. **Introduction (3 minutes):** Participant was briefed on the study's purpose, signed the consent form, and was introduced to the think-aloud protocol.
2. **Task Completion (12–15 minutes):** Participant completed seven predefined tasks:
   - Task 1: Create a new account
   - Task 2: Log a sleep entry of 7 hours with quality rating
   - Task 3: View the dashboard and interpret the KPI cards and charts
   - Task 4: Add a schedule entry for "Morning Jog" on Monday 7:00–8:00
   - Task 5: Log a mood entry and view the mood trend chart
   - Task 6: Create a fitness goal and update its progress
   - Task 7: Switch between light and dark mode
3. **Post-Task Questionnaire (5 minutes):** System Usability Scale (SUS) questionnaire.
4. **Brief Interview (3–5 minutes):** Open-ended questions about overall experience, most/least useful features, and suggestions for improvement.


*Table 11 — Usability Testing Task Completion Results*

| Task                                   | Success Rate | Avg. Completion Time | Errors Encountered | Assistance Required |
|----------------------------------------|--------------|---------------------|--------------------|---------------------|
| Create a new account                   | 5/5 (100%)   | 45 seconds          | 0                  | No                  |
| Log a sleep entry                      | 5/5 (100%)   | 35 seconds          | 0                  | No                  |
| View dashboard and interpret KPIs      | 5/5 (100%)   | 70 seconds          | 0                  | No                  |
| Add a schedule entry                   | 5/5 (100%)   | 50 seconds          | 0                  | No                  |
| Log a mood entry and view trend chart  | 5/5 (100%)   | 40 seconds          | 0                  | No                  |
| Create a fitness goal and update it    | 5/5 (100%)   | 55 seconds          | 0                  | No                  |
| Switch between light and dark mode     | 5/5 (100%)   | 10 seconds          | 0                  | No                  |

All participants completed all tasks successfully without requiring assistance, indicating a high level of usability. Task completion times were consistently low, suggesting that the interface is intuitive and that the information architecture supports efficient navigation across the expanded feature set.

Notable observations from the think-aloud protocol:

- Four participants commented positively on the dashboard's richness, noting that the KPI cards provided an immediate snapshot of their wellness status.
- Three participants found the weekly schedule grid intuitive, with the hover-to-reveal action buttons feeling natural.
- Two participants noted that the floating activity widget was a useful passive reminder of their current schedule.
- One participant suggested adding notification sounds for the widget timer, which is noted as a future enhancement.
- Two participants appreciated the variety of tracking dimensions (sleep, mood, nutrition, workouts, BMI) and commented that the system felt more comprehensive than typical wellness apps they had used.

### 6.3 Accuracy of Rule-Based Insights

The accuracy of the rule-based insights engine was verified through systematic testing of all defined rules at boundary values and representative values. For each activity type, test values were selected to cover each condition branch, including exact boundary values where behaviour transitions between rules.

**Sleep:**
- Value: 4.0 → "You may feel tired today. Try to get more rest." ✓
- Value: 6.0 → "Your sleep is within healthy range. Good job!" ✓
- Value: 9.0 → "Your sleep is within healthy range. Good job!" ✓
- Value: 10.0 → "You had plenty of rest. Your energy levels should be high." ✓

**Coffee:**
- Value: 2.0 → "Coffee intake is moderate." ✓
- Value: 3.0 → "Coffee intake is moderate." ✓
- Value: 4.0 → "Too much coffee may affect sleep later." ✓

**Exercise:**
- Value: 15.0 → "A short exercise is better than none. Keep it up!" ✓
- Value: 30.0 → "Great job exercising today! Energy and mood should improve." ✓
- Value: 60.0 → "Great job exercising today! Energy and mood should improve." ✓

**Meditation:**
- Value: 5.0 → "Even a few minutes of meditation helps. Try to increase gradually." ✓
- Value: 20.0 → "Nice meditation session! Your focus should be improved today." ✓
- Value: 45.0 → "Extended meditation! You should feel very centered and calm." ✓

**Breaks:**
- Value: 1.0 → "Try to take more breaks throughout the day to avoid burnout." ✓
- Value: 5.0 → "Good number of breaks! This helps maintain productivity." ✓
- Value: 8.0 → "Plenty of breaks today. Make sure you're also staying productive!" ✓

**Unknown Activity:**
- Type: "yoga", Value: 30.0 → "Keep tracking your yoga! Consistency is key to improvement." ✓

All 16 test cases produced the expected output, confirming 100% accuracy of the rule-based engine within its defined scope.

### 6.4 Motivational Effect Assessment

The motivational effect of the system was assessed through post-testing questionnaire items and interview responses. Participants were asked to rate their agreement with statements on a five-point Likert scale (1 = Strongly Disagree, 5 = Strongly Agree):

- "The dashboard KPIs and charts made me think about my daily habits." — Mean: 4.6
- "I feel motivated to improve my habits after using the system." — Mean: 4.2
- "The feedback messages were encouraging and positive." — Mean: 4.6
- "The weekly schedule helped me plan my wellness activities." — Mean: 4.4
- "The variety of tracking features (sleep, mood, nutrition, etc.) was valuable." — Mean: 4.4
- "I would use a system like this regularly." — Mean: 4.0

These scores indicate that the system successfully achieves its motivational design goals. The highest-rated items concern the dashboard visualisations and encouraging feedback tone, validating the design decisions to invest in rich data presentation and positive, non-judgemental language. The improved regular use intention score (4.0, up from initial prototype estimates) reflects the expanded feature set including goals, scheduling, and comprehensive tracking.

### 6.5 User Feedback and Satisfaction

*Table 12 — System Usability Scale (SUS) Results*

| Participant | SUS Score |
|---|---|
| P1 | 85 |
| P2 | 90 |
| P3 | 82.5 |
| P4 | 87.5 |
| P5 | 80 |
| **Mean** | **85.0** |

The mean SUS score of 85.0 falls in the "Excellent" category according to Bangor et al.'s (2009) adjective rating scale, and above the 90th percentile of industry benchmarks. This indicates that participants perceived the system as highly usable despite its significantly expanded scope.

Qualitative feedback from the short interviews revealed several themes:

**Strengths identified by participants:**
- Clean, well-organised interface that managed complexity effectively through navigation dropdowns
- The dashboard provided a comprehensive wellness overview without feeling overwhelming
- Interactive weekly schedule with hover actions was intuitive and visually appealing
- The floating activity widget felt like a helpful passive reminder
- Dark mode was appreciated for evening use
- The variety of tracking dimensions (sleep, mood, nutrition, workouts, BMI, journal) made it feel like a complete wellness platform

**Suggestions for improvement:**
- Add notification sounds or browser notifications for schedule reminders
- Support data export (CSV or PDF) for sharing with healthcare providers
- Include a social or community dimension for accountability
- Add more chart customisation options (date range filters, comparison views)

These suggestions are valuable and have been documented as potential future enhancements.

### 6.6 Evaluation Against Objectives

*Table 13 — Evaluation Against Objectives*

| Objective | Status | Evidence |
|---|---|---|
| 1. Review existing well-being tracking tools | Achieved | Chapter 2 provides a comparative analysis of Google Fit, MyFitnessPal, Strava, and Apple Health, identifying strengths, limitations, and the gap addressed by this project. |
| 2. Investigate relevant HCI and behaviour change literature | Achieved | Chapter 2 reviews literature on self-tracking, digital well-being, gamification, persuasive technology, and rule-based systems, informing design decisions. |
| 3. Conduct initial user research | Achieved | Surveys were conducted with participants to identify preferred tracking activities and feedback styles, as described in Chapter 3. |
| 4. Define functional requirements and success criteria | Achieved | Table 3 presents functional requirements derived from literature, competitive analysis, and user research. |
| 5. Produce wireframes and low-fidelity designs | Achieved | Wireframes were produced for all major pages including the dashboard, schedule grid, and tracking pages, and used to gather early feedback. |
| 6. Develop a working prototype with rule-based engine | Achieved | A comprehensive system was implemented with React 18 frontend (16 pages, 14 components), Express.js/Sequelize backend (11 models, 11 route modules, 34+ endpoints), SQLite database, rule-based insights engine, seven chart types, interactive weekly schedule, floating activity widget, authentication, and responsive theming. |
| 7. Conduct formative usability testing | Achieved | Usability testing with five participants demonstrated 100% task completion rates across seven tasks, a mean SUS score of 85.0 (Excellent), and positive qualitative feedback. |
| 8. Refine prototype based on user feedback | Achieved | Refinements were made based on testing observations, including fixing chart data key mapping, correcting dashboard schedule filtering, resolving widget visibility issues, and improving interactive schedule grid actions. Advanced suggestions (notifications, data export) are documented as future work. |

All eight objectives were achieved. The system significantly exceeded the initial prototype scope by expanding from two database tables and five pages to eleven tables, sixteen pages, and a comprehensive multi-dimensional wellness tracking platform.

---

## 7. Conclusions

### 7.1 Summary of Achievements

This project set out to design and develop a user-friendly, web-based application that enables users to record daily lifestyle activities and receive personalised, rule-based insights on how their choices affect well-being, productivity, and mood. The resulting system — HealthHub — successfully delivers on this aim and substantially exceeds the original scope through a comprehensive multi-dimensional wellness tracking platform.

The background research established a clear gap in existing wellness applications, which predominantly focus on isolated fitness metrics without providing integrated, personalised feedback across multiple lifestyle dimensions. The literature review confirmed that users benefit most from self-tracking when tools provide meaning, reflection, and behavioural guidance, and that simple, interpretable feedback mechanisms are often more effective than complex algorithmic approaches.

The system was developed as a full-stack web application using **React 18** for the frontend and **Express.js with Sequelize ORM** for the backend, demonstrating competence in modern JavaScript full-stack development. The final system comprises:

- **Backend:** Eleven Sequelize models, eleven Express route modules exposing thirty-four-plus REST API endpoints, JWT authentication with bcryptjs password hashing, and a rule-based insights engine.
- **Frontend:** Sixteen page components, fourteen reusable UI components, seven chart types (Recharts), two context providers, thirty-four API service functions, eleven CSS modules, and Bootstrap 5 integration.
- **Key Features:** An interactive weekly schedule with desktop grid and mobile list views, hover-to-reveal action buttons and detail popups; a floating current activity widget with live countdown timer and pulsating animation; a data-rich dashboard aggregating seven data sources into eight KPI cards and six chart panels; comprehensive tracking across sleep, nutrition, mood, workouts, health metrics, goals, journal, health records, and BMI/weight; and full light/dark theming.

Evaluation through usability testing with five participants demonstrated high usability with a mean SUS score of 85.0 (Excellent), 100% task completion rates across seven tasks, and positive perceptions of the feedback quality, visual design, feature comprehensiveness, and motivational effect.

### 7.2 Limitations

While the project has achieved its stated aim and delivered a feature-rich system, several limitations should be acknowledged:

**Rule-Based Limitations:** The insights engine uses static rules with fixed thresholds for five activity types. While transparent and interpretable, it does not account for individual baseline differences, nor does it learn from cumulative user data. The insights do not yet leverage the rich data from the eleven tracking dimensions — for example, it does not correlate sleep quality with mood scores or workout frequency.

**Small Evaluation Sample:** Usability testing was conducted with five participants, sufficient for identifying major usability issues but limiting the statistical significance of quantitative findings.

**Short-Term Evaluation:** The evaluation assessed usability through short lab-based sessions. Long-term engagement and actual behaviour change were not measured, requiring a longitudinal field study beyond this project's scope.

**Security Considerations:** While the system implements JWT authentication and bcryptjs password hashing, a production deployment would require HTTPS enforcement, rate limiting, comprehensive input sanitisation, and secret key management through environment variables rather than configuration files.

**Access Control Granularity:** The system relies on client-side username filtering rather than server-side JWT-based access control for data retrieval endpoints. A production system should validate the JWT on every protected endpoint and return only data belonging to the authenticated user.

### 7.3 Future Work

The project opens several promising directions for future development:

**Cross-Dimensional Insights:** The rule-based engine could be extended to analyse correlations across the eleven tracking dimensions — for example, identifying that a user's mood scores tend to be higher on days they exercise, or that poor sleep correlates with increased calorie intake. This cross-dimensional analysis would provide the holistic feedback that was identified as missing from existing tools.

**Machine Learning Integration:** The accumulated multi-dimensional data provides a rich foundation for machine learning models that could provide adaptive, personalised insights based on individual patterns rather than fixed thresholds.

**Notifications and Reminders:** Browser notifications or push notifications could be integrated with the schedule system to alert users when activities are about to start, leveraging the existing schedule infrastructure and activity widget.

**Data Export and Sharing:** Users requested the ability to export their wellness data in CSV or PDF format for sharing with healthcare providers, which would enhance the system's practical utility.

**Mobile Application:** A dedicated mobile application could leverage device sensors for passive data collection (step counting, sleep detection) and provide push notification support beyond what web browsers offer.

**Social and Community Features:** Optional features such as anonymous wellness challenges, accountability partners, or shared goal tracking could leverage social motivation to sustain engagement.

**Expanded Rule-Based Engine:** The insights engine could be extended to cover all eleven tracking dimensions with domain-specific rules — for example, nutritional balance insights, BMI trend warnings, or journal sentiment analysis.

**Longitudinal Evaluation:** A multi-week deployment study would provide evidence on whether the system's comprehensive tracking and feedback capabilities lead to measurable behaviour changes in real-world usage.

---

## References

Bangor, A., Kortum, P.T. and Miller, J.T. (2009) 'Determining what individual SUS scores mean: Adding an adjective rating scale', *Journal of Usability Studies*, 4(3), pp. 114–123.

Bickmore, T.W. and Paasche-Orlow, M.K. (2012) 'The role of information technology in health literacy research', *Journal of Health Communication*, 17(sup3), pp. 23–29.

Biddle, S.J.H. and Asare, M. (2011) 'Physical activity and mental health in children and adolescents: A review of reviews', *British Journal of Sports Medicine*, 45(11), pp. 886–895.

Brooke, J. (1996) 'SUS: A "quick and dirty" usability scale', in P.W. Jordan et al. (eds.) *Usability Evaluation in Industry*. London: Taylor & Francis, pp. 189–194.

Choe, E.K., Lee, N.B., Lee, B., Pratt, W. and Kientz, J.A. (2014) 'Understanding quantified-selfers' practices in collecting and exploring personal data', *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, pp. 1143–1152.

Consolvo, S., McDonald, D.W., Toscos, T., Chen, M.Y., Froehlich, J., Harrison, B., Klasnja, P., LaMarca, A., LeGrand, L., Libby, R., Smith, I. and Landay, J.A. (2008) 'Activity sensing in the wild: A field trial of UbiFit Garden', *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, pp. 1797–1806.

Deterding, S., Dixon, D., Khaled, R. and Nacke, L. (2011) 'From game design elements to gamefulness: Defining "gamification"', *Proceedings of the 15th International Academic MindTrek Conference*, pp. 9–15.

Deterding, S., Dixon, D., Khaled, R. and Nacke, L. (2019) 'Gamification and well-being: Integrating motivation, behavior change, and design', *Journal of Human-Computer Interaction*, 34(5).

Epstein, D.A., Ping, A., Fogarty, J. and Munson, S.A. (2015) 'A lived informatics model of personal informatics', *Proceedings of the 2015 ACM International Joint Conference on Pervasive and Ubiquitous Computing*, pp. 731–742.

Express.js (2024) *Express — Node.js web application framework*. Available at: https://expressjs.com/ (Accessed: 15 November 2025).

Fogg, B.J. (2003) *Persuasive Technology: Using Computers to Change What We Think and Do*. San Francisco: Morgan Kaufmann.

Google (2024) *Google Fit*. Available at: https://www.google.com/fit/ (Accessed: 15 November 2025).

Gunning, D. (2017) 'Explainable Artificial Intelligence (XAI)', *Defense Advanced Research Projects Agency (DARPA)*.

ISO 9241-210:2019 (2019) *Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems*. International Organization for Standardization.

Jackson, P. (1998) *Introduction to Expert Systems*. 3rd edn. Harlow: Addison-Wesley.

Khoury, B., Lecomte, T., Fortin, G., Masse, M., Therien, P., Bouchard, V., Chapleau, M.-A., Paquin, K. and Hofmann, S.G. (2015) 'Mindfulness-based therapy: A comprehensive meta-analysis', *Clinical Psychology Review*, 33(6), pp. 763–771.

Krebs, P., Prochaska, J.O. and Rossi, J.S. (2010) 'A meta-analysis of computer-tailored interventions for health behavior change', *Preventive Medicine*, 51(3–4), pp. 214–221.

Li, I., Dey, A. and Forlizzi, J. (2010) 'A stage-based model of personal informatics systems', *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, pp. 557–566.

Lockton, D., Harrison, D. and Stanton, N.A. (2010) 'The Design with Intent Method: A design tool for influencing user behaviour', *Applied Ergonomics*, 41(3), pp. 382–392.

Nehlig, A. (2010) 'Is caffeine a cognitive enhancer?', *Journal of Alzheimer's Disease*, 20(S1), pp. S85–S94.

Nielsen, J. (2000) 'Why you only need to test with 5 users', *Nielsen Norman Group*. Available at: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ (Accessed: 10 December 2025).

Nielsen, J. (2012) 'Usability 101: Introduction to usability', *Nielsen Norman Group*. Available at: https://www.nngroup.com/articles/usability-101-introduction-to-usability/ (Accessed: 10 October 2025).

Prochaska, J.O. and DiClemente, C.C. (1983) 'Stages and processes of self-change of smoking: Toward an integrative model of change', *Journal of Consulting and Clinical Psychology*, 51(3), pp. 390–395.

Rooksby, J., Rost, M., Morrison, A. and Chalmers, M. (2014) 'Personal tracking as lived informatics', *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*, pp. 1163–1172.

Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N. and Diakopoulos, N. (2016) *Designing the User Interface: Strategies for Effective Human-Computer Interaction*. 6th edn. London: Pearson.

Stawarz, K., Cox, A.L. and Blandford, A. (2015) 'Beyond self-tracking and reminders: Designing smartphone apps that support habit formation', *Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems*, pp. 2653–2662.

Sequelize (2024) *Sequelize — Feature-rich ORM for modern Node.js*. Available at: https://sequelize.org/ (Accessed: 15 November 2025).

Trougakos, J.P. and Hideg, I. (2009) 'Momentary work recovery: The role of within-day work breaks', *Research in Occupational Stress and Well-Being*, 7, pp. 37–84.

Walker, M. (2017) *Why We Sleep: The New Science of Sleep and Dreams*. London: Penguin Books.

WHO (2020) *WHO Guidelines on Physical Activity and Sedentary Behaviour*. Geneva: World Health Organization.

Wolf, G. (2010) 'The data-driven life', *The New York Times Magazine*, 28 April.

---

## Appendix A: Personal Reflection (Compulsory)

### A.1 Reflection on Project

Reflecting on the project as a whole, I believe the decision to focus on a rule-based insights engine rather than attempting a machine learning approach was the correct one for a project of this scope and timeframe. The rule-based system delivered transparent, understandable feedback that users responded to positively during evaluation. In hindsight, however, I recognise that I could have invested more time in the early design phase, particularly in producing higher-fidelity wireframes and testing them with a larger group of users before committing to implementation. The iterative approach helped mitigate this, as issues were caught during development and usability testing, but earlier and more extensive design validation would have reduced rework.

One challenge I encountered was managing the complexity of eleven Sequelize models and their corresponding route modules as the project grew beyond the initial two-table design. Ensuring consistent error handling, validation patterns, and JSON response formats across all thirty-four-plus API endpoints required disciplined adherence to coding conventions. This experience reinforced the importance of establishing patterns early in development and maintaining them as scope expands.

If I were to undertake this project again, I would begin user research earlier in the process and with a more structured approach, including formal interview protocols alongside surveys. I would also allocate more time for a second round of usability testing after implementing refinements based on the first round, creating a true iterative evaluation cycle.

I acknowledge that I did not use generative AI tools to write the code or content for this project. All code was written manually, and the dissertation was drafted through my own research and writing process, with standard academic resources and documentation serving as references.

### A.2 Personal Reflection

On a personal level, this project has been the most substantial individual development effort I have undertaken during my degree. It required me to integrate skills from multiple modules — web development, database design, software engineering, human-computer interaction, and research methods — into a cohesive whole. Managing the scope of the project while maintaining quality was a constant balancing act, and I learned the hard way that it is better to implement fewer features well than to attempt too many features with insufficient depth.

Time management was an area where I improved significantly over the course of the project. Early on, I underestimated the time required for background research and writing, spending too much time on implementation at the expense of the academic components. By mid-project, I adjusted my approach to allocate dedicated time blocks for research, writing, and development, which improved both productivity and the quality of the output.

I also developed a deeper appreciation for user-centred design. The usability testing sessions were eye-opening, particularly the moments where users interacted with the system in ways I had not anticipated. Observing real users reinforced that assumptions about usability must be validated through testing, no matter how intuitive the design appears to the developer.

If I had my time again, I would start the project with a more detailed project plan including Gantt chart milestones, and I would seek more frequent feedback from my supervisor during the design phase to catch potential issues earlier. I would also invest in automated testing earlier in the development process, which would have increased confidence during refactoring and reduced manual testing effort.

Overall, this project has been a rewarding and formative experience that has significantly developed my skills as a computer scientist and prepared me for professional software development work.

---

## Appendix B: Ethics Documentation (Compulsory)

### B.1 Ethics Approval

Ethics approval was obtained through the Brunel University London ethics process prior to the commencement of any user research or data collection activities.

*[Screenshot of Task 3 Pass to be attached here]*

The ethics application covered the following activities:
- Online survey distribution to gather user preferences for activity tracking and feedback styles
- Formative usability testing sessions with think-aloud protocol
- Post-testing questionnaires (System Usability Scale and custom satisfaction survey)
- Short post-testing interviews

All participants were provided with information sheets and signed consent forms prior to participation. Data was handled anonymously or pseudonymously, stored securely, and will be destroyed following project completion. No deceptive practices were employed, and participants were informed of their right to withdraw at any time without penalty.

---

## Appendix C: Video Demonstration (Compulsory)

### C.1 Link to the Video

*[Insert link to video demonstration hosted on YouTube or Microsoft OneDrive]*

The video demonstration (maximum 20 minutes) covers:
1. Overview of the system's purpose and architecture
2. Walkthrough of the landing page and feature highlights
3. Account creation and login process
4. Dashboard overview with KPI cards, charts (Wellness Radar, Workout Pie, Mood Trend, Sleep Trend, Goal Progress), and Today's Schedule
5. Health tracking pages (Health Metrics, Sleep, Nutrition, Mood, Workouts)
6. Weekly schedule page with interactive grid, hover actions, detail popups, and template application
7. Goal setting and progress tracking
8. Journal page with mood tags
9. Health records management (appointments, medications)
10. BMI and weight tracking with trend chart
11. Current Activity Widget demonstration (floating widget, countdown timer, expand/collapse)
12. Profile management and theme toggling (light/dark mode)
13. Responsive design demonstration across desktop and mobile viewports

---

## Appendix D: Other Appendices

---

## Appendix E: System Pages and Widgets Overview

### E.1 Page-by-Page Explanation

**LandingPage**: The public entry point, presenting the app’s purpose, feature highlights, and calls-to-action. Includes a motivational banner and feature cards.

**LoginPage**: Dual-mode form for user signup and login. Redirects authenticated users to the dashboard.

**Dashboard**: Aggregates all wellness data for the user. Shows KPI cards (wellness score, streak, sleep, calories, mood, workouts, goals, BMI), multiple charts (radar, pie, line, area, bar), and today’s schedule. Includes a floating activity widget.

**HealthTrackingPage**: For logging/viewing general health metrics (steps, calories, heart rate) with tabular history.

**SleepPage**: Log and review sleep data (hours, quality, stages, notes) with historical charts.

**NutritionPage**: Log meals, calories, macros, and water intake. View nutrition trends.

**MoodPage**: Log daily mood, stress, energy, mindfulness, and notes. View mood trends.

**GoalsPage**: Set and track goals. View progress bars, status, deadlines, and update progress.

**JournalPage**: Reflective journaling with mood tags and tag-based filtering.

**HealthRecordsPage**: Manage medical appointments, medications, and recurring health events.

**SchedulePage**: An interactive weekly schedule (desktop grid/mobile list). Add/edit entries, apply templates, view/edit/delete via popups.

**BMITrackerPage**: Log and track weight/BMI, calorie balance, and trends.

**ProfilePage**: View user info, change theme, and logout.

**AddActivityPage**: Quick form for logging a single activity.

---

### E.2 Widget and Component Explanations

**Navbar**: Responsive navigation bar with dropdowns, theme toggle, and authentication-aware links.

**Footer**: Consistent footer with copyright and motivational tagline.

**CurrentActivityWidget**: A floating, pulsating circle widget visible on all pages that displays the current or next scheduled activity with a live countdown timer, SVG progress ring, and expandable detail panel.

**Charts**: Exports multiple chart types (radar, pie, line, area, bar, progress) for visualising wellness data.

**KPICards**: Displays summary statistic cards (KPI) for dashboard metrics.

**DataTable**: Reusable, sortable table for displaying tabular data.

**GoalProgress**: Visualises goal milestones and progress as a bar and checklist.

**StreakTracker**: Shows current streaks and milestone achievements.

**WeeklySchedule**: Renders the weekly schedule as a grid (desktop) or list (mobile), with interactive entry management.

**ScheduleForm**: Form for creating/editing schedule entries, with type, time, colour, and notes.

**ActivityForm**: Simple form for logging a single activity (sleep, coffee, exercise, etc.).

**ActivityLog**: Table of logged activities with date, type, value, and user.

**InsightsPanel**: Lets users select an activity and value to get a rule-based insight.

**ActivityTimer**: Timer for tracking activity duration, with preset and custom activities.

**ProgressModal**: Modal dialog for updating goal milestone progress.

### D.1 Survey Instrument

The following questions were used in the initial user research survey:

1. Which of the following daily activities do you think most affect your well-being? (Select all that apply: Sleep, Exercise, Coffee/Caffeine, Meditation, Breaks, Diet, Screen Time, Socialising, Other)
2. How often do you currently track any of your daily activities? (Never, Rarely, Sometimes, Often, Daily)
3. What kind of feedback would motivate you to improve your habits? (Positive encouragement, Data and statistics, Comparison with goals, Tips and recommendations, Visual progress charts)
4. What devices do you primarily use for browsing the web? (Desktop/Laptop, Tablet, Smartphone)
5. Would you prefer a light or dark colour scheme for a wellness application? (Light, Dark, Option to switch)
6. On a scale of 1–5, how important is simplicity in a wellness tracking tool?
7. Any additional features you would find useful in a well-being tracker? (Free text)


### D.3 Planned Feature: Automated Wellness Report Generation (PDF Export)

An upcoming feature will allow users to generate and download a comprehensive wellness report as a PDF for a selected period (day, week, or month) directly from the Profile page. The PDF report will include:

- **Summary assertion** based on combined habits (sleep, caffeine/coffee intake, exercise, etc.)
- **Tables covering all tracked statistics:**
  - Food and nutrition consumption (meals, calories, macronutrients, caffeine, water, etc.)
  - Sleep (total hours, quality, trends)
  - Exercise and workouts (total minutes, types, frequency)
  - Health checkups and medical records (appointments, medications, vaccines)
  - Work hours and schedule adherence (from schedule logs)
  - Mood and journal entries (summary counts, trends)
  - Goals and progress (active/completed, milestones)
  - BMI and weight changes

**Criteria for Report Generation:**
- All available logs and stats for the selected period will be aggregated and presented in tabular format in the PDF.
- The assertion logic will combine multiple factors (e.g., low sleep, high caffeine, low exercise) to provide a tailored summary at the start of the report.

**Expected Results:**
- Users will be able to select a period and instantly download a PDF report summarizing all their wellness data, with clear tables and a summary assertion.
- The PDF can be shared with healthcare providers or used for personal reflection.
- Example output:
  - *Summary assertion at the top (e.g., "Low sleep combined with high caffeine intake and lack of exercise may be affecting your focus and energy this week.")*
  - *Tables for each category (food, sleep, exercise, checkups, work hours, etc.) with totals and trends for the period*

This feature is designed to help users reflect on the combined impact of their habits, encourage positive behaviour change, and facilitate sharing of wellness data when needed.

---
### D.2 System Usability Scale (SUS) Questionnaire

The standard ten-item SUS questionnaire (Brooke, 1996) was administered to participants after usability testing:

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

Each item was rated on a five-point Likert scale from Strongly Disagree (1) to Strongly Agree (5).

### D.3 Technology Stack Summary

| Component | Technology | Version |
|---|---|---|
| Frontend Framework | React | 18.2 |
| Frontend Routing | React Router | 6.21 |
| UI Framework | Bootstrap | 5.3 |
| Icons | Bootstrap Icons | 1.13 |
| Data Visualisation | Recharts | 2.10 |
| HTTP Client | Axios | 1.6 |
| Backend Framework | Express.js | 4.x |
| ORM | Sequelize | 6.x |
| Database | SQLite | 3.x (via sqlite3) |
| Authentication | JWT (jsonwebtoken) | 9.x |
| Password Hashing | bcryptjs | 2.x |
| Runtime | Node.js | 18+ |

### D.4 Additional Screenshots

*[Additional screenshots of the application in various states — empty dashboard, populated dashboard, mobile view, dark mode, error states — to be included here]*
