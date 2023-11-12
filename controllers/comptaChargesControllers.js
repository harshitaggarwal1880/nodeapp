//import des modules nécessaires
const DB = require("../mysql.config")
const { response } = require("../app");
const e = require("cors");

//POST creation de l'entrée d'argent
exports.createCharges = (req, res, next ) => {

    console.log("***bienvenue dans createCharges*** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    console.log(req.body)

    //récupération des données de la requete
    let {  categorie, datePaiement, montantPaye, electriciteMois, poste, libelle, commentaire, nomPrenom } = req.body;
    
    
    /////////////////////////////////////////////

    let typePaiementCurrent
    let valeurDefault

    let idPaiement

    //requete de récupération de toutes les charges
    let sqlSelectAllCharges = "SELECT * FROM chargesEcole"
    

    //requete de création du paiement   
    let sqlCreateCharge = `INSERT INTO chargesEcole ( categorie, datePaiement, montantPaye, electriciteMois, poste, libelle, commentaire, nomPrenom)
        VALUES ( "${categorie}", "${ datePaiement }", ${parseInt(montantPaye)}, "${electriciteMois}", "${poste}",  "${libelle}", "${commentaire}", "${nomPrenom}" ) ;`

    /*
    let sqlCreatePaiement = `INSERT INTO entreesArgent ( scolarite, tenuesClasse, transport, cantine, datePaiement, montantPaye, eleves_id )
    VALUES ( "${typePaiement}", "${typePaiementCurrent}", "${typePaiementCurrent}", "${typePaiementCurrent}", "${datePaiement}", ${parseInt(montantPaye)},${parseInt(idEleve)} ) ;`
    */
        
    DB.query( sqlCreateCharge, (errCharge, resCharge) => {

        console.log("**** le resultat de sqlCreateCharge")
        console.log(sqlCreateCharge)

        if(errCharge){ 

            res.status(400).json({errCharge}) 
            console.log("***erreur de sqlCreateCharge*** " +  errCharge)  

        }else{

        
            //////////////////////////////::

            /*

            DB.query( sqlSelectAllCharges, (errSelectAllCharges, resSelectAllCharges) => {

                console.log("bienvenue au sqlSelectAllCharges deuxième appel")

                //console.log("**** resSelectAllCharges")
               // console.log(resSelectAllCharges)

             
                if(errSelectAllCharges){ 

                    res.status(400).json({errSelectAllCharges})
                    console.log("***erreur de sqlSelectAllCharges 2*** " +  errSelectAllCharges)  
        
                }else{

                    let listeAllCharges = resSelectAllCharges

                    console.log("****  le dernier élément de listeCharge  après creation Charge actuel est ")
                    
                    let dernierAllCharges= listeAllCharges[listeAllCharges.length - 1]
                    console.log(dernierAllCharges)

                    //formatage de la date en "YYYY-MM-DD"
                    const dateStr = `${dernierAllCharges.dateAllCharges}`
                    const date = new Date(dateStr);

                    const annee = date.getFullYear();
                    const mois = String(date.getMonth() + 1).padStart(2, '0');
                    const jour = String(date.getDate()).padStart(2, '0');

                    const dateFormatee = `${annee}-${mois}-${jour}`;
                   
                    console.log("***** dateFormatee ");
                    console.log(dateFormatee);

                   // console.log("dernierpaiement.id : " + dernierpaiement.datePaiement)

                    
                    //requete de mis à jour de entreesArgent_id l'élève
                    //let sqlSUpdatePaiement = `UPDATE entreesArgent SET eleves_id = ${ dernierpaiement.id }  WHERE id = ${dernierpaiement.id} ;`                    
                             
                    let sqlSelectAllCharges2 =  "SELECT * FROM chargesEcole"

                    DB.query(sqlSelectAllCharges2, (errAllCharges2, resAllCharges2) => {


                        if(errAllCharges2){  

                            console.log("*** erreur de sqlSelectAllCharges2 *** " +  errAllCharges2)  
                            res.status(400).json({errAllCharges2})
                            
                            
                
                        }else{

                            let paiementCharge = resAllCharges2.filter(element2 => element2.personnels_id === dernierAllCharges.personnels_id)
                            
                            let listeMontantCharge = paiementCharge.map( element => element.montantPaye)
                          
                            console.log("******* listeMontantCharge ")
                            console.log(listeMontantCharge)

                            //calcule du montant total payé par l'élève
                            let  mergeMontantTotalCharge = listeMontantCharge.reduce( (acc, current) => {

                                console.log("***** mergeMontantTotalCharge")
                                console.log(acc + current)
                        
                                return acc + current



                            },0 )

                            console.log("****** mergeMontantTotalCharge ")
                            console.log(mergeMontantTotalCharge )

                           


                            ////////////////////////////////////////

                             //requete de mis à jour du personnel
                           
                            let sqlSUpdatePersonnel= `UPDATE personnels SET  chargesEcole_id = ${dernierAllCharges.id }  WHERE id = ${ dernierAllCharges.personnels_id } ;`                    

                            DB.query(  sqlSUpdatePersonnel, (errUpdatePersonnel, resUpdatePersonnel) => {

                                console.log("****** resultat de la requete sqlSUpdatePersonnel")
                                console.log(sqlSUpdatePersonnel)

                                if(errUpdatePersonnel){ 

                                    console.log("*** erreur de sqlSUpdatePersonnel *** " +  errUpdatePersonnel)  
                                    res.status(400).json({errUpdatePersonnel})
                                    
                                    
                        
                                }else{

                                    console.log("*** modification du personnel effectuée avec succès*** ") 
                                    console.log(resUpdatePersonnel) 


                                    

                                }

                            })


                            ////////////////////////////////////////
                        
                        
                        }


                    } )

                   

 
                }

            })*/
            
           
            console.log("*** charge crée avec succès*** ") 
            res.status(200).json(resCharge)
        }
        
    })
    


};

//GET récupération de toutes les charges d'argent
exports.getAllCharges = (req, res, next ) => {

    console.log("*** bienvenue dans getAllCharges *** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    console.log(req.body)

    

    //requete de récupération de tous les paiements
    let sqlSelectAllCharges = "SELECT * FROM chargesEcole"

    DB.query( sqlSelectAllCharges, (errAllCharges, resAllCharges) => {


        console.log("****** resultat de la requete sqlSelectAllCharges")
        console.log(resAllCharges)

        if(errAllCharges){ 

            console.log("*** erreur de sqlSelectAllCharges*** " +  errAllCharges)  
            res.status(400).json({errAllCharges})
            
            

        }else{

            console.log("*** charges récupérés avec succès*** ") 
            res.status(200).json(resAllCharges)

        }


    })


};



//GET  récupération d'une entrée d'argent
exports.getOneCharge = (req, res, next ) => {

    console.log("*** bienvenue dans getOneCharge *** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    console.log(req.body)

    let eleveCurrent
    let paiementCurrent

    

    //requete de récupération de toutes les charges
    let sqlSelectAllCharges= "SELECT * FROM chargesEcole"

    //requete de récupération de tous les élèves
    let sqlSelectAllPersonnels = "SELECT * FROM personnels"


    let idCharge = parseInt(req.params.id)
    console.log(" ***** idCharge  : " + idCharge )

    DB.query( sqlSelectAllCharges, (errAllCharges, resAllCharges) => {


        console.log("****** resultat de la requete sqlSelectAllCharges")
        console.log(resAllCharges)

        if(errAllCharges){ 

            console.log("*** erreur de sqlSelectAllCharges*** " +  errAllCharges)  
            res.status(400).json({errAllCharges})
            
            

        }else{

            const charge = resAllCharges.find( element => element.id == idCharge )

            if(!charge ){
                res.status(404).json({message: "charge  non trouvé"})
                console.log("***charge  non trouvé*** " +  err)
            }else{
                console.log("****** charge  trouvé avec succès")
                console.log(charge )
                res.status(200).json(charge )

            }

        }
    })

   

   

   


};


