//import des modules nécessaires
const DB = require("../mysql.config")
const { response } = require("../app");
const e = require("cors");

//POST creation de l'entrée d'argent
exports.createEntree = (req, res, next ) => {

    console.log("***bienvenue dans createEntree*** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    //console.log(req.body)

    //récupération des données de la requete
    let { idEleve, typePaiement, datePaiement,montantPaye } = req.body;
    //let { idEleve, scolarite, tenuesClasses, transport,cantine, datePaiement, montantPaye } = req.body;
    console.log(req.body)

    /*
    console.log("****** req.body.typePaiement")
    console.log(req.body.typePaiement)

    let {  scolarite, tenuesClasses, transport,cantine } = req.body.typePaiement;

    console.log("**** les différente valeurs sont")
    console.log("scolarite = " + scolarite + " " +  "tenuesClasses = " + tenuesClasses + " " + "transport = "+ transport + " " + "cantine = "+ cantine )
    */
    /////////////////////////////////////////////

    let typePaiementCurrent
    let valeurDefault

    let idPaiement

    //requete de récupération de tous les paiements
    let sqlSelectAllPaiement = "SELECT * FROM entreesArgent"
    

    //requete de création du paiement  
    let sqlCreatePaiement = `INSERT INTO entreesArgent ( ${typePaiement}, datePaiement, montantPaye, eleves_id )
        VALUES ( ${parseInt(montantPaye)},  "${ datePaiement }", ${parseInt(montantPaye)}, ${parseInt(idEleve)} ) ;`

    /*
    let sqlCreatePaiement = `INSERT INTO entreesArgent ( scolarite, tenuesClasse, transport, cantine, datePaiement, montantPaye, eleves_id )
    VALUES ( "${typePaiement}", "${typePaiementCurrent}", "${typePaiementCurrent}", "${typePaiementCurrent}", "${datePaiement}", ${parseInt(montantPaye)},${parseInt(idEleve)} ) ;`
    */
        
    DB.query( sqlCreatePaiement, (errPaiement, resPaiement) => {

        console.log("**** le resultat de sqlCreatePaiement")
        console.log(sqlCreatePaiement)

        if(errPaiement){ 

            res.status(400).json({errPaiement}) 
            console.log("***erreur de sqlCreatePaiement*** " +  errPaiement)  

        }else{

        
            //////////////////////////////::

            

            DB.query( sqlSelectAllPaiement, (errSelectPaiement, resSelectPaiement) => {

                console.log("bienvenue au sqlSelectAllPaiement deuxième appel")

                //console.log("**** resSelectPaiement")
               // console.log(resSelectPaiement)

             
                if(errSelectPaiement){ 

                    res.status(400).json({errSelectPaiement})
                    console.log("***erreur de sqlSelectAllPaiement 2*** " +  errSelectPaiement)  
        
                }else{

                    let listePaiement = resSelectPaiement

                    console.log("****  le dernier élément de listePaiement  après creation paiement actuel est ")
                    
                    let dernierpaiement = listePaiement[listePaiement.length - 1]
                    console.log(dernierpaiement)

                    //formatage de la date en "YYYY-MM-DD"
                    const dateStr = `${dernierpaiement.datePaiement}`
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
                             
                    let sqlSelectAllPaiement2 =  "SELECT * FROM entreesArgent"

                    DB.query(sqlSelectAllPaiement2, (errAllPaiement2, resAllPaiement2) => {


                        if(errAllPaiement2){ 

                            console.log("*** erreur de sqlSelectAllPaiement2 *** " +  errAllPaiement2)  
                            res.status(400).json({errAllPaiement2})
                            
                            
                
                        }else{

                            let paiementEleve = resAllPaiement2.filter(element2 => element2.eleves_id === dernierpaiement.eleves_id)
                            
                            let listeMontantEleve = paiementEleve.map( element => element.montantPaye)
                          
                            console.log("******* listeMontantEleve ")
                            console.log(listeMontantEleve)

                            //calcule du montant total payé par l'élève
                            let  mergeMontantTotalEleve = listeMontantEleve.reduce( (acc, current) => {

                                console.log("***** mergeMontantTotalEleve")
                                console.log(acc + current)
                        
                                return acc + current



                            },0 )

                            console.log("****** mergeMontantTotalEleve ")
                            console.log(mergeMontantTotalEleve )

                            //////////////////////////////////////////////////////////////////////////////////////

                            //let elveEncour 
                            //récupération de tous les élèves
                            let sqlAllEleves = "SELECT * FROM eleves"

                            DB.query( sqlAllEleves, (errsqlAllEleves, ressqlAllEleves) => {


                                console.log("****** resultat de la requete  ressqlAllEleves")
                                console.log(ressqlAllEleves)

                                if(errsqlAllEleves){ 

                                    console.log("*** erreur de sqlAllEleves *** " +  sqlAllEleves)  
                                    res.status(400).json({sqlAllEleves})
                                    
                                    
                        
                                }else{

                                     //récupération des totaux de l'élève
                                    let elveEncour = ressqlAllEleves.find( eleveEncours =>  eleveEncours.id === idEleve)

                                    console.log("***** elveEncour ")
                                    console.log(elveEncour )


                            
                           

                                    //mise en correspondance des valeurs table eleves et typePaiement
                                    let scolariteTotale = elveEncour.scolariteTotale
                                    let tenueClasseTotale = elveEncour.tenueClasseTotale 
                                    let transportTotale = elveEncour.transportTotale
                                    let cantineTotale = elveEncour.cantineTotale

                                    if(typePaiement === "scolarite"){

                                       /* if(!elveEncour.scolariteTotale){

                                            scolariteTotale = parseInt(montantPaye)

                                            console.log("**** le if de !elveEncour.scolariteTotale")

                                       // }else{*/

                                            //console.log("**** le else de !elveEncour.scolariteTotale")
                                            
                                            scolariteTotale = elveEncour.scolariteTotale + parseInt(montantPaye)

                                       // }
                                        
                                        
                                    }

                                    if(typePaiement === "tenueClasse"){

                                        if(!elveEncour.tenueClasseTotale ){

                                            tenueClasseTotale =  parseInt(montantPaye)

                                        }else{

                                            tenueClasseTotale = elveEncour.tenueClasseTotale + parseInt(montantPaye)

                                        }
                                       
                                      
                                    }

                                    if(typePaiement === "transport"){ 

                                        if(!elveEncour.transportTotale ){

                                            transportTotale = parseInt(montantPaye)

                                        }else{

                                             transportTotale = elveEncour.transportTotale + parseInt(montantPaye)

                                        }

                                       
                                       
                                    }

                                    if(typePaiement === "cantine"){

                                        if(!elveEncour.cantineTotale ){ 

                                            cantineTotale = parseInt(montantPaye)

                                        }else{

                                              cantineTotale = elveEncour.cantineTotale + parseInt(montantPaye)

                                        }

                                      
                                      
                                    }


                                    
                                    console.log("**** elveEncour.scolariteTotale")
                                    console.log(elveEncour)

                                    //calcule de la scolarité total payé par l'élève
                                    console.log("**** scolariteTotale " + scolariteTotale)
                                    

                                    //calcule du montant total tenues de classe payé par l'élève
                                    console.log("**** tenueClasseTotale " + tenueClasseTotale)
                                



                                    //calcule du montant total du transport de classe payé par l'élève
                                    console.log("**** transportTotale " + transportTotale)
                                    


                                    //calcule du montant total du transport de classe payé par l'élève
                                    console.log("**** cantineTotale " + cantineTotale)
                                    


                                    /********************************** */

                                    //requete de mis à jour de l'élève
                                    let sqlSUpdateEleve = `UPDATE eleves SET  entreesArgent_id = ${ dernierpaiement.id }, scolariteTotale = ${ scolariteTotale  }, tenueClasseTotale = ${ tenueClasseTotale }, transportTotale = ${ transportTotale }, cantineTotale = ${ cantineTotale }, montantTotalEleve = ${mergeMontantTotalEleve}, dateDernierPaiement = "${ dateFormatee }"  WHERE id = ${ dernierpaiement.eleves_id } ;`   
                                
                                
                                    // let sqlSUpdateEleve = `UPDATE eleves SET  entreesArgent_id = ${ dernierpaiement.id },  montantTotalEleve = ${mergeMontantTotalEleve}, dateDernierPaiement = "${  dateFormatee}"  WHERE id = ${ dernierpaiement.eleves_id } ;`                    
        
                                    DB.query(  sqlSUpdateEleve, (errUpdateEleve, resUpdateEleve) => {
        
                                        console.log("****** resultat de la requete sqlSUpdateEleve")
                                        console.log(sqlSUpdateEleve)
        
                                        if(errUpdateEleve){ 
        
                                            console.log("*** erreur de sqlSUpdateEleve *** " +  errUpdateEleve)  
                                            res.status(400).json({errUpdateEleve})
                                            
                                            
                                
                                        }else{
        
                                            console.log("*** modification de l'élève effectuée avec succès*** ") 
                                            console.log(resUpdateEleve) 
                                        
        
 
                                     
 
                                        } 
        
                                    })






                                    /********************************** */
  
                                }

                            })
                            
                            //////////////////////////////////////////////////////////////////////////////////////

                            /*
                             //requete de mis à jour de l'élève
                            let sqlSUpdateEleve = `UPDATE eleves SET  entreesArgent_id = ${ dernierpaiement.id }, scolariteTotale = ${ scolariteTotale  }, tenueClasseTotale = ${ tenueClasseTotale }, transportTotale = ${ transportTotale }, cantineTotale = ${ cantineTotale }, montantTotalEleve = ${mergeMontantTotalEleve}, dateDernierPaiement = "${ dateFormatee }"  WHERE id = ${ dernierpaiement.eleves_id } ;`   
                           
                           
                           // let sqlSUpdateEleve = `UPDATE eleves SET  entreesArgent_id = ${ dernierpaiement.id },  montantTotalEleve = ${mergeMontantTotalEleve}, dateDernierPaiement = "${  dateFormatee}"  WHERE id = ${ dernierpaiement.eleves_id } ;`                    

                            DB.query(  sqlSUpdateEleve, (errUpdateEleve, resUpdateEleve) => {

                                console.log("****** resultat de la requete sqlSUpdateEleve")
                                console.log(sqlSUpdateEleve)

                                if(errUpdateEleve){ 
 
                                    console.log("*** erreur de sqlSUpdateEleve *** " +  errUpdateEleve)  
                                    res.status(400).json({errUpdateEleve})
                                    
                                    
                        
                                }else{

                                    console.log("*** modification de l'élève effectuée avec succès*** ") 
                                    console.log(resUpdateEleve) 


                                    

                                }

                            })

                            */
                            ////////////////////////////////////////
                        
                        
                        }


                    } )

                   

 
                }

            })
            
           
            console.log("*** paiement créer avec succès*** ") 
            res.status(200).json(resPaiement)
        }
        
    })
    


};

//GET récupération de toutes les entrées d'argent
exports.getAllEntrees = (req, res, next ) => {

    console.log("*** bienvenue dans getAllEntrees *** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    console.log(req.body)

    //récupération des données de la requete
    //let { idEleve, typePaiement, datePaiement,montantPaye } = req.body;

    //requete de récupération de tous les paiements
    let sqlSelectAllPaiement = "SELECT * FROM entreesArgent"

    DB.query( sqlSelectAllPaiement, (errPaiement, resPaiement) => {


        console.log("****** resultat de la requete sqlSelectAllPaiement")
        console.log(resPaiement)

        if(errPaiement){ 

            console.log("*** erreur de sqlSelectAllPaiement *** " +  errPaiement)  
            res.status(400).json({errPaiement})
            
            

        }else{ 

            console.log("*** paiement récupérés avec succès*** ") 
            res.status(200).json(resPaiement)

        }


    })


};



//GET  récupération d'une entrée d'argent
exports.getOneEntree = (req, res, next ) => {

    console.log("*** bienvenue dans getOneEntree *** " )
    console.log("***userId du token*** : " + req.auth.userId ) 

    console.log(req.body)

    let eleveCurrent
    let paiementCurrent

    

    //requete de récupération de tous les paiements
    let sqlSelectAllPaiement = "SELECT * FROM entreesArgent"

    //requete de récupération de tous les élèves
    let sqlSelectAllEleve = "SELECT * FROM eleves"


    let idPaiement = parseInt(req.params.id)
    console.log(" ***** idPaiement : " + idPaiement)

    DB.query( sqlSelectAllPaiement, (errPaiement, resPaiement) => {


        console.log("****** resultat de la requete sqlSelectAllPaiement")
        console.log(resPaiement)

        if(errPaiement){ 

            console.log("*** erreur de sqlSelectAllPaiement *** " +  errPaiement)  
            res.status(400).json({errPaiement})
            
            

        }else{

            const paiement = resPaiement.find( element => element.id == idPaiement)

            if(!paiement){
                res.status(404).json({message: "paiement non trouvé"})
                console.log("***paiement non trouvé*** " +  err)
            }else{
                console.log("****** paiement trouvé avec succès")
                console.log(paiement)
                res.status(200).json(paiement)

            }

        }
    })

    /*
    DB.query( sqlSelectAllPaiement, (errPaiement, resPaiement) => {


        console.log("****** resultat de la requete sqlSelectAllPaiement")
        console.log(resPaiement)

        if(errPaiement){ 

            console.log("*** erreur de sqlSelectAllPaiement *** " +  errPaiement)  
            res.status(400).json({errPaiement})
            
            

        }else{


            DB.query(sqlSelectAllEleve, (errAllEleve, resAllEleve) => {

                if(errAllEleve){ 
        
                    console.log("***erreur de sqlCreatePaiement*** " +  errAllEleve)  
                    res.status(400).json({errAllEleve})
                    
        
                }else{
        
                    eleveCurrent = resAllEleve.find( element => element.id === idEleve)
        
                    console.log("**** eleveCurrent ")
                    console.log(eleveCurrent)
        
                    //requete de mis à jour de entreesArgent_id l'élève
                    let sqlSUpdateEleve = `UPDATE eleves SET entreesArgent_id = ${ idPaiement }  WHERE id = ${idEleve} ;`                    
        
                    DB.query( sqlSUpdateEleve, (errUpdateEleve, resUpdateEleve) => {
        
                        console.log("****** resultat de la requete sqlSUpdateEleve")
                        console.log(sqlSUpdateEleve)
        
                        if(errUpdateEleve){ 
        
                            console.log("*** erreur de sqlSUpdateEleve *** " +  errUpdateEleve)  
                            res.status(400).json({errUpdateEleve})
                            
                            
                
                        }else{
        
                            console.log("*** modification de l'élève effectuée avec succès*** ") 
                            console.log(resUpdateEleve)
        
                        }
        
                    })
        
                }
        
        
        
            } )



            //////////////////////////////////::

            console.log("*** paiement récupérés avec succès*** ") 
            res.status(200).json(resPaiement)

        }


    })
    */

   

   


};


