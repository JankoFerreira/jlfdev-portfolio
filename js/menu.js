// Mobile menu state is shared by both entry pages.
const menu = document.getElementById("sideMenu");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");

function setMenuState(isOpen) {
    if (!menu || !menuToggle) return;

    menu.classList.toggle("is-open", isOpen);
    menu.setAttribute("aria-hidden", String(!isOpen));
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
}

if (menu && menuToggle) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });
}

if (menu && menuClose) {
    menuClose.addEventListener("click", () => setMenuState(false));
}

if (menu) {
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenuState(false));
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        setMenuState(false);
    }
});
