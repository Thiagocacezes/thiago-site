const cookieNotification = document.getElementById('aviso-de-cookies');
const closeButton = document.getElementById('aviso-de-cookies-fechar');

function closeCookieNotification() {
    cookieNotification.style.display = 'none';
}

closeButton.addEventListener('click', closeCookieNotification);

const cookieConsent = getCookie('cookieConsent');

if (!cookieConsent) {
    cookieNotification.style.display = 'block';
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
}

function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return cookieValue ? cookieValue[2] : null;
}

/*document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("cookiesAccepted")) {
        var cookieMessage = document.getElementById('cookie-notification');
        var closeCookie = document.getElementById('cookie-notification-close');

        if (cookieMessage && closeCookie) {
            cookieMessage.style.display = 'block';
            closeCookie.addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.setItem("cookiesAccepted", true);
                cookieMessage.style.display = 'none';
            });
        }
    }
});*/
/*if (!localStorage.getItem("cookiesAccepted")) {
    var cookieMessage = document.getElementById('cookie-notification');
    var closeCookie = document.getElementById('cookie-notification-close');

    cookieMessage.style.display = 'block';
    closeCookie.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("cookiesAccepted", true);

        cookieMessage.style.display = 'none';

        if (localStorage.getItem("cookiesAccepted")) {
            // Se os cookies foram aceitos anteriormente, ocultar o aviso
            cookieMessage.style.display = 'none';
        }
    });
}*/
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}