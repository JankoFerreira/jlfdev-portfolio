// Shared page behaviors:
// - intro loader on the home page
// - back-to-top button state
// - Formspree contact form submission feedback
const backToTopBtn = document.getElementById("backToTop");
const scrollIndicator = document.querySelector(".scroll-indicator");
const loader = document.getElementById("loader");
const nameWrap = document.getElementById("nameWrap");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const statusText = document.getElementById("statusText");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const loaderName = "JANKO FERREIRA";
const loaderStatuses = [
    "Initializing Experience",
    "Loading Interface",
    "Rendering Motion",
    "Preparing Portfolio",
    "Finalizing"
];

function buildLoaderLetters(text) {
    if (!nameWrap) return;

    nameWrap.innerHTML = "";

    // Split the name into individually animated characters for the loader intro.
    [...text].forEach((character, index) => {
        const span = document.createElement("span");
        span.className = character === " " ? "char space" : "char";
        span.textContent = character === " " ? "\u00A0" : character;
        span.style.setProperty("--char-delay", `${index * 70}ms`);
        nameWrap.appendChild(span);
    });
}

function completeLoader() {
    if (!loader) {
        document.body.classList.add("loaded");
        return;
    }

    // Snap to the completed state, then let the curtain animation reveal the page.
    if (progressBar) progressBar.style.transform = "scaleX(1)";
    if (progressText) progressText.textContent = "100%";
    if (statusText) statusText.textContent = "Ready";

    window.setTimeout(() => {
        loader.classList.add("reveal");
    }, 180);

    window.setTimeout(() => {
        loader.classList.add("hide");
        document.body.classList.add("loaded");
    }, 1100);
}

let loaderStarted = false;
let backToTopWasVisible = false;

function runLoader() {
    if (loaderStarted) {
        return;
    }

    loaderStarted = true;

    if (!loader || !progressBar || !progressText || !statusText) {
        document.body.classList.add("loaded");
        return;
    }

    buildLoaderLetters(loaderName);

    if (prefersReducedMotion.matches) {
        completeLoader();
        return;
    }

    let progress = 0;
    const totalDuration = 3200;
    const intervalMs = 40;
    const increment = 100 / (totalDuration / intervalMs);

    // Simulate staged progress so the entrance feels intentional instead of abrupt.
    const interval = window.setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            window.clearInterval(interval);
            completeLoader();
            return;
        }

        const rounded = Math.floor(progress);
        progressBar.style.transform = `scaleX(${(rounded / 100).toFixed(3)})`;
        progressText.textContent = `${rounded}%`;

        const statusIndex = Math.min(
            loaderStatuses.length - 1,
            Math.floor((rounded / 100) * loaderStatuses.length)
        );

        statusText.textContent = loaderStatuses[statusIndex];
    }, intervalMs);
}

function updateScrollUi() {
    const isPastFold = window.scrollY > 400;
    const scrollableDistance = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
    );
    const scrollProgress = Math.min(window.scrollY / scrollableDistance, 1);

    if (backToTopBtn) {
        backToTopBtn.classList.toggle("show", isPastFold);
        backToTopBtn.style.setProperty("--scroll-progress", scrollProgress.toFixed(3));

        if (isPastFold && !backToTopWasVisible && !prefersReducedMotion.matches) {
            backToTopBtn.classList.remove("pulse-in");
            window.requestAnimationFrame(() => backToTopBtn.classList.add("pulse-in"));
        }

        if (!isPastFold) {
            backToTopBtn.classList.remove("pulse-in");
        }

        backToTopWasVisible = isPastFold;
    }

    if (scrollIndicator) {
        scrollIndicator.style.opacity = window.scrollY > 50 ? "0" : "1";
    }
}

if (backToTopBtn) {
    let backToTopRect = null;
    let backToTopPointerFrame = 0;
    let backToTopPointerEvent = null;

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    backToTopBtn.addEventListener("pointermove", event => {
        if (prefersReducedMotion.matches || event.pointerType === "touch") return;

        backToTopPointerEvent = event;
        if (backToTopPointerFrame) return;

        backToTopPointerFrame = window.requestAnimationFrame(() => {
            const rect = backToTopRect || backToTopBtn.getBoundingClientRect();
            const pointerEvent = backToTopPointerEvent;
            backToTopPointerFrame = 0;

            if (!pointerEvent) return;

            const offsetX = ((pointerEvent.clientX - rect.left) / rect.width - 0.5) * 10;
            const offsetY = ((pointerEvent.clientY - rect.top) / rect.height - 0.5) * 10;

            backToTopBtn.style.setProperty("--magnetic-x", `${offsetX.toFixed(2)}px`);
            backToTopBtn.style.setProperty("--magnetic-y", `${offsetY.toFixed(2)}px`);
            backToTopPointerEvent = null;
        });
    });

    const resetBackToTopMagnet = () => {
        backToTopBtn.style.setProperty("--magnetic-x", "0px");
        backToTopBtn.style.setProperty("--magnetic-y", "0px");
        backToTopRect = null;
    };

    backToTopBtn.addEventListener("pointerenter", () => {
        backToTopRect = backToTopBtn.getBoundingClientRect();
    }, { passive: true });
    backToTopBtn.addEventListener("pointerleave", resetBackToTopMagnet);
    backToTopBtn.addEventListener("blur", resetBackToTopMagnet);
}

let scrollTicking = false;

// Throttle scroll-driven UI updates to one paint frame at a time.
window.addEventListener("scroll", () => {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
        updateScrollUi();
        scrollTicking = false;
    });
}, { passive: true });

updateScrollUi();

const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const formStatus = document.getElementById("formStatus");
const disciplineSignal = document.querySelector(".jlf-about-signal--discipline");
const educationSignal = document.querySelector(".jlf-about-signal--education");
const growthSignal = document.querySelector(".jlf-about-signal--growth");
const craftCard = document.querySelector(".jlf-about-card--craft");
const aboutPortraitImage = document.querySelector(".jlf-about-card--portrait img[data-default-src]");

if (contactForm && sendBtn) {
    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        sendBtn.classList.add("sending");
        if (formStatus) formStatus.textContent = "Sending your message.";

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            sendBtn.classList.remove("sending");
            sendBtn.classList.add("sent");
            sendBtn.disabled = true;
            contactForm.reset();
            if (formStatus) formStatus.textContent = "Message sent successfully.";
        } catch {
            sendBtn.classList.remove("sending");
            sendBtn.textContent = "Error - Try Again";
            if (formStatus) formStatus.textContent = "Message failed to send. Please try again or email me directly.";
        }
    });
}

if (aboutPortraitImage) {
    const defaultSrc = aboutPortraitImage.dataset.defaultSrc;
    const disciplineSrc = aboutPortraitImage.dataset.disciplineSrc;
    const educationSrc = aboutPortraitImage.dataset.educationSrc;
    const growthSrc = aboutPortraitImage.dataset.growthSrc;
    const perspectiveSrc = aboutPortraitImage.dataset.perspectiveSrc;

    const setPortraitState = state => {
        aboutPortraitImage.classList.toggle("is-discipline", state === "discipline");
        aboutPortraitImage.classList.toggle("is-perspective", state === "perspective");
    };

    const swapPortrait = (nextSrc, state = "") => {
        if (!nextSrc || aboutPortraitImage.getAttribute("src") === nextSrc) return;

        setPortraitState(state);
        aboutPortraitImage.classList.add("is-swapping");

        window.setTimeout(() => {
            aboutPortraitImage.src = nextSrc;
        }, 90);

        window.setTimeout(() => {
            aboutPortraitImage.classList.remove("is-swapping");
        }, 220);
    };

    const queueImagePreload = source => {
        if (!source) return;

        const preload = () => {
            const image = new Image();
            image.decoding = "async";
            image.src = source;
        };

        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(preload, { timeout: 1200 });
            return;
        }

        window.setTimeout(preload, 250);
    };

    [disciplineSrc, educationSrc, growthSrc, perspectiveSrc].forEach(queueImagePreload);

    if (disciplineSignal) {
        disciplineSignal.addEventListener("mouseenter", () => {
            swapPortrait(disciplineSrc, "discipline");
        });

        disciplineSignal.addEventListener("focus", () => {
            swapPortrait(disciplineSrc, "discipline");
        });

        disciplineSignal.addEventListener("mouseleave", () => {
            swapPortrait(defaultSrc);
        });

        disciplineSignal.addEventListener("blur", () => {
            swapPortrait(defaultSrc);
        });
    }

    if (educationSignal) {
        educationSignal.addEventListener("mouseenter", () => {
            swapPortrait(educationSrc);
        });

        educationSignal.addEventListener("focus", () => {
            swapPortrait(educationSrc);
        });

        educationSignal.addEventListener("mouseleave", () => {
            swapPortrait(defaultSrc);
        });

        educationSignal.addEventListener("blur", () => {
            swapPortrait(defaultSrc);
        });
    }

    if (growthSignal) {
        growthSignal.addEventListener("mouseenter", () => {
            swapPortrait(growthSrc);
        });

        growthSignal.addEventListener("focus", () => {
            swapPortrait(growthSrc);
        });

        growthSignal.addEventListener("mouseleave", () => {
            swapPortrait(defaultSrc);
        });

        growthSignal.addEventListener("blur", () => {
            swapPortrait(defaultSrc);
        });
    }

    if (craftCard) {
        craftCard.addEventListener("mouseenter", () => {
            swapPortrait(perspectiveSrc, "perspective");
        });

        craftCard.addEventListener("focusin", () => {
            swapPortrait(perspectiveSrc, "perspective");
        });

        craftCard.addEventListener("mouseleave", () => {
            swapPortrait(defaultSrc);
        });

        craftCard.addEventListener("focusout", () => {
            swapPortrait(defaultSrc);
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runLoader, { once: true });
} else {
    runLoader();
}
