let DB;
function conectDb(){
    const openConnection = window.indexedDB.open('crm',1);

    openConnection.onerror = function(){
        console.log('Hubo un error');
    };

    openConnection.onsuccess = function(){
        DB = openConnection.result;
    }
}

function printAlert (menssage, type,form){
    const alertDelete = document.querySelector('.alerta');

    if(!alertDelete){
        //Crear la alerta
        const alert = document.createElement('div');
        alert.classList.add('px-4', 'py-3','rounded','max-w-lg',',max-auto','mt-6','text-center','border', 'alerta');

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