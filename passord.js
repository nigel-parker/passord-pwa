// Password generator logic converted from Groovy

function getRandomConsonant() {
    return getRandom('bdfgjklmnprstv');
}

function getRandomVowel() {
    return getRandom('aeiou');
}

function getRandomConsonantPair() {
    const doubles = ['kr', 'gl', 'sv', 'kv', 'st', 'sp', 'sl', 'gr', 'pl', 'dr', 'tr', 'pr'];
    const random = Math.floor(Math.random() * doubles.length);
    return doubles[random];
}

function getRandom(candidates) {
    const random = Math.floor(Math.random() * candidates.length);
    return candidates[random];
}

function generatePiece1() {
    let result = '';
    result += getRandomConsonant().toUpperCase();
    result += getRandomVowel();
    result += getRandomConsonant();
    result += getRandomVowel();
    return result;
}

function generatePiece2() {
    let result = '';
    result += getRandomConsonantPair();
    result += getRandomVowel();
    result += getRandomConsonant();
    return result;
}

function generatePassword() {
    const piece1 = generatePiece1();
    const piece2 = generatePiece2();
    return `${piece1}${piece2}13---`;
}

function generateMultiple(count) {
    const passwords = [];
    for (let i = 0; i < count; i++) {
        passwords.push(generatePassword());
    }
    return passwords;
}
