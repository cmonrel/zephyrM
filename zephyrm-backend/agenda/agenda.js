/**
 * Agenda
 *
 * This module sets up an Agenda instance for job scheduling.
 *
 * @module agenda
 */

const Agenda = require("agenda");
require("dotenv").config();

const agenda = new Agenda({
  db: { address: process.env.DB_CN, collection: "agendaJobs" },
});

module.exports = { agenda };
