import mongoose from 'mongoose';

const duplicateSnapshotSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    fullName: { type: String, default: '' },
    company: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    relationshipScore: { type: Number, default: 0 },
    healthStatus: { type: String, default: 'Healthy' },
    avatar: { type: String, default: '' },
  },
  { _id: false }
);

const duplicateRecordSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    primaryContactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    duplicateContactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    reason: { type: String, default: '' },
    matchConfidence: { type: Number, default: 0 },
    matchReasons: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Pending',
    },
    resolution: {
      type: String,
      enum: ['Ignored', 'KeptBoth', 'Merged'],
      default: null,
    },
    primarySnapshot: { type: duplicateSnapshotSchema, default: null },
    duplicateSnapshot: { type: duplicateSnapshotSchema, default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

duplicateRecordSchema.index({ ownerId: 1, status: 1 });

const DuplicateRecord = mongoose.model('DuplicateRecord', duplicateRecordSchema, 'duplicates');

export default DuplicateRecord;
