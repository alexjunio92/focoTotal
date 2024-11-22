function getWhisperOutput(mensagem){
    return mensagem
}

function replaceWordInMessage(message, keyWord) {
  // Usando expressões regulares para substituir todas as ocorrências da palavra na mensagem
  var replacedMessage = message.replace(/\(keyWordEnglish\)/g, `<lang xml:lang='en-US'>${keyWord}</lang>`);

  // Adicionando as tags <speak> às extremidades da mensagem
  var finalOutput = `<speak>${replacedMessage}</speak>`;

  return finalOutput;
}

module.exports = {
      getWhisperOutput,
      replaceWordInMessage
}