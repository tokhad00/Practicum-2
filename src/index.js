const analyzeButton = document.getElementById('analyze-button');
const filenameField = document.getElementById('filename-field');
const usertextField = document.getElementById('usertext-field');

let selectedWordId = 0;

usertextField.addEventListener('input', function() {
    filenameField.value = '';
});

analyzeButton.addEventListener('click', function() {
  const filename = filenameField.files[0];
  const usertext = usertextField.value;

  if ((!filename) && (usertext !== '')) {
    processText(usertext);
  }

  if ((filename) && (usertext === '')) {
    const reader = new FileReader();
    reader.onload = () => {
        processText(reader.result);
    }
    reader.readAsText(filename);
  }

  if ((!filename) && (usertext === '')) {
    alert("Необходимо заполнить одно из полей!");
  }

  if ((filename) && (usertext !== '')) {
    alert("Необходимо заполнить только одно поле!");
  }
});

/**
 * @description Очищает исходный текст от знаков препинания и иных небуквенных символов
 * @param {Array} words Массив слов без знаков препинания, полученный из исходного текста
 */
function processText(result) {
  const arrayOfWords = result.replace(/[^a-zA-Z ]+/g, ' ').replace('/ {2,}/',' ').split(' ');
  renderWords(arrayOfWords);
}

/**
 * @description Меняет в тексте ранее выбранное пользователем слово при нажатии на кнопку синонима или антонима
 * @param {string} word Слово, которым необходимо заменить в тексте ранее выбранное
 */
function changeSelectedWord(word) {
    const wordSpans = document.getElementsByClassName('word-from-text');
    Array.from(wordSpans).forEach((span) => {
        if (span.getAttribute('data-id') === selectedWordId) {
            span.innerHTML = word;
        }
    });
}

/**
 * @description Содержит в себе вызовы функций для получения данных с внешнего API
 * @param {string} word Слово, подлежащее анализу
 * @async
 */
async function getInfoAboutWord(word) {
    const wordInfo = await loadData(word);
    if (wordInfo.success !== false) {
        console.log(wordInfo);
        const examplesInfo = await loadData(`${word}/examples`);
        const antonymsInfo = await loadData(`${word}/antonyms`);
        const categoryInfo = await loadData(`${word}/inCategory`);
        const similarInfo = await loadData(`${word}/similarTo`);
        const substanceInfo = await loadData(`${word}/substanceOf`);
        renderTranscription(wordInfo);
        renderListOfDefinitions(wordInfo);
        renderExamples(examplesInfo);
        renderAntonyms(antonymsInfo);
        renderCategories(categoryInfo);
        renderSimilars(similarInfo);
        renderSubstances(substanceInfo);
    } else {
       alert('Совпадений не найдено!');
    }
}

/**
 * @description Выводит на страницу транскрипцию слова
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderTranscription(array) {
    const transcriptionParagraph = document.getElementById('analyzed-word-transcription');
    transcriptionParagraph.innerHTML = array.pronunciation.all;
}

/**
 * @description Выводит на страницу список антонимов к слову, если таковые найдены
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderAntonyms(array) {
    const antonymsContainer = document.getElementById('antonyms-container');
    antonymsContainer.innerHTML = '<h2 class="title-of-part">Антонимы</h2>';

    if (array.antonyms.length === 0) {
        antonymsContainer.innerHTML = 'Антонимов не найдено!';
    } else for (i = 0; i < array.antonyms.length; i++) {
        antonymsContainer.insertAdjacentHTML('beforeend', `<button class="btn btn-primary antonym-button">${array.antonyms[i]}</button>`);
    }

    const antonymButtons = document.getElementsByClassName('antonym-button');
    Array.from(antonymButtons).forEach((button) => {
        button.addEventListener('click', function() {
            const word = this.innerText;
            const analyzedWordParagraph = document.getElementById('analyzed-word');
            analyzedWordParagraph.innerHTML = word;
            changeSelectedWord(word);
            getInfoAboutWord(word);
        });
    });
}

/**
 * @description Выводит на страницу список примеров использования слова, если таковые найдены
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderExamples(array) {
    const examplesContainer = document.getElementById('examples-container');
    examplesContainer.innerHTML = '<h2 class="title-of-part">Примеры использования слова</h2>';

    if (array.examples.length === 0) {
        examplesContainer.innerHTML = 'Примеров не найдено!';
    } else for (i = 0; i < array.examples.length; i++) {
        examplesContainer.insertAdjacentHTML('beforeend', `<p class="example-parag">${array.examples[i]}</p>`);
    }
}

/**
 * @description Выводит на страницу список Category Of, если таковой найден
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderCategories(array) {
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = '';

    if (array.inCategory.length === 0) {
        categoriesContainer.insertAdjacentHTML('beforeend', '<p>Не найдено!</p>');
    } else for (i = 0; i < array.inCategory.length; i++) {
        categoriesContainer.insertAdjacentHTML('beforeend', `<p class="category-parag">${array.inCategory[i]}</p>`);
    }
}

/**
 * @description Выводит на страницу список Similar To, если таковой найден
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderSimilars(array) {
    const similarsContainer = document.getElementById('similars-container');
    similarsContainer.innerHTML = '';

    if (array.similarTo.length === 0) {
        similarsContainer.insertAdjacentHTML('beforeend', '<p>Не найдено!</p>');
    } else for (i = 0; i < array.similarTo.length; i++) {
        similarsContainer.insertAdjacentHTML('beforeend', `<p class="category-parag">${array.similarTo[i]}</p>`);
    }
}

/**
 * @description Выводит на страницу список Substance Of, если таковой найден
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderSubstances(array) {
    const substancesContainer = document.getElementById('substances-container');
    substancesContainer.innerHTML = '';

    if (array.substanceOf.length === 0) {
        substancesContainer.insertAdjacentHTML('beforeend', '<p>Не найдено!</p>');
    } else for (i = 0; i < array.substanceOf.length; i++) {
        substancesContainer.insertAdjacentHTML('beforeend', `<p class="category-parag">${array.substanceOf[i]}</p>`);
    }
}

/**
 * @description Выводит на страницу блоки, в которых содержатся значения слов, части речи и список синонимов
 * @param {Object} array Объект, полученный в результате запроса
 */
function renderListOfDefinitions(array) {
    const wordAnalyzeContainer = document.getElementById('features');
    wordAnalyzeContainer.style.visibility = 'visible';

    const definitionsContainer = document.getElementById('definitions-container');
    definitionsContainer.innerHTML = '';
        const synonymsArray = [];
    
        for (i = 0; i < array.results.length; i++) {
            definitionsContainer.insertAdjacentHTML('beforeend', `
                <div class="definition-card">
                    <div class="light-box box-hover">
                        <h2><i class="fa fa-comment"></i><span>${array.results[i].definition}</span></h2>
                        <p>Часть речи: ${array.results[i].partOfSpeech}</p>
                        <div class="synonyms-container"></div>
                    </div>
                </div>`);
            synonymsArray.push(array.results[i].synonyms);
        }
    
        const synonymsContainers = document.getElementsByClassName('synonyms-container');
        const synonymsContainersArray = Array.from(synonymsContainers);
        for (j = 0; j < synonymsContainersArray.length; j++) {
            if (synonymsArray[j] === undefined) {
                synonymsContainersArray[j].innerHTML = 'Синонимов не найдено!';
            } else {
                synonymsContainersArray[j].innerHTML = '<h2>Синонимы</h2>';
                for (k = 0; k < synonymsArray[j].length; k++) {
                    synonymsContainersArray[j].insertAdjacentHTML('beforeend', `
                        <button class="btn btn-primary synonym-button">${synonymsArray[j][k]}</button>`);
                }
            } 
        }
    
        const synonymButtons = document.getElementsByClassName('synonym-button');
        Array.from(synonymButtons).forEach((button) => {
            button.addEventListener('click', function() {
                const word = this.innerText;
                const analyzedWordParagraph = document.getElementById('analyzed-word');
                analyzedWordParagraph.innerHTML = word;
                changeSelectedWord(word);
                getInfoAboutWord(word);
            });
        });
}

/**
 * @description Выводит на страницу блоки с словами и устанавливает на них обработчики кликов
 * @param {Array} words Массив слов без знаков препинания, полученный из исходного текста
 */
function renderWords(words) {
    const wordsContainer = document.getElementById('words-container');
    wordsContainer.innerHTML = '';
    words.forEach((word, index) => {
        wordsContainer.insertAdjacentHTML('beforeend', `<span class="word-from-text" data-id="${index}">${word}</span><span> </span>`);
    });

    const wordSpans = document.getElementsByClassName('word-from-text');
    Array.from(wordSpans).forEach((span) => {
        span.addEventListener('click', function() {
            this.classList.toggle('red-text');
            selectedWordId = this.getAttribute('data-id');
            const word = this.innerText;
            const analyzedWordParagraph = document.getElementById('analyzed-word');
            analyzedWordParagraph.innerHTML = word;
            getInfoAboutWord(word);
        });
    });
}

/**
 * @description Содержит в себе генератор промисов для загрузки данных с внешнего API
 * @param {string} word Часть URL, по которому нужно сделать запрос
 * @returns {Object} Объект с результатами запроса
 */
function loadData(word) {
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