const Vehicle = require("../models/Vehicle");
const crudFactory = require("./crudFactory");

module.exports = crudFactory(Vehicle, { populate: { path: "assignedDriver", select: "name employeeId" } });
