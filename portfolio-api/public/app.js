// ==========================================
// SUPERHERO COMMAND CENTER
// Frontend Application
// Russ Isrow
// ==========================================


const API_URL = "http://localhost:3000/api";




// ==========================================
// LOAD DATABASE COUNT
// ==========================================

async function loadCount() {

    try {

        const response = await fetch(
            `${API_URL}/count`
        );


        const data = await response.json();


        document.getElementById("count").innerHTML =

            `${data[0].count}`;


    } catch(error) {

        console.error(
            "Count Error:",
            error
        );


        document.getElementById("count").innerHTML =
            "OFFLINE";

    }

}







// ==========================================
// LOAD ALL HEROES
// ==========================================

async function loadHeroes() {


    const container = document.getElementById(
        "heroes"
    );


    container.innerHTML =
        "Accessing Hero Registry...";



    try {


        const response = await fetch(

            `${API_URL}/heroes`

        );


        const heroes = await response.json();



        displayHeroes(heroes);



    } catch(error) {


        console.error(error);


        container.innerHTML =
            "Database connection failed.";

    }


}







// ==========================================
// SEARCH HEROES
// ==========================================

async function searchHeroes() {


    const search =
        document.getElementById("search")
        .value
        .trim();



    if(search === "") {

        loadHeroes();

        return;

    }




    const container =
        document.getElementById("heroes");


    container.innerHTML =
        "Searching Registry...";



    try {


        const response = await fetch(

            `${API_URL}/search?name=${search}`

        );



        const heroes =
            await response.json();



        displayHeroes(heroes);



    } catch(error) {


        console.error(error);


        container.innerHTML =
            "Search system failure.";

    }

}








// ==========================================
// DISPLAY HERO RECORDS
// ==========================================

function displayHeroes(heroes) {


    const container =
        document.getElementById("heroes");



    container.innerHTML = "";




    if(heroes.length === 0) {


        container.innerHTML =

        `
        <div class="hero-card">

            <h3>
            NO RECORD FOUND
            </h3>

            <p>
            The Hero Registry returned no matches.
            </p>

        </div>
        `;


        return;

    }





    heroes.forEach((hero,index)=>{


        const card =
            document.createElement("div");



        card.className =
            "hero-card";


const alignment =
    hero.alignment || "Unknown";


let statusClass = "unknown";


const alignmentText =
    alignment.toLowerCase();



if(
    alignmentText.includes("good") ||
    alignmentText.includes("hero")
){

    statusClass = "hero";

}



else if(
    alignmentText.includes("bad") ||
    alignmentText.includes("villain") ||
    alignmentText.includes("evil")
){

    statusClass = "villain";

}



        card.innerHTML =

        `

        <h3>
            ${hero.superhero_name}
        </h3>


        <p>
            <strong>
            Registry ID:
            </strong>
            #${hero.id || index + 1}
        </p>



        <p>
            <strong>
            Civilian Identity:
            </strong>
            ${hero.full_name || "Unknown"}
        </p>



        <p>
            <strong>
            Publisher:
            </strong>
            ${hero.publisher_name || "Unknown"}
        </p>



        <p>
            <strong>
            Species:
            </strong>
            ${hero.race || "Unknown"}
        </p>




<p>
    <strong>
    Classification:
    </strong>

    <span class="badge ${statusClass}">
        ${alignment === "Good" ? "🟢 HERO" : 
          alignment === "Bad" ? "🔴 VILLAIN" : 
          "⚪ " + alignment}
    </span>

</p>




        <p>
            <strong>
            Height:
            </strong>
            ${hero.height_cm || "Unknown"} cm
        </p>



        <p>
            <strong>
            Weight:
            </strong>
            ${hero.weight_kg || "Unknown"} kg
        </p>



        <button class="profile-button">

            View Intelligence File

        </button>


        `;



        container.appendChild(card);



    });


}







// ==========================================
// START SYSTEM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        loadCount();


        loadHeroes();


    }
);