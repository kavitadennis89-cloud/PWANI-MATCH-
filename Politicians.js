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
    apiKey: "AIzaSyCyR7feKg_SAVo1o8ZWFlWphvd5RQ7a-eU",
    authDomain: "pwani-match.firebaseapp.com",
    projectId: "pwani-match",
    storageBucket: "pwani-match.firebasestorage.app",
    messagingSenderId: "221245848970",
    appId: "1:221245848970:web:27b10109ab1030c7715c73",
    measurementId: "G-R59LBQZYD2"
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
        console.error("politiciansGrid not found.");
        return;
    }

    politiciansGrid.innerHTML = `
        <div class="loading">
            Loading politicians...
        </div>
    `;

    try {

        const politiciansQuery = query(
            collection(db, "politicians"),
            orderBy("name", "asc")
        );

        const snapshot = await getDocs(politiciansQuery);

        if (snapshot.empty) {

            politiciansGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No politicians yet</h3>
                    <p>Politician profiles will appear here.</p>
                </div>
            `;

            return;
        }


        politiciansGrid.innerHTML = "";


        snapshot.forEach((doc) => {

            const politician = doc.data();

            const name = politician.name || "Unknown Politician";
            const position = politician.position || "Position not available";
            const party = politician.party || "Independent";
            const photo = politician.photo || "https://via.placeholder.com/400x400?text=Politician";
            const id = doc.id;


            const card = document.createElement("div");

            card.className = "politician-card";


            card.innerHTML = `
                <div class="politician-image">
                    <img
                        src="${photo}"
                        alt="${name}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x400?text=Politician'"
                    >
                </div>

                <div class="politician-info">

                    <h3>${name}</h3>

                    <p class="politician-position">
                        ${position}
                    </p>

                    <p class="politician-party">
                        ${party}
                    </p>

                    <a
                        href="politician.html?id=${id}"
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
            <div class="error-state">
                <h3>Unable to load politicians</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}


// ======================================================
// START
// ======================================================

loadPoliticians();
