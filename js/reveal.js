// Reveal animated sections as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-up");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
    });

    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(item => item.classList.add("active"));
}

(function initJourneySystem() {
    const section = document.querySelector(".portfolio-journey");
    const timeline = document.querySelector(".journey-timeline");
    const items = Array.from(document.querySelectorAll(".journey-item"));
    const readoutTitle = document.querySelector(".journey-readout-title");
    const readoutMeta = document.querySelector(".journey-readout-meta");

    if (!section || !timeline || !items.length || !readoutTitle || !readoutMeta) {
        return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const progressPulse = document.createElement("span");
    progressPulse.className = "journey-progress-pulse";
    progressPulse.setAttribute("aria-hidden", "true");
    timeline.appendChild(progressPulse);

    const itemData = items.map(item => ({
        year: item.dataset.journeyYear ?? "",
        title: item.dataset.journeyTitle ?? "",
        role: item.dataset.journeyRole ?? ""
    }));

    let scrollActiveIndex = 0;
    let hoverActiveIndex = null;
    let currentActiveIndex = -1;

    function setActive(index) {
        const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
        if (clampedIndex === currentActiveIndex) {
            return;
        }

        currentActiveIndex = clampedIndex;
        const activeItem = items[clampedIndex];

        items.forEach((item, itemIndex) => {
            item.classList.toggle("is-current", itemIndex === clampedIndex);
        });

        readoutTitle.textContent = itemData[clampedIndex].title;
        readoutMeta.textContent = `${itemData[clampedIndex].year} | ${itemData[clampedIndex].role}`;

        const sectionRect = section.getBoundingClientRect();
        const focusRect = activeItem.getBoundingClientRect();
        const centerX = ((focusRect.left + (focusRect.width / 2)) - sectionRect.left) / sectionRect.width;
        const centerY = ((focusRect.top + (focusRect.height / 2)) - sectionRect.top) / Math.max(sectionRect.height, 1);

        section.style.setProperty("--journey-ambient-x", `${Math.max(12, Math.min(88, centerX * 100))}%`);
        section.style.setProperty("--journey-ambient-y", `${Math.max(10, Math.min(84, centerY * 100))}%`);
        section.style.setProperty("--journey-active-progress", "1");
    }

    function getTargetIndex() {
        return hoverActiveIndex !== null ? hoverActiveIndex : scrollActiveIndex;
    }

    items.forEach((item, index) => {
        const card = item.querySelector(".journey-card");

        item.addEventListener("mouseenter", () => {
            hoverActiveIndex = index;
            setActive(index);
        });

        item.addEventListener("mouseleave", () => {
            hoverActiveIndex = null;
            setActive(getTargetIndex());
        });

        if (!card) return;

        let cardRect = null;
        let pointerFrameId = 0;
        let pendingPointerEvent = null;

        card.addEventListener("pointerenter", () => {
            cardRect = card.getBoundingClientRect();
        }, { passive: true });

        card.addEventListener("pointermove", event => {
            if (reducedMotionQuery.matches) return;

            pendingPointerEvent = event;
            if (pointerFrameId) return;

            pointerFrameId = window.requestAnimationFrame(() => {
                const pointerEvent = pendingPointerEvent;
                const rect = cardRect || card.getBoundingClientRect();
                pendingPointerEvent = null;
                pointerFrameId = 0;

                if (!pointerEvent) return;

                const x = ((pointerEvent.clientX - rect.left) / rect.width) * 100;
                const y = ((pointerEvent.clientY - rect.top) / rect.height) * 100;
                const tiltX = ((pointerEvent.clientX - (rect.left + rect.width / 2)) / rect.width) * 5;
                const tiltY = ((pointerEvent.clientY - (rect.top + rect.height / 2)) / rect.height) * -5;

                card.style.setProperty("--pointer-x", `${x}%`);
                card.style.setProperty("--pointer-y", `${y}%`);
                card.style.setProperty("--journey-tilt-x", `${tiltX}deg`);
                card.style.setProperty("--journey-tilt-y", `${tiltY}deg`);
            });
        }, { passive: true });

        card.addEventListener("pointerleave", () => {
            cardRect = null;
            card.style.setProperty("--pointer-x", "50%");
            card.style.setProperty("--pointer-y", "50%");
            card.style.setProperty("--journey-tilt-x", "0deg");
            card.style.setProperty("--journey-tilt-y", "0deg");
        });
    });

    function syncTimelineState() {
        const timelineRect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const focusLine = viewportHeight * 0.4;

        let bestIndex = 0;
        let bestDistance = Number.POSITIVE_INFINITY;

        items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const middle = rect.top + (rect.height / 2);
            const distance = Math.abs(middle - focusLine);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = index;
            }

            if (rect.top < viewportHeight * 0.68 && rect.bottom > viewportHeight * 0.24) {
                item.classList.add("active");
            } else if (!item.classList.contains("reveal-left") && !item.classList.contains("reveal-right") && !item.classList.contains("reveal-up")) {
                item.classList.remove("active");
            }
        });

        scrollActiveIndex = bestIndex;
        setActive(getTargetIndex());

        if (timelineRect.top < viewportHeight * 0.8 && timelineRect.bottom > viewportHeight * 0.15) {
            const scrollRatio = Math.max(0, Math.min(1, (viewportHeight * 0.72 - timelineRect.top) / (timelineRect.height + viewportHeight * 0.2)));
            section.style.setProperty("--journey-scan-offset", `${scrollRatio * 112}%`);
            section.style.setProperty("--journey-active-progress", "1");
        } else {
            section.style.setProperty("--journey-active-progress", "0");
        }
    }

    let ticking = false;

    function requestSync() {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            syncTimelineState();
            ticking = false;
        });
    }

    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("load", requestSync);
    window.addEventListener("resize", requestSync);
    reducedMotionQuery.addEventListener?.("change", requestSync);

    requestSync();
})();
