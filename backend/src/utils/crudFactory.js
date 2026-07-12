const asyncHandler = require("express-async-handler");

/**
 * Generic CRUD controller factory to keep resource controllers DRY.
 * `options.populate` is applied to list + getOne queries.
 */
function crudFactory(Model, options = {}) {
  const { populate = [] } = options;

  const list = asyncHandler(async (req, res) => {
    const { search, status, limit = 100, page = 1, sort = "-createdAt" } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search && options.searchFields) {
      query.$or = options.searchFields.map((f) => ({
        [f]: { $regex: search, $options: "i" },
      }));
    }
    let q = Model.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    populate.forEach((p) => (q = q.populate(p)));
    const [items, total] = await Promise.all([q, Model.countDocuments(query)]);
    res.json({ data: items, total, page: Number(page), limit: Number(limit) });
  });

  const getOne = asyncHandler(async (req, res) => {
    let q = Model.findById(req.params.id);
    populate.forEach((p) => (q = q.populate(p)));
    const item = await q;
    if (!item) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ data: item });
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ data: { id: req.params.id }, message: "Deleted" });
  });

  return { list, getOne, create, update, remove };
}

module.exports = crudFactory;