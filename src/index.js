const parse = require("./parse")
const run = require("./run")

const stdEnv = {
    random: () => Math.random(),
    time: () => Date.now(),
    output: (str) => console.log(str),
}

// TODO: do something with stack remainer
function runProgram (str, env = stdEnv) {
    run(parse(str), env)
}

module.exports = { runProgram }
