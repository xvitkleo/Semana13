loadStorageCards();
createId();

function createId() {
    if(!localStorage.getItem("contadorId")) {
        localStorage.setItem("contadorId", 0);
    }
}

function actualizarId() {
    let id = localStorage.getItem("contadorId");
    localStorage.removeItem("contadorId");
    localStorage.setItem("contadorId", parseInt(id)+1);
}

function getValues() {
    return {
        name : document.querySelector("[name='name']").value,
        telefono : document.querySelector("[name='telefono']").value,
        correo : document.querySelector("[name='correo']").value,
        foto : document.querySelector("[name='foto']").value,
        about : document.querySelector("[name='about']").value
    }
}

document.querySelector(".agregar-mascota_button").addEventListener('click', function(){
    mostrarFormularioAgregar();    
})

function addStorageValues(values, id) {
    values.id = id;
    if(localStorage.getItem("mascotas")) {
        let mascotas = JSON.parse(localStorage.getItem("mascotas"));
        mascotas.push(values);
        localStorage.setItem("mascotas", JSON.stringify(mascotas));
    }
    else {
        localStorage.setItem("mascotas", JSON.stringify([values]));
    }
}

function editCard(e, card, formulario, values) {
    e.preventDefault();
    let id = values.id;
    let valuesActuales = getValues()
    const { name, telefono, correo, foto, about } = valuesActuales;    
    card.innerHTML = `
    <figure><img src="${foto}" alt=""></figure>              
    <h2>${name}</h2>
    <p>${telefono}</p>
    <p>${correo}</p>
    <p>${about}</p>
    <div class="mascota_modifiers">
        <div class="edit">
            <i class="fas fa-pen"></i>
            <p>Edit</p>
        </div>
        <div class="delete">
            <i class="fas fa-times"></i>
            <p>Delete</p>
        </div>
    </div>
    `;

    let mascotas = JSON.parse(localStorage.getItem("mascotas"));
    mascotas = mascotas.filter(function(e) {
        return e.id != id;
    })   
    localStorage.removeItem("mascotas");
    localStorage.setItem("mascotas", JSON.stringify(mascotas));
    addStorageValues(valuesActuales, id);
    formulario.remove();      
    
}

function mostrarFormularioEditar(card, values) {
    const { name, telefono, correo, foto, about } = values;
    console.log(about);
    const formulario = document.createElement("div");
    formulario.classList.add("editar-mascota");
    formulario.innerHTML = `
        <form class="editar-mascota_formulario">
            <h2>Editar Mascota</h2>
            <input required type="text" name="name" id="" placeholder="Nombre" value=${name}>
            <input required type="text" name="telefono" id="" placeholder="Telefono" value=${telefono}>
            <input required type="text" name="correo" id="" placeholder="Correo" value=${correo}>
            <input required type="text" name="foto" id="" placeholder="Foto" value=${foto}>
            <textarea required name="about" id="" cols="30" rows="10" placeholder="About">${about}</textarea>
            <button class="editar_button">Editar</button>
            <button class="cancelar_button">Cancelar</button>
        </form>
    `;

    document.querySelector("body").appendChild(formulario);
    formulario.querySelector(".editar_button").addEventListener('click', (e) => editCard(e, card, formulario, values))
    formulario.querySelector(".cancelar_button").addEventListener('click', function(e) {
        e.preventDefault();
        formulario.remove()
    })
    
}



function createCard(values) {
    const { name, telefono, correo, foto, about } = values;

    const card = document.createElement("div");
    card.classList.add("mascota");
    card.innerHTML = `
    <figure><img src="${foto}" alt=""></figure>              
    <h2>${name}</h2>
    <p>${telefono}</p>
    <p>${correo}</p>
    <p>${about}</p>
    <div class="mascota_modifiers">
        <div class="edit">
            <i class="fas fa-pen"></i>
            <p>Edit</p>
        </div>
        <div class="delete">
            <i class="fas fa-times"></i>
            <p>Delete</p>
        </div>
    </div>
    ` ;
    card.querySelector(".edit").addEventListener('click', () => mostrarFormularioEditar(card, values));
    card.querySelector(".delete").addEventListener('click', () => showModal(card, values));   
    return card;
}


function mostrarFormularioAgregar() {
    const formulario = document.createElement("div");
    formulario.classList.add("agregar-mascota");
    formulario.innerHTML = `
        <form class="agregar-mascota_formulario">
            <h2>Agregar Mascota</h2>
            <input required type="text" name="name" id="" placeholder="Nombre">
            <input required type="text" name="telefono" id="" placeholder="Telefono">
            <input required type="text" name="correo" id="" placeholder="Correo"> 
            <input required type="text" name="foto" id="" placeholder="Foto"> 
            <textarea required name="about" id="" cols="30" rows="10" placeholder="About"></textarea> 
            <button class="agregar_button">Agregar</button>
            <button class="cancelar_button">Cancelar</button>
        </form>
    `;

    formulario.querySelector(".agregar_button").addEventListener('click', function(e){
        e.preventDefault();
        let values = getValues();
        let card = createCard(values);     
        addStorageValues(values, localStorage.getItem("contadorId"));  
        actualizarId();
        insertCard(card);
        formulario.remove();
    })

    formulario.querySelector(".cancelar_button").addEventListener('click', function(e){
        e.preventDefault();        
        formulario.remove();
    })
    document.querySelector("body").appendChild(formulario);
}
function loadStorageCards() {
    let mascotas = JSON.parse(localStorage.getItem("mascotas"));
    if(mascotas) {
        mascotas.forEach(function(mascota) {
            insertCard(createCard(mascota));
        });
    }    
}

function insertCard(card) {
    document.querySelector(".container").appendChild(card);
}


function showModal(card, values) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal_vista">
            <i class="fas fa-times"></i>
            <p>¿Estas seguro que quieres eliminar a esta mascota?</p>
            <div>
                <button class="modal_aceptar-boton">Aceptar</button>
                <button class="modal_cancelar-boton">Cancelar</button>
            </div>
        </div>
    `;
    modal.querySelector(".modal_aceptar-boton").addEventListener('click', function(e) {
        deleteCard(card, values);
        modal.remove();
    })
    modal.querySelector(".modal_cancelar-boton").addEventListener('click', function(e) {
        modal.remove();
    })
    document.querySelector("body").appendChild(modal);

}

function deleteCard(card, values) {
    let mascotas = JSON.parse(localStorage.getItem("mascotas"));
    mascotas = mascotas.filter(function(e) {
        return e.id != values.id;
    })   
    localStorage.removeItem("mascotas");
    localStorage.setItem("mascotas", JSON.stringify(mascotas));
    card.remove();
}






