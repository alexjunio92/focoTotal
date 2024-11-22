/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const moment = require('moment-timezone')
//const sql = require("msnodesqlv8");

const helper = require('./helper')
const ssml = require('./SsmlOutput.js')
const rb = require('./reminderBuilder.js')

function getInfo(selectedInfo) {
    let msg, say;
    return say ;
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        var speakOutput = `Olá! Bem vindo ao Foco Total! Seu gerenciador de tempo e foco. Em que posso ajudar?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Você pode solicitar pomodoro, lista de tarefas e respiração guiada`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Até mais!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Desculpe. Não tenho informações sobre isso. Tente de novo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Desculpe, houve algum problema com o que você pediu. Tente de novo.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GetInformationIntentHandler = 
{
    canHandle(handlerInput) 
    {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetInformationIntent';
    },
    async handle(handlerInput) 
    {
        var msg = "";
        var say = "uai";
        
        var info;
        var resolvedInfo;
        var infoSlot;
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        infoSlot = Alexa.getSlot(handlerInput.requestEnvelope, "info");
        info = infoSlot.value;
        
        resolvedInfo = helper.getResolvedWords(handlerInput, "info");
        
        if (resolvedInfo) {
            
            var selectedInfo = resolvedInfo[0].value.name
            selectedInfo = selectedInfo.toLowerCase()
            
            switch (selectedInfo) {
                case "foco":
                    const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient(),
                        { permissions } = handlerInput.requestEnvelope.context.System.user;
                        
                    if (!permissions){
                        return handlerInput.responseBuilder
                            .speak("Vá até o app Alexa mobile para liberar as permissões.")
                            .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
                            .getResponse()
                    }
                    
                    const currentDateTime = moment().tz('America/Sao_Paulo')
                    
                    let minuteObj = 25;
                    
                    const Pomo1start = rb.New(minuteObj, 'Fim do primeiro ciclo de foco. Descanse por 5 minutos.');
                    minuteObj+=5;
                    const Pomo1end = rb.New(minuteObj, 'Fim do primeiro descanso. Iniciando agora o segundo ciclo de foco.');
                    minuteObj+=25;
                    
                    const Pomo2start = rb.New(minuteObj, 'Fim do segundo ciclo de foco. Descanse por 5 minutos.');
                    minuteObj+=5;
                    const Pomo2end = rb.New(minuteObj, 'Fim do segundo descanso. Iniciando agora o terceiro ciclo de foco.');
                    minuteObj+=25;
                    
                    const Pomo3start = rb.New(minuteObj, 'Fim do terceiro ciclo de foco. Descanse por 5 minutos.');
                    minuteObj+=5;
                    const Pomo3end = rb.New(minuteObj, 'Fim do terceiro descanso. Iniciando agora o quarto e último ciclo de foco.');
                    minuteObj+=25;
                    
                    const Pomo4start = rb.New(minuteObj, 'Fim do quarto e último ciclo de foco. Descanse por 15 minutos.');
                    minuteObj+=15;
                    const Pomo4end = rb.New(minuteObj, 'Fim do quarto e último descanso. Se desejar criar um novo ciclo pomodoro, abra a Skill Foco total novamente e solicite um novo ciclo falando pomodoro');
                    
                    try{
                        await reminderApiClient.createReminder(Pomo1start);
                        await reminderApiClient.createReminder(Pomo1end);
                        await reminderApiClient.createReminder(Pomo2start);
                        await reminderApiClient.createReminder(Pomo2end);
                        await reminderApiClient.createReminder(Pomo3start);
                        await reminderApiClient.createReminder(Pomo3end);
                        await reminderApiClient.createReminder(Pomo4start);
                        await reminderApiClient.createReminder(Pomo4end);
                    }catch(error){
                        console.log(`~~~Erro: ${error}`);
                        return handlerInput.responseBuilder.speak(`Ocorreu um erro ao criar um novo ciclo pomodoro. Por favor tente mais tarde. ${error.toString()}`)
                    }
                    
                    const speakOutput = `Ciclo pomodoro criado com sucesso.`;
                    return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .getResponse();
                case "tarefa":
                    say = 'Você não tem tarefas salvas. Deseja incluir uma nova tarefa?'
                    break;
                
                case "respiração":
                    say = `Vamos fazer um exercíciode respiração. Puxe o ar e segure. . . . . . . . . . Solte o ar.............. Mais uma vez. Respire . . . . . . . Segure o ar. . .  Solte o ar. . . . .  Pronto. Melhor? `
                    break;
                
                default:
                    say = `Ainda não tenho informações sobre esse tema (${selectedInfo}). Como posso ajudar?`;
            }
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        }
        else {
            say = 'Ainda não tenho informações sobre esse tema. Como posso ajudar?';
        }
        
        return handlerInput.responseBuilder
                                    .speak(say)
                                    .reprompt(say)
                                    .getResponse();
    }
};

const CreateReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    async handle(handlerInput) {
        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient(),
        { permissions } = handlerInput.requestEnvelope.context.System.user;
        
        if (!permissions){
            return handlerInput.responseBuilder
                .speak("Vá até o app Alexa mobile para liberar as permissões.")
                .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
                .getResponse()
        }
        
        const currentDateTime = moment().tz('America/Sao_Paulo')
        
        let minuteObj = 25;
        
        const Pomo1start = rb.New(minuteObj, 'Fim do primeiro ciclo de foco. Descanse por 5 minutos.');
        minuteObj+=5;
        const Pomo1end = rb.New(minuteObj, 'Fim do primeiro descanso. Iniciando agora o segundo ciclo de foco.');
        minuteObj+=25;
        
        const Pomo2start = rb.New(minuteObj, 'Fim do segundo ciclo de foco. Descanse por 5 minutos.');
        minuteObj+=5;
        const Pomo2end = rb.New(minuteObj, 'Fim do segundo descanso. Iniciando agora o terceiro ciclo de foco.');
        minuteObj+=25;
        
        const Pomo3start = rb.New(minuteObj, 'Fim do terceiro ciclo de foco. Descanse por 5 minutos.');
        minuteObj+=5;
        const Pomo3end = rb.New(minuteObj, 'Fim do terceiro descanso. Iniciando agora o quarto e último ciclo de foco.');
        minuteObj+=25;
        
        const Pomo4start = rb.New(minuteObj, 'Fim do quarto e último ciclo de foco. Descanse por 15 minutos.');
        minuteObj+=15;
        const Pomo4end = rb.New(minuteObj, 'Fim do quarto e último descanso. Se desejar criar um novo ciclo pomodoro, abra a Skill Foco total novamente e solicite um novo ciclo falando pomodoro');
        
        try{
            await reminderApiClient.createReminder(Pomo1start);
            await reminderApiClient.createReminder(Pomo1end);
            await reminderApiClient.createReminder(Pomo2start);
            await reminderApiClient.createReminder(Pomo2end);
            await reminderApiClient.createReminder(Pomo3start);
            await reminderApiClient.createReminder(Pomo3end);
            await reminderApiClient.createReminder(Pomo4start);
            await reminderApiClient.createReminder(Pomo4end);
        }catch(error){
            console.log(`~~~Erro: ${error}`);
            return handlerInput.responseBuilder.speak(`Ocorreu um erro ao criar um novo ciclo pomodoro. Por favor tente mais tarde. ${error.toString()}`)
        }
        
        const speakOutput = `Ciclo pomodoro criado com sucesso.`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
    }
};


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CreateReminderIntentHandler,
        GetInformationIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();