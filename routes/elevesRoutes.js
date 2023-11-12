/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const elevesController = require("../controllers/elevesController")
const auth = require("../middlewares/auth")


router.post("/", auth, elevesController.createEleve)
router.get("/", auth, elevesController.getEleves)
router.get("/:id", auth, elevesController.getOneEleve)
router.put("/:id", auth, elevesController.updateEleve)
router.delete("/:id", auth, elevesController.deleteEleve)





module.exports = router;     