document.addEventListener("DOMContentLoaded", function () {

    const titleContainer = document.querySelector(".container-titre");

    gsap.from(titleContainer, {
        duration: 1.3,
        y: 1000,
        ease: "ease-out",
    });


});