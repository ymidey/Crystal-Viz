
document.addEventListener("DOMContentLoaded", function () {

    const logoContainer = document.querySelector(".logo-container");

    gsap.from(logoContainer, {
        duration: 1.7,
        y: 500,
        opacity: 0,
        ease: "ease-out",
    });


});