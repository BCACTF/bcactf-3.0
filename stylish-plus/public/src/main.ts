/// <reference path="./globals.ts" />

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

let passcode = "";
let flag: string | undefined = undefined;

function setPasscode(newPasscode: string) {
    passcode = newPasscode;
    document.getElementById("admin-modal-code")!.innerText = passcode;
}

const wrongMessages = [
    "You got it wrong. Try harder next time.",
    "Can't get the passcode? That's a you problem.",
    "Hands off my passcode!",
    "You're not getting in.",
    "Maybe if you bring me a box of ramen, I'll consider it.",
    "Try mashing on the keyboard harder.",
];

async function submitPasscode() {
    const title = document.getElementById("admin-modal-title")!;
    title.innerText = "Submitting...";

    try {
        const response = await fetch("/api/flag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                passcode,
            }),
        });

        if (response.status === 200) {
            flag = await response.text();
            title.innerText = "Welcome to the Admin Panel";
            document.getElementById("admin-passcode-entry")!.style.display = "none";
            document.getElementById("admin-restricted")!.style.display = "flex";
        } else if (response.status === 403) {
            title.innerText = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (e) {
        console.error(e);
        title.innerText = "An error occurred."
    }
}

async function expressApproval() {
    const button = document.getElementById("express-approval")! as HTMLButtonElement;
    button.disabled = true;

    const title = document.getElementById("admin-modal-title")!;
    title.innerText = "Expressing approval...";

    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) throw new Error("No ID");
        const { status } = await fetch(`/api/approve/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                flag,
            }),
        });

        if (status !== 200) throw new Error(`Unexpected response status: ${status}`);

        title.innerText = "Approval expressed!";
    } catch (e) {
        title.innerText = "Couldn't express approval.";
        console.error(e);
    }
    
    button.disabled = false;
}

function showFlag() {
    alert(flag!);
}

window.addEventListener("load", () => {
    document.getElementById("algorithm")!.addEventListener("click", summonTheAlgorithm);
    document.getElementById("express-approval")!.addEventListener("click", expressApproval);
    document.getElementById("show-flag")!.addEventListener("click", showFlag);

    const buttons = [
        "D", "E", "F",
        "A", "B", "C",
        "7", "8", "9",
        "4", "5", "6",
        "1", "2", "3",
        "Reset", "0", "Submit",
    ];
    const indices = [...Array(buttons.length).keys()];
    for (let i = 0; i < indices.length; i++) {
        const j = Math.floor(Math.random() * indices.length);
        const temp = indices[i];
        indices[i] = indices[j];
        indices[j] = temp;
    }

    const keypad = document.getElementById("keypad")!;
    let css = "";
    for (let i = 0; i < indices.length; i++) {
        const button = buttons[indices[i]];
        css += `
            #keypad button:nth-child(${i + 1}) {
                order: ${indices[i]};
            }
        `;
        const template = document.getElementById("keypad-button")! as HTMLTemplateElement;
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const el = fragment.querySelector("button")! as HTMLButtonElement;
        el.innerText = button;
        el.addEventListener("click", () => {
            if (button === "Reset") {
                setPasscode("");
            } else if (button === "Submit") {
                el.disabled = true;
                submitPasscode().finally(() => {
                    el.disabled = false;
                })
            } else {
                setPasscode(passcode + button);
            }
        });
        keypad.appendChild(el);
    }
    const keypadStyle = document.createElement("style");
    keypadStyle.innerText = css;
    document.head.appendChild(keypadStyle);

    MicroModal.init();
});