export function createResourceController(Model, ownerField = 'ownerId') {
  return {
    list: async (req, res) => {
      const records = await Model.find({ [ownerField]: req.userId }).sort({ createdAt: -1 });
      res.json({ data: records });
    },
    get: async (req, res) => {
      const record = await Model.findOne({ _id: req.params.id, [ownerField]: req.userId });
      if (!record) return res.status(404).json({ message: 'Record not found.' });
      res.json({ data: record });
    },
    create: async (req, res) => {
      const record = await Model.create({ ...req.body, [ownerField]: req.userId });
      res.status(201).json({ data: record });
    },
    update: async (req, res) => {
      const record = await Model.findOneAndUpdate(
        { _id: req.params.id, [ownerField]: req.userId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!record) return res.status(404).json({ message: 'Record not found.' });
      res.json({ data: record });
    },
    remove: async (req, res) => {
      const record = await Model.findOneAndDelete({
        _id: req.params.id,
        [ownerField]: req.userId,
      });
      if (!record) return res.status(404).json({ message: 'Record not found.' });
      res.status(204).send();
    },
  };
}
