const ex = require("express");
const router = ex.Router();
const { registerValidation, loginValidation } = require("../validation");
const query_enum = require("../db/queryselectorEnum");
const queryMachine = require("../db/queryMachine");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

/* this will handle the login, register and logout routes
for our site. It will also handle issuing JWT
*/

// the result of a query to our DB
let finalres;
// refresh tokens are in charge of deciding wether the data tokens should be refreshed
let refreshTokens = [];

// refreshes tokens
router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) res.sendStatus(403);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(payload);
    res.Status(200).json({ accessToken, success:true, message:"token refershed" });
  });
});

// register new user
router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const salt = bcrypt.genSaltSync(10);
  req.body.pword = bcrypt.hashSync(req.body.pword, salt);
  finalres = await queryMachine(query_enum.REGISTER_QUERY, req.body);
  if (finalres.success) {
    const user = {
      user_id: finalres.results.insertId,
      isadmin: false,
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET);
    refreshTokens.push(refreshToken);
    res.json({
      accessToken,
      refreshToken,
      message: "registered succesfully",
      success: true,
      user,
    });
  } else res.send(finalres);
});

// login existing user
router.post("/login", async (req, res) => {
  // validate login
  const { error } = loginValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false });
  // if data is valid, request a log-in
  finalres = await queryMachine(query_enum.LOGIN_QUERY, req.body);
  if (finalres && finalres.results && finalres.results[0]) {
    if (bcrypt.compareSync(req.body.pword, finalres.results[0].pword)) {
      // if the login info is correct, create a token
      const user = {
        fname: finalres.results[0].fname,
        lname: finalres.results[0].lname,
        user_id: finalres.results[0].user_id,
        // here we use the isAdmin field retutned from the DB, because a admin may be logging in
        isadmin: !!finalres.results[0].isadmin,
      };
      //  generate a expiring token that we will auth routes against, and a refresh one that wil only determine
      // wether to refresh the access token
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET);
      refreshTokens.push(refreshToken);
      res.json({
        accessToken,
        refreshToken,
        message: "logged in succesfully",
        success: true,
        user,
      });
    } else
      res
        .status(401)
        .json({
          message: "password or username did not match",
          success: false,
        });
  } else
    res
      .status(401)
      .json({ message: "password or username did not match", success: false });
});

// logout user
router.delete("/logout", async (req, res) => {
  // on logout, remove the refresh token from the list, and the active token will quickly expire
  finalres = await queryMachine(query_enum.LOGOUT, req.body.uname);
  if (finalres.results) {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.Status(204).json({success:true, message:"logged out"});
  }
});

// helper function that issues a expiring token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}
module.exports = router;
