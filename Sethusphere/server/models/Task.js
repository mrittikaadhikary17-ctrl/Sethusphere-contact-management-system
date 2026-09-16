import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      default: null,
    },
    contactName: { type: String, default: '' },
    contactCompany: { type: String, default: '' },
    contactAvatar: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    dueDate: { type: String, default: '' },
    dueDateRaw: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Overdue', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    category: { type: String, default: 'Follow-up' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

taskSchema.index({ ownerId: 1, status: 1 });
taskSchema.index({ ownerId: 1, dueDateRaw: 1 });

taskSchema.index({ ownerId: 1, contactId: 1 });

const Task = mongoose.model('Task', taskSchema, 'tasks');

export default Task;
