function myFirstCalculator(input) {
    if (input.match(/[a-zA-Z"'\\]/)) {
        return "Bad input. Letters, backslashes, and quote marks are not allowed!";
    } else if (input.length>45){
        return "Bad input. Input must be 45 characters long or less"
    }
    else {
        try {
            return (eval(input));
        } catch (e) {
            return "Calculator returned error: " + e;
        }
    }
}

console.log("Get the flag by making the calculator output \"bcactf\"!");
if (process.argv.length < 3) {
    console.log("Please run this program with an argument.");
    process.exit();
}
c = myFirstCalculator(process.argv[2]); //might need to change the "< 3" and "[2]" when using netcat
console.log("Result: " + c);
if (c === "bcactf") {
    console.log("Congrats! The flag is bcactf{G00D_EV4LUAT1ON}");
}