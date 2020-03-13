const { Worker, parentPort } = require('worker_threads');

const randomData = require('./randomizeData'); //Рандомно сгенерированный массив с объектами

//Набор опций
const randomArraySize = 10; //Размер массива рандомных данных
const countCPU = os.length; //КАК количество доступных воркеров
const dataArr = randomData(randomArraySize); //Массив с рандомными объектами
const subArrSize = Math.ceil(randomArraySize / countCPU); //Количество значений в подмассиве

//Необходимо найти
//Для теста взято значение в определенном объекте
const needToFind = {
    [Object.keys(dataArr[6])[0]] : Object.values(dataArr[6])[0]
};

//Функция для разбивки основного массива на количество потоков
function getSlicedArr(arr, subArrSize, slicedArr = []){
    for (let i = 0; i < arr.length; i += subArrSize){
        slicedArr.push(arr.slice(i, i + subArrSize));
    }
    return slicedArr;
}

//Функция для сравнения свойств главного и искомого объектов
function findIn(sourceObject, targetObject) {
    return !Object.keys(sourceObject).some(s => sourceObject[s] !== targetObject[s]) ? targetObject.num : false;
}

//Функция для поиска объекта
function search(arr, x){
    //Если последний элемент не удовлетворяет искомые значения
    if (!findIn(x, arr[arr.length - 1])){
        for (let i = 0; i < arr.length; i++){
           if (findIn(x, arr[i]) && i < arr.length - 1) return arr[i];
        }
    }else return arr[arr.length - 1];
}

//НАЧАЛО РАБОТЫ С ПОТОКАМИ
function evalInWorker(){
    return new Promise((res, rej) =>{
        try {
            const worker = new Worker(__filename, {eval: true});
            worker.on('error', e => rej(e));
            worker.on('message', msg => {
                res(msg);
            });
            worker.on('exit', code => {
                if(code !== 0)
                   rej(new Error(`Worker stopped with exit code ${code}`));
            });
        }catch (e) {
            rej(e);
        }
    });
}