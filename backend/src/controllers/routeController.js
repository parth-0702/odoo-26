const Route = require("../models/Route");
const crudFactory = require("./crudFactory");

module.exports = crudFactory(Route, {
  populate: [
    { path: "assignedDriver", select: "name employeeId" },
    { path: "assignedVehicle", select: "registrationNumber make model" },
  ],
});
