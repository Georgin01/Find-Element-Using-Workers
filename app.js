const os = require('os').cpus(); //для правильного подсчета количества воркеров
const { Worker } = require('worker_threads');

const randomData = require('./randomizeData'); //рандомно сгенерированный массив с объектами

//Набор опций
const countCPU = os.length; //КАК количество доступных воркеров
const randomArraySize = 10; //размер массива рандомных данных


function getSlicedArr(arr, subArrSize, slicedArr = []){
    for (let i = 0; i < arr.length; i += subArrSize){
        slicedArr.push(arr.slice(i, i + subArrSize));
    }
    return slicedArr;
}

const dataArr = randomData(randomArraySize);
const subArrSize = Math.floor(randomArraySize / countCPU);

console.log(getSlicedArr(dataArr, countCPU));