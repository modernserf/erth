const fs = require("fs")
const peg = require("pegjs")
const { actionCreators } = require("./schema")

const grammar = fs.readFileSync("src/erth.pegjs", {encoding: "utf8"})
const parser = peg.buildParser(grammar)

function parse (str) {
    try {
        return parser.parse(str)
    } catch (e) {
        return actionCreators.parseError(str)
    }
}

module.exports = parse
