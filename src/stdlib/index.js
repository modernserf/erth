const op = (fn) => (a) => {
    const r = a.pop()
    return a.push(fn(a.pop(), r))
}

const div = (l, r) => Math.floor(l / r)
const mod = (l, r) => ((l % r) + r) % r

const math = {
    "+": op((l, r) => l + r),
    "*": op((l, r) => l * r),
    "/": op((l, r) => l / r),
    "-": op((l, r) => l - r),
    div: op(div),
    mod: op(mod),
    divmod: (s) => {
        const r = s.pop()
        const l = s.pop()
        return s.push(div(l, r), mod(l, r))
    },
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

const stackOps = {
    dup: (s) => {
        const x = s.pop()
        return s.push(x, x)
    },
    drop: (s) => {
        s.pop()
        return s
    },
    swap: (s) => {
        const [y, x] = [s.pop(), s.pop()]
        return s.push(y, x)
    },
    over: (s) => {
        const [y, x] = [s.pop(), s.pop()]
        return s.push(x, y, x)
    },
    rot: (s) => {
        const [z, y, x] = [s.pop(), s.pop(), s.pop()]
        return s.push(y, z, x)
    },
    "-rot": (s) => {
        const [z, y, x] = [s.pop(), s.pop(), s.pop()]
        return s.push(z, x, y)
    },
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
        return s.push(iff ? thn : els)
    },
}

module.exports = Object.assign({}, math, logic, stackOps, comparison)
