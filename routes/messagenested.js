router.post("/", (request, response, next) => {
    //validate on empty parameters
    if (!request.body.chatId || !request.body.message) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.body.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
            //validate chat id exists
        let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
        let values = [request.body.chatId]

        pool.query(query, values)
            .then(result => {
                if (result.rowCount == 0) {
                    response.status(404).send({
                        message: "Chat ID not found"
                    })
                } else {
                    //validate memberid exists in the chat
                    let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
                    let values = [request.body.chatId, request.decoded.memberid]
                
                    pool.query(query, values)
                        .then(result => {
                            if (result.rowCount > 0) {
                                //add the message to the database
                                let insert = `INSERT INTO Messages(ChatId, Message, MemberId)
                                    VALUES($1, $2, $3) 
                                    RETURNING PrimaryKey AS MessageId, ChatId, Message, MemberId AS email, TimeStamp`
                                let values = [request.body.chatId, request.body.message, request.decoded.memberid]
                                pool.query(insert, values)
                                .then(result => {
                                    if (result.rowCount == 1) {
                                        //insertion success. Attach the message to the Response obj
                                        response.message = result.rows[0]
                                        response.message.email = request.decoded.email
                                        //Pass on to next to push
                                        // send a notification of this message to ALL members with registered tokens
                                        let query = `SELECT token FROM Push_Token
                                            INNER JOIN ChatMembers ON
                                            Push_Token.memberid=ChatMembers.memberid
                                            WHERE ChatMembers.chatId=$1`
                                        let values = [request.body.chatId]
                                        pool.query(query, values)
                                        .then(result => {
                                            console.log(request.decoded.email)
                                            console.log(request.body.message)
                                            result.rows.forEach(entry => 
                                                msg_functions.sendMessageToIndividual(
                                                    entry.token, 
                                                    response.message))
                                            response.send({
                                                success:true
                                            })
                                        }).catch(err => {

                                            response.status(400).send({
                                                message: "SQL Error on select from push token",
                                                error: err
                                            })
                                        })
                                    } else {
                                        response.status(400).send({
                                            "message": "unknown error"
                                        })
                                    }

                                    }).catch(err => {
                                        response.status(400).send({
                                        message: "SQL Error on insert",
                                        error: err
                                    })
                                })
                            } else {
                                response.status(400).send({
                                    message: "user not in chat"
                                })
                            }
                        }).catch(error => {
                            response.status(400).send({
                                message: "SQL Error on memeber in chat check",
                                error: error
                            })
                        })
                }
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error on chatid check",
                    error: error
                })
            })
        }
})