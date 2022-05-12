function myFirstCalculator(input) {
    if (input.match(/[a-zA-Z"'\\]/)) {
        return "Bad input. Letters, backslashes, and quote marks are not allowed!";
    } else {
        try {
            return (eval(input));
        } catch (e) {
            return "Calculator returned error: " + e;
        }
    }
}

console.log("Get the flag by making the calculator output \"yoursecond\"!");
if (process.argv.length < 3) {
    console.log("Please run this programs with an argument.");
    process.exit();
}
c = myFirstCalculator(process.argv[2]); //might need to change the "< 3" and "[2]" when using netcat
console.log("Result: " + c);
if (c === "yoursecond") {
    console.log("Congrats! The flag is bcactf{G00D_EV4LUAT1ON}");
}