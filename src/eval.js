const { actions } = require("./schema")

function evalErth (stack, env, token) {
    // unboxed value
    if (!token.type) {
        stack.push(token)
        return
    }
    switch (token.type) {
    case actions.comment:
        return
    case actions.string:
    case actions.number:
    case actions.substack:
        stack.push(token.payload)
        return
    case actions.word:
        env[token.payload](stack, env)
        return
    case actions.define: {
        const name = token.payload[0].payload
        const expr = token.payload.slice(1)
        env[name] = (stack, env_) => applyErth(stack, env_, expr)
        return
    }
    }
}

function applyErth (stack, env, expr) {
    expr.forEach((token) => evalErth(stack, env, token))
}

module.exports = { evalErth, applyErth }
