const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function wordSort(array){
    return array.sort();
}

function numberSort(array){
    return array.sort(function(a, b){return a - b});
}

function reverseSort(array){
    return array.sort(function(a, b){return b - a});
}

function lengthSort(array){
    return array.sort(function(a, b){return a.length - b.length});
}
function uniqueFilter(array){
    return Array.from(new Set(array));
}

function askQuestions() {
    rl.question('Enter words/numbers, separated by SPACE: ', (answer) => {
        if (answer === 'exit') //we need some base case, for recursion
            return rl.close();
        const inputArr = answer.split(" ");
        rl.question('Choose function:' +
            '\n1. Words by alphabet.' +
            '\n2. Numbers from the smallest.' +
            '\n3. Numbers from the biggest.' +
            '\n4. Words by length.' +
            '\n5. Unique words.\n', (answer) => {
            switch (answer){
                case 'exit':
                    return rl.close();
                case '1':
                    console.log(wordSort(inputArr));
                    break;
                case '2':
                    console.log(numberSort(inputArr));
                    break;
                case '3':
                    console.log(reverseSort(inputArr));
                    break;
                case '4':
                    console.log(lengthSort(inputArr));
                    break;
                case '5':
                    console.log(uniqueFilter(inputArr));
                    break;
                default:
                    console.log('I DON`T KNOW!')
            }

            //console.log(inputArr);
            askQuestions();
        });
    });
}

askQuestions();