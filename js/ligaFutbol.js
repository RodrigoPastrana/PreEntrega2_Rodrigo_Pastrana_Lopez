function crearLiga() {
    const cantidadEquipos = parseInt(prompt("¿Cuántos equipos quieres en la liga?"));

    if (isNaN(cantidadEquipos) || cantidadEquipos < 2) {
        alert("Debes ingresar un número válido de equipos (mínimo 2).");
        return;
    }

    // Contiene los nombres de los equipos
    const equipos = [];
    for (let i = 0; i < cantidadEquipos; i++) {
        const nombreEquipo = prompt(`Ingresa el nombre del equipo ${i + 1}:`);
        equipos.push(nombreEquipo);
    }

    // Agrega un equipo "Libre" si la cantidad es impar
    if (cantidadEquipos % 2 !== 0) {
        equipos.push("Libre");
    }

    // Generar el fixture (ida y vuelta alternando localía)
    const fixture = generarFixture(equipos);

    // Muestra el fixture en la página
    mostrarFixtureEnPagina(fixture, equipos);
}

function generarFixture(equipos) {
    const totalFechas = equipos.length - 1; // Una vuelta de partidos
    const partidosPorFecha = equipos.length / 2;
    let fixture = [];
    
    // Generar los partidos de la primera vuelta (ida) alternando local y visitante
    for (let ida = 0; ida < totalFechas; ida++) {
        let partidos = [];
        for (let i = 0; i < partidosPorFecha; i++) {
            let local = equipos[i];
            let visitante = equipos[equipos.length - 1 - i];

            // Alternar entre local y visitante en cada partido
            if (ida % 2 === 0) {
                partidos.push({ local, visitante });
            } else {
                partidos.push({ local: visitante, visitante: local });
            }
        }
        fixture = fixture.concat(partidos);

        // Rotar equipos (manteniendo el primer equipo fijo)
        equipos.splice(1, 0, equipos.pop());
    }

    // Generar los partidos de la segunda vuelta (vuelta) alternando local y visitante
    for (let ida = 0; ida < totalFechas; ida++) {
        let partidos = [];
        for (let i = 0; i < partidosPorFecha; i++) {
            let local = equipos[i];
            let visitante = equipos[equipos.length - 1 - i];

            // En la vuelta, se invierten los roles de local y visitante
            if (ida % 2 === 0) {
                partidos.push({ local: visitante, visitante: local });
            } else {
                partidos.push({ local, visitante });
            }
        }
        fixture = fixture.concat(partidos);

        // Rotar equipos (manteniendo el primer equipo fijo)
        equipos.splice(1, 0, equipos.pop());
    }

    return fixture;
}

function mostrarFixtureEnPagina(fixture, equipos) {
    const fixtureDiv = document.getElementById("fixture");
    fixtureDiv.innerHTML = ""; // Borra el contenido previo del fixture

    let partidosPorFecha = equipos.length / 2;
    let fechaActual = 1;

    fixture.forEach((partido, index) => {
        // Crear título para la fecha
        if (index % partidosPorFecha === 0) {
            const tituloFecha = document.createElement("div");
            tituloFecha.className = "fecha";
            tituloFecha.textContent = `Fecha ${fechaActual}`;
            fixtureDiv.appendChild(tituloFecha);

            fechaActual++;
        }

        // Mostrar partidos normales
        if (partido.local !== "Libre" && partido.visitante !== "Libre") {
            const partidoDiv = document.createElement("div");
            partidoDiv.className = "partido";
            partidoDiv.textContent = `${partido.local} vs ${partido.visitante}`;
            fixtureDiv.appendChild(partidoDiv);
        }
    });

    // Agregar los botones después de mostrar el fixture
    agregarBotones(fixture);
}

function agregarBotones(fixture) {
    const fixtureDiv = document.getElementById("fixture");

    // Botón para crear otra liga
    const botonCrearOtraLiga = document.createElement("button");
    botonCrearOtraLiga.textContent = "Crear otra liga";
    botonCrearOtraLiga.addEventListener("click", () => {
        location.reload(); // Recarga la página para reiniciar todo
    });
    fixtureDiv.appendChild(botonCrearOtraLiga);

    // Botón para buscar partidos de un equipo específico
    const botonBuscarPartidos = document.createElement("button");
    botonBuscarPartidos.textContent = "Buscar partidos de un equipo específico";
    botonBuscarPartidos.addEventListener("click", () => {
        const equipoBuscado = prompt("Ingresa el nombre del equipo para buscar sus partidos:");
        if (equipoBuscado) {
            buscarPartidosPorEquipo(equipoBuscado, fixture);
        }
    });
    fixtureDiv.appendChild(botonBuscarPartidos);
}

function buscarPartidosPorEquipo(equipo, fixture) {
    const partidosEncontrados = fixture.filter(
        partido => partido.local === equipo || partido.visitante === equipo
    );

    const fixtureDiv = document.getElementById("fixture");

    // Crear una sección para mostrar los partidos del equipo debajo del fixture
    const resultadosDiv = document.createElement("div");
    resultadosDiv.id = "resultadosBusqueda";
    resultadosDiv.innerHTML = `<h2>Partidos del equipo: ${equipo}</h2>`; // Título para la búsqueda

    partidosEncontrados.forEach((partido) => {
        const partidoDiv = document.createElement("div");
        partidoDiv.className = "partido";
        partidoDiv.textContent = `${partido.local} vs ${partido.visitante}`;
        resultadosDiv.appendChild(partidoDiv);
    });

    // Agregar los resultados de la búsqueda debajo del fixture
    fixtureDiv.appendChild(resultadosDiv);
}
