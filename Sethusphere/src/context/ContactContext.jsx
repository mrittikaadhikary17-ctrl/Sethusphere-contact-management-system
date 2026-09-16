import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest, getAuthToken } from "../lib/api";

const ContactContext = createContext(null);

export function ContactProvider({ children }) {
  const normalizeContact = (contact) => ({
    ...contact,
    id: contact.id || contact._id,
    fullName:
      contact.fullName ||
      `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
    avatar: contact.avatar || contact.profilePhoto || "",
    healthStatus:
      contact.healthStatus || contact.relationshipStatus || "Healthy",
    relationshipStatus:
      contact.relationshipStatus || contact.healthStatus || "Healthy",
    tags: Array.isArray(contact.tags) ? contact.tags : [],
    notes: Array.isArray(contact.notes) ? contact.notes : [],
  });

  const normalizeActivity = (activity) => ({
    ...activity,
    id: activity.id || activity._id,
  });

  const duplicatePairNames = [
  ["Meera Chatterjee", "Meera Chatterji"],
  ["Sayan Banerjee", "Sayan Banerjee"],
  ["Nisha Verma", "Nisha Varma"],
];

  const profileImages = [
    "https://i.pravatar.cc/150?img=47",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=32",
    "https://i.pravatar.cc/150?img=44",
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=11",
    "https://i.pravatar.cc/150?img=49",
    "https://i.pravatar.cc/150?img=13",
    "https://i.pravatar.cc/150?img=33",
    "https://i.pravatar.cc/150?img=45",
    "https://i.pravatar.cc/150?img=6",
    "https://i.pravatar.cc/150?img=14",
    "https://i.pravatar.cc/150?img=48",
    "https://i.pravatar.cc/150?img=15",
    "https://i.pravatar.cc/150?img=35",
    "https://i.pravatar.cc/150?img=46",
    "https://i.pravatar.cc/150?img=7",
    "https://i.pravatar.cc/150?img=16",
    "https://i.pravatar.cc/150?img=36",
    "https://i.pravatar.cc/150?img=17",
  ];

  const getDemoContacts = (data) => {
    const normalized = data.map(normalizeContact);

    const araavContacts = normalized
      .filter(
        (contact) =>
          contact.fullName?.trim().toLowerCase() === "araav sharma"
      )
      .slice(0, 2);

    const duplicateContacts = duplicatePairNames
      .flat()
      .map((name) =>
        normalized.find(
          (contact) =>
            contact.fullName?.trim().toLowerCase() === name.toLowerCase()
        )
      )
      .filter(Boolean);

    const selectedIds = new Set(
      [...araavContacts, ...duplicateContacts].map((contact) =>
        String(contact.id)
      )
    );

    const remainingContacts = normalized
      .filter((contact) => !selectedIds.has(String(contact.id)))
      .sort((a, b) => {
        const firstDate = new Date(a.createdAt || 0).getTime();
        const secondDate = new Date(b.createdAt || 0).getTime();
        return secondDate - firstDate;
      });

    const selectedContacts = [
      ...araavContacts,
      ...duplicateContacts,
      ...remainingContacts,
    ].slice(0, 20);

    return selectedContacts.map((contact, index) => {
      const image = profileImages[index % profileImages.length];

      return {
        ...contact,
        avatar: contact.avatar || contact.profilePhoto || image,
        profilePhoto: contact.profilePhoto || contact.avatar || image,
      };
    });
  };

  const similarity = (left, right) => {
    const a = left.toLowerCase();
    const b = right.toLowerCase();

    const distance = Array.from({ length: b.length + 1 }, (_, row) =>
      Array.from({ length: a.length + 1 }, (_, column) =>
        row === 0 ? column : column === 0 ? row : 0
      )
    );

    for (let row = 1; row <= b.length; row += 1) {
      for (let column = 1; column <= a.length; column += 1) {
        distance[row][column] =
          b[row - 1] === a[column - 1]
            ? distance[row - 1][column - 1]
            : Math.min(
                distance[row - 1][column - 1] + 1,
                distance[row][column - 1] + 1,
                distance[row - 1][column] + 1
              );
      }
    }

    return (
      1 -
      distance[b.length][a.length] /
        Math.max(a.length, b.length, 1)
    );
  };

  const buildDuplicatePairs = (contactList) => {
    const generated = [];

    duplicatePairNames.forEach(([firstName, secondName]) => {
      const left = contactList.find(
        (contact) =>
          contact.fullName?.trim().toLowerCase() === firstName.toLowerCase()
      );

      const right = contactList.find(
        (contact) =>
          contact.fullName?.trim().toLowerCase() === secondName.toLowerCase()
      );

      if (!left || !right) return;

      generated.push({
        id: `detected-${left.id}-${right.id}`,
        primaryContact: left,
        duplicateContact: right,
        reason: "Similar contact names",
        matchConfidence: Math.round(
          similarity(left.fullName || "", right.fullName || "") * 100
        ),
      });
    });

    return generated.slice(0, 3);
  };

  const [contacts, setContacts] = useState(() => {
    if (getAuthToken()) return [];

    const saved = localStorage.getItem("sethusphere_contacts");
    return saved ? JSON.parse(saved) : [];
  });

  const [interactions, setInteractions] = useState(() => {
    if (getAuthToken()) return [];

    const saved = localStorage.getItem("sethusphere_interactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    if (getAuthToken()) return [];

    const saved = localStorage.getItem("sethusphere_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [groups, setGroups] = useState(() => {
    if (getAuthToken()) return [];

    const saved = localStorage.getItem("sethusphere_groups");
    return saved ? JSON.parse(saved) : [];
  });

  const [tags, setTags] = useState(() => {
    if (getAuthToken()) return [];

    const saved = localStorage.getItem("sethusphere_tags");
    return saved ? JSON.parse(saved) : [];
  });

  const [duplicates, setDuplicates] = useState([]);
  const [dismissedDuplicates, setDismissedDuplicates] = useState([]);

  const [activeContactId, setActiveContactId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("sethusphere_profile");

    return saved
      ? JSON.parse(saved)
      : {
          firstName: "",
          lastName: "",
          name: "",
          avatar: "",
          email: "",
          phone: "",
          title: "",
          company: "",
          industry: "",
          location: "",
          bio: "",
          timezone: "Asia/Kolkata (IST +5:30)",
        };
  });

  const showToast = (message, type = "success") => {
    const id = Date.now();

    setToast({
      id,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  useEffect(() => {
    const generated = buildDuplicatePairs(contacts);
    setDuplicates(generated);
    setDismissedDuplicates([]);
  }, [contacts]);

  useEffect(() => {
    if (!getAuthToken()) return;

    apiRequest("/auth/profile")
      .then(({ user }) => {
        setProfile((current) => ({
          ...current,
          ...user,
          title: user.designation || current.title,
          avatar:
            user.avatar ||
            user.profilePhoto ||
            current.avatar,
        }));
      })
      .catch(() => {});

    apiRequest("/contacts")
      .then(({ data }) => {
        setContacts(getDemoContacts(data));
      })
      .catch((error) => showToast(error.message, "error"));

    apiRequest("/interactions")
      .then(({ data }) =>
        setInteractions(data.map(normalizeActivity))
      )
      .catch((error) => showToast(error.message, "error"));

    apiRequest("/tasks")
      .then(({ data }) =>
        setTasks(data.map(normalizeActivity))
      )
      .catch((error) => showToast(error.message, "error"));

    apiRequest("/groups")
      .then(({ data }) => {
        const incomingGroups = Array.isArray(data) ? data : [];

        const existingPartnersIndex = incomingGroups.findIndex(
          (group) =>
            group.name?.trim().toLowerCase() === "partners"
        );

        let updatedGroups = [...incomingGroups];

        if (existingPartnersIndex === -1) {
          updatedGroups.push({
            id: "partners-demo",
            name: "Partners",
            description: "Strategic partners and collaborators",
            color: "#7C3AED",
            contactCount: 0,
            contacts: [],
          });
        }

        const partnersIndex = updatedGroups.findIndex(
          (group) =>
            group.name?.trim().toLowerCase() === "partners"
        );

        if (partnersIndex !== -1) {
          const partnersGroup = updatedGroups[partnersIndex];
          updatedGroups = [
            ...updatedGroups.slice(0, partnersIndex),
            ...updatedGroups.slice(partnersIndex + 1),
            partnersGroup,
          ];
        }

        setGroups(updatedGroups);
      })
      .catch((error) => showToast(error.message, "error"));

    apiRequest("/tags")
      .then(({ data }) => setTags(data))
      .catch((error) => showToast(error.message, "error"));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sethusphere_contacts",
      JSON.stringify(contacts)
    );
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(
      "sethusphere_interactions",
      JSON.stringify(interactions)
    );
  }, [interactions]);

  useEffect(() => {
    localStorage.setItem(
      "sethusphere_tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "sethusphere_groups",
      JSON.stringify(groups)
    );
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(
      "sethusphere_profile",
      JSON.stringify(profile)
    );
  }, [profile]);

  const getHealthStatusFromScore = (score) => {
    if (score >= 85) return "Healthy";
    if (score >= 60) return "Needs Attention";
    if (score >= 30) return "At Risk";
    return "Inactive";
  };

  const addContact = async (contactData) => {
    const score = Number(contactData.relationshipScore) || 75;

    const payload = {
      ...contactData,
      relationshipScore: score,
      relationshipStatus: getHealthStatusFromScore(score),
      isFavorite: contactData.isFavorite || false,
      isArchived: false,
      tags: contactData.tags || [],
      notes: contactData.notesText
        ? [
            {
              id: `note-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              author: profile.name || "Workspace user",
              content: contactData.notesText,
            },
          ]
        : [],
    };

    delete payload.notesText;

    const { data } = await apiRequest("/contacts", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const newContact = normalizeContact(data);

    setContacts((prev) => [
      newContact,
      ...prev,
    ]);

    showToast(
      `Added ${newContact.fullName || newContact.firstName} to Sethusphere`
    );

    return newContact;
  };

  const updateContact = async (id, updatedFields) => {
    const score =
      updatedFields.relationshipScore !== undefined
        ? Number(updatedFields.relationshipScore)
        : undefined;

    const { data } = await apiRequest(`/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...updatedFields,
        ...(score === undefined
          ? {}
          : {
              relationshipScore: score,
              relationshipStatus:
                getHealthStatusFromScore(score),
            }),
      }),
    });

    const updatedContact = normalizeContact(data);

    setContacts((prev) =>
      prev.map((contact) =>
        String(contact.id) ===
        String(updatedContact.id || id)
          ? updatedContact
          : contact
      )
    );

    showToast("Contact details updated successfully");

    return updatedContact;
  };

  const getContactById = async (id) => {
    const { data } = await apiRequest(`/contacts/${id}`);
    const contact = normalizeContact(data);

    setContacts((prev) =>
      prev.map((item) =>
        item.id === id ? contact : item
      )
    );

    return contact;
  };

  const deleteContact = async (id) => {
    const target = contacts.find((c) => c.id === id);

    await apiRequest(`/contacts/${id}`, {
      method: "DELETE",
    });

    setContacts((prev) =>
      prev.filter((c) => c.id !== id)
    );

    showToast(
      `Removed ${target?.fullName || "contact"}`
    );
  };

  const toggleFavorite = (id) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newState = !c.isFavorite;

          showToast(
            newState
              ? `Starred ${c.fullName}`
              : `Removed star from ${c.fullName}`,
            "info"
          );

          return {
            ...c,
            isFavorite: newState,
          };
        }

        return c;
      })
    );
  };

  const archiveContact = async (id) => {
    const contact = contacts.find(
      (item) => item.id === id
    );

    if (!contact) return;

    const isArchived = !contact.isArchived;

    const { data } = await apiRequest(`/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        isArchived,
      }),
    });

    const updatedContact = normalizeContact(data);

    setContacts((prev) =>
      prev.map((item) =>
        item.id === id ? updatedContact : item
      )
    );

    showToast(
      isArchived
        ? `Archived ${contact.fullName}`
        : `Restored ${contact.fullName}`,
      "info"
    );
  };

  const addContactNote = async (
    contactId,
    noteText
  ) => {
    if (!noteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      author: "Mrittika Adhikary",
      content: noteText.trim(),
    };

    const contact = contacts.find(
      (item) => item.id === contactId
    );

    if (!contact) return;

    const { data } = await apiRequest(
      `/contacts/${contactId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          notes: [
            newNote,
            ...(contact.notes || []),
          ],
        }),
      }
    );

    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? normalizeContact(data)
          : c
      )
    );

    showToast("Note added to contact timeline");
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (!task) return;

    const status =
      task.status === "Completed"
        ? "Pending"
        : "Completed";

    const { data } = await apiRequest(
      `/tasks/${taskId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    );

    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? normalizeActivity(data)
          : item
      )
    );

    showToast(
      status === "Completed"
        ? `Completed task: "${task.title}"`
        : `Reopened task: "${task.title}"`,
      "success"
    );
  };

  const addTask = async (taskData) => {
    const { data } = await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify({
        ...taskData,
        status: "Pending",
      }),
    });

    setTasks((prev) => [
      normalizeActivity(data),
      ...prev,
    ]);

    showToast(
      `Created follow-up task for ${
        data.contactName || "contact"
      }`
    );

    return data;
  };

  const deleteTask = async (taskId) => {
    await apiRequest(`/tasks/${taskId}`, {
      method: "DELETE",
    });

    setTasks((prev) =>
      prev.filter((t) => t.id !== taskId)
    );

    showToast(
      "Task removed from active workspace",
      "info"
    );
  };

  const updateTask = async (id, updates) => {
    const { data } = await apiRequest(
      `/tasks/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );

    setTasks((prev) =>
      prev.map((item) =>
        item.id === id
          ? normalizeActivity(data)
          : item
      )
    );

    showToast("Task updated successfully");

    return data;
  };

  const addInteraction = async (
    interactionData
  ) => {
    const { data } = await apiRequest(
      "/interactions",
      {
        method: "POST",
        body: JSON.stringify({
          ...interactionData,
          timestamp: new Date().toISOString(),
          date: new Date().toISOString().split("T")[0],
        }),
      }
    );

    setInteractions((prev) => [
      normalizeActivity(data),
      ...prev,
    ]);

    if (interactionData.contactId) {
      setContacts((prev) =>
        prev.map((c) => {
          if (
            c.id === interactionData.contactId
          ) {
            const newScore = Math.min(
              100,
              (c.relationshipScore || 0) + 4
            );

            return {
              ...c,
              relationshipScore: newScore,
              healthStatus:
                getHealthStatusFromScore(
                  newScore
                ),
              lastInteraction: "Today",
              lastInteractionDate:
                new Date()
                  .toISOString()
                  .split("T")[0],
              lastInteractionType:
                interactionData.type,
              totalInteractions:
                (c.totalInteractions || 0) + 1,
            };
          }

          return c;
        })
      );
    }

    showToast(
      `Logged ${data.type} with ${data.contactName}`
    );

    return data;
  };

  const updateInteraction = async (
    id,
    updates
  ) => {
    const { data } = await apiRequest(
      `/interactions/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );

    setInteractions((prev) =>
      prev.map((item) =>
        item.id === id
          ? normalizeActivity(data)
          : item
      )
    );

    showToast("Interaction updated successfully");

    return data;
  };

  const deleteInteraction = async (id) => {
    await apiRequest(`/interactions/${id}`, {
      method: "DELETE",
    });

    setInteractions((prev) =>
      prev.filter((item) => item.id !== id)
    );

    showToast("Interaction removed", "info");
  };

  const updateContactNote = async (
    contactId,
    noteId,
    content
  ) => {
    const contact = contacts.find(
      (item) => item.id === contactId
    );

    if (!contact) return;

    const notes = (contact.notes || []).map(
      (note) =>
        note.id === noteId
          ? {
              ...note,
              content,
            }
          : note
    );

    const { data } = await apiRequest(
      `/contacts/${contactId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          notes,
        }),
      }
    );

    setContacts((prev) =>
      prev.map((item) =>
        item.id === contactId
          ? normalizeContact(data)
          : item
      )
    );

    showToast("Note updated successfully");
  };

  const deleteContactNote = async (
    contactId,
    noteId
  ) => {
    const contact = contacts.find(
      (item) => item.id === contactId
    );

    if (!contact) return;

    const notes = (contact.notes || []).filter(
      (note) => note.id !== noteId
    );

    const { data } = await apiRequest(
      `/contacts/${contactId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          notes,
        }),
      }
    );

    setContacts((prev) =>
      prev.map((item) =>
        item.id === contactId
          ? normalizeContact(data)
          : item
      )
    );

    showToast("Note removed", "info");
  };

  const mergeDuplicate = (pairId) => {
    const pair = duplicates.find(
      (duplicate) => duplicate.id === pairId
    );

    if (!pair) return;

    setDismissedDuplicates((prev) => [
      pair,
      ...prev,
    ]);

    setDuplicates((prev) =>
      prev.filter(
        (duplicate) => duplicate.id !== pairId
      )
    );

    showToast(
      "Contacts consolidated for this session",
      "success"
    );
  };

  const ignoreDuplicate = (pairId) => {
    const pair = duplicates.find(
      (duplicate) => duplicate.id === pairId
    );

    if (!pair) return;

    setDismissedDuplicates((prev) => [
      pair,
      ...prev,
    ]);

    setDuplicates((prev) =>
      prev.filter(
        (duplicate) => duplicate.id !== pairId
      )
    );

    showToast(
      "Marked as distinct for this session",
      "info"
    );
  };

  const restoreDuplicates = () => {
    setDuplicates(buildDuplicatePairs(contacts));
    setDismissedDuplicates([]);

    showToast(
      "Restored all candidate duplicate pairs",
      "success"
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(
      "sethusphere_contacts"
    );
    localStorage.removeItem(
      "sethusphere_interactions"
    );
    localStorage.removeItem(
      "sethusphere_tasks"
    );
    localStorage.removeItem(
      "sethusphere_groups"
    );
    localStorage.removeItem(
      "sethusphere_tags"
    );

    setContacts([]);
    setInteractions([]);
    setTasks([]);
    setGroups([]);
    setTags([]);
    setDuplicates([]);
    setDismissedDuplicates([]);
    setActiveContactId(null);

    showToast(
      "Workspace data cleared",
      "info"
    );
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        interactions,
        tasks,
        groups,
        tags,
        duplicates,
        activeContactId,
        setActiveContactId,
        addContact,
        updateContact,
        getContactById,
        deleteContact,
        toggleFavorite,
        archiveContact,
        addContactNote,
        updateContactNote,
        deleteContactNote,
        toggleTaskStatus,
        addTask,
        deleteTask,
        updateTask,
        addInteraction,
        updateInteraction,
        deleteInteraction,
        mergeDuplicate,
        ignoreDuplicate,
        restoreDuplicates,
        dismissedDuplicates,
        resetDemoData,
        toast,
        showToast,
        hideToast,
        isSearchOpen,
        setIsSearchOpen,
        quickAddType,
        setQuickAddType,
        editingContact,
        setEditingContact,
        editingActivity,
        setEditingActivity,
        profile,
        updateProfile: (updates) =>
          setProfile((current) => ({
            ...current,
            ...updates,
          })),
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error(
      "useContacts must be used within a ContactProvider"
    );
  }

  return context;
}
