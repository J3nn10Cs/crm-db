//las variables y funciones se queden de forma local
(function(){

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDb();
    })

    //Crear la bd de datos IndexDb
    function createDb(){
        //version
        const createDb = window.indexedDB.open('crm',1);

        //si marca error
        createDb.onerror = function (){
            console.log('Hubo un error');
        }

        createDb.onsuccess = function(){
            DB = createDb.result;
        };

        createDb.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm',{
                keyPath: 'id',
                autoIncrement: true
            });

            objectStore.createIndex('nombre','nombre', {unique: false});
            objectStore.createIndex('email','email', {unique: true});
            objectStore.createIndex('telefono','telefono', {unique: false});
            objectStore.createIndex('empresa','empresa', {unique: false});
            objectStore.createIndex('id','id', {unique: false});
        }
    }
})();