//las variables y funciones se queden de forma local
(function(){

    let DB;
    const listClient = document.querySelector('#listado-clientes');

    const table = document.querySelector('table');

    document.addEventListener('DOMContentLoaded', () => {
        createDb();

        if(window.indexedDB.open('crm',1)){
            getClient();
        }

        listClient.addEventListener('click', deleteClient);
    })

    const deleteClient = (e) => {
        e.preventDefault();

        if(e.target.classList.contains('eliminar')){
            //dataset para el data - cliente 
            const idDelete = Number(e.target.dataset.cliente);
            const confirmar = confirm('Estás seguro de eliminar este cliente');
            if(confirmar === true){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idDelete);

                transaction.oncomplete = function(){
                    printAlert('Ellinado con exito','exito',table);

                    //hacer un recorrido al padre y eliminar
                    e.target.parentElement.parentElement.remove();
                };

                transaction.onerror = function(){
                    printAlert('Hubo un error al momento de eliminar', 'error', table)
                }
            }
        }
    }

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
                    const {company, name,email,phone,id} = cursor.value;

                    
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
                                <p class="text-gray-600">${company}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
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