let data;
let data10;
let myChart;

const api = async () => {
        const res = await fetch("https://mindicador.cl/api/");
        const json = await res.json();
        return data = json;
    }

const api10 = async (moneda) => {
        const res = await fetch(`https://mindicador.cl/api/${moneda}`);
        const json = await res.json();
        return data10 = json;
    }

const listarMonedas = async () => {
    await api();
    if (!data) return console.log('No se pudo obtener la data');
    const selectMonedas = document.getElementById('divisa');
    const opcionesMonedas = Object.values(data)
        .filter(m => m.valor !== undefined)
        .map(m => `<option value="${m.codigo}">${m.nombre}</option>`);

    selectMonedas.innerHTML += opcionesMonedas.join('');
    selectMonedas.children[0].selected = true;
}

listarMonedas();

const calcular = () => {
    const resultado = document.getElementById('resultado');
    const pesos = Number(document.getElementById('clp').value);
    const moneSelect = document.getElementById('divisa').value;
    if (!pesos || !moneSelect) {
        resultado.textContent = 'Los datos ingresados son incorrectos, por favor intente nuevamente';
        return;
    }
    const moneda = data[moneSelect];
    if (pesos && moneda) {
        const valorMoneda = moneda.valor;
        const conversion = pesos / valorMoneda;
        resultado.textContent = `El valor en ${moneda.nombre} es: ${conversion.toFixed(2)}`;
    } else {
        resultado.textContent = 'Los datos ingresados son incorrectos, por favor intente nuevamente';
    }
}





const generarGrafico = async (moneda) => {
    await api10(moneda);
    const valores = data10.serie.map(obj => obj.valor);
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
        if (myChart) {
        myChart.destroy(); 
    }
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10'],
            datasets: [{
                label: 'Valor de la moneda',
                data: valores,
                backgroundColor: 'rgba(75, 0, 130)',
                borderColor: 'rgba(255, 255, 0)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}
const selectMonedas = document.getElementById('divisa');

selectMonedas.addEventListener('change', () => {
    const monedaSeleccionada = selectMonedas.value;
    generarGrafico(monedaSeleccionada);
});