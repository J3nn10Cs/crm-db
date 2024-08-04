(function(){
    let DB;

    const nameImput = document.querySelector('#nombre');
    const emailImput = document.querySelector('#email');
    const companyImput = document.querySelector('#empresa');
    const phoneImput = document.querySelector('#telefono');

    document.addEventListener('DOMContentLoaded', () => {
        connectionDb();
        //Verificar id de la url
        const paramUrl = new URLSearchParams(window.location.search);

        const idClient = paramUrl.get('id');

        if(idClient){
            setTimeout(() => {
                getClient(idClient);
            }, 1000);
        }
    });

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
            }
        }
    }

    //traer los datos a los imput
    const fillForm = (dataClient) => {
        const {name, email,company,phone} = dataClient;

        nameImput.value = name;
        emailImput.value = email;
        companyImput.value = company;
        phoneImput.value = phone;
    }

    const connectionDb = () => {
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