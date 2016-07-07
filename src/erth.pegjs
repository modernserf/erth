Program
= _? program:Exprs _? {
    return { type: "program", payload: program }
}

/* Expressions */

Exprs
= car:Expression _ cdr:Exprs { return car.concat.apply(car,cdr) }
/ exprs:Expression { return exprs }

Expression
= name:Word? ":" _ expr:Expression? _ ";" { return [{
    type: "macro", payload: {
        type: name ? name.payload : "define",
        body: expr || [],
    } }] }
/ name:Word? "[" _? expr:Expression? _? "]" { return [{
    type: "macro", payload: {
        type: name ? name.payload : "substack",
        body: expr || [],
    } }] }
/ atom:Atom _ expr:Expression { return [atom].concat(expr) }
/ atom:Atom { return [atom] }

AtomSp
= _ atom:Atom { return atom }

Atom
= Number
/ String
/ Word

/* Words */

Word
= WordChar+ {
    return { type: "word", payload: text() }
}

WordChar
= ![ \t\n\r:;\[\]]+ ch:. { return ch }

/* Strings */

String
= Quote str:Char* Quote {
    return { type: "string", payload: str.join("") }
}

Quote
= '"'

Char
= EscQuote
/ NonQuote

EscQuote
= '\\"' { return '"' }

NonQuote
= !'"' ch:. { return ch }

/* Digits */

Number
= "-"? Digits FracDigits? {
    return { type: "number", payload: Number(text()) }
}

FracDigits
= "." Digits { return text() }

Digits
= [0-9]+ { return text() }

_ "whitespace"
= [ \t\n\r]+
