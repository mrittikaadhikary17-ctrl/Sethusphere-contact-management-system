import React, { useEffect, useState } from "react";
import { X, UserPlus, PhoneCall, CheckSquare, Plus, Trash2 } from "lucide-react";
import { useContacts } from "../../context/ContactContext";
import { PhoneInputField } from "./PhoneInputField";
import { AvatarPlaceholder } from "./AvatarPlaceholder";

export function QuickAddModal() {
  const {
    quickAddType,
    setQuickAddType,
    addContact,
    updateContact,
    addInteraction,
    addTask,
    contacts,
    editingContact,
    setEditingContact,
    editingActivity,
    setEditingActivity,
    updateInteraction,
    updateTask
  } = useContacts();

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    category: "",
    relationshipScore: 80,
    address: "",
    website: "",
    notesText: "",
    avatar: ""
  });

  // Interaction form state
  const [interactionForm, setInteractionForm] = useState({
    contactId: contacts[0]?.id || "",
    type: "Meeting",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    sentiment: "Positive",
    outcome: ""
  });

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    contactId: contacts[0]?.id || "",
    dueDate: "Tomorrow, 11:00 AM",
    priority: "High",
    category: "Follow-up",
    notes: ""
  });

  const [contactError, setContactError] = useState("");

  const handleContactImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setContactError("Please choose a JPG, JPEG, PNG, or WEBP image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setContactForm((current) => ({ ...current, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (quickAddType === "contact") {
      setContactForm({
        firstName: "", lastName: "", email: "", phone: "", company: "", jobTitle: "",
        category: "", relationshipScore: 80, address: "", website: "", notesText: "", avatar: ""
      });
      setContactError("");
      return;
    }
    if (quickAddType !== "contact-edit" || !editingContact) return;
    setContactForm({
      firstName: editingContact.firstName || "",
      lastName: editingContact.lastName || "",
      email: editingContact.email || "",
      phone: editingContact.phone || "",
      company: editingContact.company || "",
      jobTitle: editingContact.jobTitle || "",
      category: editingContact.category || "",
      relationshipScore: editingContact.relationshipScore || 80,
      address: editingContact.address || "",
      website: editingContact.website || "",
      notesText: "",
      avatar: editingContact.avatar || "",
    });
  }, [editingContact, quickAddType]);

  useEffect(() => {
    if (!editingActivity) return;
    if (quickAddType === "interaction-edit") {
      setInteractionForm({
        contactId: editingActivity.contactId || "",
        type: editingActivity.type || "Note",
        title: editingActivity.title || "",
        description: editingActivity.description || "",
        date: editingActivity.date || "",
        sentiment: editingActivity.sentiment || "Neutral",
        outcome: editingActivity.outcome || "",
      });
    }
    if (quickAddType === "task-edit") {
      setTaskForm({
        title: editingActivity.title || "",
        contactId: editingActivity.contactId || "",
        dueDate: editingActivity.dueDate || "",
        priority: editingActivity.priority || "Medium",
        category: editingActivity.category || "Follow-up",
        notes: editingActivity.notes || "",
      });
    }
  }, [editingActivity, quickAddType]);

  if (!quickAddType) return null;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.firstName.trim()) return;
    setContactError("");

    try {
      const contactData = {
        firstName: contactForm.firstName.trim(),
        lastName: contactForm.lastName.trim(),
        fullName: `${contactForm.firstName.trim()} ${contactForm.lastName.trim()}`,
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        company: contactForm.company.trim() || "Independent",
        jobTitle: contactForm.jobTitle.trim() || "Professional",
        category: contactForm.category,
        relationshipScore: Number(contactForm.relationshipScore) || 75,
        address: contactForm.address.trim(),
        website: contactForm.website.trim(),
        avatar: contactForm.avatar,
        notesText: contactForm.notesText
      };
      if (quickAddType === "contact-edit") {
        const { notesText, ...updates } = contactData;
        await updateContact(editingContact.id, updates);
        setEditingContact(null);
      } else {
        await addContact(contactData);
      }
      setQuickAddType(null);
    } catch (error) {
      setContactError(error.message);
    }
  };

  const handleInteractionSubmit = (e) => {
    e.preventDefault();
    if (!interactionForm.title.trim()) return;

    const selectedContact = contacts.find((c) => c.id === interactionForm.contactId);

    const data = {
      contactId: interactionForm.contactId,
      contactName: selectedContact?.fullName || "Selected Contact",
      contactCompany: selectedContact?.company || "Company",
      contactAvatar: selectedContact?.avatar || "",
      type: interactionForm.type,
      title: interactionForm.title.trim(),
      description: interactionForm.description.trim(),
      sentiment: interactionForm.sentiment,
      outcome: interactionForm.outcome.trim()
    };
    const action = quickAddType === "interaction-edit"
      ? updateInteraction(editingActivity.id, data)
      : addInteraction(data);

    Promise.resolve(action).then(() => {
      setEditingActivity(null);
      setQuickAddType(null);
    }).catch((error) => setContactError(error.message));
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const selectedContact = contacts.find((c) => c.id === taskForm.contactId);

    const data = {
      title: taskForm.title.trim(),
      contactId: taskForm.contactId,
      contactName: selectedContact?.fullName || "Contact",
      contactCompany: selectedContact?.company || "",
      contactAvatar: selectedContact?.avatar || "",
      dueDate: taskForm.dueDate,
      priority: taskForm.priority,
      category: taskForm.category,
      notes: taskForm.notes.trim()
    };
    const action = quickAddType === "task-edit"
      ? updateTask(editingActivity.id, data)
      : addTask(data);
    Promise.resolve(action).then(() => {
      setEditingActivity(null);
      setQuickAddType(null);
    }).catch((error) => setContactError(error.message));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121316]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#DCD7CE] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8DF] bg-[#FBF9F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#722F37]/10 text-[#722F37] flex items-center justify-center">
              {quickAddType === "contact" && <UserPlus className="w-5 h-5" />}
              {(quickAddType === "interaction" || quickAddType === "interaction-edit") && <PhoneCall className="w-5 h-5" />}
              {(quickAddType === "task" || quickAddType === "task-edit") && <CheckSquare className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#121316]">
                {(quickAddType === "contact" || quickAddType === "contact-edit") && (quickAddType === "contact-edit" ? "Edit Contact" : "Add New Contact")}
                {(quickAddType === "interaction" || quickAddType === "interaction-edit") && (quickAddType === "interaction-edit" ? "Edit Interaction" : "Log Interaction")}
                {(quickAddType === "task" || quickAddType === "task-edit") && (quickAddType === "task-edit" ? "Edit Follow-up Task" : "Create Follow-up Task")}
              </h2>
              <p className="text-xs text-[#757985]">
                {(quickAddType === "contact" || quickAddType === "contact-edit") && "Manage a relationship profile with custom attributes & cadence."}
                {(quickAddType === "interaction" || quickAddType === "interaction-edit") && "Record a call, meeting, note, or touchpoint to keep health updated."}
                {(quickAddType === "task" || quickAddType === "task-edit") && "Never let an important relationship follow-up slip through."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuickAddType(null)}
            className="text-[#9C9FA8] hover:text-[#121316] p-1.5 rounded-lg hover:bg-[#EDE8DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {/* CONTACT FORM */}
          {(quickAddType === "contact" || quickAddType === "contact-edit") && (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-[#E5E0D8] bg-[#FBF9F5] p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DCD7CE] bg-white">
                  {contactForm.avatar ? <img src={contactForm.avatar} alt="Contact preview" className="h-full w-full object-cover" /> : <AvatarPlaceholder className="h-full w-full" />}
                </div>
                <div className="min-w-0">
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-[#DCD7CE] bg-white px-3 py-2 text-xs font-semibold text-[#121316] hover:bg-[#F5F2EB]">
                    {contactForm.avatar ? "Replace image" : "Add profile image"}
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleContactImage} className="sr-only" />
                  </label>
                  {contactForm.avatar && <button type="button" onClick={() => setContactForm((current) => ({ ...current, avatar: "" }))} className="ml-2 text-xs font-semibold text-[#B91C1C] hover:underline">Remove</button>}
                  <p className="mt-1 text-[11px] text-[#9C9FA8]">Optional · JPG, JPEG, PNG or WEBP</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                  />
                </div>
                {contactError && <p className="text-xs font-semibold text-[#B91C1C]">{contactError}</p>}
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                    placeholder="Enter your last name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                  />
                </div>
                <div>
                  <PhoneInputField
                    label="Phone Number"
                    value={contactForm.phone}
                    onChange={(phone) => setContactForm((current) => ({ ...current, phone }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={contactForm.jobTitle}
                    onChange={(e) => setContactForm({ ...contactForm, jobTitle: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37] focus:ring-1 focus:ring-[#722F37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Category Segment
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  >
                    <option value="">Select category</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Key Account">Key Account</option>
                    <option value="SMB">SMB</option>
                    <option value="Startup">Startup</option>
                    <option value="Partner">Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Initial Relationship Score (0-100)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={contactForm.relationshipScore}
                      onChange={(e) => setContactForm({ ...contactForm, relationshipScore: e.target.value })}
                      className="flex-1 accent-[#722F37]"
                    />
                    <span className="text-sm font-bold text-[#121316] w-8 tabular-nums">
                      {contactForm.relationshipScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Office / City Address
                  </label>
                  <input
                    type="text"
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    placeholder="Enter address"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">Website</label>
                  <input
                    type="url"
                    value={contactForm.website}
                    onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                    placeholder="e.g. https://example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Initial Relationship Notes
                </label>
                <textarea
                  rows={2}
                  value={contactForm.notesText}
                  onChange={(e) => setContactForm({ ...contactForm, notesText: e.target.value })}
                  placeholder="Key context, preferred conversation style, upcoming milestones..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setQuickAddType(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#494C55] hover:text-[#121316] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {quickAddType === "contact-edit" ? "Save Changes" : "Save Contact"}
                </button>
              </div>
            </form>
          )}

          {/* INTERACTION FORM */}
          {(quickAddType === "interaction" || quickAddType === "interaction-edit") && (
            <form onSubmit={handleInteractionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Related Contact *
                </label>
                <select
                  value={interactionForm.contactId}
                  onChange={(e) => setInteractionForm({ ...interactionForm, contactId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.company} ({c.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Interaction Type
                  </label>
                  <select
                    value={interactionForm.type}
                    onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  >
                    <option value="Meeting">Meeting (In-person / Zoom)</option>
                    <option value="Call">Phone Call</option>
                    <option value="Email">Email Communication</option>
                    <option value="Message">Direct Message (Slack / WhatsApp)</option>
                    <option value="Note">Internal Observation Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={interactionForm.date}
                    onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Subject / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={interactionForm.title}
                  onChange={(e) => setInteractionForm({ ...interactionForm, title: e.target.value })}
                  placeholder="Enter activity title"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Discussion Summary & Key Points
                </label>
                <textarea
                  rows={3}
                  value={interactionForm.description}
                  onChange={(e) => setInteractionForm({ ...interactionForm, description: e.target.value })}
                  placeholder="Key talking points, client feedback, sentiment, objections raised..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Outcome & Next Step Trigger
                </label>
                <input
                  type="text"
                  value={interactionForm.outcome}
                  onChange={(e) => setInteractionForm({ ...interactionForm, outcome: e.target.value })}
                  placeholder="Enter activity details"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setQuickAddType(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#494C55] hover:text-[#121316] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Log Interaction
                </button>
              </div>
            </form>
          )}

          {/* TASK FORM */}
          {(quickAddType === "task" || quickAddType === "task-edit") && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Associated Contact
                </label>
                <select
                  value={taskForm.contactId}
                  onChange={(e) => setTaskForm({ ...taskForm, contactId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Due Date & Time
                  </label>
                  <input
                    type="text"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    placeholder="Enter due date and time"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#494C55] mb-1.5">
                  Follow-up Notes / Context
                </label>
                <textarea
                  rows={2}
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                  placeholder="Additional context or links needed to complete this task..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DCD7CE] bg-[#FBF9F5] focus:outline-none focus:border-[#722F37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setQuickAddType(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#494C55] hover:text-[#121316] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#722F37] hover:bg-[#5C1521] rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  Create Task
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
