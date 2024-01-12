let earnings = 0;
let videoCount = 0;
let videoUpgradeCost = 10;
let autoUploadCost = 50;
let subscribers = 0;
let autoUploadInterval;

// Open or create the IndexedDB database
const dbName = "youtuberTycoonDB";
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion);

request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;

    // Create an object store to store game data
    const objectStore = db.createObjectStore("gameData", { keyPath: "id" });

    // Initialize default data
    const initData = {
        id: 1,
        earnings: 0,
        videoCount: 0,
        videoUpgradeCost: 10,
        autoUploadCost: 50,
        subscribers: 0,
    };

    // Add default data to the object store
    objectStore.add(initData);
};

request.onsuccess = function (event) {
    db = event.target.result;

    // Load saved game data
    loadGameData();
};

function loadGameData() {
    const transaction = db.transaction(["gameData"], "readwrite");
    const objectStore = transaction.objectStore("gameData");

    const request = objectStore.get(1);

    request.onsuccess = function (event) {
        const savedData = event.target.result;

        if (savedData) {
            earnings = savedData.earnings;
            videoCount = savedData.videoCount;
            videoUpgradeCost = savedData.videoUpgradeCost;
            autoUploadCost = savedData.autoUploadCost;
            subscribers = savedData.subscribers;

            updateStats();
        }
    };
}

function saveGameData() {
    const transaction = db.transaction(["gameData"], "readwrite");
    const objectStore = transaction.objectStore("gameData");

    const gameData = {
        id: 1,
        earnings: earnings,
        videoCount: videoCount,
        videoUpgradeCost: videoUpgradeCost,
        autoUploadCost: autoUploadCost,
        subscribers: subscribers,
    };

    const request = objectStore.put(gameData);

    request.onsuccess = function (event) {
        console.log("Game data saved successfully!");
    };

    request.onerror = function (event) {
        console.error("Error saving game data:", event.target.errorCode);
    };
}

function updateSubscribers() {
    document.getElementById("subCount").innerText = subscribers;
}

function updateStats() {
    document.getElementById("subCount").innerText = subscribers;
    document.getElementById("videoCount").innerText = videoCount;
    document.getElementById("upgrade-cost").innerText = videoUpgradeCost;
    document.getElementById("auto-upload-cost").innerText = autoUploadCost;
    document.getElementById("earnings").innerText = "Earnings: $" + earnings.toFixed(2);
}

function uploadVideo() {
    subscribers += getRandomInt(10, 50);
    earnings += subscribers * 0.01;
    videoCount++;
    updateSubscribers();
    updateStats();
}

function buyVideoUpgrade() {
    if (earnings >= videoUpgradeCost) {
        earnings -= videoUpgradeCost;
        videoUpgradeCost *= 2;
        subscribers += getRandomInt(20, 70);
        updateSubscribers();
        updateStats();
    } else {
        alert("Not enough earnings to buy a video upgrade!");
    }
}

function buyAutoUpload() {
    if (earnings >= autoUploadCost) {
        earnings -= autoUploadCost;
        autoUploadCost *= 2;
        autoUploadInterval = setInterval(uploadVideo, 3000);
        document.getElementById("auto-upload-btn").disabled = true;
        updateStats();
    } else {
        alert("Not enough earnings to buy auto-upload!");
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Save game data periodically
setInterval(saveGameData, 5000);

// Save game data when the page is closed or refreshed
window.onbeforeunload = function () {
    saveGameData();
};
