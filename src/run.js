const fs = require("fs")
const stdlib = require("./stdlib")
const { evalExpression } = require("./eval")
const parse = require("./parse")

const lib = parse(fs.readFileSync("src/stdlib/lib.erth", {encoding: "utf8"}))
console.log(lib)

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
    evalExpression(stack, dictionary, lib.payload)
    evalExpression(stack, dictionary, ast.payload)
    // return normal array
    return stack.slice(0)
}

module.exports = run
