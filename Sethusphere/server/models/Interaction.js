import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    contactName: { type: String, required: true, trim: true },
    contactCompany: { type: String, default: '' },
    contactAvatar: { type: String, default: '' },
    type: {
      type: String,
      enum: ['Call', 'Email', 'Meeting', 'Message', 'Note'],
      default: 'Note',
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    timestamp: { type: Date, default: null },
    sentiment: { type: String, default: 'Neutral' },
    duration: { type: String, default: '' },
    outcome: { type: String, default: '' },
  },
  { timestamps: true }
);

interactionSchema.index({ ownerId: 1, contactId: 1, timestamp: -1 });

const Interaction = mongoose.model('Interaction', interactionSchema, 'interactions');

export default Interaction;
