const { Worker} = require('worker_threads');
const os = require('os').cpus(); //для правильного подсчета количества воркеров
const path = require('path');

const randomData = require('./randomizeData'); //Рандомно сгенерированный массив с объектами

//Набор опций
const randomArraySize = 10000;                                  //Размер массива рандомных данных
const countCPU = os.length;                                     //КАК количество доступных воркеров
const dataArr = randomData(randomArraySize);                    //Массив с рандомными объектами
const subArrSize = Math.ceil(randomArraySize / countCPU);    //Количество значений в подмассиве
const workerScript = path.join(__dirname, "./searching.js");    //Получаем путь к скрипту

//Функция для разбивки основного массива на количество потоков
function getSlicedArr(arr, subArrSize, slicedArr = []){
    for (let i = 0; i < arr.length; i += subArrSize){
        slicedArr.push(arr.slice(i, i + subArrSize));
    }
    return slicedArr;
}

//======   НАЧАЛО РАБОТЫ С ПОТОКАМИ   =====
function evalInWorker(arr){
    return new Promise((res, rej) =>{
        const worker = new Worker(workerScript, { workerData: arr });
        worker.on('error', e => rej(e));
        worker.on('message', msg => {
            res(msg);
        });
        worker.on('exit', code => {
            if(code !== 0)
                rej(new Error(`Worker stopped with exit code ${code}`));
            });
    });
}

//getSlicedArr возвращает массив с подмассивами
async function tasks(subArrSize, arr = []){
    getSlicedArr(dataArr, subArrSize).map(e => arr.push(evalInWorker(e)));
    return await Promise.all(arr)
        .then(r => console.log(r , r.length + ` elem`));
}

async function run(subArrSize){
    return await tasks(subArrSize);
}

const start = Date.now();
run(subArrSize).then(() => console.log(`End In ${Date.now() - start} ms`));