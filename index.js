var FinnishDictionary=require('finnish-dictionary');

const dictionary = new FinnishDictionary('https://sanakirja.pythonanywhere.com/api/nrand/5');
dictionary.getWords()
  .then(data => console.log(data))
  .catch(error => console.error(error));