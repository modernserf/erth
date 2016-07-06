const { actions } = require("./schema")
const stdlib = require("./stdlib")

const macros = {
    define: (_, env, body) => {
        const name = body[0].payload
        const expr = body.slice(1)
        env[name] = (stack, env_) => evalExpression(stack, env_, expr)
    },
}

function evalToken (stack, env, { type, payload }) {
    switch (type) {
    case actions.string:
    case actions.number:
        stack.push(payload)
        return
    case actions.word:
        env[payload](stack, env)
        return
    case actions.macro:
        macros[payload.type](stack, env, payload.body)
        return
    }
}

function evalExpression (stack, env, expr) {
    expr.forEach((token) => evalToken(stack, env, token))
}

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

    evalExpression(stack, dictionary, ast.payload)
    // return normal array
    return stack.slice(0)
}

module.exports = run
