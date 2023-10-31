
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

});