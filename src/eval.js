const { actions, actionCreators } = require("./schema")
const { types } = require("redux-action-schema")

const macros = {
    define: (_, env, body) => {
        const name = body[0].payload
        const expr = body.slice(1)
        env[name] = (stack, env_) => evalExpression(stack, env_, expr)
    },
    substack: (stack, env, body) => {
        const ss = body
        stack.push(ss)
    },
}

function quote (value) {
    return types.Number(value) ? actionCreators.number(value)
        : types.String(value) ? actionCreators.string(value)
        : actionCreators.macro({ type: "substack", body: value })
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

module.exports = { quote, evalToken, evalExpression }
