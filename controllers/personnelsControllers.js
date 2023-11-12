//import des modules nécessaires
const DB = require("../mysql.config")
const { response } = require("../app"); 

//POST creation du personnel
exports.createPersonnel = (req, res, next) => {
    console.log("***bienvenue dans createPersonnel*** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    console.log(req.body)

    //récupération des données de la requete
    let { nom, prenom, poste, contact,  section, classe, groupeSalariale, email, salaire } = req.body

    //on l'utilisera pour insérer le userId dans utilisateurs_id
    const utilisateurs_id = req.auth.userId

    ///////////
	//nouveau
	let section_id
    let classes_id
	
    let salaireConverter = parseInt(salaire)
    let contactConverter = parseInt(contact)

    /////////

    //conversion des classes et sections en id 
    let sqlClasses = "SELECT * FROM classes;"
    let sqlSection = "SELECT * FROM section;" 

    classe && (

           // console.log("**** la classe existe : " ),
            //gestion des classes
            //récupération de toutes les classes
            DB.query( sqlClasses,(errClasse, responseClasse) => {

                console.log("**** la récupération des classes est : " )
                console.log(responseClasse )

                if(errClasse){

                    console.log("***erreur de sql sqlClasses*** " +  errClasse) 
                    res.status(404).json({errClasse}) 
                    
                }else{

                let classesCurrent = responseClasse.find( element => element.nom === classe)

                   
                    console.log("**** classesCurrent : " )
                    console.log(classesCurrent )
                  

                    classes_id = classesCurrent.id
                    console.log("****classes_id : " + classes_id)
                    //////////////////

                }

            })

            

    );

    section && (

           // console.log("**** la section existe : " ),
            //gestion des sections
            DB.query( sqlSection,(err, responseSection) => {

                console.log("**** la récupération des sections est : " )
                console.log(responseSection )

                if(err){

                    console.log("***erreur de sql sqlSection*** " +  err) 
                    res.status(404).json({err})
                    
                }else{

                    let sectionCurrent = responseSection.find( element1 => element1.nom === section)

                    console.log("**** sectionCurrent : " )
                    console.log(sectionCurrent )

                    section_id = sectionCurrent.id
                    console.log("****section_id : " + section_id)
                }

            })

    )
    
    //requete récupérant tous le personnel 
    const sqlSelectAllPerso ="SELECT * FROM personnels;"

    let idPersonnel

   

    DB.query(sqlSelectAllPerso, (err, response) => {

        console.log("***** vous êtes dans sqlSelectAllPerso")

        console.log("***** response  de sqlSelectAllPerso")
            console.log(response)

        if(err){

            console.log("***erreur de sql sqlSelectAllPerso*** " +  err) 
            res.status(404).json({err})
             
        }else{

            console.log("*** vous êtes dans vérification existance du personnel sqlSelectAllPerso*** " )

            //requete de vérification si l'utilisateur existe dans la base de données
            const personnel = response.find( element => element.contact === contactConverter )
            
            console.log("***** personnel")
            console.log(personnel)

            if(personnel){
                console.log(`*************le personnel ${nom} existe déjà****************`)
                res.status(500).json({ message: `le personnel ${nom} existe déjà`})
            }else{

                let sqlCreatePerso

                if( !section_id || !classes_id){

                    console.log("***** creation sans section_id ou classes_id")
                      //requete de creation de l'utilisateur 
                    sqlCreatePerso = `INSERT INTO personnels ( nom, prenom, poste, contact, groupeSalariale, email, salaire )
                    VALUES ( "${nom}", "${prenom}", "${poste}", ${contactConverter}, "${groupeSalariale}" , "${email}", ${salaireConverter});`
                
                }else if(!email){
 
                    console.log("***** creation avec section_id ou classes_id et sans email")
                      //requete de creation de l'utilisateur 
                      sqlCreatePerso = `INSERT INTO personnels ( nom, prenom, poste, contact, section_id, classes_id, groupeSalariale, salaire )
                      VALUES ( "${nom}", "${prenom}", "${poste}", ${contactConverter}, ${section_id}, ${classes_id}, "${groupeSalariale}", ${salaireConverter});`
                
                }else if(!section_id || !classes_id && !email){

                    console.log("***** creation sans section_id ou classes_id et sans email")
                      //requete de creation de l'utilisateur 
                    sqlCreatePerso = `INSERT INTO personnels ( nom, prenom, poste, contact, groupeSalariale, salaire )
                    VALUES ( "${nom}", "${prenom}", "${poste}", ${contactConverter}, "${groupeSalariale}", ${salaireConverter});`
                
                }else{
                
                    console.log("***** creation avec section_id ou classes_id")
                      //requete de creation de l'utilisateur
                    sqlCreatePerso = `INSERT INTO personnels ( nom, prenom, poste, contact, section_id, classes_id, groupeSalariale, email, salaire )
                    VALUES ( "${nom}", "${prenom}", "${poste}", ${contactConverter}, ${section_id}, ${classes_id}, "${groupeSalariale}" , "${email}", ${salaireConverter});`
                }
              

                    console.log("******** résultat de la requete sqlCreatePerso")
                    console.log(sqlCreatePerso)

                DB.query( sqlCreatePerso, (err, response1) => {
                    
                    if(err){ 
                        res.status(404).json({err})
                        console.log("***erreur de sql*** " +  err)  

                    }else{

                        /////////////

                        //requete de récupération de tout le personnel
                        let sqlPersonnels = "SELECT * FROM personnels;"

                        DB.query(sqlPersonnels, (errsqlPersonnels, ressqlPersonnels) => {

                            console.log("*** resultat de ressqlPersonnels récupération de tous le personnel")
                            console.log(ressqlPersonnels)

                            if(errsqlPersonnels){

                                console.log("*** erreur de errsqlPersonnels *** " +  errsqlPersonnels)  
                                res.status(400).json({errsqlPersonnels})
                               
                            
                            }else{
                                
                                //requete de la mise à jour de l'enseignant et du personnels_id si on est dans la création d'un enseignant
                                if( classe && section){

                                    console.log(" ****bienvenu dans PersonnelCurrent")
                                    console.log( classe + " " + section)

                                   let PersonnelCurrent = ressqlPersonnels.find( element1 => element1.contact === contactConverter ) //parseInt(contact)
                                    
                                    console.log("***** PersonnelCurrent")  
                                    console.log(PersonnelCurrent)

                                    idPersonnel = parseInt(PersonnelCurrent.id);  
                                    console.log("**** idPersonnel : " + idPersonnel)
                                    
                                    //requete de mis à jour de la classe
                                    const sqlUpdateClasse = `UPDATE classes SET enseignant = "${nom + " " + prenom}", personnels_id = ${idPersonnel}  WHERE nom = "${classe}" ;`                    

                                    DB.query( sqlUpdateClasse, (errUpclass, resUpclass) => {

                                        console.log("**** bienvenue dans sqlUpdateClasse : ")

                                        console.log("**** sqlUpdateClasse" )
                                        console.log(sqlUpdateClasse )

                                        if(errUpclass){ 
                                        
                                            
                                            console.log("*** erreur de sqlUpdateClasse *** " +  errUpclass) 
                                            //res.status(404).json({errUpclass}) 
                                    
                                        }else{ 

                                            
                                            
                                            console.log("*** enseignant et personnels_id modifiés avec succès*** ") 
                                            //res.status(200).json(resUpclass)
                                            
                                        }  

                                    }) 
                                }
                                

                            } 
                        
                        } )

                         
                        res.status(200).json(response1)
                        console.log("***Personnel crée avec succès*** ")  
                        
                    }
                })
            }
        }
    })


};

//GET récupération de tous le personnel
exports.getPersonnels = (req, res, next) => {

    console.log("***bienvenue dans getPersonnels*** " )
    console.log("***elementId du token*** : " + req.auth.userId ) 

    

    //requete récupérant tous le personnel 
    const sqlSelectAllPerso ="SELECT * FROM personnels"

    DB.query(sqlSelectAllPerso, (err, response) => {
        if(err){
            res.status(404).json({err})
            console.log("***erreur de sql*** " +  err)  
        }else{
            res.status(200).json(response)
            console.log(response)
        }
    })


};

//GET récupération d'un personnel
exports.getOnePersonnel = (req, res, next) =>{
    console.log("***bienvenue dans getOnePersonnels*** " )
    console.log("***elementId du token*** : " + req.auth.userId )

    //const utilisateurs_id = req.auth.userId
    //const utilisateursEmail = req.auth.email

    //requete récupérant tous le personnel 
    const sqlSelectAllPerso ="SELECT * FROM personnels"

    console.log(req.body)

    let elementId = parseInt(req.params.id) //convertion de la chaine en integer car front envoie chaine  et retourne false
    console.log(" ***** elementId : " + elementId)
    
    //vérification si le champ id est présent et cohérent
    if(!elementId){
        res.status(404).json({message: "absence de paramètre"}) 
    }

    DB.query(sqlSelectAllPerso, (err, response) => {
        if(err){
            res.status(404).json({err})
            console.log("***erreur de sql*** " +  err)  
        }else{
            const personnel = response.find( element => element.id == elementId)

            if(!personnel){
                res.status(404).json({message: "personnel non trouvé"})
                console.log("***personnel non trouvé*** " +  err)
            }else{
                console.log("****** personnel trouvé avec succès")
                console.log(personnel)
                res.status(200).json(personnel)

            }
        }
    })
}

//modification du personnel
exports.updatePersonnel = (req, res, next) =>{

    console.log("***bienvenue dans updatePersonnel*** " )

    console.log(req.body)
    console.log("***elementId du token*** : " + req.auth.userId ) 

        //récupération des données de la requete
        let { id,nom, prenom, poste, contact,  section, classe, groupeSalariale, email, salaire } = req.body
    
    //const utilisateurs_id = req.auth.userId
    //const utilisateursEmail = req.auth.email

    let userId = parseInt(req.params.id) //convertion de la chaine en integer car front envoie chaine  et retourne false

    let classes_id 
    let section_id = parseInt(section)

    //récupération de toutes les classes
    let sqlClassesAll = "SELECT * FROM classes;"

    //conversion des classes et section de lettre en id
    DB.query( sqlClassesAll, ( errsqlClasses, responsesqlClasses) => {

        console.log("**** responsesqlClasses")
        console.log(responsesqlClasses)

        if(errsqlClasses){

            console.log("***erreur de sqlClasses*** " + errsqlClasses)  
            res.status(400).json({errsqlClasses})
        
        }else{ 
            
        
            let classeCurrent = responsesqlClasses.find( element => element.nom === classe )
            console.log("**** classeCurrent")
            console.log(classeCurrent.id)

            classes_id = classeCurrent.id
            console.log("*** classes_id : " + classes_id)

            //récupération du personnel
            const sqlSelectAllPerso = `SELECT * FROM personnels;`

            //requete de mis à jour du cocktail
            const sqlUpdatePersonnel = `UPDATE personnels SET nom = "${nom}", prenom = "${prenom}", poste = "${poste}", contact = ${parseInt(contact)},                        
            section_id = ${section_id}, classes_id = ${classes_id}, groupeSalariale = "${groupeSalariale}", email = "${email}", salaire = ${parseInt(salaire)}  WHERE id = ${id} ;`   //${userId}
                        //${parseInt(section)}          //${parseInt(classe)}
            console.log("*** resulatat de la requete sqlUpdatePersonnel") 
            console.log(sqlUpdatePersonnel)
            DB.query(sqlSelectAllPerso, (err, response) => {
                
                console.log(response)///// 

                if(err){
                    res.status(404).json({err})
                    console.log("***erreur de sql 1*** " +  err)  
                }else{
                    const personnel = response.find( element => element.id == id) //userId
                
                // console.log(personnel)

                    if(!personnel){
                        res.status(404).json({message: "personnel non trouvé"}) 
                        console.log("***personnel non trouvé*** " +  err)
                    }else{
                        DB.query(sqlUpdatePersonnel, (err, response1) => {
                            if(err){
                                res.status(404).json({err})
                                console.log("***erreur de sql 2*** " +  err)  
                            }
                        // console.log(response1)
                            res.status(200).json({ message: "personnel mis à jour avec succès"})
                        })
                        
                    }
                }
            })
            
        }
    })

   
}


//DELETE supression du personnel
exports.deletePersonnel = (req, res, next) => {
    console.log("***bienvenue dans updatePersonnel*** " )
    console.log("***elementId du token*** : " + req.auth.userId ) 

    //const utilisateurs_id = req.auth.userId
    //const utilisateursEmail = req.auth.email

    let elementId = parseInt(req.params.id) //convertion de la chaine en integer car front envoie chaine  et retourne false

    //récupération du personnel
    const sqlSelectAllPerso = "SELECT * FROM personnels"

   //requete de supression
   const sqlDeletePersonnel = `DELETE FROM personnels WHERE  id = ${elementId};`

    DB.query(sqlSelectAllPerso, (err, response) => {
        if(err){
            res.status(404).json({err})
            console.log("***erreur de sql*** " +  err)  
        }else{
            const personnel = response.find( element => element.id == elementId)

            if(!personnel){
                res.status(404).json({message: "personnel non trouvé"})
                console.log("***personnel non trouvé*** " +  err)
            }else{
                DB.query(sqlDeletePersonnel, (err, response1) => {
                    if(err){
                        res.status(404).json({err})
                        console.log("***erreur de sql*** " +  err)  
                    }
                    console.log(response1)
                    res.status(200).json({ message: "personnel supprimé avec succès"})
                })
                
            }
        }
    })

}
