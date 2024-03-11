document.addEventListener("DOMContentLoaded", function () {
    var cookieMessage = document.getElementById('cookie-notification');
    var closeCookie = document.getElementById('cookie-notification-close');

    // Exibir o aviso de cookies
    cookieMessage.style.display = 'block';

    closeCookie.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("cookiesAccepted", true);

        // Ocultar o aviso de cookies após aceitar
        cookieMessage.style.display = 'none';
    });

    // Verificar se os cookies já foram aceitos anteriormente
    if (localStorage.getItem("cookiesAccepted")) {
        // Se os cookies foram aceitos anteriormente, ocultar o aviso
        cookieMessage.style.display = 'none';
    }
});
/*if (!localStorage.getItem("cookiesAccepted")) {
    var cookieMessage = document.getElementById('cookie-notification');
    var closeCookie = document.getElementById('cookie-notification-close');

    cookieMessage.style.display = 'block';
    closeCookie.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("cookiesAccepted", true);

        cookieMessage.style.display = 'none';
    });
}*/
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}