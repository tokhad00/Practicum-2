exports.loadData = function (word) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://wordsapiv1.p.rapidapi.com/words/${word}`, true);
      xhr.setRequestHeader('x-rapidapi-host', 'wordsapiv1.p.rapidapi.com');
      xhr.setRequestHeader('x-rapidapi-key', '68800a87e3msh462013bf794c783p18ad28jsnb91389f4bf6d');
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      }
      xhr.onerror = () => reject('Ошибка!');
      xhr.send(null);
    });
}