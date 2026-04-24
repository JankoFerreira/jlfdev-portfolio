function splitHeroRevealWords(target) {
    if (!target || target.dataset.heroRevealSplit === "true") {
        return;
    }

    let wordIndex = 0;
    const existingWords = target.querySelectorAll(".hero-word");

    if (existingWords.length > 0) {
        existingWords.forEach(word => {
            const wrapper = document.createElement("span");
            wrapper.className = "hero-drop-word";
            wrapper.style.setProperty("--hero-word-index", wordIndex.toString());
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
            wordIndex += 1;
        });
        target.dataset.heroRevealSplit = "true";
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

        const wrapper = document.createElement("span");
        wrapper.className = "hero-drop-word";
        wrapper.style.setProperty("--hero-word-index", wordIndex.toString());
        wrapper.textContent = part;
        fragment.appendChild(wrapper);
        wordIndex += 1;
    }

    target.replaceChildren(fragment);
    target.dataset.heroRevealSplit = "true";
}

document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll(".hero-word-reveal")
        .forEach(splitHeroRevealWords);
});
