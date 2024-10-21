const jwt = require("jsonwebtoken");

const middlewareController = {

    //verifyToken
    verifyToken: (req, res) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
                if(err){
                    res.status(403).json("TOken is not valid");
                }
                req.user = user;
                next();
            });
        }
        else{
            res.status(401).json("You are not authenticator");
        }
    },

    verifyTokenAndAdminAuth: (req, res) =>{
        this.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.admin) {
                next();
            }
            else{
                res.status(403).json("You aren't allowed to delete");
            }
        });
    },

    
}

module.exports = middlewareController;