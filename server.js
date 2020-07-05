const ex= require ("express");
const path = require('path');
const app = ex();
const cors = require('cors')
const port = 3000;

// IMPORT ROUTES
const authRoute= require("./routes/auth");
const vacationsRoute= require("./routes/vacations");

// MIDDLEWARE
app.use(ex.json())
app.use(cors())
app.use(ex.static(path.join(__dirname, 'build')))


// ROUTE MIDDLEWARE
app.use("/auth", authRoute);
app.use("/vacations", vacationsRoute)

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

app.listen(port, ()=>console.log(`listening on ${port}`));