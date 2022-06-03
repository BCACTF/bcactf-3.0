let current = 0;

window.addEventListener("load", () => {
    const button = /** @type {HTMLButtonElement} */ (document.getElementById("continue"));
    const story = document.getElementById("story");
    button.addEventListener("click", async () => {
        button.disabled = true;
        const response = await fetch(`/story?part=${current}`);
        current++;
        if (response.status === 404) {
            story.innerText = "Fin";
        } else {
            const text = await response.text();
            story.innerText = text;
            button.disabled = false;
        }
    });
});