const { evalErth, applyErth } = require("../eval")
const parse = require("../parse")

const op = (fn) => (a) => {
    const r = a.pop()
    a.push(fn(a.pop(), r))
}

const stackOps = {
    dup: (s) => {
        const x = s.pop()
        s.push(x, x)
    },
    drop: (s) => {
        s.pop()
    },
    swap: (s) => {
        const [y, x] = [s.pop(), s.pop()]
        s.push(y, x)
    },
    over: (s) => {
        const [y, x] = [s.pop(), s.pop()]
        s.push(x, y, x)
    },
    rot: (s) => {
        const [z, y, x] = [s.pop(), s.pop(), s.pop()]
        s.push(y, z, x)
    },
    "-rot": (s) => {
        const [z, y, x] = [s.pop(), s.pop(), s.pop()]
        s.push(z, x, y)
    },
    clear: (s) => {
        s.length = 0
    },
}

const returnStack = {
    __scratch: [],
    rpush: (s, env) => {
        env.__scratch.push(s.pop())
    },
    rpop: (s, env) => {
        s.push(env.__scratch.pop())
    },
    r: (s, env) => {
        s.push(env.__scratch[env.__scratch.length - 1])
    },
    rdrop: (s, env) => {
        env.__scratch.pop()
    },
}

const math = {
    "+": op((l, r) => l + r),
    "*": op((l, r) => l * r),
    "/": op((l, r) => l / r),
    "-": op((l, r) => l - r),
    div: op((l, r) => Math.floor(l / r)),
    mod: op((l, r) => ((l % r) + r) % r),
}

// uses bitwise operators to prevent short circuiting
const logic = {
    true: (s) => s.push(true),
    false: (s) => s.push(false),
    and: (s) => s.push(!!(s.pop() & s.pop())),
    or: (s) => s.push(!!(s.pop() | s.pop())),
    xor: (s) => s.push(!!(s.pop() ^ s.pop())),
    not: (s) => s.push(!s.pop()),
}

const comparison = {
    "=": op((a, b) => a === b),
    "!=": op((a, b) => a !== b),
    ">": op((a, b) => a > b),
    "<": op((a, b) => a < b),
    ">=": op((a, b) => a >= b),
    "<=": op((a, b) => a <= b),
    "?": (s) => {
        const [els, thn, iff] = [s.pop(), s.pop(), s.pop()]
        s.push(iff ? thn : els)
    },
}

const substacks = {
    quote: (s) => s.push([s.pop()]),
    push: (s) => {
        const [val, ss] = [s.pop(), s.pop()]
        s.push(ss.concat([val]))
    },
    pop: (s, env) => {
        const ss = s.pop().slice(0)
        const val = ss.pop()
        s.push(ss)
        evalErth(s, env, val)
    },
    split: (s) => {
        const [pos, ss] = [s.pop(), s.pop()]
        const l = ss.slice(0, pos)
        const r = ss.slice(pos)
        s.push(l, r)
    },
    concat: (s) => {
        const [y, x] = [s.pop(), s.pop()]
        s.push(x.concat(y))
    },
    apply: (s, env) => {
        applyErth(s, env, s.pop())
    },
    ins: (s, env) => {
        const [fns, vals] = [s.pop(), s.pop()]
        s.push(vals.reduce((coll, val) => coll.concat([val], fns), []))
    },
}

const meta = {
    eval: (s, env) => {
        applyErth(s, env, parse(s.pop()).payload)
    },

}

module.exports = Object.assign({},
    math, logic, stackOps, returnStack, comparison, substacks, meta)
