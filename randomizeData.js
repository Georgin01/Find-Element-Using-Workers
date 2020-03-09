//Небольшая иммитация запроса DSP

const getObjRandomData = (objNum) => {
    let randomObj = {};

    randomObj['num'] = objNum;
    for (let i = 0; i < 30; i++){
        randomObj[i] = Math.random() * 10;
    }
    return randomObj;
};

const generateArray = (size) => {
    return Array(size)
        .fill()
        .map((elem, i) => getObjRandomData(i));
};

module.exports = generateArray;