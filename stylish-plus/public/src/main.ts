/// <reference path="./micromodal.d.ts" />

interface Theme {
    bodyBG: string;
    bodyFG: string;
    accentBG: string;
    accentFG: string;
}

function setTheme({bodyBG, bodyFG, accentBG, accentFG}: Theme) {
    document.getElementById("style")!.innerText = `
        :root {
            --body-bg: ${bodyBG};
            --body-fg: ${bodyFG};
            --accent-bg: ${accentBG};
            --accent-fg: ${accentFG};
        }
    `;
}

function algorithmThings() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 100%, 50%)`;
}

function summonTheAlgorithm() {
    setTheme({
        bodyBG: algorithmThings(),
        bodyFG: algorithmThings(),
        accentBG: algorithmThings(),
        accentFG: algorithmThings(),
    });
}

window.addEventListener("load", _load => {
    MicroModal.init();
    document.getElementById("algorithm")!.addEventListener("click", summonTheAlgorithm);
    Array.from(document.getElementsByClassName("modal-content")).forEach(el => {
        el.addEventListener("click", e => {
            e.stopPropagation();
        });
    });
});