function shuffle(array, acc=[]) {
    if(array.length === 0) return acc
    else {
        const el = array[Math.floor(Math.random() * (array.length))];
        return shuffle(array.filter(n => n !== el), [el, ...acc])
    }
}
exports.shuffle = shuffle