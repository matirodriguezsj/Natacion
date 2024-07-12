const trainingForm = document.getElementById('training-form');
const trainingList = document.getElementById('training-list');
const dailyAverage = document.getElementById('daily-average');
const weeklyAverage = document.getElementById('weekly-average');
const monthlyAverage = document.getElementById('monthly-average');
const weeklyTrainingDays = document.getElementById('weekly-training-days');
const monthlyTrainingDays = document.getElementById('monthly-training-days');
const monthlyStats = document.getElementById('monthly-stats');

let trainings = JSON.parse(localStorage.getItem('trainings')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateTrainingList();
    updateAverages();
    updateTrainingDays();
    updateMonthlyStats();
});


trainingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const distance = parseFloat(document.getElementById('distance').value);
    const feeling = document.getElementById('feeling').value;
    
    if (date && distance && feeling) {
        trainings.push({ date, distance, feeling });
        localStorage.setItem('trainings', JSON.stringify(trainings));
        
        updateTrainingList();
        updateAverages();
        updateTrainingDays();
        updateMonthlyStats();
        
        trainingForm.reset();
    }
});

function updateTrainingList() {
    const trainingListContainer = document.getElementById('training-list');
    trainingListContainer.innerHTML = '';
    trainings.forEach((training, index) => {
        const li = document.createElement('li');
        li.textContent = `Fecha: ${training.date}, Distancia: ${training.distance} metros, Sentimiento: ${training.feeling} `;
        
        // Agregar botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            deleteTraining(index);
        });
        li.appendChild(deleteButton);
        
        trainingListContainer.appendChild(li);
    });
}

function deleteTraining(index) {
    trainings.splice(index, 1); // Eliminar el entrenamiento en el índice especificado
    localStorage.setItem('trainings', JSON.stringify(trainings)); // Actualizar localStorage
    
    updateTrainingList();
    updateAverages();
    updateTrainingDays();
    updateMonthlyStats();
}

function updateAverages() {
    const totalDistance = trainings.reduce((sum, training) => sum + training.distance, 0);
    const totalDays = trainings.length;
    const dailyAvg = totalDistance / totalDays;

    const weeklyData = trainings.filter(training => {
        const trainingDate = new Date(training.date);
        const currentDate = new Date();
        const differenceInDays = (currentDate - trainingDate) / (1000 * 3600 * 24);
        return differenceInDays <= 7;
    });
    const weeklyDistance = weeklyData.reduce((sum, training) => sum + training.distance, 0);
    const weeklyAvg = weeklyDistance / 7;

    const monthlyData = trainings.filter(training => {
        const trainingDate = new Date(training.date);
        const currentDate = new Date();
        const differenceInDays = (currentDate - trainingDate) / (1000 * 3600 * 24);
        return differenceInDays <= 30;
    });
    const monthlyDistance = monthlyData.reduce((sum, training) => sum + training.distance, 0);
    const monthlyAvg = monthlyDistance / 30;

    dailyAverage.textContent = `Promedio Diario: ${dailyAvg.toFixed(2)} metros`;
    weeklyAverage.textContent = `Promedio Semanal: ${weeklyAvg.toFixed(2)} metros`;
    monthlyAverage.textContent = `Promedio Mensual: ${monthlyAvg.toFixed(2)} metros`;
}

function updateTrainingDays() {
    const currentDate = new Date();

    // Días de entrenamiento esta semana
    const weeklyData = trainings.filter(training => {
        const trainingDate = new Date(training.date);
        const differenceInDays = (currentDate - trainingDate) / (1000 * 3600 * 24);
        return differenceInDays <= 7;
    });
    const weeklyDays = new Set(weeklyData.map(training => training.date)).size;
    weeklyTrainingDays.textContent = `Días entrenados esta semana: ${weeklyDays} días`;

    // Promedio de días entrenados por semana este mes
    const monthlyData = trainings.filter(training => {
        const trainingDate = new Date(training.date);
        const differenceInDays = (currentDate - trainingDate) / (1000 * 3600 * 24);
        return differenceInDays <= 30;
    });
    const weeksInMonth = 4; // Suponiendo 4 semanas por mes
    const monthlyDays = new Set(monthlyData.map(training => training.date)).size;
    const averageWeeklyDays = (monthlyDays / weeksInMonth).toFixed(2);
    monthlyTrainingDays.textContent = `Promedio de días entrenados por semana este mes: ${averageWeeklyDays} días`;
}

function updateMonthlyStats() {
    const currentDate = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Inicializar el objeto para almacenar estadísticas mensuales
    const monthlyStatsData = {};
    months.forEach(month => {
        monthlyStatsData[month] = {
            distance: 0,
            days: 0
        };
    });

    // Calcular metros nadados y días entrenados por mes
    trainings.forEach(training => {
        const trainingDate = new Date(training.date);
        const month = trainingDate.getMonth();
        const monthName = months[month];
        
        monthlyStatsData[monthName].distance += training.distance;
        monthlyStatsData[monthName].days++;
    });

    // Mostrar estadísticas mensuales solo para los meses con datos
    monthlyStats.innerHTML = '';
    months.forEach(month => {
        if (monthlyStatsData[month].days > 0) {
            const li = document.createElement('li');
            li.textContent = `${month}: Metros nadados: ${monthlyStatsData[month].distance} metros, Días entrenados: ${monthlyStatsData[month].days}`;
            monthlyStats.appendChild(li);
        }
    });
}
