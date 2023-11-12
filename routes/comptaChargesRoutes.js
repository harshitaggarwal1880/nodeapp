/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const comptaChargesControllers = require("../controllers/comptaChargesControllers")
const auth = require("../middlewares/auth");

router.post("/", auth, comptaChargesControllers.createCharges);
router.get("/", auth, comptaChargesControllers.getAllCharges);
router.get("/:id", auth, comptaChargesControllers.getOneCharge);

module.exports = router;  