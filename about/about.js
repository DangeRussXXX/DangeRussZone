// =====================================
// Russ Isrow Portfolio JavaScript
// =====================================


// =====================================
// Smooth Scrolling Navigation
// =====================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});



// =====================================
// Fade-In Animation On Scroll
// =====================================

const sections = document.querySelectorAll("section");


const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.15
    }
);



sections.forEach(section => {

    section.classList.add("hidden");

    observer.observe(section);

});



// =====================================
// Experience Accordion Enhancement
// =====================================

const detailsSections = document.querySelectorAll("details");


detailsSections.forEach(section => {


    section.addEventListener("toggle", function() {


        if (this.open) {


            detailsSections.forEach(otherSection => {


                if (otherSection !== this) {

                    otherSection.open = false;

                }


            });


        }


    });


});



// =====================================
// Dynamic Footer Year
// =====================================

const footer = document.querySelector("footer");


if (footer) {


    const year = new Date().getFullYear();


    const copyright = document.createElement("p");


    copyright.classList.add("copyright");


    copyright.textContent =
        `© ${year} Russ Isrow. All Rights Reserved.`;



    footer.appendChild(copyright);


}



// =====================================
// Button Hover Animation
// =====================================

const buttons = document.querySelectorAll(".button");


buttons.forEach(button => {


    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-3px)";

    });



    button.addEventListener("mouseleave", () => {

        button.style.transform = "translateY(0)";

    });


});



// =====================================
// Image Loading Animation
// =====================================

const profileImage = document.querySelector(".hero-image img");


if (profileImage) {


    profileImage.addEventListener("load", () => {

        profileImage.classList.add("loaded");

    });


}



// =====================================
// Current Navigation Highlight
// =====================================

const currentPage = window.location.pathname;


document.querySelectorAll(".navbar a").forEach(link => {


    if (link.href.includes(currentPage)) {


        link.classList.add("active");


    }


});

/* =========================
   PRINT PROFESSIONAL PDF
========================= */


function printResume(){

    window.print();

}





/* =========================
   SHARE PROFILE
========================= */


function shareProfile(){

    if(navigator.share){

        navigator.share({

            title:"Russ Isrow | Professional Services Engineer",

            text:"Professional portfolio and technical experience",

            url:window.location.href

        })

        .catch(error => console.log(error));

    }

    else {

        navigator.clipboard.writeText(window.location.href);

        alert("Profile link copied to clipboard!");

    }

}