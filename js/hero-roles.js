// Rotate the highlighted role in the hero heading with a type/delete effect.
const heroRoleRotator = document.querySelector(".hero-roles-rotator");

if (heroRoleRotator) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const roleTrack = heroRoleRotator.querySelector(".hero-roles-word");
    const roleArticle = document.querySelector(".hero-role-article");

    let roles = [];

    try {
        roles = JSON.parse(heroRoleRotator.dataset.roles || "[]");
    } catch {
        roles = [];
    }

    roles = roles
        .filter(role => typeof role === "string" && role.trim().length > 0)
        .map(role => role.trim());

    if (roles.length > 0 && roleTrack) {
        const pauseDelay = Number(heroRoleRotator.dataset.rotationDelay) || 2400;
        const deleteSpeed = 52;
        const typeSpeed = 68;
        const emptyPause = 280;
        const startPause = 1100;

        let currentIndex = 0;
        let stepTimer = null;

        function measureWidth(text) {
            // Measure every role once so the heading width stays stable while rotating.
            const probe = document.createElement("span");
            probe.className = "hero-roles-word";
            probe.style.position = "absolute";
            probe.style.visibility = "hidden";
            probe.style.pointerEvents = "none";
            probe.textContent = text;
            heroRoleRotator.appendChild(probe);
            const width = probe.getBoundingClientRect().width;
            probe.remove();
            return width;
        }

        function setStableWidth() {
            const widest = Math.max(...roles.map(role => measureWidth(role)));
            heroRoleRotator.style.setProperty("--hero-roles-width", `${Math.ceil(widest)}px`);
        }

        function getIndefiniteArticle(text) {
            return /^[aeiou]/i.test(text.trim()) ? "an" : "a";
        }

        function updateRole(text) {
            roleTrack.textContent = text;
            heroRoleRotator.setAttribute("aria-label", text);
            window.decorateHeroWords?.(roleTrack);

            if (roleArticle) {
                const nextArticle = getIndefiniteArticle(text);
                if (roleArticle.dataset.article !== nextArticle) {
                    roleArticle.textContent = nextArticle;
                    roleArticle.dataset.article = nextArticle;
                    window.decorateHeroWords?.(roleArticle);
                }
            }

            window.reindexHeroWords?.();
        }

        function clearTimer() {
            window.clearTimeout(stepTimer);
        }

        function schedule(delay, callback) {
            clearTimer();
            stepTimer = window.setTimeout(callback, delay);
        }

        function typeRole(targetText, next) {
            let visibleLength = 0;

            function tick() {
                visibleLength += 1;
                updateRole(targetText.slice(0, visibleLength));

                if (visibleLength < targetText.length) {
                    schedule(typeSpeed, tick);
                    return;
                }

                schedule(pauseDelay, next);
            }

            if (!targetText.length) {
                schedule(pauseDelay, next);
                return;
            }

            tick();
        }

        function deleteRole(currentText, nextText) {
            let visibleLength = currentText.length;

            function tick() {
                visibleLength -= 1;
                updateRole(currentText.slice(0, visibleLength));

                if (visibleLength > 0) {
                    schedule(deleteSpeed, tick);
                    return;
                }

                schedule(emptyPause, () => typeRole(nextText, rotateToNext));
            }

            if (!currentText.length) {
                schedule(emptyPause, () => typeRole(nextText, rotateToNext));
                return;
            }

            tick();
        }

        function rotateToNext() {
            currentIndex = (currentIndex + 1) % roles.length;
            const nextText = roles[currentIndex];
            const previousIndex = (currentIndex - 1 + roles.length) % roles.length;
            const currentText = roles[previousIndex];

            deleteRole(currentText, nextText);
        }

        function reset() {
            clearTimer();
            currentIndex = 0;
            updateRole(roles[currentIndex]);

            // Reduced-motion users still get the first role, just without cycling animation.
            if (!prefersReducedMotion.matches && roles.length > 1) {
                schedule(startPause, rotateToNext);
            }
        }

        setStableWidth();
        reset();

        window.addEventListener("resize", setStableWidth);

        prefersReducedMotion.addEventListener("change", () => {
            reset();
        });
    }
}
