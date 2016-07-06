Program
= _? head:Atom tail:AtomSp* _? {
  return { type: "program", payload: [head].concat(tail) }
}

AtomSp
= _ atom:Atom {
    return atom
}

Atom
= Number
/ String
/ Word

/* Words */

Word
= NonSpChar+ {
    return { type: "word", payload: text() }
}

NonSpChar
= !_ ch:. { return ch }

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
