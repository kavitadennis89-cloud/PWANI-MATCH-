// ======================================================
// PWANI WATCH — POLITICIANS
// ======================================================
// PWANI WATCH — POLITICIANS
// Load politicians from Firebase Firestore
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyCyHesLeoPmY24xZjHdrrU5GS7qiKqjjCs",
    authDomain: "pwani-watch.firebaseapp.com",
    projectId: "pwani-watch",
    storageBucket: "pwani-watch.firebasestorage.app",
    messagingSenderId: "523614372985",
    appId: "1:523614372985:web:cd4265e914f4a1303480a8",
    measurementId: "G-962QESHXP6"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// POLITICIANS CONTAINER
// ======================================================

const politiciansGrid = document.getElementById("politiciansGrid");


// ======================================================
// LOAD POLITICIANS
// ======================================================

async function loadPoliticians() {

    if (!politiciansGrid) {
        console.error("politiciansGrid not found");
        return;
    }

    politiciansGrid.innerHTML = `
        <p class="loading">
            Loading politicians...
        </p>
    `;

    try {

        const politiciansRef = collection(db, "politicians");

        const politiciansQuery = query(
            politiciansRef,
            orderBy("name")
        );

        const snapshot = await getDocs(politiciansQuery);

        politiciansGrid.innerHTML = "";

        if (snapshot.empty) {

            politiciansGrid.innerHTML = `
                <p class="empty">
                    No politicians have been added yet.
                </p>
            `;

            return;
        }

        snapshot.forEach((doc) => {

            const politician = doc.data();

            const card = document.createElement("article");

            card.className = "politician-card";

            card.innerHTML = `
                <div class="politician-image">
                    <img 
                        src="${politician.photo || "https://via.placeholder.com/400x400?text=No+Photo"}"
                        alt="${politician.name || "Politician"}"
                    >
                </div>

                <div class="politician-info">

                    <h3>${politician.name || "Unknown"}</h3>

                    <p class="position">
                        ${politician.position || ""}
                    </p>

                    <p class="party">
                        ${politician.party || ""}
                    </p>

                    <a 
                        href="politician.html?id=${doc.id}"
                        class="profile-btn"
                    >
                        View Profile
                    </a>

                </div>
            `;

            politiciansGrid.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading politicians:", error);

        politiciansGrid.innerHTML = `
            <p class="error">
                Failed to load politicians. Please try again.
            </p>
        `;
    }
}


// ======================================================
// START
// ======================================================

loadPoliticians();


