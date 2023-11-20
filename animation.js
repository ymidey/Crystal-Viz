document.addEventListener("DOMContentLoaded", function () {
    const titleContainer = document.querySelector(".container-titre");

    gsap.registerPlugin(ScrollTrigger);

    function animationTitre() {
        gsap.from(titleContainer, {
            duration: 1.5,
            y: 900,
            ease: "ease-out",
        });
    }

    // Animation du titre au chargement de la page
    animationTitre();

    // Animation du titre à l'arrivée sur la page et chaque fois que l'on remonte 
    ScrollTrigger.create({
        trigger: titleContainer,
        start: "top",
        onEnter: animationTitre,
    });
});