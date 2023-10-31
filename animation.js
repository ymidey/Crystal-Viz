
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger)

    // Sélectionnez votre image
    const img = document.querySelector(".logo-container img");
    const div = document.querySelector('.div-footer')
    // Utilisez GSAP pour animer l'image
    gsap.from(img, {
        duration: 1, // Durée de l'animation (en secondes)
        y: 100,
        opacity: 0,
        ease: "ease-out", // Type d'animation (facultatif)
    });

    gsap.from(".div-footer", {
        x: -200,
        opacity: 0,
        scrollTrigger: {
            trigger: div, // L'élément déclencheur
            start: "top 100%", // L'animation commence lorsque 80% de l'élément est visible
            end: "top 70%", // L'animation se termine lorsque 30% de l'élément est visible
            scrub: true, // Permet d'ajuster l'animation en fonction du défilement
        },
    })


});