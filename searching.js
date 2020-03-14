const { parentPort, workerData, isMainThread } = require("worker_threads");

//Необходимо найти объект в котором присутствуют данные поля
const needToFind = {
    '3': '3.23'
};

//Функция для поиска объекта в одном массиве
function search(arr, x){
    //Если последний элемент не удовлетворяет искомые значения
    if (!findIn(x, arr[arr.length - 1])){
        for (let i = 0; i < arr.length; i++){
            if (findIn(x, arr[i]) && i < arr.length - 1) return arr[i];
        }
    }else return arr[arr.length - 1];
}

//Функция для сравнения свойств главного и искомого объектов
function findIn(sourceObject, targetObject) {
    return !Object.keys(sourceObject).some(s => sourceObject[s] !== targetObject[s]) ? targetObject.num : false;
}

if (!isMainThread){
    //Мы должны получить массив
    if (!Array.isArray(workerData)) {
        throw new Error("workerData must be an array");
    }
    //Отправляем сообщение через родительский порт
    parentPort.postMessage(search(workerData, needToFind));
}