export const initialDuplicates = [
  {
    id: "dup-pair-1",
    reason: "Same Phone Number & Similar Name",
    matchConfidence: 94,
    primaryContact: {
      id: "cnt-1",
      firstName: "Ananya",
      lastName: "Sharma",
      fullName: "Ananya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
      jobTitle: "VP of Product",
      company: "TechNova Solutions",
      category: "Client",
      relationshipScore: 92,
      healthStatus: "Healthy",
      email: "ananya.sharma@technova.io",
      phone: "+91 98201 45890",
      address: "Level 8, Cyber City Phase II, Gurugram, HR 122002",
      website: "https://technova.io",
      totalInteractions: 38,
      lastInteraction: "2 days ago",
      tags: ["Enterprise", "Key Account", "Annual Contract", "Decision Maker"]
    },
    duplicateContact: {
      id: "cnt-dup-1",
      firstName: "Ananya",
      lastName: "S.",
      fullName: "Ananya S. (TechNova)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
      jobTitle: "Head of Product Innovation",
      company: "TechNova Labs",
      category: "Lead",
      relationshipScore: 40,
      healthStatus: "Needs Attention",
      email: "ananya.personal@gmail.com",
      phone: "+91 98201 45890", // exact match
      address: "Gurugram, Haryana",
      website: "https://technova.io",
      totalInteractions: 4,
      lastInteraction: "3 months ago",
      tags: ["Conference Lead", "Webinar 2024"]
    }
  },
  {
    id: "dup-pair-2",
    reason: "Matching Work Email Domain & Identity",
    matchConfidence: 89,
    primaryContact: {
      id: "cnt-8",
      firstName: "Sneha",
      lastName: "Patel",
      fullName: "Sneha Patel",
      avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=256&h=256",
      jobTitle: "Principal Designer",
      company: "Studio Sutra",
      category: "Vendor",
      relationshipScore: 78,
      healthStatus: "Healthy",
      email: "sneha@studiosutra.design",
      phone: "+91 98790 33451",
      address: "Navrangpura, Ahmedabad, GJ 380009",
      website: "https://studiosutra.design",
      totalInteractions: 41,
      lastInteraction: "6 days ago",
      tags: ["Design Agency", "Brand Guidelines"]
    },
    duplicateContact: {
      id: "cnt-dup-2",
      firstName: "Sneha",
      lastName: "P.",
      fullName: "Sneha P. - Sutra Design",
      avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=256&h=256",
      jobTitle: "Creative Director",
      company: "Studio Sutra Design",
      category: "Vendor",
      relationshipScore: 45,
      healthStatus: "Needs Attention",
      email: "sneha.patel@studiosutra.design", // close variation
      phone: "+91 98790 33450", // 1 digit off
      address: "Ahmedabad, Gujarat",
      website: "https://studiosutra.design",
      totalInteractions: 8,
      lastInteraction: "4 months ago",
      tags: ["Freelance", "Logo Design"]
    }
  }
];
