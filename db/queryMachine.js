const mysql = require('mysql');
const queryGetter = require('./queryGenerator');
const queryEnum = require('./queryselectorEnum');
require ('dotenv').config();

/**
 * recieve the query type and data for query, and send to 
 * DB. 
 * @param {queryselectorENUM} querySelector  - the query type
 * @param {object} payload - the data need for the query
 * @returns {object} the return will include a message: string, success:boolean, and a 
 * results or error object, appropriately
 */
async function DBquery(querySelector, payload){
    
    // DB SETUP using .env file
    const connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PWORD,
        database : process.env.DB_NAME,
        dateStrings: "true"
    });

    // variables
    let _payload;
    
    // formats the payload by query type
    switch (querySelector) {
        case queryEnum.REGISTER_QUERY:{
            _payload = { uname:payload.uname, lname:payload.lname, fname:payload.fname, pword:payload.pword};
            console.log(_payload);
            break;
        }
        case queryEnum.LOGIN_QUERY:{
            _payload = payload.uname;
            break;
        }
        case queryEnum.LOGOUT_BY_USER_ID:{
            _payload = {user_id:payload.user_id};
            break;
        }
        case queryEnum.GET_VACATIONS_BY_USER_ID:{
            _payload = payload.user_id;
            break;
        }
        case queryEnum.FOLLOW_VACATION_BY_USER_ID:{
            _payload = [payload.user_id, payload.vacation_id];
            break;
        }
        case queryEnum.GET_ALL_VACATIONS:{
            _payload = {};
            break;
        }
        case queryEnum.DELETE_VACATIONS_BY_ID:{
            _payload = {vacation_id:payload.vacation_id};
            break;
        }
        case queryEnum.CREATE_VACATION:{
            delete payload.user_id;
            delete payload.isadmin;
            _payload = payload;
            break;
        }
        case queryEnum.UPDATE_VACATION_BY_ID:{
            const info = {
                destination:payload.destination,
                description:payload.description,
                pic:payload.pic,
                sdate:payload.sdate,
                edate:payload.edate,
                price_usd:payload.price_usd
            }
            _payload = [info, payload.vacation_id];
            break;
        }
        default:
            return new Error("how did you get here "+querySelector);
    }

    // gets the query, without the data filled in
    let q = queryGetter(querySelector);

    // wrapping the query in a try-catch
    try {
        results = await asyncQuery (q, _payload, connection);
        return results;
    } catch (error) {
        return error;
    } finally{
        connection.end();
    }

}
module.exports = DBquery;

/**
 * async DB request
 * @param {*} q - query template
 * @param {*} payload - formatted data for query
 * @param {*} connection 
 * @returns same as main function
 */
function asyncQuery(q, payload, connection){

    // these will be the base return message for the query
    const success = {message:"query executed succesfully", success:true}
    const failure = {message:"could not execute query", success:false};

    return new Promise((resolve, reject) => {
        // most queries require a payload
        if (payload){
            connection.query( q, payload,  (error, _results)=>{ 
                // error handling and promise rejecting
                if (error){
                    // append the error to our basic fail result
                    failure.error = error;
                    reject(failure);
                } else {
                    // append the results to our basic success result
                    success.results = _results;
                    resolve (success);
                }
            })} else {
                
            // but not all require a payload, otherwise identical to above
            connection.query( q,  (error, _results)=>{ 
                if (error){
                    failure.error = error;
                    reject(failure);
                } else {
                    success.results= _results;
                    resolve (success);
                }
            })  
        }   

    })
}
