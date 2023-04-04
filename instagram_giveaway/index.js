const fs = require('fs');
let totalArray = [];

for (let i = 0; i < 20; i++){
    let text = fs.readFileSync(`200k_words_100x100/out${i}.txt`, 'utf-8');
    let lines = text.split('\n').sort();
    totalArray.push(lines);
}

console.log(uniqueValues(totalArray));

function uniqueValues(arrays) {
    const uniqueWords = new Set();
    for (let i in totalArray){
        for (let j in totalArray[i]){
            uniqueWords.add(totalArray[i][j]);
        }
    }
    return uniqueWords.size;
}