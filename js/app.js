//las variables y funciones se queden de forma local
(function(){

    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        createDb();

        if(window.indexedDB.open('crm',1)){
            getClient();
        }
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

    const getClient = () => {
        const openConnection = window.indexedDB.open('crm',1);

        openConnection.onerror = function(){
            console.log('Hubo un error');
        };

        openConnection.onsuccess = function(){
            DB = openConnection.result;

            //Acceder al objectStore
            const objectStore = DB.transaction('crm').objectStore('crm');

            //en caso el cursor se abra correctamente
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    const {companny, name,email,phone,id} = cursor.value;

                    const listClient = document.querySelector('#listado-clientes');
                    listClient.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${name} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${phone}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${companny}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                            </td>
                        </tr>
                    `
                    //traer el siguiente
                    cursor.continue();
                }else{
                    console.log('No hay mas registros');
                }
            }
        }
    }
})();