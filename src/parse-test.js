const test = require("tape")
const parse = require("./parse")
const { actions } = require("./schema")

function parseToken (program) {
    return parse(program).payload[0]
}

test.skip("parse error ", (t) => {
    const ast = parseToken(`foo 12.e`)
    t.equals(ast.type, actions.parseError)
    t.end()
})

test("parse a number", (t) => {
    const ast = parseToken(`-123.45`)
    t.equals(ast.type, actions.number)
    t.equals(ast.payload, -123.45)
    t.end()
})

test("parse a quoted string", (t) => {
    const ast = parseToken(`"foo"`)
    t.equals(ast.type, actions.string)
    t.equals(ast.payload, "foo")
    t.end()
})

test("parse a quoted word", (t) => {
    t.deepEquals(parseToken(`'foo`), {
        type: "string", payload: "foo",
    })
    t.end()
})

test("parse a word", (t) => {
    const ast = parseToken(`foo`)
    t.equals(ast.type, actions.word)
    t.equals(ast.payload, "foo")
    t.end()
})

test("parse a definition", (t) => {
    const ast = parseToken(`: addOne 1 + ;`)
    t.deepEquals(ast, {
        type: "define",
        payload: [
            { type: "word", payload: "addOne" },
            { type: "number", payload: 1 },
            { type: "word", payload: "+" },
        ],
    })
    t.end()
})

test("substack literals", (t) => {
    const ast = parseToken(`[1 2 3]`)
    t.deepEquals(ast, {
        type: "substack",
        payload: [
            { type: "number", payload: 1 },
            { type: "number", payload: 2 },
            { type: "number", payload: 3 },
        ],
    })
    t.end()
})

test("parse a program", (t) => {
    const ast = parse(`1   2 +
        ["foo" "bar"] eval ++
        `)
    t.deepEquals(ast, {
        type: "program",
        payload: [
            /* eslint-disable no-multi-spaces */
            { type: "number", payload: 1 },
            { type: "number", payload: 2 },
            { type: "word",   payload: "+" },
            { type: "substack", payload: [
                { type: "string", payload: "foo" },
                { type: "string", payload: "bar" },
            ]},
            { type: "word",   payload: "eval" },
            { type: "word",   payload: "++" },
            /* eslint-enable no-multi-spaces */
        ],
    })
    t.end()
})

test("comments", (t) => {
    t.deepEquals(parseToken(`: foo (number -- number\\)) 1 + ;`), {
        type: "define",
        payload: [
            { type: "word", payload: "foo" },
            { type: "comment", payload: "number -- number)" },
            { type: "number", payload: 1 },
            { type: "word", payload: "+" },
        ],
    })
    t.end()
})
