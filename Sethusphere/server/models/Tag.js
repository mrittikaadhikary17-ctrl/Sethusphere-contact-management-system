import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    count: { type: Number, default: 0 },
    color: { type: String, default: 'wine' },
  },
  { timestamps: true }
);

tagSchema.index({ ownerId: 1, name: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema, 'tags');

export default Tag;
