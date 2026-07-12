const asyncHandler = require("express-async-handler");

/**
 * Builds standard list/get/create/update/remove handlers for a Mongoose model.
 * `populate` (optional) is passed straight to .populate() on list/get.
 */
function crudFactory(Model, { populate } = {}) {
  const list = asyncHandler(async (req, res) => {
    let query = Model.find().sort({ createdAt: -1 });
    if (populate) query = query.populate(populate);
    const docs = await query;
    res.json(docs);
  });

  const getOne = asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json(doc);
  });

  const create = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json(doc);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error(`${Model.modelName} not found`);
    }
    res.json({ message: `${Model.modelName} deleted`, _id: doc._id });
  });

  return { list, getOne, create, update, remove };
}

module.exports = crudFactory;
