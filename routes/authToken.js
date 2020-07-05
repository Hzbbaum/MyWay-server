const jwt = require ('jsonwebtoken');
require ('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // expected req header is authorization: bearer token
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({success:false, message:"token is null"});
  
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({success:false, message:err});
        }   
        req.body.user_id = payload.user_id;
        next()
    })
}

// same, but we need to make sure we get admin permission
function authenticateTokenAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    // expected req header is authorization: bearer token
    const token = authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({success:false, message:"token is null"});
  
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({success:false, message:err});
        }
        if (!payload.isadmin) res.status(401).json({success:false , message:"you are not an admin"});
        req.body.user_id = payload.user_id;
        req.body.isadmin = payload.isadmin;
        next()
    })
}

module.exports.aut = authenticateToken;
module.exports.autad = authenticateTokenAdmin;