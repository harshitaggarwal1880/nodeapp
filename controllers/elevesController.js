//import des modules nécessaires
const DB = require("../mysql.config")
const { response } = require("../app");   
 
//POST creation de l'élève
exports.createEleve = (req, res, next) => {   
 
    console.log("***bienvenue dans createEleve*** " )
    console.log("***elementId du token*** : " + req.auth.userId ) 

    
    console.log("*** req.body *** " )   
    console.log(req.body)  

  
    
    //new Date(dateFormatee).toLocaleDateString("fr")

    let { anciennete, nom, prenom, decouverteDateArrivee, dateNaissance, sectionNumber,
            classes_id, dateInscription, montantPaye, nomParent1, contactParent1, nomParent2, contactParent2 } = req.body
    
    if( !anciennete || !nom || !prenom || !decouverteDateArrivee || !dateNaissance || !sectionNumber
       || !classes_id || !dateInscription || !montantPaye || !nomParent1 || !contactParent1 ){

        console.log("***veillez entrer correctement toutes les information du formulaire*** ")
        res.status(400).json({ message: "***veillez entrer correctement toutes les information du formulaire***"})
    }
     

    //on l'utilisera pour insérer le userId dans utilisateurs_id
    const utilisateurs_id = req.auth.userId
  
 
    console.log("****** la valeur sectionNumber avant le if: ****** " + sectionNumber )

    //converstion de l'id de la section en chiffre 
    let sectionAnglophone = "anglophone"  
    let sectionFrancophone = "francophone"  
    if(sectionNumber.toLowerCase() === sectionAnglophone.toLowerCase()) {

        sectionNumber = 1  

    }else if( sectionNumber.toLowerCase() === sectionFrancophone.toLowerCase() ) { 

        sectionNumber = 2        

    }  
   
    console.log("****** la valeur sectionNumber : ****** " + sectionNumber )

    ///////////////////////////////////////////////////////////////:
    
    
    //requete de récupération de toutes les classes
    const sqlSelectAllClasses = "SELECT * FROM classes" 

    DB.query( sqlSelectAllClasses, (err, response0) => {

        let classeId 

        if(err){  
            res.status(404).json({err})
            console.log("***erreur de sql sqlSelectAllClasses*** " +  err)  
        }else{
            
            const classe = response0.find( element3 => element3.nom === classes_id) //classesNom
            if(!classe) {
                            
                res.status(404).json({message: "veillez entrer correctement la classe"})
                console.log("***veillez entrer correctement la classe*** ")
            }else{

                //conversion du nom de la classe de la chaine à l'integer
                classeId = classe.id

            }
            //console.log("la valeur de classeId est : " + classeId)
        } 

    //})
 
        console.log("la valeur de classeId est : " + classeId)
        ///////////////////////////////////////////////////////////////:

        //requete récupérant toutes les élèves
        const sqlSelectAllEleves = "SELECT * FROM eleves" 
        

        DB.query( sqlSelectAllEleves, (err, response) => {

            if(err){
                res.status(404).json({err})
                console.log("***erreur de sql sqlSelectAllEleves*** " +  err)  
            }else{

                //requete de vérification si l'élève existe dans la base de données
                const eleve = response.find( element1 => element1.nom === nom && element1.prenom === prenom && element1.nomParent1 === nomParent1)
                
                console.log("l'eleve trouvé est")////////
                console.log(eleve)//////////

                if(eleve){

                    console.log(`*************l'élève ${nom} existe déjà****************`)
                    res.status(500).json({ message: `l'élève ${nom} existe déjà`})
                }else{

                    //requete de récupération des sections
                    const sqlSelectAllSections ="SELECT * FROM section"

                    DB.query( sqlSelectAllSections, (err, response1) => {  

                        if(err){ 
                            res.status(404).json({err})
                            console.log("***erreur de sql sqlSelectAllSections*** " +  err)  
                        }else{

                            //comparaison des section
                            const section = response1.find( element2 => element2.id === sectionNumber )

                            console.log("ma section est ")
                            console.log(section)

                            //vérification si la section(le numéro) envoyée correspond à une section(numéro) de la base de données
                            if(!section) { 
                                
                                res.status(404).json({message: "veillez entrer correctement la section"})
                                console.log("***veillez entrer correctement la section*** ")
                            }else{

                                let sqlCreateEleve
                                
                                //vérification si nomParent2, contactParent2 existe ou pas decouverteDateArrivee
                                if(!nomParent2 || !contactParent2 ){

                                    console.log("*** ma requete sqlCreateEleve avec des valeurs nulles   : *****")
                                   
                                    //requete de création de l'élève
                                    sqlCreateEleve = `INSERT INTO eleves ( anciennete, decouverteDateArrivee, nom, prenom, dateNaissance, section_id,
                                        classes_id, utilisateurs_id,scolariteTotale, montantTotalEleve, nomParent1, contactParent1, dateInscription, montantPaye)
                                    VALUES (  "${anciennete}", "${decouverteDateArrivee}", "${nom}", "${prenom}", "${dateNaissance}", ${sectionNumber},
                                        ${classeId}, ${utilisateurs_id}, ${montantPaye} , ${montantPaye}, "${nomParent1}", ${contactParent1}, "${dateInscription}", ${montantPaye} );`
    


                                 }else{

                                    console.log("**** ma requete sqlCreateEleve sans  valeurs nulles  : ****")
                                   
                                    //requete de création de l'élève
                                    sqlCreateEleve = `INSERT INTO eleves ( anciennete, decouverteDateArrivee, nom, prenom, dateNaissance, section_id,
                                        classes_id, utilisateurs_id, scolariteTotale, montantTotalEleve, nomParent1, contactParent1, dateInscription, montantPaye)
                                    VALUES (  "${anciennete}", "${decouverteDateArrivee}", "${nom}", "${prenom}", "${dateNaissance}", ${sectionNumber},
                                        ${classeId}, ${utilisateurs_id}, ${montantPaye} , ${montantPaye},  "${nomParent1}", ${contactParent1}, "${dateInscription}", ${montantPaye} );`
    
 
                                 } 
                               
                                 console.log("****** sqlCreateEleve")
                                console.log(sqlCreateEleve)
                                    
                                

                                DB.query( sqlCreateEleve, (err, response3) => {

                                    ///////////////////////

                                    let listeEleveBase
                                    //gestion de la mise à jour de l'effectif de la classe
                                    
                                    DB.query( sqlSelectAllEleves, (errEleve, resEleve) => {

                                        if(errEleve){

                                            console.log("***erreur de sql sqlSelectAllEleves 2 *** " +  errEleve) 
                                            res.status(404).json({errEleve})
                                        }else{

                                             listeEleveBase = resEleve
                                            console.log(" ****** resEleve")
                                            console.log(resEleve)

                                            let tablefilterEleve = resEleve.filter( eleve => eleve.classes_id === classeId)
                                            console.log("****** tablefilterEleve ******")
                                            console.log(` l'effectif de la classe ${classes_id} est : ` + tablefilterEleve.length)
                                            
                                            //requete de mise à jour des effectifs
                                            let sqlUpdateEffectif = `UPDATE  classes SET effectif = ${tablefilterEleve.length} WHERE id = ${classeId}`

                                            DB.query(sqlUpdateEffectif, (errUpdateEffectif, resUpdateEffectif) => {

                                                if(errUpdateEffectif){

                                                    console.log("***erreur de sql sqlUpdateEffectif *** " +  errUpdateEffectif) 
                                                    res.status(404).json({ errUpdateEffectif })
                                                }else{

                                                    console.log(` ******  l'effectif de la classe ${classes_id} a été mise ajour `)
                                                   
                                                }
                                            })



                                             ////////////////////////////////////

                                             //récupération de l'id du dernier élève crée
                                             let dernierEleveCree = resEleve[resEleve.length - 1]

                                             console.log("***** dernierEleveCree")
                                             console.log(dernierEleveCree)

                                             let scolarite= "scolarite"

                                             //requete de création du paiement  

                                             /******** */

                                             
                                             //formatage de la date avant d'éxécuter la requete
                                             
                                             const moment = require('moment');

                                             // Date au format initial
                                             const dateStr = `${dernierEleveCree.dateInscription}`;
                                             
                                             // Convertir la date en objet Moment
                                             const dateObj = moment(dateStr, "ddd MMM DD YYYY HH:mm:ss Z");
                                             
                                             // Extraire l'année, le mois et le jour
                                             const year = dateObj.format("YYYY");
                                             const month = dateObj.format("MM");
                                             const day = dateObj.format("DD");
                                             
                                             // Maintenant, vous pouvez utiliser ces valeurs dans votre requête SQL
                                             const sqlQuery = `
                                               INSERT INTO entreesArgent (scolarite, datePaiement, montantPaye, eleves_id)
                                               VALUES (500, '${year}-${month}-${day}', 500, 118);
                                             `;
                                            
                                             /******** */

                                            let sqlCreatePaiement = `INSERT INTO entreesArgent ( scolarite, datePaiement, montantPaye, eleves_id )
                                            VALUES ( ${parseInt(dernierEleveCree.montantPaye)},  '${year}-${month}-${day}', ${parseInt(dernierEleveCree.montantPaye)}, ${dernierEleveCree.id} ) ;`
           
                                            console.log(" ****** la requete est sqlCreatePaiement")
                                            console.log( sqlCreatePaiement)

                                            DB.query( sqlCreatePaiement, (errsqlCreatePaiement, ressqlCreatePaiement) =>{

                                                console.log("bienvenue au test sqlCreatePaiement")

                                                if(errsqlCreatePaiement){ 

                                                    console.log("***erreur de errsqlCreatePaiement *** " +  errsqlCreatePaiement) 
                                                    res.status(400).json({errsqlCreatePaiement})
                                                   
                                        
                                                }else{


                                                    console.log("le paiement a été crée avec succès pour la première creation de l'élève")

                                                }


                                                /********************** */
                                                         ////////////

                                                    let sqlAllPaiementEntree = "SELECT * FROM entreesArgent"
                                                    
                                                

                                                    DB.query( sqlAllPaiementEntree, (errsqlAllPaiementEntree, ressqlAllPaiementEntree) =>{


                                                        console.log(" resultat récupération de toutes les entrées sqlAllPaiementEntree")
                                                        console.log(ressqlAllPaiementEntree)

                                                        if(errsqlAllPaiementEntree){ 

                                                            console.log("***erreur de errsqlAllPaiementEntree *** " +  errsqlAllPaiementEntree)  
                                                            res.status(400).json({errsqlAllPaiementEntree})
                                                        
                                                         
                                                        }else{
 
                                                            let dernierpaiement2 = ressqlAllPaiementEntree[ressqlAllPaiementEntree.length - 1]
                                                            
                                                            console.log("**** dernierpaiement2")
                                                            console.log(dernierpaiement2)
                                                        
                                                            //requete de mis à jour de l'élève
                                                            let sqlUpdateEleve = `UPDATE eleves SET  entreesArgent_id = ${ dernierpaiement2.id } WHERE id = ${ dernierpaiement2.eleves_id } ;`   

                                                            DB.query( sqlUpdateEleve, (errsqlUpdateEleve, ressqlUpdateEleve) =>{

                                                                if(errsqlUpdateEleve){ 

                                                                    console.log("***erreur de errsqlUpdateEleve *** " +  errsqlUpdateEleve) 
                                                                    res.status(400).json({errsqlUpdateEleve})
 
                                                         
                                                                }else{


                                                                    console.log("l'id entreesArgent a été mis à jour avec succès")

                                                                   
                                                                }
                                                                

                                                            })

                                                        }


                                                    })



                                                /************************** */

                                            })

                                           
                                            ////////////////////////////////////

                                           
                                        }

                                    })


                                    ////////////////////////////////////

                                     //mise à jour de entreesArgent_id de l'élève

                                    
                                     console.log(" ****** listeEleveBasee")
                                     console.log(listeEleveBase)
                                   
                                   



                                     ////////////////////////////////////

                                    


                                    ///////////////////////

                                    console.log("******** test ********$")////// 

                                    console.log(response3)///////
                                    
                                    if(err){

                                        console.log("***erreur de sql sqlCreateEleve*** " +  err) 
                                        res.status(404).json({err})
                                         
                                    }else{
                                        res.status(200).json(response3) 
                                        console.log("***élève crée avec succès*** ")   
                                    } 
                                })
                                
                            
                            
                            }

                        }

                    })


                }

            }

        })
    })    

};


//GET récupération de tous les élèves
exports.getEleves = (req, res, next) => {

    console.log("***bienvenue dans getEleves*** " )
    console.log("***elementId du token*** : " + req.auth.userId )

    //requete récupérant toutes les classes 
    const sqlSelectAllEleves ="SELECT * FROM eleves"

    DB.query(sqlSelectAllEleves, (err, response) => {
       if(err){
           res.status(404).json({err})
           console.log("***erreur de sql sqlSelectAllEleves*** " +  err)  
       }else{
           res.status(200).json(response)
           console.log(response)
       }
   })


};


//GET récupération d'un élève
exports.getOneEleve = (req, res, next) => {

    console.log("***bienvenue dans getOneEleve*** " )
    console.log("***elementId du token*** : " + req.auth.userId )

    let elementId = parseInt(req.params.id)

    if(!elementId){

        res.status(404).json({message: "absence de paramètre"})
    }

    //requete récupérant tous les élèves
    const sqlSelectAllEleves ="SELECT * FROM eleves"

    DB.query(sqlSelectAllEleves, (err, response) => {

        if(err){
            res.status(404).json({err})
            console.log("***erreur de sql sqlSelectAllEleves*** " +  err)  
        }else{

            console.log("ma response est : ")
            console.log(response)//////

            const eleve = response.find( element => element.id == elementId)

            console.log("mon eleve est : ")
            console.log(eleve)//////
            if(!eleve){
                res.status(404).json({message: "eleve non trouvé"})
                console.log("***eleve non trouvé*** " +  err)
            }else{

                res.status(200).json(eleve)
            }
        }





    })

};


//PUT modification de l'élève
exports.updateEleve = (req, res, next) => {

    console.log("***bienvenue dans updateEleve*** " )
    console.log("***elementId du token*** : " + req.auth.userId ) 
    
    //console.log("*** mon headers dans updateEleve*** " )
    //console.log(req.headers)



    //récupération des données de la requetes
    console.log("***** req.body ******") 
    console.log(req.body) 
    

    let { idEleve, anciennete, decouverteDateArrivee, nom, prenom, dateNaissance, dateInscription, montantPaye, sectionNumber,
        classes_id,  nomParent1, contactParent1, nomParent2, contactParent2 } = req.body

        console.log("classes_id :" +  classes_id)
       
    
     
    //let elementId = parseInt(req.params.id) //idEleve 
    let elementId = idEleve

    //converstion de l'id de la section en chiffre 
    let sectionAnglophone = "anglophone"
    let sectionFrancophone = "francophone"
    if(sectionNumber.toLowerCase() === sectionAnglophone.toLowerCase()) {

        sectionNumber = 1

    }else if( sectionNumber.toLowerCase() === sectionFrancophone.toLowerCase() ) {

        sectionNumber = 2

    } 
   
    console.log("****** la valeur sectionNumber : ****** " + sectionNumber )
    ////////////////////////////:

    /*
    let dateNaissance1 = new Date(dateNaissance).toLocaleDateString()
    let dateInscription1 = new Date(dateInscription).toLocaleDateString()

    let decouverteDateArrivee1

    if(decouverteDateArrivee1 == Date){

        decouverteDateArrivee1 = new Date(decouverteDateArrivee).toLocaleDateString()

    }
    */


    //////////////////////////
    let classeId 
    let classeNomBase
    let sqlUpdateEffectif 
    let eleve
    let classeChoice

    let sqlUpdateEleve 

    //requete de récupération de tous les élèves
    const sqlSelectAllEleves = "SELECT * FROM eleves" 
    //requete de récupération de toutes les classes
    const sqlSelectAllClasses = "SELECT * FROM classes" 

    let idClasseBase

    /////////////////////////////

    
    if( !anciennete && !nom && !prenom && !decouverteDateArrivee && !dateNaissance 
        && !montantPaye && !nomParent1 && !contactParent1 ){

            console.log("** bienvenue dans le tranfert")

           
            DB.query( sqlSelectAllClasses, (err, response00) => {

                //let classeId 
        
                if(err){
                    console.log("***erreur de sql sqlSelectAllClasses*** " +  err)
                    res.status(404).json({err})
                      
                }else{ 
                    
                    const classe = response00.find( element3 => element3.nom === classes_id) //classesNom
                    if(!classe) {
                              
                        console.log("***veillez entrer correctement la classe*** ")
                        res.status(404).json({message: "veillez entrer correctement la classe"})
                        
                    }else{
        
                        //conversion du nom de la classe de la chaine à l'integer
                        classeId = classe.id
                        classeNomBase = classe.nom

                    }
                    
                } 
        
                console.log("la valeur de classeId est : " + classeId) 
               
            
                //////////////////////////////////////////////////////////////////
        
                
                DB.query( sqlSelectAllEleves, (err, response0) => {
        
                    console.log("****** response0********")///////
                    console.log(response0)///////

                    //récupération de l'élève actuelle
                    eleve = response0.find( eleve1 => eleve1.id === req.body.idEleve)
                    //récupération de la classe de l'élève actuel à partir de la base de données
                    classeChoice = response00.find( classe1 => classe1.id === eleve.classes_id)
            
                    console.log("la valeur de classeNomBase est : " + classeNomBase)
                    console.log("****** eleve********")///////
                    console.log(eleve)
                    ///////////////////////////////////
                    if(err){
            
                        console.log("***erreur de sql sqlSelectAllEleves *** " +  err)
                        res.status(404).json({message: "erreur de sql sqlSelectAllEleves" + err})
                        
                    }else{
            
                         /////////////////////////////////////////
                            //classeNomBase != classes_id
                         if( eleve.classes_id != classeId){  //comparaison de l'ancien id de la classe avc le id de la nouvelle classe
        
                            console.log("**** vous êtes dans le transfert sans contact 2 et nom 2 avec la modification d'effectif et classeNomBase != classes_id")
                          
                            //requete de récupération de toutes les classes
                            const sqlSelectAllClasses2 = "SELECT * FROM classes" 

                            //gestion de la mise à jour de l'effectif
                            let tablefilterEleve = response0.filter( eleve2 => eleve2.classes_id === classeId )
                            console.log("***** tablefilterEleve.length : " + tablefilterEleve.length)
                            console.log(tablefilterEleve)

                            sqlUpdateEleve = `UPDATE eleves SET section_id=${sectionNumber}, classes_id=${classeId}, dateInscription="${dateInscription}"
                            WHERE id = ${elementId} ;`

                            //requete de mise à jour décrémentation de -1  des effectifs
                            let sqlUpdateEffectifDécrémentation = `UPDATE  classes SET effectif = ${classeChoice.effectif -= 1} WHERE id = ${eleve.classes_id}`
                            
                            //requete de mise à jour incrémentation de +1  des effectifs
                             sqlUpdateEffectif = `UPDATE  classes SET effectif = ${tablefilterEleve.length += 1} WHERE id = ${classeId}`

                              ////////////////////////////////////////////////////  
                            
                            

                            DB.query(sqlUpdateEffectif, (errUpdateEffectif, resUpdateEffectif) => {

                                if(errUpdateEffectif){

                                    console.log("***erreur de sql sqlUpdateEffectif *** " +  errUpdateEffectif) 
                                    res.status(404).json({ errUpdateEffectif })
                                }else{

                                    DB.query(sqlUpdateEffectifDécrémentation, (errSqlUpdateEffectifDécrémentation, resSqlUpdateEffectifDécrémentation) => {

                                        if(errSqlUpdateEffectifDécrémentation){

                                            console.log("***erreur de sql sqlUpdateEffectifDécrémentation *** " +  errSqlUpdateEffectifDécrémentation) 
                                            res.status(404).json({ errSqlUpdateEffectifDécrémentation })
                                        }else{

                                            console.log(` ******  votre décrémentation d'effectif a été faite avec succès ****`)
                                        }
                                    })

                                    console.log(` ******  l'effectif de la classe ${classes_id} a été mise ajour ****`)
                                    
                                }
                            })

                            //////////////////////////////////////////////////
                            
                           
                                
                        }else{ 

                            console.log("**** vous êtes dans le transfert sans contact 2 et nom 2 avec la modification d'effectif et classeNomBase pas différent classes_id")
                            //let sqlUpdateEleve 
                            //requete de mis à jour de l'élève                                           
                            sqlUpdateEleve = `UPDATE eleves SET section_id=${sectionNumber}, classes_id=${classeId}, dateInscription="${dateInscription}"
                            WHERE id = ${elementId} ;`

                        }

                        ////////////////////////////////////////

                        console.log("résultat de la requete sqlUpdateEleve")//
                        console.log(sqlUpdateEleve)//

                        console.log("résultat de la requete sqlUpdateEffectif")//
                        console.log(sqlUpdateEffectif)//
            
                        DB.query(sqlUpdateEleve, (err, response2) => {  
            
                            if(err){
                                console.log("***erreur de sqlUpdateEleve*** " +  err)
                                res.status(404).json({ message: "erreur de sqlUpdateEleve" + err})
                                
                            }
                           


                            
                            // console.log(response1)
                            console.log(`l'élève ${req.body.nom} a été mise à jour avec succès`)
                            res.status(200).json({ message: "l'élève a été mise à jour avec succès"})
                            
                        })   
            
                    } 
                })
                     
            })
       
        }else{

            DB.query( sqlSelectAllEleves, (err, response0) => {

                console.log("****** response0********")///////
                console.log(response0)///////
        
                
                if(err){
        
                    console.log("***erreur de sql sqlSelectAllEleves *** " +  err)
                    res.status(404).json({message: "erreur de sql sqlSelectAllEleves" + err})
                    
                }else{
        
                    //let sqlUpdateEleve 
        
                    if(!nomParent2 || !contactParent2 ){
                        
                       

                        console.log("**** vous êtes dans le transfert sans contact 2 et nom 2 sans modification d'effectif")
                        //requete de mis à jour de l'élève
                        sqlUpdateEleve = `UPDATE eleves SET anciennete="${anciennete}", decouverteDateArrivee="${decouverteDateArrivee}", nom="${nom}", prenom="${prenom}", dateNaissance="${dateNaissance}", section_id=${sectionNumber},
                        classes_id=${classes_id}, dateInscription="${dateInscription}", montantPaye=${montantPaye}, nomParent1="${nomParent1}", contactParent1=${contactParent1}
                        WHERE id = ${elementId}   ;`
                          
                    }else{

                       
                        console.log("**** vous êtes dans le transfert avec contact 2 et nom 2 sans la modification d'effectif")

                        //requete de mis à jour de l'élève
                        sqlUpdateEleve = `UPDATE eleves SET anciennete="${anciennete}", decouverteDateArrivee="${decouverteDateArrivee}", nom="${nom}", prenom="${prenom}", dateNaissance="${dateNaissance}", section_id=${sectionNumber},
                        classes_id=${classes_id},  nomParent1="${nomParent1}", contactParent1=${contactParent1}
                        nomParent2="${nomParent2}", contactParent2=${contactParent2}   WHERE id = ${elementId} ;`   

                    }
                    
                    console.log("résultat de la requete sqlUpdateEleve")//
                    console.log(sqlUpdateEleve)//
        
                    DB.query(sqlUpdateEleve, (err, response2) => { 
        
                        if(err){
                            console.log("***erreur de sqlUpdateEleve*** " +  err)
                            res.status(404).json({ message: "erreur de sqlUpdateEleve" + err})
                            
                        }
                    // console.log(response1)
                        console.log(`l'élève ${nom} a été mise à jour avec succès`)
                        res.status(200).json({ message: "l'élève a été mise à jour avec succès"})
                        
                    })   
        
                }  

            })


        }
   
        
};


//DELETE supression de l'élève
exports.deleteEleve = (req, res, next) => { 

    console.log("***bienvenue dans deleteEleve*** " )
    console.log("***elementId du token*** : " + req.auth.userId ) 

    let elementId = parseInt(req.params.id)
    console.log("****** elementId ****** " + elementId)
    console.log(elementId)
    let eleve

    /////////////////////////
    
     //requete de récupération de toutes les classes
    const sqlSelectAllClasses = "SELECT * FROM classes" 

    //////////////////////
    const  sqlSelectAllEleves = `SELECT * FROM eleves;` 
   //requete de supression
   const sqlDeleteEleve = `DELETE FROM eleves WHERE  id = ${elementId};`

    DB.query(sqlSelectAllEleves , (err, response) => {  
        if(err){
            res.status(404).json({err})
            console.log("***erreur de ssqlSelectAllEleves*** " +  err)  
        }else{
             eleve = response.find( element => element.id == elementId)
             console.log("***** eleve.classes_id : " + eleve.classes_id)
             console.log("***** eleve : ")
             console.log( eleve)

            if(!eleve){
                res.status(404).json({message: "éleve non trouvé"})
                console.log("***élève non trouvé*** " +  err)
            }else{
                DB.query(sqlDeleteEleve , (err, response1) => {
                    if(err){
                        res.status(404).json({err})
                        console.log("***erreur de sqlDeleteEleve *** " +  err)  
                    }

                    
                     /////////////////////// 

                        let tablefilterEleve = response.filter( eleve2 => eleve2.classes_id === eleve.classes_id )
                        console.log("***** tablefilterEleve.length : " + tablefilterEleve.length)
                        console.log(tablefilterEleve)

                         //requete de récupération de toutes les classes
                        const sqlSelectAllClasses2 = "SELECT * FROM classes" 

                        //requete de mise à jour des effectifs
                        let sqlUpdateEffectif = `UPDATE  classes SET effectif = ${tablefilterEleve.length -= 1} WHERE id = ${eleve.classes_id}`

                        DB.query(sqlUpdateEffectif, (errUpdateEffectif, resUpdateEffectif) => {

                            if(errUpdateEffectif){

                                console.log("***erreur de sql sqlUpdateEffectif *** " +  errUpdateEffectif) 
                                res.status(404).json({ errUpdateEffectif })
                            }else{

                                console.log(` ******  l'effectif de la classe ${eleve.classes_id} a été mise ajour ****`)
                                
                            }
                        })
                       

                    ///////////////////////


                    //console.log(response1)
                    res.status(200).json({ message: "élève supprimé avec succès"})
                })
                
            } 
        }
    })


};

 /*
 pour la modification de la classe
                        //requete de mis à jour de l'élève
                        sqlUpdateEleve = `UPDATE eleves SET anciennete="${anciennete}", decouverteDateArrivee="${decouverteDateArrivee}", nom="${nom}", prenom="${prenom}", dateNaissance="${dateNaissance}", section_id=${sectionNumber},
                        classes_id=${classes_id},  nomParent1="${nomParent1}", contactParent1=${contactParent1}
                        nomParent2="${nomParent2}", contactParent2=${contactParent2}   WHERE id = ${elementId} ;`   
                        
        
                       */ 