let plots = {};
let currentPlot = null;
let plotCount = 0;

// Список доступных растений с изображениями
const plants = {
    "Картошка": "/src/images/potato.jpg",
    "Помидоры": "/src/images/tomato.jpg",
    "Морковь": "/src/images/carrot.png",
};


// Обновить количество участков
function updatePlotCount() {
    document.getElementById("plot-count").textContent = `Количество участков: ${plotCount}`;
}

// Обновить данные выбранного участка
function updatePlotDetails() {
    const plotTitle = document.getElementById("plot-title");
    const plantInfo = document.getElementById("plant-info");
    const plantButton = document.getElementById("plant-button");
    const plantImageContainer = document.getElementById("plant-image-container");

    plantImageContainer.innerHTML = ""; // Очистка изображения
    if (currentPlot) {
        plotTitle.textContent = `Участок: ${currentPlot}`;
        const plotData = plots[currentPlot];
        if (plotData?.plant) {
            plantInfo.textContent = `Растение: ${plotData.plant}, Грядок: ${plotData.beds}`;
            const plantImage = document.createElement("img");
            plantImage.src = plants[plotData.plant];
            plantImage.alt = plotData.plant;
            plantImage.style.width = "100px";
            plantImage.style.height = "100px";
            plantImageContainer.appendChild(plantImage);
        } else {
            plantInfo.textContent = "Нет посаженных растений.";
        }
        plantButton.disabled = false;
    } else {
        plotTitle.textContent = "Выберите участок";
        plantInfo.textContent = "Нет данных";
        plantButton.disabled = true;
    }
}

// Выбрать участок
function selectPlot(plotName) {
    currentPlot = plotName;
    updatePlotDetails();

    const allPlots = document.querySelectorAll(".plot");
    allPlots.forEach((plot) => {
        if (plot.textContent === plotName) {
            plot.classList.add("selected");
        } else {
            plot.classList.remove("selected");
        }
    });
}

// Создать участок
document.getElementById("create-plot-frame").addEventListener("click", () => {
    const plotName = prompt("Введите имя участка:");
    if (!plotName || plots[plotName]) {
        alert("Некорректное имя или участок уже существует!");
        return;
    }

    plots[plotName] = {};
    plotCount++;
    updatePlotCount();

    const newPlot = document.createElement("div");
    newPlot.className = "plot";
    newPlot.textContent = plotName;
    newPlot.addEventListener("click", () => selectPlot(plotName));

    document.getElementById("plots-footer-container").appendChild(newPlot);
});

// Посадить растение
document.getElementById("plant-button").addEventListener("click", () => {
    const plantType = prompt("Выберите растение: Картошка, Помидоры, Морковь");
    if (!plants[plantType]) {
        alert("Неверный выбор. Попробуйте снова.");
        return;
    }
    const bedCount = parseInt(prompt("Введите количество грядок:"), 10);

    if (!isNaN(bedCount) && bedCount > 0) {
        plots[currentPlot] = { plant: plantType, beds: bedCount };
        updatePlotDetails();
    } else {
        alert("Некорректный ввод. Попробуйте снова.");
    }
});

// Смена имени пользователя
function editUsername() {
    const newName = prompt("Введите новое имя пользователя:");
    if (newName) {
        document.getElementById("username").textContent = newName;
    }
}

// Загрузка аватара
document.getElementById("avatar-input").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("avatar").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
