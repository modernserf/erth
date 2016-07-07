const { applyErth } = require("../eval")

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
        return s
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
}

const math = {
    "+": op((l, r) => l + r),
    "*": op((l, r) => l * r),
    "/": op((l, r) => l / r),
    "-": op((l, r) => l - r),
    div: op((l, r) => Math.floor(l / r)),
    mod: op((l, r) => ((l % r) + r) % r),
}

// TODO: box bools

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
        ss.push(val)
        s.push(ss)
    },
    apply: (s, env) => {
        applyErth(s, env, s.pop())
    },
    ins: (s, env) => {
        const [fns, vals] = [s.pop(), s.pop()]
        s.push(vals.reduce((coll, val) => coll.concat([val], fns), []))
    },
}

module.exports = Object.assign({},
    math, logic, stackOps, comparison, substacks)
