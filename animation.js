
document.addEventListener("DOMContentLoaded", function () {

    const titleContainer = document.querySelector(".title-container");

    gsap.from(titleContainer, {
        duration: 1.5,
        y: 500,
        ease: "ease-out",
    });


});