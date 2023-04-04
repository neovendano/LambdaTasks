function dots(text){
    let placeCount = text.length - 1;
    let combs = Math.pow(2, placeCount);
    const textArr = [];

    for (let i = 0; i < combs; i++){
        let newText = text;
        for (let j = 0; j < placeCount; j++){
            if ((i >> j) & 1){
                newText = newText.slice(0, j+1 - text.length) + '.' + newText.slice(j+1 - text.length);
            }
        }
        textArr.push(newText);
    }

    console.log(textArr);
}

dots("abcd")