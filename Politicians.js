// ======================================================
// PWANI WATCH — POLITICIANS
// Load politicians from Firebase Firestore
// ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

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
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// POLITICIANS CONTAINER
// ======================================================

const politiciansGrid = document.querySelector(".politicians-grid");


// ======================================================
// LOAD POLITICIANS
// ======================================================

async function loadPoliticians() {

    if (!politiciansGrid) {
        console.error("Politicians grid not found.");
        return;
    }

    // Loading state
    politiciansGrid.innerHTML = `
        <div class="loading-politicians">
            <div class="loading-spinner"></div>
            <p>Loading politicians...</p>
        </div>
    `;

    try {

        const politiciansRef = collection(db, "politicians");

        const politiciansQuery = query(
            politiciansRef,
            orderBy("name")
        );

        const snapshot = await getDocs(politiciansQuery);


        // ==================================================
        // NO POLITICIANS
        // ==================================================

        if (snapshot.empty) {

            politiciansGrid.innerHTML = `
                <div class="empty-politicians">
                    <h3>No politicians found</h3>
                    <p>
                        There are currently no politician profiles
                        available.
                    </p>
                </div>
            `;

            return;
        }


        // ==================================================
        // CLEAR LOADING
        // ==================================================

        politiciansGrid.innerHTML = "";


        // ==================================================
        // CREATE CARDS
        // ==================================================

        snapshot.forEach((doc) => {

            const politician = doc.data();

            const id = doc.id;

            const name =
                politician.name || "Unknown Politician";

            const position =
                politician.position || "Public Official";

            const party =
                politician.party || "Political Party";

            const photo =
                politician.photo ||
                "images/default-politician.jpg";


            const card = document.createElement("article");

            card.className = "politician-card";


            card.innerHTML = `

                <div class="politician-photo">

                    <img
                        src="${photo}"
                        alt="${escapeHTML(name)}"
                        loading="lazy"
                        onerror="this.src='images/default-politician.jpg'"
                    >

                </div>


                <div class="politician-info">

                    <span class="politician-position">
                        ${escapeHTML(position)}
                    </span>


                    <h2>
                        ${escapeHTML(name)}
                    </h2>


                    <p class="politician-party">
                        ${escapeHTML(party)}
                    </p>


                    <a
                        href="politician-profile.html?id=${encodeURIComponent(id)}"
                        class="profile-btn"
                    >
                        View Profile
                        <span>→</span>
                    </a>

                </div>

            `;


            politiciansGrid.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Error loading politicians:",
            error
        );


        politiciansGrid.innerHTML = `

            <div class="error-politicians">

                <h3>Unable to load politicians</h3>

                <p>
                    Please check your internet connection
                    and try again.
                </p>

                <button onclick="location.reload()">
                    Try Again
                </button>

            </div>

        `;

    }

}


// ======================================================
// SECURITY — ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// START
// ======================================================

loadPoliticians();
