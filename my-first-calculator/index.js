const readline = require('readline');

function myFirstCalculator(input) {
    if (!input) return "Please input text";
    if (input.match(/[a-zA-Z"`'\\]/)) {
        return "Bad input. Letters, backslashes, backticks, and quote marks are not allowed!";
    } else if (input.length > 45){
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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('> ', (response) => {
  const c = myFirstCalculator(response)
  console.log("Result: " + c);
  if (c === "bcactf") {
    console.log("Congrats! The flag is bcactf{G00D_EV4LUAT1ON}");
  }
    
  rl.close();
  process.exit(0);
});
