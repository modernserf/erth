Program
= _? head:ProgramComponent tail:SpProgramComponent* _? {
    var program = head.concat.apply(head, tail)
    return { type: "program", payload: program }
}

SpProgramComponent
= _ pg:ProgramComponent { return pg }

ProgramComponent
= macro:Macro { return [macro] }
/ Expression

/* Macros */

Macro
= name:Word? ":" _ body:Expression _ ";" {
    return { type: "macro", payload: {
        type: name ? name.payload : "define",
        body: body,
    } }
}

/* Expressions */

Expression
= head:Atom tail:AtomSp* {
  return [head].concat(tail)
}

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
= ![ \t\n\r:;]+ ch:. { return ch }

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
