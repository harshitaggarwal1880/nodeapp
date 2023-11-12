//importation du package mysql
const mysql   = require('mysql');
const express = require('express'); 


/***************************************** */
let sqlTableUser = `CREATE TABLE User (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  pseudo VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE
  
)`


const DB = mysql.createConnection({ 
  host     : process.env.DB_HOST,  
  user     : process.env.DB_USERNAME,   
  password :  process.env.DB_PASSWORD,  
  database : process.env.DB_DATABASE,
}); 
 
//connexion à la base de données

DB.connect(function(err) {
  if(err) {
    throw err
  };

  // DB.query(`SHOW TABLES`, (err, res) => {
    // if(err){
      // throw err
    // }
    console.log('------------connexion à la base lessurdoues réussie----------');
    //console.log(res);
  // })
  

})



module.exports = DB;  