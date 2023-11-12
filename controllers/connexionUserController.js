//importation des packages nécessaires
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const DB = require("../mysql.config")

//donne accès à la fonction qui permet de modifier le système des fichiers
const fs = require('fs');
//const { response } = require("../app");

//POST creation de l'utilisateur
exports.signup = (req, res, next) => {
    console.log("*******bienvenue dans le signup********")

    //recupération des données du corps de la requête
    const { nom, prenom, email, password} = req.body
    

    //vérification des donnée de la requete
    if( !nom || !prenom || !email || !password) {
        res.status(400).json({ message: "veillez remplir toutes les données du formulaire "})
    }
    
    //requete de récupération des utilisateurs existe dans la base de données
    const sqlSelectUser = "SELECT nom, prenom, email FROM utilisateurs"

    DB.query( sqlSelectUser, (err, response) =>{
        if(err){
            res.status(404).json({err})
            console.log("***erreur de sql*** " +  err)  
        }else{
            
            //requete de vérification si l'utilisateur existe dans la base de données
            const user = response.find( element => element.email == email)
            if(user) {
                console.log(`*************l'utilisateur ${nom} existe déjà****************`)
                res.status(500).json({ message: `l'utilisateur ${nom} existe déjà`})
            }

           
            //hashage du mot de passe
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then((hash) => { 
                    //password = hash //le password non hashé de la requete est remplacé par celui hashé

                    //console.log(req.body)
                    //requete de creation de l'utilisateur
                    let sqlCreateUser = `INSERT INTO utilisateurs ( nom, prenom, email, password)
                                            VALUES ( "${nom}", "${prenom}", "${email}",  "${hash}");`

                    DB.query(sqlCreateUser, (err, response1) => {
                        if(err){
                            res.status(404).json({err})
                            console.log("***erreur de sql*** " +  err)  
                        }else{
                            res.status(200).json(response1)
                            console.log("***Utilisateur crée avec succès*** ")
                        }
                        
                    })
                })
                .catch( err => { res.status(500).json({ err})})
        }
    })

};


// POST LOGIN connexion de l'utilisateur
exports.login =  (req, res, next) => {
    console.log("*******bienvenue dans le login********") 

    //récupération des données de la requete
    const { email, password} = req.body

    if(!email || !password){
        res.status(400).json({ message: "veillez remplir toutes les données du formulaire "})
    }

    //requete de récupération des utilisateurs existe dans la base de données
    const sqlSelectUser = "SELECT * FROM utilisateurs"

    /////////////////////////////////////

    //requete de récupération des utilisateurs existe dans la base de données
    const sqlSelectAllEleves = "SELECT id FROM eleves"

    /////////////////////////////////////

    DB.query(sqlSelectUser, (err, response) => {
        if(err){
            res.status(404).json({err})
            console.log("***erreur de sql*** " +  err)  
        }else{
             //verification du mail
            const user = response.find( element => element.email == email)

            
            //verification du mail
            if(!user){
                console.log("***mot de passe ou identifiant est incorrect *** " ) 
                res.status(401).json({message: "mot de passe ou identifiant est incorrect"})
            }else{
                //vérification du mot de passe
                bcrypt.compare(password, user.password)
                    .then( valid => {
                        if(!valid) {
                            console.log("***mot de passe ou identifiant est incorrect *** " ) 
                            res.status(401).json({message: "mot de passe ou identifiant est incorrect"})
                        }else{

                            console.log(req.body)
                            
                            res.status(200).json({
                                token: jwt.sign(  //generation du token
                                        {
                                            //données récupérées dans base de odnnées qui sont la charge utile
                                            userId: user.id,
                                            nom: user.nom,   
                                            prenom: user.prenom, 
                                            email: user.email     
                                        },
                                        process.env.TOKEN_KEY, //clé secrete
                                        { expiresIn: process.env.TOKEN_EXPIRE} //date d'expiration
                                    )
                            })
                            console.log("********utilisateur connecté avec succès********")

                        }

                    })
                    .catch( err => { res.status(500).json({ err})})
            }
        }
    })

};