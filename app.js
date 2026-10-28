class Tarea {
    constructor(nombre, completa = false) {
        this.nombre = nombre;
        this.completa = completa;
        this.eliminada = false;
    }
    completar() {
        this.completa = !this.completa;
    }
    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
    eliminar() {
        this.eliminada = true;
    }
}
class GestorDeTareas {
    constructor() {
        this.tareas = [];
        this.inputTarea = document.getElementById("nueva-tarea");
        this.botonAgregar = document.getElementById("agregar-tarea");
        this.listaTareas = document.getElementById("lista-tareas");
        this.cargarTareas();
        this.botonAgregar.addEventListener("click", () => {
            this.agregarTarea(this.inputTarea.value);
        });
        this.render();
    }
    guardarTareas() {
        localStorage.setItem(
            "misTareas",
            JSON.stringify(this.tareas)
        );
    }
    cargarTareas() {
        const tareasGuardadas = localStorage.getItem("misTareas");
        if (tareasGuardadas !== null) {
            try {
                const datos = JSON.parse(tareasGuardadas);

                if (Array.isArray(datos)) {
                    this.tareas = datos.map((dato) => {
                        const tarea = new Tarea(
                            dato.nombre,
                            dato.completa
                        );
                        return tarea;
                    });
                }
            } catch (error) {
                alert("No se pudieron cargar las tareas guardadas.");
                this.tareas = [];
            }
        }
    }
    agregarTarea(nombre) {
        const nombreLimpio = nombre.trim();
        if (nombreLimpio === "") {
            alert("Por favor, escribe una tarea.");
            return;
        }
        const tarea = new Tarea(nombreLimpio);
        this.tareas.push(tarea);
        this.guardarTareas();
        this.inputTarea.value = "";
        this.inputTarea.focus();

        this.render();
    }
    eliminarTarea(tarea) {
        tarea.eliminar();
        this.tareas = this.tareas.filter(
            (elemento) => elemento !== tarea
        );
        this.guardarTareas();
        this.render();
    }

    render() {
        this.listaTareas.innerHTML = "";
        this.tareas.forEach((tarea) => {
            const elemento = document.createElement("li");
            elemento.innerHTML = `
                <span class="nombre-tarea"></span>
                <button class="completar">Completar</button>
                <button class="editar">Editar</button>
                <button class="eliminar">Eliminar</button>
            `;
            const nombre = elemento.querySelector(".nombre-tarea");
            const botonCompletar = elemento.querySelector(".completar");
            const botonEditar = elemento.querySelector(".editar");
            const botonEliminar = elemento.querySelector(".eliminar");
            nombre.textContent = tarea.nombre;
            if (tarea.completa) {
                nombre.style.textDecoration = "line-through";
                botonCompletar.textContent = "Desmarcar";
            }
            botonCompletar.addEventListener("click", () => {
                tarea.completar();
                this.guardarTareas();
                this.render();
            });
            botonEditar.addEventListener("click", () => {
                const nuevoNombre = prompt(
                    "Escribe el nuevo nombre:",
                    tarea.nombre
                );
                if (nuevoNombre === null) {
                    return;
                }
                if (nuevoNombre.trim() === "") {
                    alert("El nombre no puede estar vacío.");
                    return;
                }
                tarea.editar(nuevoNombre.trim());
                this.guardarTareas();
                this.render();
            });
            botonEliminar.addEventListener("click", () => {
                this.eliminarTarea(tarea);
            });
            this.listaTareas.appendChild(elemento);
        });
    }
}
const gestor = new GestorDeTareas();