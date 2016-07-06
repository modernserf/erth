const { createSchema, types: t } = require("redux-action-schema")

const token = (x) => x.type && x.payload

const schema = createSchema([
    ["parseError", t.String],
    ["number", t.Number],
    ["string", t.String],
    ["word", t.String],
    ["macro",
        ["type", t.String],
        ["body", t.ArrayOf(token)]],
    ["program", t.ArrayOf(token)],
])

module.exports = schema
