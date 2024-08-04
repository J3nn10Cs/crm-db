(function(){
    let DB;
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectDb();
        form.addEventListener('submit', validateClient);
    });

    function validateClient(e){
        e.preventDefault();

        //Leer todos los imputs
        const name = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#telefono').value;
        const company = document.querySelector('#empresa').value;

        if(name === '' || email === '' || phone === '' || company ===''){
            printAlert('Todos los campos son obligatorios','error',form);
            return;
        }

        //para poder guardarlo en aplication
        function createNewClient (client){
            const transaction = DB.transaction(['crm'], 'readwrite');

            const objectStore = transaction.objectStore('crm');

            objectStore.add(client);

            transaction.onerror = function(){
                printAlert('Hubo un error','error');
            }

            transaction.oncomplete = function(){
                printAlert('Cliente agregado correctamente', 'exito',form);
                setTimeout(() => {
                    //nos lleva a otra pestaña
                    window.location.href = 'index.html';
                }, 3000);
            }
        }

        //Crear un objeto con la informacion
        const client = {
            //key value
            name,
            email,
            phone,
            company
        }

        client.id = Date.now();

        createNewClient(client);
    }
})();