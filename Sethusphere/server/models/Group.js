import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#722F37' },
    accentBg: { type: String, default: 'bg-wine-50 text-wine-900 border-wine-200' },
    memberCount: { type: Number, default: 0 },
    primaryLead: { type: String, default: '' },
    contactIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

groupSchema.index({ ownerId: 1, name: 1 }, { unique: true });

const Group = mongoose.model('Group', groupSchema, 'groups');

export default Group;
