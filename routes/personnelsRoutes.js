/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const personnelsController = require("../controllers/personnelsControllers")
const auth = require("../middlewares/auth");


//const multer = require("../middleware/multer-config");


router.delete("/:id", auth, personnelsController.deletePersonnel)
router.put("/:id", auth, personnelsController.updatePersonnel) 
router.get("/:id", auth, personnelsController.getOnePersonnel ) 
router.get("/", auth, personnelsController.getPersonnels)
router.post("/", auth, personnelsController.createPersonnel)

module.exports = router;  



