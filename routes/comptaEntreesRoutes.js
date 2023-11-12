/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const comptaEntreeController = require("../controllers/comptaEntreesControllers")
const auth = require("../middlewares/auth");

router.post("/", auth, comptaEntreeController.createEntree);
router.get("/", auth, comptaEntreeController.getAllEntrees);
router.get("/:id", auth, comptaEntreeController.getOneEntree);

module.exports = router; 