import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: '' },
    author: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    avatar: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
    category: { type: String, default: '' },
    relationshipScore: { type: Number, default: 0 },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Needs Attention', 'At Risk', 'Inactive'],
      default: 'Healthy',
    },
    relationshipStatus: {
      type: String,
      enum: ['Healthy', 'Needs Attention', 'At Risk', 'Inactive'],
      default: 'Healthy',
    },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    relationshipSince: { type: String, default: '' },
    lastInteraction: { type: String, default: '' },
    lastInteractionDate: { type: String, default: '' },
    lastInteractionType: { type: String, default: '' },
    nextFollowUp: { type: String, default: '' },
    nextFollowUpDate: { type: String, default: '' },
    totalInteractions: { type: Number, default: 0 },
    cadence: { type: String, default: '' },
    preferredChannel: { type: String, default: '' },
    responsiveness: { type: String, default: '' },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    notes: { type: [noteSchema], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

contactSchema.index({ ownerId: 1 });
contactSchema.index({ ownerId: 1, email: 1 });
contactSchema.index({ ownerId: 1, phone: 1 });
contactSchema.index({ ownerId: 1, company: 1 });
contactSchema.index({ ownerId: 1, healthStatus: 1 });
contactSchema.index({ ownerId: 1, nextFollowUpDate: 1 });

const Contact = mongoose.model('Contact', contactSchema, 'contacts');

export default Contact;
