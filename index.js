// index.js
var FinnishDictionary=require('./finnish-dictionary.js');

const dictionary = new FinnishDictionary('https://botudien.pythonanywhere.com/api/nrand/5');
dictionary.getWords()
  .then(data => console.log(data))
  .catch(error => console.error(error));