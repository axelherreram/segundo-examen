let sexoChart; // Variable global para almacenar el gráfico de sexo
let edadChart; // Variable global para almacenar el gráfico de edad

async function obtenerDatos() {
    const municipioId = document.getElementById('municipios').value;
    const apiUrl = `https://censopoblacion.azurewebsites.net/API/indicadores/2/${municipioId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.text();
        const jsonData1 = JSON.parse(data);
        const jsonData = JSON.parse(jsonData1);


        // Mostrar los datos en el HTML
        document.getElementById('resultados').innerHTML = `
            <h2 class="text-3xl text-black font-bold mb-4">${jsonData.nombre}</h2>
            <p class="text-lg"><strong>Población Total:</strong> ${jsonData.pob_total.toLocaleString()} habitantes</p>
            <p class="text-lg"><strong>Extensión Territorial:</strong> ${jsonData.ext_territorial} km²</p>
            <p class="text-lg"><strong>Índice de Masculinidad:</strong> ${jsonData.indice_masculinidad}</p>
            <p class="text-lg"><strong>Alfabetismo:</strong> ${jsonData.alfabetismo}%</p>
            <p class="text-lg"><strong>Promedio de Hijos por Mujer:</strong> ${jsonData.prom_hijos_mujer}</p>
            <p class="text-lg"><strong>Promedio de Personas por Hogar:</strong> ${jsonData.prom_personas_hogar}</p>
        `;

        // Actualizar los gráficos
        actualizarGraficos(jsonData);
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        document.getElementById('resultados').innerHTML = 'Error al obtener los datos';
    }
}

function actualizarGraficos(data) {
    // Destruir el gráfico de sexo si ya existe
    if (sexoChart) {
        sexoChart.destroy();
    }

    // Destruir el gráfico de edad si ya existe
    if (edadChart) {
        edadChart.destroy();
    }

    // Gráfico de distribución por sexo
    const ctxSexo = document.getElementById('sexoChart').getContext('2d');
    sexoChart = new Chart(ctxSexo, {
        type: 'doughnut',
        data: {
            labels: ['Hombres', 'Mujeres'],
            datasets: [{
                data: [data.total_sexo_hombre, data.total_sexo_mujeres],
                backgroundColor: ['#4CAF50', '#FF6384'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'black'  // Cambia el color de texto de la leyenda a negro
                    }
                }
            }
        }
    });

    // Gráfico de distribución por edad
    const ctxEdad = document.getElementById('edadChart').getContext('2d');
    edadChart = new Chart(ctxEdad, {
        type: 'bar',
        data: {
            labels: ['0-14 años', '15-64 años', '65+ años'],
            datasets: [{
                label: 'Población',
                data: [data.pob_edad_014, data.pob_edad_1564, data.pob_edad_65],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        color: 'black'  // Cambia el color del texto en el eje X a negro
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black'  // Cambia el color de texto de la leyenda a negro
                    }
                }
            }
        }
    });

}

obtenerDatos(); // Llamada inicial con valor por defecto