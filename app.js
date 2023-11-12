//import des modules nécessaires
const express = require("express");
const cors = require("cors"); 

//pour éxécuter le __le dirname
const path = require('path');


////////////////////
//import des modules de routages
const user_connexion_router = require("./routes/connexionUserRoutes");
const user_router = require("./routes/userRoutes")
const personnel_router = require("./routes/personnelsRoutes")
const classe_router = require("./routes/classesRoutes")
const eleve_router = require("./routes/elevesRoutes") 
const comptaEntree_router = require("./routes/comptaEntreesRoutes")
const comptaCharges_router = require("./routes/comptaChargesRoutes")


////////////////////

//creation de l'api
const app = express();

app.use(cors());   //evite les erreurs cors
app.use(express.json()); //l'api va communiquer en json
app.use(express.urlencoded({ extended: true })); //l'encodage des url car on a plusieurs types d'url


////////////////////

app.use(express.static(path.join(__dirname, '../front/build')));  



////////////////////
//mise en place du routage

app.use("/auth", user_connexion_router) 
app.use("/usersRoutes", user_router)

app.use("/personnels", personnel_router) 

app.use("/classesRoutes", classe_router)  

app.use("/eleves", eleve_router) 

app.use("/comptas", comptaEntree_router) 

app.use("/comptaCharges", comptaCharges_router )

////////////////////


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
});




///////////////////

module.exports = app; 

