const bcrypt = require("bcrypt")
const DB = require("../mysql.config")
const jwt = require("jsonwebtoken");



//donne accès à la fonction qui permet de modifier le système des fichiers
const fs = require('fs');

// PUT modification de l'utilisateur
exports.updateUtilisateur = ( req, res, next) => { 
    console.log("*******bienvenue dans l' updateOne********")

    console.log( "la valeur req.auth.userId : " + req.auth.userId)///////

    //récupération des données de la requête
    const { nom, prenom, email, password } = req.body

    const userId = parseInt(req.params.id) //convertion de la chaine en integer car front envoie chaine (jason) et retourne false si pas integer ou si absence

    //console.log( userId)///////
    //console.log( req.auth)///////
    

    /////////////////////////////////////////////
    //récupération du user de la requete.body (corps de la requete)
    const User = req.file ? {
        ...JSON.parse(req.body.user),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    console.log(User)/////// 

    //delete User.userId; //supression du userId du corps de la requete
    //////////////////////////////////////////////
    
    
    //requete de récurération d'user
    //const sqlSelectOne =`SELECT id FROM utilisateurs WHERE id = ${userId};`
    const sqlSelectAll =`SELECT * FROM utilisateurs;`

    
    
    //requete mise à jour du user
    const sqlUpdateOne = `UPDATE utilisateurs SET nom = "${nom}", prenom = "${prenom}" WHERE id = ${userId};`
    
    //vérification si le champ id est présent et cohérent
    if(!userId) { 
        return res.status(404).json({ message: "absence de paramètre"})
    }else{
        console.log("***debut du sql*** ")
        DB.query(sqlSelectAll, (err, response) => {    
            if(err) {
                res.status(404).json({err})
                console.log("***erreur de sql*** " +  err) 
            }
            //vérification si l'utilisateur existe
            const user = response.find( element =>   element.id == userId ) //req.auth.userId
            if(!user){
                res.status(403).json({ message: "Non autiré !"})
            }else{
                DB.query(sqlUpdateOne, (err, response) => {
                    if(err) {
                        res.status(404).json({err})
                        console.log("***erreur de sql*** " +  err) 
                    }else{
                        console.log("***utilisateur modifié avec succès*** " ) 
                        res.status(200).json({ message: "utilisateur modifié avec succès" })
                    }
                })
            }
        })
    }
    
}


// DELETEsupression de l'utilisateur
exports.deleteOneUtilisateur = (req, res, next) => {
    console.log("*******bienvenue dans le deleteOne********")
    const userId = parseInt(req.params.id) //convertion de la chaine en integer car front envoie chaine (jason) et retourne false si pas integer ou si absence
    

    //requete de suppression du user
    const sqlDeleteUser =`DELETE FROM utilisateurs WHERE id = ${userId};`

    //vérification si le champ id est présent et cohérent
    if(!userId) {
        return res.status(404).json({ message: "absence de paramètre"})
    }else{
        DB.query( sqlDeleteUser, (err, response) => { 
            if(err){
                res.status(404).json({err})
                console.log("***erreur de sql*** " +  err) 
            }else{
                console.log("***utilisateur supprimé avec succès*** ")
                res.status(200).json({ message: "utilisateur supprimé avec succès" })
            }
        })
    }
}

//GET récupération d'un utilisateur
exports.utilisateurSingle = ( req, res, next) => {
    console.log("*******bienvenue dans le getOne********")/////

    //let userId = req.params.id
    let userId = parseInt(req.params.id) //convertion de la chaine en integer car front envoie chaine  et retourne false
                                        // si pas integer ou si absence et en base id est en integer pour eviter problèmes chaine et integer
    let sqlSelectOne =`SELECT * FROM utilisateurs WHERE id = ${userId};`

    console.log("******** bienvenu dans la récupération du user *********")
    console.log(userId)
    console.log(req.params.id) 
 
    //vérification si le champ id est présent et cohérent
    if(!userId){
        res.status(404).json({message: "absence de paramètre"})
    }else{

        DB.query(sqlSelectOne, (err, response) => { 
            if(err) {
                res.status(404).json({err})
                console.log("***erreur de sql*** " +  err)
            }else{
                res.status(200).json(response)
                console.log("***utilisateur récupéré avec succès*** " )
            }
        })
    }
}


// GET récupération des utilisateurs
exports.arrayUtilisateur = (req, res, next) => {
    console.log("*******bienvenue dans le getall********")/////

    console.log("req.auth.userId : " + req.auth.userId)

    const sqlSelect = `SELECT * FROM utilisateurs;`
    DB.query( sqlSelect, (err, response) => {
        if(err) {
            console.log("***erreur de sql*** " +  err) 
        }else{
            res.status(200).json(response)
            console.log(response)
        }
    })
}





