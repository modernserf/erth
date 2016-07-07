const fs = require("fs")
const stdlib = require("./stdlib")
const { applyErth } = require("./eval")
const parse = require("./parse")

const lib = parse(fs.readFileSync("src/stdlib/lib.erth", {encoding: "utf8"}))

function createStack () {
    const stack = []
    stack._pop = stack.pop
    stack.pop = function () {
        if (this.length === 0) {
            throw new Error("Empty stack")
        }
        return stack._pop()
    }
    return stack
}

function run (ast, environment) {
    const stack = createStack()

    const dictionary = Object.assign({},
        environment,
        stdlib)
    applyErth(stack, dictionary, lib.payload)
    applyErth(stack, dictionary, ast.payload)
    // return values
    console.log("stack:", stack)
    return stack.slice(0)
}

module.exports = run
