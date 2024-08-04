(function(){
    let DB;
    let idClient;

    const nameImput = document.querySelector('#nombre');
    const emailImput = document.querySelector('#email');
    const companyImput = document.querySelector('#empresa');
    const phoneImput = document.querySelector('#telefono');

    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        connectionDb();

        //Actualiza el registro
        form.addEventListener('submit',updateClient);

        //Verificar id de la url
        const paramUrl = new URLSearchParams(window.location.search);

        idClient = paramUrl.get('id');
        console.log(idClient)

        if(idClient){
            setTimeout(() => {
                getClient(idClient);
            }, 1000);
        }
    });

    const updateClient = (e) => {
        e.preventDefault();

        if(nameImput.value === '' || emailImput === '' || phoneImput === '' || companyImput === ''){
            printAlert('Todos los campos son obligatorios','error',form);
            return;
        }

        //actualizar el cliente
        const clientUpdate = {
            name: nameImput.value,
            email: emailImput.value,
            company: companyImput.value,
            phone: phoneImput.value,
            //convertir string a numero
            id: Number(idClient)
        }

        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        //
        objectStore.put(clientUpdate);

        transaction.oncomplete = function(){
            printAlert('Editado correctamente','exito',form);
        };

        setTimeout(() => {
            window.location.href = 'index.html'
        }, 1000);

        transaction.onerror = function(){
            printAlert('Hubo un error','error',form);
        }
    }

    const getClient = (id) =>{
        const transaction = DB.transaction(['crm'], 'readwrite');
        //para interactuar con la bd
        const objectStore = transaction.objectStore('crm');
        
        const client = objectStore.openCursor();
        //En caso de que se haya obtenido correctamente
        client.onsuccess = (e) => {
            const cursor = e.target.result;
            //console.log(cursor); -> trae todo la informacion

            if(cursor){
                if(cursor.value.id === Number(id)){ // verficar el id
                    //console.log(cursor.value); //trae el valor del campo
                    fillForm(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    //traer los datos a los imput
    function fillForm (dataClient){
        const {name, email,company,phone} = dataClient;
        nameImput.value = name;
        emailImput.value = email;
        companyImput.value = company;
        phoneImput.value = phone;
    }

    function connectionDb () {
        const openConnection = window.indexedDB.open('crm',1);

        //si hay un error
        openConnection.onerror = () => {
            console.log('Hubo un error');
        }

        //si todo ta bien
        openConnection.onsuccess = () => {
            DB = openConnection.result;
        }
    }
})();