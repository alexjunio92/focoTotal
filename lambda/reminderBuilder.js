function New (minutes, textMessage){
    const secondsOffset = (minutes * 60).toString();
    const reminderObj = {
           trigger: {
                type : "SCHEDULED_RELATIVE",
                offsetInSeconds : secondsOffset
           },
           alertInfo: {
                spokenInfo: {
                    content: [{
                        locale: "pt-BR",
                        text: textMessage
                        //,"ssml": "<speak> walk the dog</speak>"
                    }]
                }
            },
            pushNotification : {                            
                 status : "ENABLED"         
            }
        }
    return reminderObj
}

module.exports = {
      New
}