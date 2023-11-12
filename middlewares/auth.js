const jwt = require("jsonwebtoken")


module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            console.log(token)
            res.status(401).json({message: "absence du token"})
        }
        console.log("présence du token")///
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); 
        const userId = decodedToken.userId; //userId du token
        req.auth = {  //insersion de l'objet userId du token dans la requete
            userId: userId
        };
        next();
    } 
    catch(error) { 
         res.status(401).json( { error })
    } 
}; 