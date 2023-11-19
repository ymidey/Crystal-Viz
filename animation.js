document.addEventListener("DOMContentLoaded", function () {

    const titleContainer = document.querySelector(".container-titre");

    gsap.from(titleContainer, {
        duration: 1.5,
        y: 500,
        ease: "ease-out",
    });


});