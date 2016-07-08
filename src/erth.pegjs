Program
= _ program:Expression* _ {
    return { type: "program", payload: program }
}

/* Expressions */

Expression
= _ expr:Comment _ { return expr }
/ _ expr:Definition _ { return expr }
/ _ expr:Substack _ { return expr }
/ _ expr:Number _ { return expr }
/ _ expr:String _ { return expr }
/ _ expr:Word _ { return expr }


Definition
= name:Word? ":" _ expr:Expression* _ ";" {
    return {
        type: name ? name.payload : "define",
        payload: expr,
    }
}

Substack
= name:Word? "[" _ expr:Expression* _ "]" {
    return {
        type: name ? name.payload : "substack",
        payload: expr,
    }
}

/* Comments */

Comment
= "(" comment:CommentChar* ")" { return {
    type: "comment",
    payload: comment.join("")
}}

CommentChar
= EscParen
/ NonParen

EscParen
= "\\)" { return ')' }

NonParen
= ![\)]+ ch:. { return ch }

/* Words */

Word
= WordChar+ {
    return { type: "word", payload: text() }
}

WordChar
= ![ '"\t\n\r:;\[\]]+ ch:. { return ch }

/* Strings */

String
= Quote str:Char* Quote { return { type: "string", payload: str.join("") } }
/ "'" str:WordChar+ { return { type: "string", payload: str.join("") } } 

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
= [ \t\n\r]*
