# Erth
A concatenative actor language

---

## TODO

- substack refcounting  
    - substacks are refs to "heap"
    - operations are mutable, substacks with multiple refs copy (& decrement) before mutating
    - weakmap of array => count

- CLI REPL
- web REPL
- documentation
- string ops
- error handling
- I/O
- process model
- pattern matching
