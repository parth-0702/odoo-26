const Shipment = require("../models/Shipment");
const crudFactory = require("./crudFactory");

module.exports = crudFactory(Shipment, { populate: { path: "route", select: "code origin destination status" } });
