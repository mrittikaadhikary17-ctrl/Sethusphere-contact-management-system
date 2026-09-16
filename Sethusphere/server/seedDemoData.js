import "dotenv/config";

import mongoose from "mongoose";

import connectDB from "./config/db.js";

import User from "./models/User.js";
import Contact from "./models/Contact.js";
import Interaction from "./models/Interaction.js";
import Task from "./models/Task.js";
import Group from "./models/Group.js";
import Tag from "./models/Tag.js";
import DuplicateRecord from "./models/DuplicateRecord.js";
import Notification from "./models/Notification.js";

const SEEDED_EMAILS = [
  "araav.sharma.pm@gmail.com",
  "araav.sharma.engineering@gmail.com",
  "priya.sen.dev@gmail.com",
  "rahul.mehta.founder@gmail.com",
  "ananya.roy.design@gmail.com",
  "sneha.kapoor.hr@gmail.com",
  "rohan.das.tech@gmail.com",
  "ishita.mukherjee.ba@gmail.com",
  "vikram.patel.arch@gmail.com",
  "meera.chatterjee.hr@gmail.com",
  "aditya.ghosh.dev@gmail.com",
  "nisha.verma.client@gmail.com",
  "kunal.saha.design@gmail.com",
  "meera.chatterji.hr@gmail.com",
  "sayan.banerjee.tech@gmail.com",
  "riya.dutta.founder@gmail.com",
  "advik.gupta.cloud@gmail.com",
  "nisha.varma.client@gmail.com",
  "neha.singh.product@gmail.com",
  "aman.malhotra.data@gmail.com",
];

const OLD_DEMO_EMAIL_REGEX = /@demo\.sethusphere\.local$/i;

const profileImages = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/41.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/52.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/64.jpg",
  "https://randomuser.me/api/portraits/women/49.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/56.jpg",
  "https://randomuser.me/api/portraits/men/71.jpg",
  "https://randomuser.me/api/portraits/women/50.jpg",
  "https://randomuser.me/api/portraits/men/15.jpg",
  "https://randomuser.me/api/portraits/women/47.jpg",
  "https://randomuser.me/api/portraits/men/82.jpg",
  "https://randomuser.me/api/portraits/women/63.jpg",
  "https://randomuser.me/api/portraits/women/24.jpg",
  "https://randomuser.me/api/portraits/men/77.jpg",
];

const contactsData = [
  {
    firstName: "Araav",
    lastName: "Sharma",
    jobTitle: "Product Manager",
    company: "TechNova Solutions",
    category: "Professional",
    relationshipScore: 88,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "araav.sharma.pm@gmail.com",
    phone: "+91 98765 21001",
    website: "https://technova.example.com",
    linkedin: "https://linkedin.com/in/araav-sharma",
    relationshipSince: "2024-02-15",
    lastInteraction: "Product discussion",
    lastInteractionDate: "2026-09-10",
    lastInteractionType: "Meeting",
    nextFollowUp: "Follow up on product proposal",
    nextFollowUpDate: "2026-09-18",
    totalInteractions: 14,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "High",
    tags: ["Important", "Tech", "Networking", "VIP"],
    isFavorite: true,
  },
  {
    firstName: "Araav",
    lastName: "Sharma",
    jobTitle: "Engineering Manager",
    company: "CloudBridge Labs",
    category: "Professional",
    relationshipScore: 72,
    healthStatus: "Needs Attention",
    relationshipStatus: "Needs Attention",
    email: "araav.sharma.engineering@gmail.com",
    phone: "+91 98765 21002",
    website: "https://cloudbridge.example.com",
    linkedin: "https://linkedin.com/in/araav-sharma-engineering",
    relationshipSince: "2024-07-12",
    lastInteraction: "Technical discussion",
    lastInteractionDate: "2026-08-22",
    lastInteractionType: "Call",
    nextFollowUp: "Reconnect regarding engineering opportunity",
    nextFollowUpDate: "2026-09-17",
    totalInteractions: 8,
    cadence: "Monthly",
    preferredChannel: "Call",
    responsiveness: "Medium",
    tags: ["Tech", "Hiring", "Follow Up"],
    isFavorite: false,
  },
  {
    firstName: "Priya",
    lastName: "Sen",
    jobTitle: "Senior Software Engineer",
    company: "Infosys",
    category: "Professional",
    relationshipScore: 81,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "priya.sen.dev@gmail.com",
    phone: "+91 98765 21003",
    website: "https://infosys.example.com",
    relationshipSince: "2023-11-08",
    lastInteraction: "Career discussion",
    lastInteractionDate: "2026-09-08",
    lastInteractionType: "Message",
    nextFollowUp: "Share updated project portfolio",
    nextFollowUpDate: "2026-09-20",
    totalInteractions: 17,
    cadence: "Monthly",
    preferredChannel: "Message",
    responsiveness: "High",
    tags: ["Tech", "Networking"],
  },
  {
    firstName: "Rahul",
    lastName: "Mehta",
    jobTitle: "Founder",
    company: "StartupHub",
    category: "Startup",
    relationshipScore: 61,
    healthStatus: "At Risk",
    relationshipStatus: "At Risk",
    email: "rahul.mehta.founder@gmail.com",
    phone: "+91 98765 21004",
    website: "https://startuphub.example.com",
    relationshipSince: "2025-01-20",
    lastInteraction: "Startup networking call",
    lastInteractionDate: "2026-07-15",
    lastInteractionType: "Call",
    nextFollowUp: "Reconnect about collaboration",
    nextFollowUpDate: "2026-09-16",
    totalInteractions: 5,
    cadence: "Quarterly",
    preferredChannel: "Call",
    responsiveness: "Low",
    tags: ["Startup", "Networking", "Follow Up"],
  },
  {
    firstName: "Ananya",
    lastName: "Roy",
    jobTitle: "UX Designer",
    company: "PixelCraft Studio",
    category: "Professional",
    relationshipScore: 91,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "ananya.roy.design@gmail.com",
    phone: "+91 98765 21005",
    website: "https://pixelcraft.example.com",
    relationshipSince: "2024-04-10",
    lastInteraction: "Design review",
    lastInteractionDate: "2026-09-11",
    lastInteractionType: "Meeting",
    nextFollowUp: "Review new portfolio",
    nextFollowUpDate: "2026-09-25",
    totalInteractions: 21,
    cadence: "Biweekly",
    preferredChannel: "Email",
    responsiveness: "High",
    tags: ["Networking", "Tech"],
  },
  {
    firstName: "Sneha",
    lastName: "Kapoor",
    jobTitle: "Talent Acquisition Specialist",
    company: "Deloitte",
    category: "Recruiter",
    relationshipScore: 78,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "sneha.kapoor.hr@gmail.com",
    phone: "+91 98765 21006",
    website: "https://deloitte.example.com",
    relationshipSince: "2025-05-18",
    lastInteraction: "Recruitment discussion",
    lastInteractionDate: "2026-09-05",
    lastInteractionType: "Email",
    nextFollowUp: "Send latest resume",
    nextFollowUpDate: "2026-09-19",
    totalInteractions: 9,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "High",
    tags: ["Hiring", "Important", "Follow Up"],
  },
  {
    firstName: "Rohan",
    lastName: "Das",
    jobTitle: "Technical Lead",
    company: "Wipro",
    category: "Mentor",
    relationshipScore: 86,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "rohan.das.tech@gmail.com",
    phone: "+91 98765 21007",
    website: "https://wipro.example.com",
    relationshipSince: "2023-08-14",
    lastInteraction: "Career mentoring",
    lastInteractionDate: "2026-09-03",
    lastInteractionType: "Call",
    nextFollowUp: "Discuss backend architecture",
    nextFollowUpDate: "2026-09-24",
    totalInteractions: 19,
    cadence: "Monthly",
    preferredChannel: "Call",
    responsiveness: "High",
    tags: ["Mentor", "Tech"],
  },
  {
    firstName: "Ishita",
    lastName: "Mukherjee",
    jobTitle: "Business Analyst",
    company: "Accenture",
    category: "Professional",
    relationshipScore: 69,
    healthStatus: "Needs Attention",
    relationshipStatus: "Needs Attention",
    email: "ishita.mukherjee.ba@gmail.com",
    phone: "+91 98765 21008",
    website: "https://accenture.example.com",
    relationshipSince: "2025-02-11",
    lastInteraction: "Project discussion",
    lastInteractionDate: "2026-08-10",
    lastInteractionType: "Meeting",
    nextFollowUp: "Check project status",
    nextFollowUpDate: "2026-09-21",
    totalInteractions: 7,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "Medium",
    tags: ["Follow Up", "Networking"],
  },
  {
    firstName: "Vikram",
    lastName: "Patel",
    jobTitle: "Software Architect",
    company: "TCS",
    category: "Mentor",
    relationshipScore: 93,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "vikram.patel.arch@gmail.com",
    phone: "+91 98765 21009",
    website: "https://tcs.example.com",
    relationshipSince: "2022-10-05",
    lastInteraction: "Architecture review",
    lastInteractionDate: "2026-09-09",
    lastInteractionType: "Meeting",
    nextFollowUp: "Discuss system design",
    nextFollowUpDate: "2026-09-30",
    totalInteractions: 27,
    cadence: "Monthly",
    preferredChannel: "Call",
    responsiveness: "High",
    tags: ["Mentor", "Tech", "Important", "VIP"],
    isFavorite: true,
  },
  {
    firstName: "Meera",
    lastName: "Chatterjee",
    jobTitle: "HR Manager",
    company: "Cognizant",
    category: "Recruiter",
    relationshipScore: 74,
    healthStatus: "Needs Attention",
    relationshipStatus: "Needs Attention",
    email: "meera.chatterjee.hr@gmail.com",
    phone: "+91 98765 21010",
    website: "https://cognizant.example.com",
    relationshipSince: "2025-09-02",
    lastInteraction: "Hiring discussion",
    lastInteractionDate: "2026-08-28",
    lastInteractionType: "Email",
    nextFollowUp: "Ask about internship openings",
    nextFollowUpDate: "2026-09-17",
    totalInteractions: 6,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "Medium",
    tags: ["Hiring", "Follow Up"],
  },
  {
    firstName: "Aditya",
    lastName: "Ghosh",
    jobTitle: "Full Stack Developer",
    company: "DevWorks",
    category: "Professional",
    relationshipScore: 83,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "aditya.ghosh.dev@gmail.com",
    phone: "+91 98765 21011",
    website: "https://devworks.example.com",
    relationshipSince: "2024-06-16",
    lastInteraction: "Project collaboration",
    lastInteractionDate: "2026-09-06",
    lastInteractionType: "Message",
    nextFollowUp: "Review GitHub project",
    nextFollowUpDate: "2026-09-22",
    totalInteractions: 12,
    cadence: "Monthly",
    preferredChannel: "Message",
    responsiveness: "High",
    tags: ["Tech", "Networking"],
  },
  {
    firstName: "Nisha",
    lastName: "Verma",
    jobTitle: "Marketing Manager",
    company: "BrightWave Media",
    category: "Client",
    relationshipScore: 77,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "nisha.verma.client@gmail.com",
    phone: "+91 98765 21012",
    website: "https://brightwave.example.com",
    relationshipSince: "2025-03-19",
    lastInteraction: "Campaign review",
    lastInteractionDate: "2026-09-04",
    lastInteractionType: "Meeting",
    nextFollowUp: "Review campaign metrics",
    nextFollowUpDate: "2026-09-23",
    totalInteractions: 11,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "High",
    tags: ["Client", "Important", "VIP"],
  },
  {
    firstName: "Kunal",
    lastName: "Saha",
    jobTitle: "Product Designer",
    company: "DesignForge",
    category: "Professional",
    relationshipScore: 64,
    healthStatus: "At Risk",
    relationshipStatus: "At Risk",
    email: "kunal.saha.design@gmail.com",
    phone: "+91 98765 21013",
    website: "https://designforge.example.com",
    relationshipSince: "2024-12-03",
    lastInteraction: "Portfolio review",
    lastInteractionDate: "2026-07-30",
    lastInteractionType: "Meeting",
    nextFollowUp: "Reconnect about design collaboration",
    nextFollowUpDate: "2026-09-20",
    totalInteractions: 4,
    cadence: "Quarterly",
    preferredChannel: "Message",
    responsiveness: "Low",
    tags: ["Tech", "Follow Up"],
  },
  {
    firstName: "Meera",
    lastName: "Chatterji",
    jobTitle: "Recruitment Consultant",
    company: "TalentBridge",
    category: "Recruiter",
    relationshipScore: 71,
    healthStatus: "Needs Attention",
    relationshipStatus: "Needs Attention",
    email: "meera.chatterji.hr@gmail.com",
    phone: "+91 98765 21014",
    website: "https://talentbridge.example.com",
    relationshipSince: "2025-06-12",
    lastInteraction: "Recruiter message",
    lastInteractionDate: "2026-08-31",
    lastInteractionType: "Message",
    nextFollowUp: "Share updated skills profile",
    nextFollowUpDate: "2026-09-18",
    totalInteractions: 8,
    cadence: "Monthly",
    preferredChannel: "Message",
    responsiveness: "Medium",
    tags: ["Hiring", "Networking"],
  },
  {
    firstName: "Sayan",
    lastName: "Banerjee",
    jobTitle: "Engineering Director",
    company: "Orbit Systems",
    category: "Professional",
    relationshipScore: 89,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "sayan.banerjee.tech@gmail.com",
    phone: "+91 98765 21015",
    website: "https://orbit.example.com",
    relationshipSince: "2023-05-20",
    lastInteraction: "Technology discussion",
    lastInteractionDate: "2026-09-07",
    lastInteractionType: "Call",
    nextFollowUp: "Discuss cloud architecture",
    nextFollowUpDate: "2026-09-26",
    totalInteractions: 16,
    cadence: "Monthly",
    preferredChannel: "Call",
    responsiveness: "High",
    tags: ["Tech", "Networking"],
  },
  {
    firstName: "Riya",
    lastName: "Dutta",
    jobTitle: "Founder",
    company: "Connectly",
    category: "Startup",
    relationshipScore: 58,
    healthStatus: "At Risk",
    relationshipStatus: "At Risk",
    email: "riya.dutta.founder@gmail.com",
    phone: "+91 98765 21016",
    website: "https://connectly.example.com",
    relationshipSince: "2025-08-01",
    lastInteraction: "Startup networking",
    lastInteractionDate: "2026-07-20",
    lastInteractionType: "Message",
    nextFollowUp: "Follow up on partnership",
    nextFollowUpDate: "2026-09-19",
    totalInteractions: 3,
    cadence: "Quarterly",
    preferredChannel: "Message",
    responsiveness: "Low",
    tags: ["Startup", "Networking", "Follow Up"],
  },
  {
    firstName: "Sayan",
    lastName: "Banerjee",
    jobTitle: "Cloud Engineer",
    company: "CloudMatrix",
    category: "Professional",
    relationshipScore: 84,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "advik.gupta.cloud@gmail.com",
    phone: "+91 98765 21017",
    website: "https://cloudmatrix.example.com",
    relationshipSince: "2024-09-10",
    lastInteraction: "Cloud architecture discussion",
    lastInteractionDate: "2026-09-02",
    lastInteractionType: "Call",
    nextFollowUp: "Share cloud resources",
    nextFollowUpDate: "2026-09-27",
    totalInteractions: 13,
    cadence: "Monthly",
    preferredChannel: "Call",
    responsiveness: "High",
    tags: ["Tech", "Networking"],
  },
  {
    firstName: "Nisha",
    lastName: "Varma",
    jobTitle: "Client Success Manager",
    company: "GrowthWorks",
    category: "Client",
    relationshipScore: 76,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "nisha.varma.client@gmail.com",
    phone: "+91 98765 21018",
    website: "https://growthworks.example.com",
    relationshipSince: "2025-04-14",
    lastInteraction: "Client check-in",
    lastInteractionDate: "2026-09-01",
    lastInteractionType: "Meeting",
    nextFollowUp: "Monthly account review",
    nextFollowUpDate: "2026-09-29",
    totalInteractions: 10,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "High",
    tags: ["Client", "Important"],
  },
  {
    firstName: "Neha",
    lastName: "Singh",
    jobTitle: "Product Analyst",
    company: "FinEdge",
    category: "Professional",
    relationshipScore: 79,
    healthStatus: "Healthy",
    relationshipStatus: "Healthy",
    email: "neha.singh.product@gmail.com",
    phone: "+91 98765 21019",
    website: "https://finedge.example.com",
    relationshipSince: "2025-01-12",
    lastInteraction: "Product planning",
    lastInteractionDate: "2026-09-06",
    lastInteractionType: "Meeting",
    nextFollowUp: "Share product notes",
    nextFollowUpDate: "2026-09-28",
    totalInteractions: 9,
    cadence: "Monthly",
    preferredChannel: "Email",
    responsiveness: "High",
    tags: ["Networking", "Important"],
  },
  {
    firstName: "Aman",
    lastName: "Malhotra",
    jobTitle: "Data Engineer",
    company: "DataSphere",
    category: "Professional",
    relationshipScore: 67,
    healthStatus: "Needs Attention",
    relationshipStatus: "Needs Attention",
    email: "aman.malhotra.data@gmail.com",
    phone: "+91 98765 21020",
    website: "https://datasphere.example.com",
    relationshipSince: "2025-04-22",
    lastInteraction: "Technical discussion",
    lastInteractionDate: "2026-08-19",
    lastInteractionType: "Call",
    nextFollowUp: "Reconnect about data engineering",
    nextFollowUpDate: "2026-09-22",
    totalInteractions: 6,
    cadence: "Monthly",
    preferredChannel: "Call",
    responsiveness: "Medium",
    tags: ["Tech", "Follow Up"],
  },
];

const interactionData = [
  ["araav.sharma.pm@gmail.com", "Meeting", "Product roadmap discussion", "Discussed upcoming product requirements and possible collaboration.", "Positive", "45 min", "Follow-up scheduled"],
  ["araav.sharma.pm@gmail.com", "Email", "Proposal follow-up", "Shared product proposal and requested feedback.", "Positive", "", "Awaiting response"],
  ["araav.sharma.engineering@gmail.com", "Call", "Engineering opportunity", "Discussed potential engineering collaboration.", "Neutral", "25 min", "Reconnect next week"],
  ["priya.sen.dev@gmail.com", "Message", "Career discussion", "Discussed current technology trends and career opportunities.", "Positive", "", "Good conversation"],
  ["priya.sen.dev@gmail.com", "Meeting", "Portfolio review", "Reviewed project portfolio and discussed improvements.", "Positive", "40 min", "Portfolio update requested"],
  ["rahul.mehta.founder@gmail.com", "Call", "Startup networking call", "Discussed startup collaboration possibilities.", "Neutral", "30 min", "Follow-up required"],
  ["ananya.roy.design@gmail.com", "Meeting", "Design review", "Reviewed dashboard UX and interaction patterns.", "Positive", "50 min", "Design feedback shared"],
  ["sneha.kapoor.hr@gmail.com", "Email", "Recruitment discussion", "Discussed internship and entry-level hiring opportunities.", "Positive", "", "Resume requested"],
  ["rohan.das.tech@gmail.com", "Call", "Career mentoring", "Discussed backend development and system design.", "Positive", "35 min", "Continue mentoring"],
  ["ishita.mukherjee.ba@gmail.com", "Meeting", "Project discussion", "Discussed business requirements for a new internal project.", "Neutral", "35 min", "Check status later"],
  ["vikram.patel.arch@gmail.com", "Meeting", "Architecture review", "Reviewed REST API and database architecture concepts.", "Positive", "60 min", "System design follow-up"],
  ["meera.chatterjee.hr@gmail.com", "Email", "Hiring discussion", "Asked about upcoming internship opportunities.", "Neutral", "", "Waiting for response"],
  ["aditya.ghosh.dev@gmail.com", "Message", "Project collaboration", "Shared GitHub project and discussed technical implementation.", "Positive", "", "Review project"],
  ["nisha.verma.client@gmail.com", "Meeting", "Campaign review", "Reviewed campaign requirements and deliverables.", "Positive", "45 min", "Metrics review scheduled"],
  ["kunal.saha.design@gmail.com", "Meeting", "Portfolio review", "Reviewed design portfolio and possible collaboration.", "Neutral", "30 min", "Reconnect later"],
  ["meera.chatterji.hr@gmail.com", "Message", "Recruiter message", "Discussed current internship opportunities.", "Positive", "", "Share updated profile"],
  ["sayan.banerjee.tech@gmail.com", "Call", "Technology discussion", "Discussed cloud infrastructure and engineering practices.", "Positive", "40 min", "Continue discussion"],
  ["riya.dutta.founder@gmail.com", "Message", "Startup networking", "Discussed partnership possibilities.", "Neutral", "", "Follow-up required"],
  ["advik.gupta.cloud@gmail.com", "Call", "Cloud architecture discussion", "Discussed cloud technologies and learning resources.", "Positive", "30 min", "Share resources"],
  ["nisha.varma.client@gmail.com", "Meeting", "Client check-in", "Reviewed client requirements and next steps.", "Positive", "45 min", "Monthly review"],
  ["araav.sharma.pm@gmail.com", "Note", "Important contact note", "Reviewed relationship details and follow-up requirements.", "Neutral", "", "Review relationship"],
  ["vikram.patel.arch@gmail.com", "Email", "System design resources", "Shared useful system design resources.", "Positive", "", "Read resources"],
  ["sneha.kapoor.hr@gmail.com", "Call", "Hiring follow-up", "Followed up regarding internship hiring.", "Positive", "20 min", "Resume under review"],
  ["ananya.roy.design@gmail.com", "Message", "Design resources", "Shared design inspiration and resources.", "Positive", "", "Continue discussion"],
  ["sayan.banerjee.tech@gmail.com", "Meeting", "Cloud architecture", "Discussed scalable backend architecture.", "Positive", "50 min", "Follow-up scheduled"],
];

const taskData = [
  ["araav.sharma.pm@gmail.com", "Follow up on product proposal", "2026-09-18", "High", "Pending"],
  ["priya.sen.dev@gmail.com", "Share updated project portfolio", "2026-09-20", "Medium", "Pending"],
  ["rahul.mehta.founder@gmail.com", "Reconnect about collaboration", "2026-09-16", "High", "Overdue"],
  ["ananya.roy.design@gmail.com", "Review new portfolio", "2026-09-25", "Low", "Pending"],
  ["sneha.kapoor.hr@gmail.com", "Send latest resume", "2026-09-19", "Urgent", "In Progress"],
  ["rohan.das.tech@gmail.com", "Discuss backend architecture", "2026-09-24", "Medium", "Pending"],
  ["ishita.mukherjee.ba@gmail.com", "Check project status", "2026-09-21", "Medium", "Pending"],
  ["vikram.patel.arch@gmail.com", "Discuss system design", "2026-09-30", "Low", "Pending"],
  ["meera.chatterjee.hr@gmail.com", "Ask about internship openings", "2026-09-17", "High", "Pending"],
  ["kunal.saha.design@gmail.com", "Reconnect about collaboration", "2026-09-20", "Medium", "Overdue"],
  ["meera.chatterji.hr@gmail.com", "Share updated skills profile", "2026-09-18", "High", "Pending"],
  ["riya.dutta.founder@gmail.com", "Follow up on partnership", "2026-09-19", "High", "Pending"],
];

const groups = [
  ["Work", "Professional contacts and workplace connections."],
  ["Mentors", "People who provide career or technical guidance."],
  ["Recruiters", "Recruiters and hiring contacts."],
  ["Clients", "Client and business relationships."],
  ["Networking", "Professional networking connections."],
  ["Partners", "Strategic partners, collaborators, and business alliances."],
];

const tags = [
  ["Important", "wine"],
  ["Follow Up", "amber"],
  ["Tech", "blue"],
  ["Hiring", "purple"],
  ["Mentor", "green"],
  ["Client", "rose"],
  ["Startup", "orange"],
  ["Networking", "slate"],
  ["VIP", "wine"],
];

const duplicatePairs = [
  {
    primary: "meera.chatterjee.hr@gmail.com",
    duplicate: "meera.chatterji.hr@gmail.com",
    confidence: 94,
    reason: "Very similar contact names.",
  },
  {
    primary: "sayan.banerjee.tech@gmail.com",
    duplicate: "advik.gupta.cloud@gmail.com",
    confidence: 100,
    reason: "Matching contact names.",
  },
  {
    primary: "nisha.verma.client@gmail.com",
    duplicate: "nisha.varma.client@gmail.com",
    confidence: 94,
    reason: "Very similar contact names.",
  },
];

async function getSeedOwner() {
  const configuredEmail = process.env.SEED_OWNER_EMAIL
    ?.trim()
    .toLowerCase();

  if (configuredEmail) {
    const user = await User.findOne({
      email: configuredEmail,
    });

    if (!user) {
      throw new Error(
        `SEED_OWNER_EMAIL "${configuredEmail}" was not found.`
      );
    }

    return user;
  }

  const users = await User.find({}).select(
    "_id email name firstName lastName"
  );

  if (users.length === 0) {
    throw new Error(
      "No users found. Sign up once in SethuSphere before running the seed."
    );
  }

  if (users.length > 1) {
    throw new Error(
      "Multiple users exist. Run the seed with SEED_OWNER_EMAIL set to the email of the user who should own the seeded data."
    );
  }

  return users[0];
}

async function removeSeedData(ownerId) {
  const previousContacts = await Contact.find({
    ownerId,
    $or: [
      {
        email: {
          $in: SEEDED_EMAILS,
        },
      },
      {
        email: {
          $regex: OLD_DEMO_EMAIL_REGEX,
        },
      },
    ],
  }).select("_id");

  const previousContactIds = previousContacts.map(
    (contact) => contact._id
  );

  if (previousContactIds.length > 0) {
    await Interaction.deleteMany({
      ownerId,
      contactId: {
        $in: previousContactIds,
      },
    });

    await Task.deleteMany({
      ownerId,
      contactId: {
        $in: previousContactIds,
      },
    });

    await DuplicateRecord.deleteMany({
      ownerId,
      $or: [
        {
          primaryContactId: {
            $in: previousContactIds,
          },
        },
        {
          duplicateContactId: {
            $in: previousContactIds,
          },
        },
      ],
    });

    await Contact.deleteMany({
      _id: {
        $in: previousContactIds,
      },
    });
  }

  await DuplicateRecord.deleteMany({
    ownerId,
    $or: [
      {
        reason: {
          $regex: "^Potential duplicate based on",
        },
      },
      {
        reason: {
          $regex: "^Very similar contact names$",
        },
      },
      {
        reason: {
          $regex: "^Matching contact names$",
        },
      },
    ],
  });

  await Group.deleteMany({
    ownerId,
    $or: [
      {
        name: {
          $in: [
            ...groups.map(([name]) => name),
            "Friends",
          ],
        },
      },
      {
        name: {
          $regex: /^Demo\s+-/i,
        },
      },
      {
        name: {
          $regex: /^Demo\s+/i,
        },
      },
    ],
  });

  await Tag.deleteMany({
    ownerId,
    $or: [
      {
        name: {
          $in: [
            ...tags.map(([name]) => name),
            "Friends",
          ],
        },
      },
      {
        name: {
          $regex: /^Demo\s+-/i,
        },
      },
      {
        name: {
          $regex: /^Demo\s+/i,
        },
      },
    ],
  });

  await Notification.deleteMany({
    userId: ownerId,
    $or: [
      {
        title: {
          $regex: /^\[Demo\]/i,
        },
      },
      {
        title: {
          $regex: /^\[SethuSphere Demo\]/i,
        },
      },
    ],
  });
}

async function seed() {
  await connectDB();

  const owner = await getSeedOwner();
  const ownerId = owner._id;

  console.log(`Using owner: ${owner.email}`);

  await removeSeedData(ownerId);

  const categoryAssignments = {
  "rahul.mehta.founder@gmail.com": "Lead",
  "ananya.roy.design@gmail.com": "Partner",
  "araav.sharma.pm@gmail.com": "VIP",
  "kunal.saha.design@gmail.com": "Vendor",
  "priya.sen.dev@gmail.com": "Employee",
  "riya.dutta.founder@gmail.com": "Lead",
  "aditya.ghosh.dev@gmail.com": "Partner",
  "neha.singh.product@gmail.com": "Employee",
};
const contactDocuments = contactsData.map(
    (contact, index) => ({
      ...contact,
      ownerId,
      category:
        categoryAssignments[contact.email] ||
        contact.category,
      fullName: `${contact.firstName} ${contact.lastName}`,
      avatar: profileImages[index],
      profilePhoto: profileImages[index],
    })
  );

  const contacts = await Contact.insertMany(
    contactDocuments
  );

  const contactByEmail = new Map();

  for (const contact of contacts) {
    contactByEmail.set(contact.email, contact);
  }

  if (contacts.length !== 20) {
    throw new Error(
      `Expected 20 contacts but created ${contacts.length}.`
    );
  }

  const araavContacts = contacts.filter(
    (contact) =>
      contact.firstName === "Araav" &&
      contact.lastName === "Sharma"
  );

  if (araavContacts.length !== 2) {
    throw new Error(
      `Expected exactly 2 Araav Sharma contacts but found ${araavContacts.length}.`
    );
  }

  const interactionDocuments = interactionData.map(
    (
      [
        email,
        type,
        title,
        description,
        sentiment,
        duration,
        outcome,
      ],
      index
    ) => {
      const contact = contactByEmail.get(email);

      if (!contact) {
        throw new Error(
          `Interaction contact not found: ${email}`
        );
      }

      const timestamp = new Date(
        Date.now() -
          Math.max(1, 25 - index) *
            24 *
            60 *
            60 *
            1000
      );

      return {
        ownerId,
        contactId: contact._id,
        contactName: contact.fullName,
        contactCompany: contact.company,
        contactAvatar: contact.avatar,
        type,
        title,
        description,
        date: timestamp.toISOString().slice(0, 10),
        timestamp,
        sentiment,
        duration,
        outcome,
      };
    }
  );

  const createdInteractions =
    await Interaction.insertMany(
      interactionDocuments
    );

  const taskDocuments = taskData.map(
    ([email, title, dueDate, priority, status]) => {
      const contact = contactByEmail.get(email);

      if (!contact) {
        throw new Error(
          `Task contact not found: ${email}`
        );
      }

      return {
        ownerId,
        contactId: contact._id,
        contactName: contact.fullName,
        contactCompany: contact.company,
        contactAvatar: contact.avatar,
        title,
        dueDate,
        dueDateRaw: dueDate,
        priority,
        status,
        category: "Follow-up",
        notes: `Follow-up task for ${contact.fullName}.`,
      };
    }
  );

  const createdTasks = await Task.insertMany(
    taskDocuments
  );

  const tagDocuments = tags.map(
    ([name, color]) => ({
      ownerId,
      name,
      count: contacts.filter((contact) =>
        contact.tags?.includes(name)
      ).length,
      color,
    })
  );

  const createdTags = await Tag.insertMany(
    tagDocuments
  );

  const groupDocuments = groups.map(
    ([name, description]) => {
      let groupContacts = [];

      if (name === "Mentors") {
        groupContacts = contacts.filter(
          (contact) =>
            contact.category === "Mentor"
        );
      } else if (name === "Recruiters") {
        groupContacts = contacts.filter(
          (contact) =>
            contact.category === "Recruiter"
        );
      } else if (name === "Clients") {
        groupContacts = contacts.filter(
          (contact) =>
            contact.category === "Client"
        );
      } else if (name === "Networking") {
        groupContacts = contacts.filter((contact) =>
          contact.tags?.includes("Networking")
        );
      } else if (name === "Partners") {
        groupContacts = contacts.filter((contact) =>
          ["Startup", "Client"].includes(
            contact.category
          )
        );
      } else {
        groupContacts = contacts.filter(
          (contact) =>
            contact.category === "Professional" ||
            contact.category === "Startup"
        );
      }

      return {
        ownerId,
        name,
        slug: name
          .toLowerCase()
          .replace(/\s+/g, "-"),
        description,
        color: "#722F37",
        memberCount: groupContacts.length,
        primaryLead:
          groupContacts[0]?.fullName || "",
        contactIds: groupContacts.map(
          (contact) => contact._id
        ),
        tags: [name],
      };
    }
  );

  const createdGroups =
    await Group.insertMany(groupDocuments);

  for (const pair of duplicatePairs) {
    const primary = contactByEmail.get(
      pair.primary
    );

    const duplicate = contactByEmail.get(
      pair.duplicate
    );

    if (!primary || !duplicate) {
      throw new Error(
        `Duplicate pair contact not found: ${pair.primary} / ${pair.duplicate}`
      );
    }

    await DuplicateRecord.create({
      ownerId,
      primaryContactId: primary._id,
      duplicateContactId: duplicate._id,
      reason: pair.reason,
      matchConfidence: pair.confidence,
      status: "Pending",
      primarySnapshot: {
        id: primary._id.toString(),
        firstName: primary.firstName,
        lastName: primary.lastName,
        fullName: primary.fullName,
        company: primary.company,
        email: primary.email,
        avatar: primary.avatar,
      },
      duplicateSnapshot: {
        id: duplicate._id.toString(),
        firstName: duplicate.firstName,
        lastName: duplicate.lastName,
        fullName: duplicate.fullName,
        company: duplicate.company,
        email: duplicate.email,
        avatar: duplicate.avatar,
      },
    });
  }

  const notificationDocuments = [
    {
      userId: ownerId,
      type: "FollowUp",
      title: "[Demo] Follow-up due",
      message:
        "A follow-up with Araav Sharma is due soon.",
      relatedContactId:
        contactByEmail.get(
          "araav.sharma.pm@gmail.com"
        )?._id,
      relatedTaskId: createdTasks[0]?._id,
      isRead: false,
    },
    {
      userId: ownerId,
      type: "Task",
      title: "[Demo] High-priority task",
      message:
        "A recruitment follow-up requires your attention.",
      relatedContactId:
        contactByEmail.get(
          "sneha.kapoor.hr@gmail.com"
        )?._id,
      relatedTaskId: createdTasks[4]?._id,
      isRead: false,
    },
    {
      userId: ownerId,
      type: "Reminder",
      title: "[Demo] Upcoming follow-up",
      message:
        "An upcoming relationship follow-up is scheduled.",
      relatedContactId:
        contactByEmail.get(
          "ananya.roy.design@gmail.com"
        )?._id,
      relatedTaskId: createdTasks[3]?._id,
      isRead: false,
    },
    {
      userId: ownerId,
      type: "Interaction",
      title: "[Demo] Recent interaction",
      message:
        "A recent interaction was recorded with a professional contact.",
      relatedContactId:
        contactByEmail.get(
          "vikram.patel.arch@gmail.com"
        )?._id,
      isRead: true,
    },
    {
      userId: ownerId,
      type: "System",
      title: "[Demo] Duplicate detection",
      message:
        "Potential duplicate contacts were detected.",
      relatedContactId:
        contactByEmail.get(
          "meera.chatterjee.hr@gmail.com"
        )?._id,
      isRead: false,
    },
  ];

  const createdNotifications =
    await Notification.insertMany(
      notificationDocuments
    );

  const duplicateCount =
    await DuplicateRecord.countDocuments({
      ownerId,
      primaryContactId: {
        $in: contacts.map(
          (contact) => contact._id
        ),
      },
    });

  console.log("");
  console.log("========================================");
  console.log(
    "SethuSphere demo data seeded successfully"
  );
  console.log("========================================");
  console.log(`Contacts:       ${contacts.length}`);
  console.log(
    `Interactions:   ${createdInteractions.length}`
  );
  console.log(`Tasks:          ${createdTasks.length}`);
  console.log(`Groups:         ${createdGroups.length}`);
  console.log(`Tags:           ${createdTags.length}`);
  console.log(`Duplicates:     ${duplicateCount}`);
  console.log(
    `Notifications:  ${createdNotifications.length}`
  );
  console.log("========================================");
  console.log("20 contacts created with profile images.");
  console.log("Duplicate pairs:");
  console.log(
    "1. Meera Chatterjee <-> Meera Chatterji"
  );
  console.log(
    "2. Sayan Banerjee <-> Sayan Banerjee"
  );
  console.log(
    "3. Nisha Verma <-> Nisha Varma"
  );
  console.log("Partners group created.");
  console.log(
    "Previous seeded demo data was replaced."
  );
  console.log("========================================");
}

seed()
  .catch((error) => {
    console.error("");
    console.error("Demo seed failed:");
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });



