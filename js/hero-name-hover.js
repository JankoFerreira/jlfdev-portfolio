const heroWordSequenceStartedAt = performance.now();
const heroWordStepSeconds = 0.8;

function decorateHeroWords(target) {
    if (!target) {
        return;
    }

    const text = target.textContent || "";
    const fragment = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);

    for (const part of parts) {
        if (!part) {
            continue;
        }

        if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
            continue;
        }

        const word = document.createElement("span");
        word.className = "hero-word";
        word.textContent = part;
        fragment.appendChild(word);
    }

    target.replaceChildren(fragment);
}

function reindexHeroWords() {
    const elapsedSeconds = (performance.now() - heroWordSequenceStartedAt) / 1000;

    document.querySelectorAll(".hero-name .hero-word").forEach((word, index) => {
        word.style.setProperty("--word-index", index.toString());
        word.style.setProperty("--word-delay", `${(index * heroWordStepSeconds) - elapsedSeconds}s`);
    });
}

window.decorateHeroWords = decorateHeroWords;
window.reindexHeroWords = reindexHeroWords;

document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll(".hero-name-intro, .hero-roles-prefix, .hero-role-article, .hero-roles-word")
        .forEach(decorateHeroWords);

    reindexHeroWords();
});
