/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const utilisateurController = require("../controllers/userController")
const auth = require("../middlewares/auth");
//const middlewareAuth = require("../middleware/auth")

//const multer = require("../middleware/multer-config");


// router.post("/signup", utilisateurController.signup) 
// router.post("/login",  utilisateurController.login)

router.put("/:id", auth, utilisateurController.updateUtilisateur)
router.delete("/:id", auth, utilisateurController.deleteOneUtilisateur)
router.get("/:id", auth, utilisateurController.utilisateurSingle)
router.get("/", auth,utilisateurController.arrayUtilisateur)


 
module.exports = router;  