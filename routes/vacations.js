const ex =require("express");
const router = ex.Router();
const query_enum = require('../db/queryselectorEnum');
const queryMachine = require('../db/queryMachine');
const {aut, autad} = require('./authToken');

let finalres =[];

/* this handles the data routes - getting the flight lists, updating flights, and handles the followers*/

// get flight list
router.get("/", aut, async (req, res)=>{
    finalres = await queryMachine(query_enum.GET_VACATIONS_BY_USER_ID, req.body);
    res.json({"success":true, message:`succesfuly got vacations for ${req.body.user_id}`, finalres});
});

// toggle following a flight
router.post("/follow", aut, async(req,res)=>{
    finalres = await queryMachine(query_enum.FOLLOW_VACATION_BY_USER_ID, req.body);
    res.json({"success":true, message:`successfully toggled vacation ${req.body.vacation_id} follow for user ${req.body.user_id} `, finalres});
});

// protected route for getting complete list with aggregate follows
router.get("/adminGet", autad, async (req, res) => {
    finalres = await queryMachine(query_enum.GET_ALL_VACATIONS);
    res.json({"success":true, message:`succesfuly got all vacations`, finalres});
})

// protected route for updating flights
router.put("/", autad, async(req, res)=>{
    finalres =  await queryMachine(query_enum.UPDATE_VACATION_BY_ID, req.body);
    res.json({success:true, message:`succesfuly updated ${req.body.vacation_id}`, finalres});
})

// protected route for adding flights
router.post("/", autad, async(req, res)=>{
    finalres =  await queryMachine(query_enum.CREATE_VACATION, req.body);
    res.json({success:true, message:`vacation succesfully created`, finalres});
    
})

// protected route for deleting flights
router.delete("/", async(req, res)=>{
    finalres = await queryMachine(query_enum.DELETE_VACATIONS_BY_ID, req.body);
    res.send({success:true, message:`succesfully deletd vacation ${req.body.vacation.vacation_id}`, finalres});
})

module.exports = router; 