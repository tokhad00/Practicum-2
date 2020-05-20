const f = require('../src/loadData');

test('shows that function returns object with results of analysis', async () => {
    const value = await f.loadData('London');
    expect(value).toStrictEqual({"frequency": 4.7, "pronunciation": {"all": "'ləndən"}, "results": [{"definition": "United States writer of novels based on experiences in the Klondike gold rush (1876-1916)", "instanceOf": ["writer", "author"], "partOfSpeech": "noun", "synonyms": ["jack london", "john griffith chaney"]}, {"definition": "the capital and largest city of England; located on the Thames in southeastern England; financial and industrial and cultural center", "derivation": ["londoner"], "hasMembers": ["londoner"], "hasParts": ["bloomsbury", "city of london", "city of westminster", "fleet street", "greenwich", "harley street", "lombard street", "whitehall", "big ben", "wimbledon", "newgate", "old bailey", "pall mall", "soho", "the city", "tower of london", "trafalgar square", "wembley", "west end", "westminster"], "instanceOf": ["national capital"], "partOf": ["england"], "partOfSpeech": "noun", "synonyms": ["british capital", "capital of the united kingdom", "greater london"]}], "syllables": {"count": 2, "list": ["lon", "don"]}, "word": "london"});
});

test('shows that function returns object with antonyms', async () => {
    const value = await f.loadData('little/antonyms');
    expect(value).toStrictEqual({"antonyms": ["much", "big"], "word": "little"});
});

test('shows that function returns object with error message if the word doesn`t exist', async () => {
    const value = await f.loadData('qwer');
    expect(value).toStrictEqual({"message": "word not found", "success": false});
});