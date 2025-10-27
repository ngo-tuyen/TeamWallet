const express = require("express");
const router = express.Router();
const teamController = require("../controllers/team.controller");
const authMiddleware = require("../middleware/auth");

router.get("/my-teams", authMiddleware, teamController.getMyTeams);
router.post("/teams", authMiddleware, teamController.createTeam);

module.exports = router;
