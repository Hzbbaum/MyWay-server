const queryEnum = require('./queryselectorEnum');

// this just returns a pre formatted query, depending on input
const queriesSyntaxGetter = (querySelector) =>{
    
    switch (querySelector) {
        case queryEnum.REGISTER_QUERY:
            return "INSERT INTO users SET ?";
        case queryEnum.LOGIN_QUERY:
            return "SELECT  user_id, pword, isadmin, fname, lname FROM users WHERE uname  = ?";
        case queryEnum.LOGOUT_BY_USER_ID:
            return "SELECT * FROM USERS WHERE user_id = ?"
        case queryEnum.GET_VACATIONS_BY_USER_ID:
            return "SELECT vacations.vacation_id, vacations.destination, vacations.description, vacations.price_usd, vacations.pic, DATE_FORMAT(vacations.sdate, '%d/%m/%Y') as sdate, DATE_FORMAT(vacations.edate, '%d/%m/%Y') as edate, followers.follow FROM vacations LEFT JOIN followers ON followers.vacation_id = vacations.vacation_id and followers.user_id =? ORDER BY followers.follow DESC, sdate ASC";
        case queryEnum.FOLLOW_VACATION_BY_USER_ID:
            return "CALL FOLLOW_VACATION(?,?);";
        case queryEnum.GET_ALL_VACATIONS:
            return "SELECT vacations.*, SUM(followers.follow) AS followers_num FROM vacations LEFT JOIN followers ON followers.vacation_id = vacations.vacation_id GROUP BY vacations.vacation_id";
        case queryEnum.DELETE_VACATIONS_BY_ID:
            return "DELETE FROM vacations WHERE ?";
        case queryEnum.UPDATE_VACATION_BY_ID:
            return "UPDATE vacations SET ? where vacation_id = ?";
        case queryEnum.CREATE_VACATION:
            return "INSERT INTO vacations SET ?";
        default:
            return new Error(`${this} could not find a query of the type ${querySelector}`);
    }

};

module.exports = queriesSyntaxGetter;