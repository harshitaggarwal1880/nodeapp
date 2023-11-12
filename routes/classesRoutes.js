/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const classesController = require("../controllers/classesControllers")
const auth = require("../middlewares/auth");


//const multer = require("../middleware/multer-config");


router.delete("/:id", auth, classesController.deleteClasse)
router.put("/:id", auth, classesController.updateClasse) 
router.get("/:id", auth, classesController.getOneClasse ) 
router.get("/", auth, classesController.getClasses)
router.post("/", auth, classesController.createClasse)


////////////////////////////
//test
//router.get("/", auth, classesController.classesRoutes)


//////////////////////////

module.exports = router; 