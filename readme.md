# Overview

This is the overview for the endpoints of the **MyWay** API.

## Table of Contents

1. [Endpoints](#endpoints)
   - [Auth routes](#auth-routes)
   - [Vacation routes](#vacation-routes)
2. [About](#about)

## Endpoints
All succesful requests adhere to the following format:
````
{
   success:true,
   message:"some message"
}
````
Any and all fields in the table below are in addition to the above.
Similarly, all errors adhere to 
````
{
   success:false,
   message:"some message"
}
````

Any route with access set to 'user' or 'admin' must have an authurazation token added to the header. These tokens must be refreshed periodically.

### Auth Routes

|Endpoint|Method|Body|Queries|Access|Response|
|--------|------|----|-------|------|--------|
|/register|Post|`{ user }`|none|any|`{ accesstoken, refreshtoken, user }` - password scrubbed|
|/login|Post|`{ uname, pword }`|none|any|`{ user }` - password scrubbed|
|/logout|Delete|`{ uname }`|none|any|`{ user }` - password scrubbed|
|/token|Post|`{ token }`|none|user|`{ user }` - password scrubbed|


### Vacation Routes

|Endpoint|Method|Body|Queries|Access|Response|
|--------|------|----|-------|------|--------|
|/|Get|`{ user_id }`|none|user|`{ finalres }`|
|/follow|Post|`{ user_id, vacation_id, pword }`|none|user|`{ finalres }`|
|/adminget|Get|none|none|admin|`{ finalres }`|
|/|Put|`{ vacation }`|none|admin|`{ finalres }`|
|/|Post|`{ vacation }` - no vaction_id|none|admin|`{ finalres }`|
|/|Delete|` { vacation }`|none|admin|
`
## About

This endpoint was created by Hillel Buchsbaum. Feel free to ask me for more details, or for any suggestions for improvement!