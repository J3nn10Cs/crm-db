(function(){
    let DB;
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectDb();
        form.addEventListener('submit', validateClient);
    });

    function conectDb(){
        const openConection = window.indexedDB.open('crm',1);

        openConection.onerror = function(){
            console.log('Hubo un error');
        };

        openConection.onsuccess = function(){
            DB = openConection.result;
        }
    }

    function validateClient(e){
        e.preventDefault();

        //Leer todos los imputs
        const name = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#telefono').value;
        const company = document.querySelector('#empresa').value;

        if(name === '' || email === '' || phone === '' || company ===''){
            printAlert('Todos los campos son obligatorios','error');
            return;
        }
    }

    const printAlert = (menssage, type) => {
        const alertDelete = document.querySelector('.alerta');

        if(!alertDelete){
            //Crear la alerta
            const alert = document.createElement('div');
            alert.classList.add('px-4', 'py-3','rounded','max-w-lg',',mx-auto','mt-6','text-center','border', 'alerta');

            if(type === 'error'){
                alert.classList.add('bg-red-100', 'border-red-400','text-red-700');
            }else{
                alert.classList.add('bg-green-100','border-green-300','text-green-700');
            }

            alert.textContent = menssage;

            form.appendChild(alert);

            setTimeout(() => {
                alert.classList.add('hidden');
            }, 3000);
        }

        
    }

})();