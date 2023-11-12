/*******Import des  modules nécessaires */
/*******Import des  modules nécessaires */
const express = require("express")
const router = express.Router()
const utilisateurConnexionController = require("../controllers/connexionUserController")
//const auth = require("../middleware/auth");


//const multer = require("../middleware/multer-config");


router.post("/signup", utilisateurConnexionController.signup)
router.post("/login",  utilisateurConnexionController.login)  

module.exports = router;   