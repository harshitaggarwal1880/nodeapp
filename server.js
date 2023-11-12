const http = require("http");


//importation du package pour les variables d'environnement
const dotenv = require("dotenv").config();
//importation de la base de données
const DB = require("./mysql.config")  

//pour éxécuter le __le dirname
const path = require('path');
 

//creation de l'application
const app = require("./app");
app.set("port", process.env.PORT || process.env.PORT2);  

//creation du server
const server = http.createServer(app)     



//lancement du server
server.listen(process.env.PORT, () => {
    console.log(`---------------ce server tourne au port ${process.env.PORT}-------------`)  
})