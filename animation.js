
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger)

    const img = document.querySelector(".logo-container img");
    gsap.from(img, {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "ease-out",
    });


});