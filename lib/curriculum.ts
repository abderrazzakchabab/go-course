export type Level = "beginner" | "intermediate" | "advanced" | "expert";

export interface Lab { goal: string; steps: string[]; verifyId: string; starter: string }
export interface Section { heading: string; body: string }
export interface Exercise { question: string; hint?: string; answer: string }
export interface Chapter {
  id: string;
  level: Level;
  number: number;
  title: string;
  summary: string;
  duration: string;
  sections: Section[];
  keyCommands: string[];
  exercises: Exercise[];
  lab?: Lab;
}

const _CH1: Chapter[] = [
  {
    id: "hello-go",
    number: 1,
    level: "beginner",
    title: "Hello, Go",
    summary: "Why Go exists, what makes it different, and how to write and run your first program in under a minute.",
    duration: "12 min",
    sections: [
      {
        heading: "Why Go was built",
        body: "Go came out of Google in 2009, designed by people who had spent years inside very large C++ codebases. Their complaint was concrete: **builds were slow**, dependency graphs were unmanageable, and the language let you express things that didn't actually need to be expressed. Go's answer was to delete features. No classes. No inheritance. No generics until 2022, and even then conservatively. The compiler should be fast enough that you stop noticing it. A team should be able to read code written by another team without ceremony.\n\nThe payoff is that Go programs feel boring in the best sense. There is usually exactly one way to do something, and that one way is what everyone uses. This makes the language easy to learn and surprisingly hard to outgrow."
      },
      {
        heading: "Your first program",
        body: "Every Go file starts with a **package** declaration. The special package `main` produces an executable; anything else produces a library. The `main` function is where execution begins.\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"hello, world\")\n}\n```\n\n`fmt` is the standard library's formatting package. `Println` is exported because it starts with a capital letter — that's how Go marks visibility. Lowercase identifiers are package-private. There is no `public`/`private` keyword."
      },
      {
        heading: "Running and building",
        body: "Two commands cover 90% of daily use. `go run main.go` compiles and executes in one step. `go build` produces a single static binary you can copy to a server with no runtime to install. That second property is the reason Go ate so much of the DevOps tooling world: Docker, Kubernetes, Terraform, and Hugo all ship as one file with no dependencies.\n\nThe Go toolchain is the language. There is no Maven, no virtualenv, no node_modules drama. `go fmt` formats your code to one canonical style. `go vet` catches suspicious constructs. `go test` runs tests. Learn these four verbs and you can navigate any Go repo."
      },
      {
        heading: "fmt.Printf and format verbs",
        body: "Beyond `Println`, `fmt.Printf` gives you fine-grained control over output with **format verbs**: `%d` for integers, `%f` for floats, `%s` for strings, `%v` for any value, `%T` for the type, and `%#v` for the Go-syntax representation. These are the same verbs used inside `fmt.Sprintf` to build strings and `fmt.Errorf` to build errors — learning them once pays off everywhere.\n\n```go\nname := \"ada\"\nscore := 97.5\nfmt.Printf(\"%s scored %.1f%%\\n\", name, score)\n// ada scored 97.5%\n```\n\nThe `%` must be escaped as `%%` when you want a literal percent sign."
      }
    ],
    keyCommands: ["go run main.go", "go build -o app .", "go fmt ./...", "go vet ./..."],
    exercises: [
      {
        question: "What does the capital letter on `Println` signify in Go?",
        answer: "A capitalized identifier is exported — visible to other packages. Lowercase identifiers are package-private. This is Go's entire visibility system; there are no `public`/`private` keywords."
      },
      {
        question: "Why does `go build` produce a binary with no runtime dependency?",
        answer: "The Go compiler statically links the runtime and all imports into one self-contained binary. There is no VM or interpreter to install on the target machine — this is why Go tools like Docker and Terraform ship as a single file."
      },
      {
        question: "Write a fmt.Printf call that prints: `pi ≈ 3.14` using a float64 variable.",
        hint: "Use the %.2f verb to limit decimal places.",
        answer: "```go\npi := 3.14159\nfmt.Printf(\"pi ≈ %.2f\\n\", pi)\n```"
      }
    ],
    lab: {
      goal: "Print your own greeting to stdout.",
      steps: [
        "Change the string passed to fmt.Println.",
        "Click 'Run on Go Playground' to execute.",
        "Read the output and confirm it matches what you expected."
      ],
      verifyId: "hello",
      starter: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("hello, world")\n}\n`
    }
  },
  {
    id: "types-and-variables",
    number: 2,
    level: "beginner",
    title: "Types, variables, and the zero value",
    summary: "Go is statically typed but rarely makes you say so. Learn declaration shorthand, the zero value, and why both matter.",
    duration: "15 min",
    sections: [
      {
        heading: "Declarations the long way and the short way",
        body: "Go has a verbose declaration form and a short form. The verbose form names the type explicitly: `var name string = \"ada\"`. The short form uses **type inference** with the `:=` operator: `name := \"ada\"`. Inside a function, you'll use `:=` almost exclusively. At package scope only `var` and `const` are allowed.\n\n```go\nvar count int        // declared, no value yet\ncount = 42           // assigned later\n\nname := \"ada\"        // declared + inferred + assigned\nratio := 3.14        // float64\nactive := true       // bool\n```\n\nThe **zero value** is the rule that makes Go safer than C: every variable starts at a defined value, never garbage. `int` is `0`, `string` is `\"\"`, `bool` is `false`, pointers are `nil`."
      },
      {
        heading: "Constants and untyped numbers",
        body: "`const` declares a value that the compiler bakes in. Constants can be **untyped**, which means they take on whatever type the surrounding expression needs. This is why `const pi = 3.14159` works as both `float32` and `float64` depending on where you use it.\n\n`iota` generates sequential integer constants inside a `const` block — the standard way to define enums in Go:\n\n```go\nconst (\n    StatusPending = iota // 0\n    StatusActive         // 1\n    StatusDone           // 2\n)\n```\n\nOnce you assign an untyped constant to a typed variable, it becomes that type."
      },
      {
        heading: "The basic numeric types and when each one matters",
        body: "`int` is the default; on a 64-bit machine it's 64 bits wide. Use it for counts, indices, and loop variables. `int32` and `int64` are for when you're serializing to a wire format and need an exact width. `float64` is the default float; use `float32` only if you're touching graphics APIs that demand it.\n\n`byte` is an alias for `uint8` and `rune` is an alias for `int32`. `rune` represents a Unicode code point — important the moment you index into a string, because indexing by byte position in a multi-byte string gives you broken characters.\n\n```go\ns := \"héllo\"\nfmt.Println(len(s))           // 6 (bytes)\nfmt.Println(len([]rune(s)))   // 5 (code points)\n```"
      },
      {
        heading: "Type conversions are explicit",
        body: "Go never silently converts between numeric types. If you want to add an `int` and a `float64` you must convert first:\n\n```go\nvar x int = 3\nvar y float64 = 1.5\nresult := float64(x) + y  // explicit conversion\n```\n\nThis feels verbose coming from Python or JavaScript, but it prevents an entire class of bugs where implicit widening or narrowing silently loses data. The compiler error is better than the runtime mystery."
      }
    ],
    keyCommands: ["go run .", "go doc builtin"],
    exercises: [
      {
        question: "What is the zero value of a `bool`, `int`, `string`, and pointer in Go?",
        answer: "`false`, `0`, `\"\"` (empty string), and `nil` respectively. Every variable is initialized to its zero value if not explicitly assigned — there is no 'uninitialized' garbage state."
      },
      {
        question: "Why can't you write `var x int = 3.5` in Go?",
        answer: "3.5 is a floating-point constant and cannot be represented as `int` without truncation. Go requires explicit conversion (`int(3.5)`) and even then it truncates. The compiler rejects the implicit conversion to protect you from accidental precision loss."
      },
      {
        question: "Use iota to define a `Direction` enum with values North=0, East=1, South=2, West=3.",
        hint: "Declare a const block with iota.",
        answer: "```go\ntype Direction int\nconst (\n    North Direction = iota\n    East\n    South\n    West\n)\n```"
      }
    ],
    lab: {
      goal: "Declare three variables of different types and print them.",
      steps: [
        "Use := to declare a string, an int, and a bool.",
        "Print them with fmt.Println.",
        "Leave one var declared but unassigned to see the zero-value rule in action."
      ],
      verifyId: "vars",
      starter: `package main\n\nimport "fmt"\n\nfunc main() {\n    name := "ada"\n    age := 28\n    active := true\n    var score int // zero value: 0\n    fmt.Println(name, age, active, score)\n}\n`
    }
  },
  {
    id: "control-flow",
    number: 3,
    level: "beginner",
    title: "Control flow you'll actually use",
    summary: "if, for, and switch — the only three control-flow keywords Go gives you, and the patterns that come up daily.",
    duration: "14 min",
    sections: [
      {
        heading: "if with a short statement",
        body: "Go has no `while`, no `do-while`, no ternary. It has `if`, `for`, and `switch`. The `if` is unusual in that it lets you bind a variable scoped to the if/else block:\n\n```go\nif err := doThing(); err != nil {\n    return err\n}\n```\n\nThis pattern is everywhere. It keeps the error variable from leaking into the surrounding scope and reads as 'do the thing; if it failed, bail.'"
      },
      {
        heading: "for is the only loop",
        body: "Three forms cover everything:\n\n```go\nfor i := 0; i < 10; i++ { ... }   // classic C-style\nfor cond { ... }                   // the 'while' Go doesn't have\nfor { ... }                        // infinite\n```\n\nAnd `for ... range` walks slices, maps, channels, and strings:\n\n```go\nfor i, v := range items { ... }\nfor key, val := range counts { ... }\nfor _, r := range \"héllo\" { ... }   // r is a rune, not a byte\n```\n\nUse `_` to discard an index or value you don't need."
      },
      {
        heading: "switch is more powerful than it looks",
        body: "Go's `switch` doesn't fall through by default — each case is independent. Cases can be **expressions**, which means you can collapse long if/else chains:\n\n```go\nswitch {\ncase score >= 90: grade = \"A\"\ncase score >= 80: grade = \"B\"\ndefault:          grade = \"F\"\n}\n```\n\nThis form (switch with no value) is idiomatic when you want pattern-matching ergonomics. The `type switch` lets you branch on an interface's concrete type — we'll see it in chapter 6."
      },
      {
        heading: "break, continue, and labeled loops",
        body: "`break` exits the innermost loop or switch. `continue` skips to the next iteration. When you have nested loops and need to break out of the outer one, Go provides **labeled statements**:\n\n```go\nouter:\n    for i := range matrix {\n        for j := range matrix[i] {\n            if matrix[i][j] == target {\n                break outer\n            }\n        }\n    }\n```\n\nLabeled breaks are rare but much cleaner than a sentinel boolean variable."
      }
    ],
    keyCommands: ["go run .", "go vet ./..."],
    exercises: [
      {
        question: "How does Go replace the `while` loop that other languages have?",
        answer: "Go uses `for condition { ... }` — a `for` loop with only a condition and no init or post statement. It behaves identically to `while` in other languages."
      },
      {
        question: "When iterating over a string with `for i, r := range s`, what type is `r`?",
        answer: "`r` is a `rune` (`int32`), representing a Unicode code point. This correctly handles multi-byte UTF-8 characters. If you iterate by index (`s[i]`) you get a `byte`, which breaks on non-ASCII characters."
      },
      {
        question: "Write a switch statement that returns a string 'positive', 'negative', or 'zero' for an int n.",
        hint: "Use switch with no value and case expressions.",
        answer: "```go\nfunc sign(n int) string {\n    switch {\n    case n > 0: return \"positive\"\n    case n < 0: return \"negative\"\n    default:    return \"zero\"\n    }\n}\n```"
      }
    ],
    lab: {
      goal: "Loop from 1 to 15 and print FizzBuzz.",
      steps: [
        "Use a classic for loop.",
        "Use switch with case expressions to pick the output.",
        "Print 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for 15, the number otherwise."
      ],
      verifyId: "fizzbuzz",
      starter: `package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 15; i++ {\n        switch {\n        case i%15 == 0:\n            fmt.Println("FizzBuzz")\n        case i%3 == 0:\n            fmt.Println("Fizz")\n        case i%5 == 0:\n            fmt.Println("Buzz")\n        default:\n            fmt.Println(i)\n        }\n    }\n}\n`
    }
  }
];

const _CH2: Chapter[] = [
  {
    id: "functions-errors",
    number: 4,
    level: "intermediate",
    title: "Functions, multiple returns, and the error value",
    summary: "Why Go has no exceptions, how the error interface works, and the patterns that make error handling pleasant instead of noisy.",
    duration: "18 min",
    sections: [
      {
        heading: "Multiple return values change how you design APIs",
        body: "A Go function can return more than one value, and the convention is `(result, error)`. There are no exceptions in Go. If something can fail, it returns an `error` alongside the value.\n\n```go\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, fmt.Errorf(\"divide by zero\")\n    }\n    return a / b, nil\n}\n\nq, err := divide(10, 0)\nif err != nil {\n    log.Fatal(err)\n}\n```\n\nThis feels noisy at first. It stops feeling noisy once you've debugged a codebase where the failure mode of every function is invisible until it explodes."
      },
      {
        heading: "error is just an interface",
        body: "**`error` is an interface with one method: `Error() string`.** Any type that implements it is an error. The standard library provides `errors.New` and `fmt.Errorf` for ad-hoc errors, but for libraries you'll define your own type so callers can inspect it:\n\n```go\ntype NotFoundError struct{ Key string }\nfunc (e *NotFoundError) Error() string { return \"not found: \" + e.Key }\n```\n\nCallers use `errors.As` and `errors.Is` (Go 1.13+) to introspect wrapped errors. `fmt.Errorf(\"context: %w\", err)` wraps an error while preserving the original for `errors.Is` checks."
      },
      {
        heading: "defer, panic, and recover — used sparingly",
        body: "**`defer`** schedules a call to run when the surrounding function returns, regardless of how it returns. It's how you close files, unlock mutexes, and clean up — without try/finally:\n\n```go\nf, err := os.Open(name)\nif err != nil { return err }\ndefer f.Close()\n```\n\n**`panic`** unwinds the stack and **`recover`** catches that unwind inside a deferred function. Don't use them for ordinary control flow. They exist for unrecoverable programmer errors or to seal a goroutine boundary so a runaway panic doesn't kill your server."
      },
      {
        heading: "First-class functions and closures",
        body: "Functions are values in Go. You can assign them to variables, pass them to other functions, and return them. A **closure** is a function literal that captures variables from the surrounding scope:\n\n```go\nfunc counter() func() int {\n    n := 0\n    return func() int {\n        n++\n        return n\n    }\n}\n\nc := counter()\nfmt.Println(c(), c(), c()) // 1 2 3\n```\n\nClosures are the building block for functional patterns like `map`, `filter`, middleware chains, and option functions."
      }
    ],
    keyCommands: ["go doc errors", "go run ."],
    exercises: [
      {
        question: "What is the difference between `errors.Is` and `errors.As`?",
        answer: "`errors.Is` checks if any error in the chain matches a specific value (useful for sentinel errors like `io.EOF`). `errors.As` unwraps the chain and assigns the first error matching a target type — use it when you need to read fields from a custom error type."
      },
      {
        question: "Why should you `defer cancel()` immediately after calling `context.WithTimeout` or `context.WithCancel`?",
        answer: "The cancel function releases the timer goroutine and associated resources. If you forget to call it, you leak a goroutine for the lifetime of the parent context. Deferring it immediately ensures it always runs when the function exits, even on error paths."
      },
      {
        question: "Write a function `retry(n int, fn func() error) error` that calls fn up to n times and returns nil on first success.",
        hint: "Loop n times; return nil as soon as fn() returns nil.",
        answer: "```go\nfunc retry(n int, fn func() error) error {\n    var err error\n    for i := 0; i < n; i++ {\n        if err = fn(); err == nil {\n            return nil\n        }\n    }\n    return err\n}\n```"
      }
    ],
    lab: {
      goal: "Write a safeDivide function that returns (result, error) and handle the error at the call site.",
      steps: [
        "Define safeDivide(a, b float64) (float64, error).",
        "Return an error from fmt.Errorf when b is zero.",
        "Call it twice — once with valid args, once with b=0 — and print both outcomes."
      ],
      verifyId: "errors",
      starter: `package main\n\nimport "fmt"\n\nfunc safeDivide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, fmt.Errorf("divide by zero")\n    }\n    return a / b, nil\n}\n\nfunc main() {\n    for _, pair := range [][2]float64{{10, 2}, {7, 0}} {\n        q, err := safeDivide(pair[0], pair[1])\n        if err != nil {\n            fmt.Println("error:", err)\n            continue\n        }\n        fmt.Println("result:", q)\n    }\n}\n`
    }
  },
  {
    id: "slices-maps-structs",
    number: 5,
    level: "intermediate",
    title: "Slices, maps, and structs",
    summary: "The three data structures you'll use in every program. Where their footguns hide and how to avoid them.",
    duration: "20 min",
    sections: [
      {
        heading: "Slices are not arrays",
        body: "A Go **array** has a fixed size baked into its type — `[3]int` and `[4]int` are different types. You'll rarely use arrays directly. A **slice** is a view into an underlying array, with three fields: pointer, length, capacity. `[]int` is the type. `append` grows the slice, allocating a new backing array when capacity runs out.\n\n```go\ns := []int{1, 2, 3}\ns = append(s, 4)\nfmt.Println(s, len(s), cap(s))\n```\n\nThe footgun: when you slice a slice (`s[1:3]`), you share the backing array. Mutating one view mutates the other. If you need an independent copy, use `copy` or `slices.Clone` (Go 1.21+)."
      },
      {
        heading: "Maps — fast, but order-less",
        body: "`map[K]V` is Go's hash table. Declaration uses `make` because the zero value (`nil`) can be read from but not written to:\n\n```go\ncounts := make(map[string]int)\ncounts[\"go\"]++\n\nif v, ok := counts[\"rust\"]; ok {\n    fmt.Println(v)\n}\n```\n\n**The comma-ok idiom** distinguishes 'key absent' from 'key present with zero value.' Iteration order is intentionally randomized — never depend on it. If you need order, keep a separate slice of keys."
      },
      {
        heading: "Structs are records, not objects",
        body: "A struct groups named fields. Go has no classes; methods are functions with a **receiver**:\n\n```go\ntype Point struct{ X, Y float64 }\n\nfunc (p Point) Distance(q Point) float64 {\n    dx, dy := p.X-q.X, p.Y-q.Y\n    return math.Sqrt(dx*dx + dy*dy)\n}\n```\n\nReceivers come in two flavors. A **value receiver** gets a copy. A **pointer receiver** (`func (p *Point)`) gets a reference and can mutate. Use a pointer receiver when the method modifies the struct, when the struct is large, or for consistency across a type's methods."
      },
      {
        heading: "Struct embedding — composition over inheritance",
        body: "Go has no inheritance, but **embedding** lets one struct include another's fields and methods:\n\n```go\ntype Animal struct{ Name string }\nfunc (a Animal) Speak() string { return a.Name + \" says hello\" }\n\ntype Dog struct {\n    Animal           // embedded — promotes fields and methods\n    Breed string\n}\n\nd := Dog{Animal: Animal{Name: \"Rex\"}, Breed: \"Lab\"}\nfmt.Println(d.Speak())  // Rex says hello\nfmt.Println(d.Name)     // promoted field\n```\n\nEmbedding is not inheritance. There is no polymorphism here — a `Dog` is not an `Animal` for type-checking purposes. Interfaces handle polymorphism; embedding handles code reuse."
      }
    ],
    keyCommands: ["go doc slices", "go doc maps"],
    exercises: [
      {
        question: "What happens if you append to a slice that was created as a sub-slice of another slice and capacity allows?",
        answer: "The append modifies the underlying array shared with the original slice, overwriting elements in the original. This is a classic Go footgun. Avoid by using `s[low:high:max]` (three-index slice) to cap capacity, forcing a new allocation on the first append."
      },
      {
        question: "Why does reading from a nil map not panic, but writing to one does?",
        answer: "A nil map returns the zero value for any key lookup (with ok=false). Writes require a real hash table to be allocated — writing to nil panics because there is no backing structure. Always use `make(map[K]V)` before writing."
      },
      {
        question: "Write a function `groupBy(words []string) map[int][]string` that groups words by their length.",
        hint: "Use a map[int][]string and append each word to the slice for its length key.",
        answer: "```go\nfunc groupBy(words []string) map[int][]string {\n    result := make(map[int][]string)\n    for _, w := range words {\n        result[len(w)] = append(result[len(w)], w)\n    }\n    return result\n}\n```"
      }
    ],
    lab: {
      goal: "Count word frequencies and print the top word.",
      steps: [
        "Split a string into words with strings.Fields.",
        "Count them in a map[string]int.",
        "Find and print the most frequent word."
      ],
      verifyId: "wordcount",
      starter: `package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    text := "the quick brown fox jumps over the lazy dog the end"\n    counts := map[string]int{}\n    for _, w := range strings.Fields(text) {\n        counts[w]++\n    }\n    var top string\n    var max int\n    for w, n := range counts {\n        if n > max {\n            max, top = n, w\n        }\n    }\n    fmt.Printf("top word: %q (%d times)\\n", top, max)\n}\n`
    }
  },
  {
    id: "interfaces",
    number: 6,
    level: "advanced",
    title: "Interfaces and the implicit contract",
    summary: "Go interfaces are satisfied implicitly. This sounds like a small detail. It changes how you design code.",
    duration: "18 min",
    sections: [
      {
        heading: "Structural, not nominal",
        body: "In Java or C# you declare 'this class implements this interface.' In Go you never declare it. If a type has the methods, it satisfies the interface. This is called **structural typing**.\n\n```go\ntype Stringer interface { String() string }\n\ntype Point struct{ X, Y int }\nfunc (p Point) String() string { return fmt.Sprintf(\"(%d,%d)\", p.X, p.Y) }\n```\n\nThe practical consequence: **interfaces live with the consumer, not the producer.** A package that needs 'something I can read from' defines `io.Reader`. Anyone with a matching method set is automatically compatible."
      },
      {
        heading: "Small interfaces win",
        body: "The standard library's most-used interfaces have one method: `io.Reader`, `io.Writer`, `io.Closer`, `error`, `fmt.Stringer`. Small interfaces compose. Large interfaces ossify. **Accept interfaces, return structs** — this is the most cited piece of Go API advice and it follows from structural typing.\n\nCompose interfaces with embedding:\n\n```go\ntype ReadWriter interface {\n    io.Reader\n    io.Writer\n}\n```\n\nThis composes without duplication. Any type with both `Read` and `Write` methods satisfies `ReadWriter` automatically."
      },
      {
        heading: "Type assertions and the type switch",
        body: "When you hold an interface value and need to recover the concrete type, you assert:\n\n```go\nif sw, ok := w.(io.StringWriter); ok {\n    sw.WriteString(s)\n}\n```\n\nA **type switch** branches on the dynamic type:\n\n```go\nswitch v := x.(type) {\ncase int:    fmt.Println(\"int\", v)\ncase string: fmt.Println(\"string\", v)\ndefault:     fmt.Println(\"other\")\n}\n```\n\nReach for type assertions sparingly. If you're doing them everywhere, your interface is probably too narrow."
      },
      {
        heading: "The empty interface and any",
        body: "`interface{}` (now aliased as `any` in Go 1.18+) holds any value. It is Go's escape hatch for truly generic containers before generics existed. Functions like `fmt.Println` accept `...any` because they can't know what you'll pass.\n\nThe cost: all type safety disappears at the boundary. When you retrieve a value from `any`, you must assert its type. Prefer typed interfaces or generics. Use `any` only at system boundaries — JSON unmarshalling, logger fields, or interop with external data."
      }
    ],
    keyCommands: ["go doc io.Reader", "go doc fmt.Stringer"],
    exercises: [
      {
        question: "What does 'accept interfaces, return structs' mean and why is it good advice?",
        answer: "Functions should accept interface types (flexible — any compatible type works) but return concrete struct types (the caller gets full type information and access to all fields/methods, not just what the interface exposes). This maximizes flexibility for callers while keeping return types informative."
      },
      {
        question: "Can a value of type `*T` satisfy an interface that requires a method with a value receiver on `T`?",
        answer: "Yes. A pointer `*T` automatically has all methods of `T` (value receiver methods are promoted to the pointer). The reverse is not true: `T` does not have pointer receiver methods unless you hold a pointer."
      },
      {
        question: "Design a `Logger` interface with a single `Log(level, msg string)` method. Write two implementations: `ConsoleLogger` that prints to stdout and `SilentLogger` that discards output.",
        hint: "The SilentLogger method body can be empty.",
        answer: "```go\ntype Logger interface {\n    Log(level, msg string)\n}\ntype ConsoleLogger struct{}\nfunc (ConsoleLogger) Log(level, msg string) {\n    fmt.Printf(\"[%s] %s\\n\", level, msg)\n}\ntype SilentLogger struct{}\nfunc (SilentLogger) Log(level, msg string) {}\n```"
      }
    ],
    lab: {
      goal: "Build a Shape interface implemented by Circle and Rectangle.",
      steps: [
        "Define Shape with an Area() float64 method.",
        "Implement it for Circle{R float64} and Rectangle{W, H float64}.",
        "Print the total area of a []Shape."
      ],
      verifyId: "shapes",
      starter: `package main\n\nimport (\n    "fmt"\n    "math"\n)\n\ntype Shape interface{ Area() float64 }\n\ntype Circle struct{ R float64 }\nfunc (c Circle) Area() float64 { return math.Pi * c.R * c.R }\n\ntype Rectangle struct{ W, H float64 }\nfunc (r Rectangle) Area() float64 { return r.W * r.H }\n\nfunc main() {\n    shapes := []Shape{Circle{R: 2}, Rectangle{W: 3, H: 4}}\n    var total float64\n    for _, s := range shapes {\n        total += s.Area()\n    }\n    fmt.Printf("total area: %.2f\\n", total)\n}\n`
    }
  }
];

const _CH3: Chapter[] = [
  {
    id: "goroutines-channels",
    number: 7,
    level: "advanced",
    title: "Goroutines, channels, and the CSP mental model",
    summary: "Go's concurrency is its biggest hook. Learn the model — Communicating Sequential Processes — before you learn the syntax.",
    duration: "25 min",
    sections: [
      {
        heading: "Goroutines are cheap",
        body: "A **goroutine** is a function running concurrently. Spawning one costs a few KB of stack and a slot in the runtime scheduler — not a full OS thread. You can have hundreds of thousands of them in a single process.\n\n```go\ngo doWork(id)\n```\n\nThe runtime multiplexes goroutines onto a small pool of OS threads. You almost never need to think about threads directly. What you do need to think about is **how goroutines communicate**."
      },
      {
        heading: "Channels are typed pipes",
        body: "A **channel** carries values of one type between goroutines. Send with `ch <- v`, receive with `v := <-ch`. Channels can be **unbuffered** (sender blocks until receiver is ready) or **buffered** (slack of N values).\n\n```go\nch := make(chan int)\ngo func() { ch <- 42 }()\nfmt.Println(<-ch)\n```\n\nThe Go proverb: **'Don't communicate by sharing memory; share memory by communicating.'** Channels make ownership of data explicit. The sender hands it off; the receiver owns it. No locks needed."
      },
      {
        heading: "select and the patterns that emerge",
        body: "`select` is `switch` for channels. It blocks until one of its cases can proceed.\n\n```go\nselect {\ncase v := <-results: handle(v)\ncase <-time.After(time.Second): return errTimeout\ncase <-ctx.Done(): return ctx.Err()\n}\n```\n\nWith `select` you compose fan-out, fan-in, timeouts, and cancellation."
      },
      {
        heading: "Worker pools — the practical concurrency pattern",
        body: "Spawning one goroutine per item is fine for small N. For unbounded N, use a **worker pool**: a fixed set of goroutines consuming from a shared job channel.\n\n```go\njobs := make(chan int, 100)\nresults := make(chan int, 100)\n\nfor w := 0; w < 4; w++ {\n    go func() {\n        for j := range jobs {\n            results <- process(j)\n        }\n    }()\n}\n\nfor _, j := range work { jobs <- j }\nclose(jobs)\n\nfor range work { fmt.Println(<-results) }\n```\n\nThe `close(jobs)` causes all workers' `range jobs` to exit cleanly. This pattern is the backbone of every Go data pipeline."
      }
    ],
    keyCommands: ["go run -race .", "go doc context"],
    exercises: [
      {
        question: "What is the difference between a buffered and unbuffered channel?",
        answer: "An unbuffered channel (`make(chan T)`) synchronizes sender and receiver — the send blocks until a receiver is ready, and vice versa. A buffered channel (`make(chan T, n)`) allows up to n sends to proceed without a receiver. Use buffered channels when the producer and consumer can run at different rates and you want to decouple them."
      },
      {
        question: "Why does closing a channel from the receiver side cause a panic?",
        answer: "Closing signals 'no more values will be sent.' Only the sender knows this. If the receiver closes, the sender may still try to send, which panics (send on closed channel). The ownership rule: only the sender closes."
      },
      {
        question: "Write a `fanOut` function that reads from one input channel and distributes items to N worker goroutines, each printing the item.",
        hint: "Create N goroutines each ranging over the same input channel.",
        answer: "```go\nfunc fanOut(in <-chan int, n int) {\n    var wg sync.WaitGroup\n    for i := 0; i < n; i++ {\n        wg.Add(1)\n        go func(id int) {\n            defer wg.Done()\n            for v := range in {\n                fmt.Printf(\"worker %d: %d\\n\", id, v)\n            }\n        }(i)\n    }\n    wg.Wait()\n}\n```"
      }
    ],
    lab: {
      goal: "Use a channel to sum the first 10 squares concurrently.",
      steps: [
        "Spawn a goroutine that sends i*i for i in 1..10 onto a channel, then closes it.",
        "Range over the channel in main, accumulating the sum.",
        "Print the result (385)."
      ],
      verifyId: "squares",
      starter: `package main\n\nimport "fmt"\n\nfunc main() {\n    ch := make(chan int)\n    go func() {\n        for i := 1; i <= 10; i++ {\n            ch <- i * i\n        }\n        close(ch)\n    }()\n    sum := 0\n    for v := range ch {\n        sum += v\n    }\n    fmt.Println("sum of squares:", sum)\n}\n`
    }
  },
  {
    id: "context-and-concurrency-patterns",
    number: 8,
    level: "expert",
    title: "context, cancellation, and production concurrency",
    summary: "How real Go services manage deadlines, cancellation, and resource cleanup — and why context.Context is in every function signature.",
    duration: "22 min",
    sections: [
      {
        heading: "Why context exists",
        body: "Long-running operations — RPC calls, DB queries, HTTP handlers — need a way to be told 'stop, the caller no longer cares.' Without that, a slow downstream service backs up your whole system.\n\n**`context.Context`** is Go's answer. It carries a deadline, a cancellation signal, and request-scoped key/value pairs through a call stack. Every function that does I/O or blocks should take `ctx context.Context` as its **first argument**:\n\n```go\nfunc fetchUser(ctx context.Context, id string) (*User, error)\n```"
      },
      {
        heading: "Deadlines and cancellation",
        body: "Build a context with a deadline; pass it down; respect `ctx.Done()`:\n\n```go\nctx, cancel := context.WithTimeout(parent, 2*time.Second)\ndefer cancel()\n\nresult, err := db.QueryContext(ctx, sql, args...)\n```\n\n`cancel` is always called — defer it the moment you create the context, or you leak a timer goroutine."
      },
      {
        heading: "errgroup — the pattern you'll use everywhere",
        body: "`golang.org/x/sync/errgroup` is the production idiom for 'launch N goroutines, wait for all, abort on the first error':\n\n```go\ng, ctx := errgroup.WithContext(ctx)\nfor _, url := range urls {\n    url := url\n    g.Go(func() error { return fetch(ctx, url) })\n}\nif err := g.Wait(); err != nil { return err }\n```\n\nThe `url := url` shadowing captures each iteration's value. Go 1.22 fixed loop variable scoping so this is no longer required, but you'll see it in millions of lines of existing code."
      },
      {
        heading: "sync.Mutex and sync.RWMutex",
        body: "When shared mutable state is unavoidable, use a mutex. Prefer channels for communication; use mutexes for protecting a cache or counter:\n\n```go\ntype SafeCounter struct {\n    mu sync.Mutex\n    v  map[string]int\n}\n\nfunc (c *SafeCounter) Inc(key string) {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    c.v[key]++\n}\n```\n\n`sync.RWMutex` allows multiple concurrent readers with `RLock()` but exclusive writers. Use it when reads vastly outnumber writes (cache, config)."
      }
    ],
    keyCommands: ["go run -race .", "go test -race ./...", "go doc context.WithTimeout"],
    exercises: [
      {
        question: "What happens if you forget to call the cancel function returned by context.WithCancel or context.WithTimeout?",
        answer: "You leak a goroutine (the timer goroutine for WithTimeout) for the lifetime of the parent context. In a long-running server this accumulates into a goroutine leak that will eventually exhaust memory. Always `defer cancel()` immediately after creating the context."
      },
      {
        question: "When would you choose `sync.Mutex` over a channel?",
        answer: "Use a mutex when protecting a shared data structure (cache, map, counter) that multiple goroutines read and write, especially when the access pattern doesn't naturally fit a producer/consumer model. Channels are better for transferring ownership of data or for signaling between goroutines."
      },
      {
        question: "Write a `withRetry` function that calls an HTTP-like function with a context, retrying up to 3 times if the context is not yet cancelled.",
        hint: "Check ctx.Err() before each attempt.",
        answer: "```go\nfunc withRetry(ctx context.Context, fn func(context.Context) error) error {\n    for i := 0; i < 3; i++ {\n        if ctx.Err() != nil {\n            return ctx.Err()\n        }\n        if err := fn(ctx); err == nil {\n            return nil\n        }\n    }\n    return fmt.Errorf(\"all retries failed\")\n}\n```"
      }
    ],
    lab: {
      goal: "Run three operations with a 500ms timeout using context.",
      steps: [
        "Create a context with WithTimeout(500ms).",
        "Launch three goroutines that simulate work with time.Sleep durations 200/400/800 ms.",
        "Use select to either collect each result or abort when ctx.Done() fires."
      ],
      verifyId: "context",
      starter: `package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc slow(ctx context.Context, id, ms int) (string, error) {\n    select {\n    case <-time.After(time.Duration(ms) * time.Millisecond):\n        return fmt.Sprintf("job %d done", id), nil\n    case <-ctx.Done():\n        return "", ctx.Err()\n    }\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)\n    defer cancel()\n    durations := []int{200, 400, 800}\n    results := make(chan string, len(durations))\n    for i, d := range durations {\n        i, d := i, d\n        go func() {\n            r, err := slow(ctx, i, d)\n            if err != nil {\n                results <- fmt.Sprintf("job %d: %v", i, err)\n                return\n            }\n            results <- r\n        }()\n    }\n    for range durations {\n        fmt.Println(<-results)\n    }\n}\n`
    }
  },
  {
    id: "production-go",
    number: 9,
    level: "expert",
    title: "Modules, testing, and shipping a Go service",
    summary: "How a Go project is laid out, how dependencies work, how tests look, and how to debug a service at 3am.",
    duration: "25 min",
    sections: [
      {
        heading: "Modules and the dependency graph",
        body: "A **module** is a versioned collection of packages. `go mod init github.com/you/project` creates a `go.mod` file. Add a dependency by importing it and running `go mod tidy`.\n\n```\nmodule github.com/you/project\n\ngo 1.22\n\nrequire (\n    github.com/jackc/pgx/v5 v5.5.0\n)\n```\n\nMinimum version selection (MVS) means Go picks the **lowest** version that satisfies all requirements. This makes builds reproducible without a separate lockfile-resolution step."
      },
      {
        heading: "The standard project layout",
        body: "Go has no enforced layout, but a convention has emerged:\n\n```\ncmd/\n  api/main.go\ninternal/\n  user/\n  http/\nmigrations/\ngo.mod\n```\n\n**`internal/`** is special: the compiler enforces that only the parent module can import it. Use it liberally to keep your public surface small. `cmd/` is the convention for executables when you have more than one."
      },
      {
        heading: "Testing — the boring kind that ships",
        body: "Go's testing tool is part of the standard library. A test file ends in `_test.go`:\n\n```go\nfunc TestAdd(t *testing.T) {\n    got := Add(2, 3)\n    if got != 5 { t.Fatalf(\"got %d, want 5\", got) }\n}\n```\n\n**Table-driven tests** are the idiom:\n\n```go\nfor _, tc := range []struct{ a, b, want int }{ {2,3,5}, {0,0,0} } {\n    if got := Add(tc.a, tc.b); got != tc.want {\n        t.Errorf(\"Add(%d,%d) = %d, want %d\", tc.a, tc.b, got, tc.want)\n    }\n}\n```\n\n`go test -race ./...` should be green before you merge."
      },
      {
        heading: "Profiling and the 3am tools",
        body: "When a service misbehaves in production, three tools matter:\n\n1. **`net/http/pprof`** — import it for its side effect; your service exposes `/debug/pprof/` with CPU, heap, goroutine, and mutex profiles.\n2. **The race detector** — `-race` instruments memory accesses; it catches data races deterministically.\n3. **`runtime/trace`** — a flight recorder of scheduler events.\n\nGood Go ops looks boring: structured logs, a `/healthz` endpoint, graceful shutdown that respects `context.Context`, a single static binary in a `FROM scratch` Docker image."
      }
    ],
    keyCommands: ["go mod init github.com/you/project", "go mod tidy", "go test -race ./...", "go test -bench=. ./...", "go tool pprof http://localhost:6060/debug/pprof/heap"],
    exercises: [
      {
        question: "What does `go mod tidy` do?",
        answer: "It adds any missing module requirements (imports in your code not yet in go.mod) and removes any requirements that are no longer needed. Run it after adding or removing imports."
      },
      {
        question: "Why are table-driven tests preferred in Go?",
        answer: "They put all test cases in one place (easy to add new ones), the loop handles the boilerplate, and when a test fails you can see all failing cases at once rather than stopping at the first. They also naturally document the expected behavior of a function."
      },
      {
        question: "What is the purpose of `internal/` packages in a Go module?",
        answer: "The Go compiler enforces that only code within the parent of the `internal/` directory can import those packages. This lets you share code between multiple packages in your module without exposing it as a public API that external users might depend on."
      }
    ],
    lab: {
      goal: "Demonstrate a simple Add function and verify it.",
      steps: [
        "Define Add(a, b int) int.",
        "Call it with several inputs and print results.",
        "On a real project you'd put assertions in _test.go and run `go test`."
      ],
      verifyId: "table-test",
      starter: `package main\n\nimport "fmt"\n\nfunc Add(a, b int) int { return a + b }\n\nfunc main() {\n    cases := []struct{ a, b, want int }{\n        {2, 3, 5}, {0, 0, 0}, {-1, 1, 0}, {100, -50, 50},\n    }\n    ok := true\n    for _, tc := range cases {\n        got := Add(tc.a, tc.b)\n        status := "ok"\n        if got != tc.want { status = "FAIL"; ok = false }\n        fmt.Printf("Add(%d,%d) = %d (want %d) %s\\n", tc.a, tc.b, got, tc.want, status)\n    }\n    if ok { fmt.Println("\\nall cases passed") }\n}\n`
    }
  }
];

const _CH4: Chapter[] = [
  {
    id: "generics",
    number: 10,
    level: "advanced",
    title: "Generics and type constraints",
    summary: "Go 1.18 added generics. Learn type parameters, constraints, and the patterns that are actually worth using them for.",
    duration: "22 min",
    sections: [
      {
        heading: "The problem generics solve",
        body: "Before generics, Go developers wrote the same algorithm five times — once for `[]int`, once for `[]string`, once for `[]float64`, and so on — or they reached for `[]any` and lost type safety. A `Min` function that works for any ordered type required a code generator or reflection.\n\nGenerics add **type parameters** to functions and types:\n\n```go\nfunc Min[T constraints.Ordered](a, b T) T {\n    if a < b { return a }\n    return b\n}\n\nfmt.Println(Min(3, 5))       // 3 (int)\nfmt.Println(Min(3.1, 2.9))  // 2.9 (float64)\n```\n\nThe `[T constraints.Ordered]` declares a type parameter `T` constrained to types that support `<`. The compiler infers `T` from the arguments."
      },
      {
        heading: "Constraints are interfaces",
        body: "A **constraint** is an interface. The `constraints` package (part of `golang.org/x/exp`) provides `Ordered`, `Integer`, `Float`, and `Complex`. You can define your own:\n\n```go\ntype Number interface {\n    ~int | ~int64 | ~float64\n}\n\nfunc Sum[T Number](nums []T) T {\n    var total T\n    for _, n := range nums { total += n }\n    return total\n}\n```\n\nThe `~int` syntax means 'any type whose underlying type is int' — this lets your generic function work with `type MyInt int` user-defined types."
      },
      {
        heading: "Generic data structures",
        body: "Generics unlock type-safe data structures. A typed stack:\n\n```go\ntype Stack[T any] struct {\n    items []T\n}\n\nfunc (s *Stack[T]) Push(v T)      { s.items = append(s.items, v) }\nfunc (s *Stack[T]) Pop() (T, bool) {\n    var zero T\n    if len(s.items) == 0 { return zero, false }\n    n := len(s.items) - 1\n    v := s.items[n]\n    s.items = s.items[:n]\n    return v, true\n}\n```\n\nA `Stack[int]` and a `Stack[string]` are separate types. The compiler guarantees you never push a string onto an int stack."
      },
      {
        heading: "When not to use generics",
        body: "Generics add compile-time complexity. The Go team's guidance: use generics when you'd otherwise copy code for different types, or when you need a type-safe container. Don't reach for them just because something is 'more general.'\n\nInterface-based polymorphism is often cleaner for behaviour. Generics are best for **algorithms** (sort, search, map, filter, reduce) and **containers** (stack, queue, set, pair). The standard library's `slices` and `maps` packages (Go 1.21+) are the reference examples."
      }
    ],
    keyCommands: ["go doc slices", "go doc maps", "go get golang.org/x/exp"],
    exercises: [
      {
        question: "What does the `~` prefix mean in a constraint like `~int`?",
        answer: "It means 'any type whose underlying type is int', including user-defined types like `type UserID int`. Without `~`, only the exact type `int` would satisfy the constraint."
      },
      {
        question: "Why is `constraints.Ordered` needed for a Min function rather than just `any`?",
        answer: "The `any` constraint allows any type, but the `<` operator is not defined on all types (structs, maps, etc.). `constraints.Ordered` restricts T to types that support `<`, `>`, `<=`, `>=` — the Go compiler then allows those operators in the function body."
      },
      {
        question: "Write a generic `Map[T, U any](slice []T, f func(T) U) []U` function that transforms a slice.",
        hint: "Allocate the result slice with make, then iterate.",
        answer: "```go\nfunc Map[T, U any](slice []T, f func(T) U) []U {\n    result := make([]U, len(slice))\n    for i, v := range slice {\n        result[i] = f(v)\n    }\n    return result\n}\n// Usage:\nnums := []int{1, 2, 3}\nstrs := Map(nums, strconv.Itoa) // [\"1\", \"2\", \"3\"]\n```"
      }
    ],
    lab: {
      goal: "Implement a generic Filter and Reduce over a []int.",
      steps: [
        "Write Filter[T any](s []T, keep func(T) bool) []T.",
        "Write Reduce[T, U any](s []T, init U, f func(U, T) U) U.",
        "Use them to sum the even squares of [1..10]."
      ],
      verifyId: "generics",
      starter: `package main\n\nimport "fmt"\n\nfunc Filter[T any](s []T, keep func(T) bool) []T {\n    var out []T\n    for _, v := range s {\n        if keep(v) { out = append(out, v) }\n    }\n    return out\n}\n\nfunc Reduce[T, U any](s []T, init U, f func(U, T) U) U {\n    acc := init\n    for _, v := range s { acc = f(acc, v) }\n    return acc\n}\n\nfunc main() {\n    nums := make([]int, 10)\n    for i := range nums { nums[i] = i + 1 }\n    squares := Map(nums, func(n int) int { return n * n })\n    evens := Filter(squares, func(n int) bool { return n%2 == 0 })\n    sum := Reduce(evens, 0, func(acc, n int) int { return acc + n })\n    fmt.Println("sum of even squares:", sum)\n}\n\nfunc Map[T, U any](s []T, f func(T) U) []U {\n    out := make([]U, len(s))\n    for i, v := range s { out[i] = f(v) }\n    return out\n}\n`
    }
  },
  {
    id: "oop-patterns",
    number: 11,
    level: "advanced",
    title: "OOP patterns in Go: embedding, composition, functional options",
    summary: "Go has no classes but it covers every OOP use case. Learn the idiomatic patterns used in production codebases.",
    duration: "24 min",
    sections: [
      {
        heading: "Composition over inheritance — for real",
        body: "Every OOP textbook says 'prefer composition.' Go makes inheritance impossible, so the preference becomes a habit. Embedding composes types by promoting fields and methods:\n\n```go\ntype Logger struct{ prefix string }\nfunc (l Logger) Log(msg string) { fmt.Printf(\"[%s] %s\\n\", l.prefix, msg) }\n\ntype Server struct {\n    Logger          // embedded — Server.Log() works\n    addr   string\n}\n\ns := Server{Logger: Logger{prefix: \"srv\"}, addr: \":8080\"}\ns.Log(\"starting\")  // [srv] starting\n```\n\nThe embedded type is promoted. `s.Log` is shorthand for `s.Logger.Log`. If `Server` defines its own `Log`, it shadows the promoted one."
      },
      {
        heading: "The functional options pattern",
        body: "Constructors with many optional parameters become unmaintainable. The **functional options** pattern solves this:\n\n```go\ntype ServerConfig struct {\n    addr    string\n    timeout time.Duration\n    maxConn int\n}\n\ntype Option func(*ServerConfig)\n\nfunc WithTimeout(d time.Duration) Option {\n    return func(c *ServerConfig) { c.timeout = d }\n}\nfunc WithMaxConn(n int) Option {\n    return func(c *ServerConfig) { c.maxConn = n }\n}\n\nfunc NewServer(addr string, opts ...Option) *Server {\n    cfg := &ServerConfig{addr: addr, timeout: 30 * time.Second, maxConn: 100}\n    for _, o := range opts { o(cfg) }\n    return &Server{cfg: cfg}\n}\n\ns := NewServer(\":8080\", WithTimeout(10*time.Second), WithMaxConn(200))\n```\n\nThis pattern is in every serious Go library: `grpc.Dial`, `zap.NewLogger`, `http.Server`."
      },
      {
        heading: "Method sets and the pointer receiver consistency rule",
        body: "A method set determines which interface methods a type satisfies. **Value type `T`** has the method set of value receivers. **Pointer type `*T`** has the method set of both value and pointer receivers.\n\nPractical rule: if **any** method of a type uses a pointer receiver, make **all** methods use pointer receivers. Otherwise you get mysterious 'does not implement' errors when passing the value to an interface.\n\n```go\ntype Counter struct{ n int }\nfunc (c *Counter) Inc()      { c.n++ }     // pointer receiver\nfunc (c *Counter) Value() int { return c.n } // also pointer for consistency\n```"
      },
      {
        heading: "Dependency injection without a framework",
        body: "In OOP languages, dependency injection frameworks wire objects together. In Go, it's just passing interfaces to constructors:\n\n```go\ntype DB interface { Query(ctx context.Context, sql string) (Rows, error) }\n\ntype UserRepo struct { db DB }\n\nfunc NewUserRepo(db DB) *UserRepo { return &UserRepo{db: db} }\n```\n\nIn tests, pass a fake `DB`. In production, pass `*pgxpool.Pool`. No framework. No reflection. No magic. This is why Go codebases are easy to read: the wiring is explicit Go code."
      }
    ],
    keyCommands: ["go doc sync.Once", "go vet ./..."],
    exercises: [
      {
        question: "What is the functional options pattern and why is it preferred over a large config struct passed directly?",
        answer: "Functional options are functions that modify a config struct. Callers pass only the options they care about; unspecified options keep defaults. This allows adding new options without breaking existing call sites (backward compatible), makes call sites self-documenting (`WithTimeout(5s)` vs positional arg `5`), and allows options to contain logic."
      },
      {
        question: "Why should all methods on a type use the same receiver type (all value or all pointer)?",
        answer: "Because the method set of `T` (value) only includes value receiver methods, while the method set of `*T` includes both. If you mix receivers, you must always use `*T` to satisfy interfaces, but the inconsistency confuses readers. Consistency makes the rule obvious."
      },
      {
        question: "Implement a `Cache` struct that embeds `sync.RWMutex` and holds a `map[string]int`. Add `Set` and `Get` methods.",
        hint: "Use RLock/RUnlock for Get, Lock/Unlock for Set.",
        answer: "```go\ntype Cache struct {\n    sync.RWMutex\n    data map[string]int\n}\nfunc NewCache() *Cache { return &Cache{data: make(map[string]int)} }\nfunc (c *Cache) Set(k string, v int) {\n    c.Lock(); defer c.Unlock()\n    c.data[k] = v\n}\nfunc (c *Cache) Get(k string) (int, bool) {\n    c.RLock(); defer c.RUnlock()\n    v, ok := c.data[k]\n    return v, ok\n}\n```"
      }
    ],
    lab: {
      goal: "Build a configurable HTTP client using the functional options pattern.",
      steps: [
        "Define a ClientConfig struct with timeout, retries, and userAgent fields.",
        "Write WithTimeout, WithRetries, WithUserAgent option functions.",
        "NewClient applies options over safe defaults and prints the final config."
      ],
      verifyId: "options",
      starter: `package main\n\nimport (\n    "fmt"\n    "time"\n)\n\ntype ClientConfig struct {\n    timeout   time.Duration\n    retries   int\n    userAgent string\n}\n\ntype Option func(*ClientConfig)\n\nfunc WithTimeout(d time.Duration) Option { return func(c *ClientConfig) { c.timeout = d } }\nfunc WithRetries(n int) Option          { return func(c *ClientConfig) { c.retries = n } }\nfunc WithUserAgent(ua string) Option    { return func(c *ClientConfig) { c.userAgent = ua } }\n\ntype Client struct{ cfg ClientConfig }\n\nfunc NewClient(opts ...Option) *Client {\n    cfg := ClientConfig{timeout: 30 * time.Second, retries: 3, userAgent: "go-client/1.0"}\n    for _, o := range opts { o(&cfg) }\n    return &Client{cfg: cfg}\n}\n\nfunc main() {\n    c := NewClient(WithTimeout(10*time.Second), WithRetries(5), WithUserAgent("myapp/2.0"))\n    fmt.Printf("timeout=%s retries=%d ua=%s\\n", c.cfg.timeout, c.cfg.retries, c.cfg.userAgent)\n}\n`
    }
  },
  {
    id: "file-io-encoding",
    number: 12,
    level: "expert",
    title: "File I/O, JSON, CSV, and binary encoding",
    summary: "Reading and writing files efficiently. JSON and CSV for data exchange. When to reach for binary formats.",
    duration: "28 min",
    sections: [
      {
        heading: "os and bufio — the I/O stack",
        body: "Every file operation in Go starts with `os.Open` (read) or `os.Create`/`os.OpenFile` (write). Wrap with `bufio.Reader` or `bufio.Writer` to batch syscalls:\n\n```go\nf, err := os.Open(\"data.txt\")\nif err != nil { return err }\ndefer f.Close()\n\nscanner := bufio.NewScanner(f)\nfor scanner.Scan() {\n    line := scanner.Text()\n    // process line\n}\nreturn scanner.Err()\n```\n\nUnbuffered file reads issue one syscall per read call. `bufio` batches reads into 4–64 KB blocks — orders of magnitude fewer syscalls for line-oriented data."
      },
      {
        heading: "encoding/json — the universal data format",
        body: "`encoding/json` uses struct tags to map Go fields to JSON keys:\n\n```go\ntype Record struct {\n    ID    int    `json:\"id\"`\n    Name  string `json:\"name\"`\n    Score float64 `json:\"score,omitempty\"`\n}\n\nbytes, _ := json.Marshal(Record{ID: 1, Name: \"Ada\", Score: 99.5})\n// {\"id\":1,\"name\":\"Ada\",\"score\":99.5}\n\nvar r Record\njson.Unmarshal(bytes, &r)\n```\n\n`omitempty` omits the field if it's the zero value. For streaming large JSON files, use `json.NewDecoder(f).Decode(&r)` inside a loop — never read the entire file into memory first."
      },
      {
        heading: "encoding/csv — the data scientist's format",
        body: "CSV is the lingua franca of data exchange. `encoding/csv` handles quoting, escaping, and varying delimiters:\n\n```go\nreader := csv.NewReader(f)\nreader.Comma = ';'  // semicolon-delimited\nrecords, err := reader.ReadAll()\n\nwriter := csv.NewWriter(os.Stdout)\nwriter.Write([]string{\"name\", \"score\"})\nwriter.Write([]string{\"Ada\", \"99.5\"})\nwriter.Flush()\n```\n\nFor large files, use `reader.Read()` in a loop instead of `ReadAll()` to process one record at a time without loading everything into memory."
      },
      {
        heading: "Binary formats — when speed and size matter",
        body: "JSON is human-readable but slow to parse and large on the wire. For high-throughput pipelines, use binary formats:\n\n- **`encoding/gob`** — Go's native binary format. Fast, but Go-only. Use for RPC and caching.\n- **Protocol Buffers** — Language-neutral, compact, schema-enforced. The standard for microservice communication.\n- **MessagePack** — JSON-compatible binary. Drop-in for JSON with 2–5× size reduction.\n\nFor analytics data, **Parquet** (columnar) dramatically outperforms CSV: reads only the columns you need, compresses each column type optimally, and embeds per-column statistics for predicate pushdown. The `github.com/parquet-go/parquet-go` library provides a Go-native reader/writer."
      }
    ],
    keyCommands: ["go doc encoding/json", "go doc encoding/csv", "go doc bufio.Scanner"],
    exercises: [
      {
        question: "Why should you use `json.NewDecoder` instead of `json.Unmarshal` for large JSON files?",
        answer: "`json.Unmarshal` requires the entire file in memory as a byte slice first. `json.NewDecoder` reads and decodes incrementally from an `io.Reader`, so memory usage is proportional to one decoded record, not the whole file."
      },
      {
        question: "What does the struct tag `json:\"score,omitempty\"` do?",
        answer: "It maps the Go field to the JSON key `score` (instead of `Score`), and the `omitempty` flag causes the field to be omitted from the JSON output entirely when its value is the zero value (0 for float64, empty string for string, false for bool)."
      },
      {
        question: "Write a function that reads a CSV file and returns a slice of maps `[]map[string]string` using the first row as headers.",
        hint: "Read the first row as headers, then for each subsequent row zip headers and values into a map.",
        answer: "```go\nfunc readCSV(r io.Reader) ([]map[string]string, error) {\n    cr := csv.NewReader(r)\n    headers, err := cr.Read()\n    if err != nil { return nil, err }\n    var rows []map[string]string\n    for {\n        rec, err := cr.Read()\n        if err == io.EOF { break }\n        if err != nil { return nil, err }\n        row := make(map[string]string, len(headers))\n        for i, h := range headers { row[h] = rec[i] }\n        rows = append(rows, row)\n    }\n    return rows, nil\n}\n```"
      }
    ],
    lab: {
      goal: "Encode a slice of structs to JSON, write it to stdout, then decode it back.",
      steps: [
        "Define a Student struct with json tags.",
        "json.Marshal a []Student and fmt.Println the JSON.",
        "json.Unmarshal it back and print each student's name."
      ],
      verifyId: "json",
      starter: `package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Student struct {\n    Name  string  \`json:"name"\`\n    Grade int     \`json:"grade"\`\n    GPA   float64 \`json:"gpa,omitempty"\`\n}\n\nfunc main() {\n    students := []Student{\n        {Name: "Ada", Grade: 12, GPA: 3.9},\n        {Name: "Alan", Grade: 11, GPA: 3.7},\n        {Name: "Grace", Grade: 12},\n    }\n    data, err := json.MarshalIndent(students, "", "  ")\n    if err != nil { panic(err) }\n    fmt.Println(string(data))\n\n    var decoded []Student\n    json.Unmarshal(data, &decoded)\n    for _, s := range decoded {\n        fmt.Printf("Name: %s, GPA: %.1f\\n", s.Name, s.GPA)\n    }\n}\n`
    }
  }
];

const _CH5: Chapter[] = [
  {
    id: "data-pipelines",
    number: 13,
    level: "expert",
    title: "Data processing pipelines and fan-out/fan-in",
    summary: "Build production-grade pipelines: stage-based design, worker pools, backpressure, and real throughput numbers.",
    duration: "30 min",
    sections: [
      {
        heading: "The pipeline pattern",
        body: "A **pipeline** is a series of stages connected by channels, where each stage is a set of goroutines running the same function. This maps directly to ETL (Extract, Transform, Load) workflows common in data engineering.\n\n```go\n// Stage 1: generate\nfunc generate(nums ...int) <-chan int {\n    out := make(chan int)\n    go func() {\n        for _, n := range nums { out <- n }\n        close(out)\n    }()\n    return out\n}\n\n// Stage 2: transform\nfunc square(in <-chan int) <-chan int {\n    out := make(chan int)\n    go func() {\n        for n := range in { out <- n * n }\n        close(out)\n    }()\n    return out\n}\n```\n\nEach stage is independent. You compose them by passing channels: `square(generate(2, 3, 4))`."
      },
      {
        heading: "Fan-out and fan-in",
        body: "**Fan-out**: distribute work from one channel to multiple goroutines. **Fan-in**: merge multiple channels into one.\n\n```go\nfunc fanOut(in <-chan int, n int) []<-chan int {\n    outputs := make([]<-chan int, n)\n    for i := range outputs {\n        outputs[i] = square(in)  // each worker reads from the same in\n    }\n    return outputs\n}\n\nfunc merge(cs ...<-chan int) <-chan int {\n    var wg sync.WaitGroup\n    merged := make(chan int)\n    output := func(c <-chan int) {\n        for v := range c { merged <- v }\n        wg.Done()\n    }\n    wg.Add(len(cs))\n    for _, c := range cs { go output(c) }\n    go func() { wg.Wait(); close(merged) }()\n    return merged\n}\n```\n\nFan-out scales CPU-bound work across cores. Fan-in reassembles results."
      },
      {
        heading: "Backpressure and bounded queues",
        body: "Unbounded fan-out can exhaust memory. **Backpressure** means the fast producer slows when the slow consumer can't keep up. In Go, buffered channels implement bounded queues — when the buffer is full, the sender blocks:\n\n```go\nconst workers = 8\njobs := make(chan Job, workers*2)  // bounded\n\n// producer\ngo func() {\n    for _, j := range data { jobs <- j }  // blocks when full\n    close(jobs)\n}()\n\n// workers\nfor i := 0; i < workers; i++ {\n    go func() {\n        for j := range jobs { process(j) }\n    }()\n}\n```\n\nThe buffer size `workers*2` is a rule of thumb: enough to keep workers busy during bursts without unbounded queuing."
      },
      {
        heading: "A real data pipeline: CSV → transform → JSON",
        body: "Putting it together: a typed pipeline that reads CSV records, validates and enriches them concurrently, and writes JSON:\n\n```go\ntype Record struct { Name string; Amount float64 }\n\nfunc readCSV(r io.Reader) <-chan Record { ... }\nfunc enrich(in <-chan Record) <-chan Record { ... }  // calls external API\nfunc writeJSON(w io.Writer, in <-chan Record) error { ... }\n\n// Wire it:\nrecords := readCSV(f)\nenriched := merge(fanOut(records, 4, enrich)...)\nwriteJSON(os.Stdout, enriched)\n```\n\nEach stage is testable in isolation. The channel connections are the API between stages. Backpressure propagates automatically through the channel buffers."
      }
    ],
    keyCommands: ["go run -race .", "go tool trace trace.out"],
    exercises: [
      {
        question: "What is backpressure in a pipeline and how do buffered channels implement it?",
        answer: "Backpressure is the mechanism by which a slow consumer slows a fast producer, preventing unbounded memory growth. A buffered channel of size N blocks the producer when N items are in flight. The producer can only proceed when a consumer reads an item, naturally pacing the pipeline."
      },
      {
        question: "Why should pipeline stages receive a `<-chan T` (receive-only) and return a `<-chan T` rather than a bidirectional `chan T`?",
        answer: "Directional channel types encode ownership in the type system. A receive-only channel `<-chan T` can't be sent to or closed by the receiver — this prevents bugs where the wrong goroutine closes a channel. The compiler enforces the ownership rule at compile time."
      },
      {
        question: "Write a pipeline stage `filter[T any](in <-chan T, keep func(T) bool) <-chan T`.",
        hint: "Launch a goroutine, range over in, send to out only if keep returns true.",
        answer: "```go\nfunc filter[T any](in <-chan T, keep func(T) bool) <-chan T {\n    out := make(chan T)\n    go func() {\n        defer close(out)\n        for v := range in {\n            if keep(v) { out <- v }\n        }\n    }()\n    return out\n}\n```"
      }
    ],
    lab: {
      goal: "Build a 3-stage pipeline: generate numbers → filter evens → square them, print results.",
      steps: [
        "Stage 1: generate 1..20 into a channel.",
        "Stage 2: filter channel, passing only even numbers.",
        "Stage 3: square each value, print the sum."
      ],
      verifyId: "pipeline",
      starter: `package main\n\nimport "fmt"\n\nfunc generate(n int) <-chan int {\n    out := make(chan int)\n    go func() {\n        for i := 1; i <= n; i++ { out <- i }\n        close(out)\n    }()\n    return out\n}\n\nfunc filterEven(in <-chan int) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for v := range in {\n            if v%2 == 0 { out <- v }\n        }\n    }()\n    return out\n}\n\nfunc squareAll(in <-chan int) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for v := range in { out <- v * v }\n    }()\n    return out\n}\n\nfunc main() {\n    nums := generate(20)\n    evens := filterEven(nums)\n    squares := squareAll(evens)\n    sum := 0\n    for v := range squares { sum += v }\n    fmt.Println("sum of even squares 1..20:", sum)\n}\n`
    }
  },
  {
    id: "databases",
    number: 14,
    level: "expert",
    title: "Databases: database/sql, SQLite, and DuckDB patterns",
    summary: "Query relational databases from Go. The standard interface, compile-time safe queries, and analytics with DuckDB.",
    duration: "30 min",
    sections: [
      {
        heading: "database/sql — the standard interface",
        body: "`database/sql` is a generic interface; drivers plug in underneath. Import a driver for its side effect:\n\n```go\nimport (\n    \"database/sql\"\n    _ \"github.com/mattn/go-sqlite3\"  // registers the sqlite3 driver\n)\n\ndb, err := sql.Open(\"sqlite3\", \"./data.db\")\nif err != nil { log.Fatal(err) }\ndefer db.Close()\n\nrows, err := db.QueryContext(ctx, \"SELECT id, name FROM users WHERE active = ?\", true)\nif err != nil { return err }\ndefer rows.Close()\nfor rows.Next() {\n    var id int; var name string\n    rows.Scan(&id, &name)\n    fmt.Println(id, name)\n}\nreturn rows.Err()\n```\n\nAlways check `rows.Err()` after the loop — errors can surface there."
      },
      {
        heading: "Connection pools and transactions",
        body: "`db.SetMaxOpenConns`, `db.SetMaxIdleConns`, and `db.SetConnMaxLifetime` tune the connection pool. For most services: max open = 25, max idle = 5, lifetime = 5 minutes.\n\nTransactions group multiple operations atomically:\n\n```go\ntx, err := db.BeginTx(ctx, nil)\nif err != nil { return err }\ndefer tx.Rollback()  // no-op if committed\n\ntx.ExecContext(ctx, \"INSERT INTO orders ...\")\ntx.ExecContext(ctx, \"UPDATE inventory ...\")\n\nreturn tx.Commit()\n```\n\nThe `defer tx.Rollback()` idiom is the Go equivalent of try/finally — it rolls back if the function exits early (error, panic) without a commit."
      },
      {
        heading: "DuckDB for analytics",
        body: "DuckDB is an **in-process OLAP** database — no server, no daemon, just link the library and query Parquet/CSV/JSON files with full SQL including window functions, ASOF joins, and PIVOT.\n\n```go\nimport (\n    \"database/sql\"\n    _ \"github.com/marcboeker/go-duckdb\"\n)\n\ndb, _ := sql.Open(\"duckdb\", \"\")\nrows, _ := db.QueryContext(ctx,\n    `SELECT date_trunc('month', ts) AS month,\n            SUM(amount) AS revenue\n     FROM read_parquet('sales/*.parquet')\n     GROUP BY 1\n     ORDER BY 1`)\n```\n\nDuckDB queries Parquet files directly — you never load the data into memory manually. This is the data scientist's replacement for pandas on large datasets."
      },
      {
        heading: "Repository pattern — keeping SQL out of business logic",
        body: "Don't scatter SQL strings across your codebase. The **repository pattern** isolates database access behind an interface:\n\n```go\ntype UserRepo interface {\n    FindByID(ctx context.Context, id int) (*User, error)\n    Save(ctx context.Context, u *User) error\n}\n\ntype sqlUserRepo struct{ db *sql.DB }\n\nfunc (r *sqlUserRepo) FindByID(ctx context.Context, id int) (*User, error) {\n    row := r.db.QueryRowContext(ctx, \"SELECT id, name FROM users WHERE id=?\", id)\n    var u User\n    return &u, row.Scan(&u.ID, &u.Name)\n}\n```\n\nTests inject a fake `UserRepo`. The business logic never imports `database/sql`."
      }
    ],
    keyCommands: ["go get github.com/mattn/go-sqlite3", "go get github.com/marcboeker/go-duckdb", "go doc database/sql"],
    exercises: [
      {
        question: "Why must you always call `rows.Close()` and check `rows.Err()` after iterating a sql.Rows?",
        answer: "`rows.Close()` releases the database connection back to the pool — forgetting it leaks connections. `rows.Err()` surfaces any error that occurred during iteration (network failure, query timeout) that wouldn't be returned by `rows.Next()` returning false."
      },
      {
        question: "What is the difference between OLTP and OLAP databases? Why is DuckDB better for analytics than PostgreSQL?",
        answer: "OLTP (e.g. PostgreSQL) is optimized for many concurrent short reads/writes (row-oriented storage, ACID transactions). OLAP (e.g. DuckDB) is optimized for few large aggregations over many rows (columnar storage, reads only needed columns, vectorized execution). DuckDB can scan 100M rows in seconds in-process; PostgreSQL would require network overhead, row parsing, and lacks vectorized execution."
      },
      {
        question: "Why is `defer tx.Rollback()` idiomatic even though you call `tx.Commit()` at the end?",
        answer: "If any operation between BeginTx and Commit returns an error and the function returns early, the transaction is left open and the connection is held. `defer tx.Rollback()` guarantees cleanup on all exit paths. After a successful `Commit()`, the Rollback call is a no-op (the transaction is already closed)."
      }
    ],
    lab: {
      goal: "Create an in-memory SQLite database, insert rows, and query them.",
      steps: [
        "Open an in-memory SQLite DB with sql.Open.",
        "CREATE TABLE users(id INTEGER, name TEXT).",
        "INSERT three rows, then SELECT and print them."
      ],
      verifyId: "sqlite",
      starter: `package main\n\nimport (\n    "database/sql"\n    "fmt"\n    _ "github.com/mattn/go-sqlite3"\n)\n\nfunc main() {\n    db, err := sql.Open("sqlite3", ":memory:")\n    if err != nil { panic(err) }\n    defer db.Close()\n\n    db.Exec("CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT)")\n    db.Exec("INSERT INTO users VALUES (1, 'Ada')")\n    db.Exec("INSERT INTO users VALUES (2, 'Alan')")\n    db.Exec("INSERT INTO users VALUES (3, 'Grace')")\n\n    rows, err := db.Query("SELECT id, name FROM users ORDER BY id")\n    if err != nil { panic(err) }\n    defer rows.Close()\n    for rows.Next() {\n        var id int; var name string\n        rows.Scan(&id, &name)\n        fmt.Printf("%d: %s\\n", id, name)\n    }\n    fmt.Println(rows.Err())\n}\n`
    }
  },
  {
    id: "http-api-capstone",
    number: 15,
    level: "expert",
    title: "HTTP APIs and the data-science capstone",
    summary: "Build a real JSON API with net/http, wire it to a database, and ship a complete data pipeline project.",
    duration: "35 min",
    sections: [
      {
        heading: "net/http — the standard library is enough",
        body: "Go's `net/http` is production-grade without a framework. The `http.ServeMux` added in Go 1.22 supports path parameters natively:\n\n```go\nmux := http.NewServeMux()\nmux.HandleFunc(\"GET /users/{id}\", func(w http.ResponseWriter, r *http.Request) {\n    id := r.PathValue(\"id\")\n    user, err := repo.FindByID(r.Context(), id)\n    if err != nil {\n        http.Error(w, err.Error(), http.StatusNotFound)\n        return\n    }\n    json.NewEncoder(w).Encode(user)\n})\n\nlog.Fatal(http.ListenAndServe(\":8080\", mux))\n```\n\nFor more complex routing, `chi` or `gorilla/mux` are lightweight additions that don't force a framework."
      },
      {
        heading: "Middleware and the handler chain",
        body: "Go middleware wraps `http.Handler`. The pattern composes handlers:\n\n```go\nfunc logging(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        start := time.Now()\n        next.ServeHTTP(w, r)\n        log.Printf(\"%s %s %v\", r.Method, r.URL.Path, time.Since(start))\n    })\n}\n\nmux = logging(mux)  // wrap the mux\n```\n\nCommon middleware: logging, authentication, rate limiting, CORS, request ID injection. Each is just a function from `http.Handler` to `http.Handler`."
      },
      {
        heading: "Graceful shutdown",
        body: "Production servers must drain in-flight requests before exiting. The pattern:\n\n```go\nserver := &http.Server{Addr: \":8080\", Handler: mux}\n\ngo func() {\n    if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {\n        log.Fatal(err)\n    }\n}()\n\nquit := make(chan os.Signal, 1)\nsignal.Notify(quit, os.Interrupt, syscall.SIGTERM)\n<-quit\n\nctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\ndefer cancel()\nserver.Shutdown(ctx)\n```\n\nThe `Shutdown` call stops accepting new connections and waits for active ones to finish, or until the timeout fires."
      },
      {
        heading: "Capstone: a CSV analytics API",
        body: "The capstone wires everything together. The service:\n\n1. On startup, reads `sales.csv` (10k rows) into an in-memory DuckDB database.\n2. Exposes `GET /summary` — runs a SQL GROUP BY and returns JSON totals per category.\n3. Exposes `GET /search?q=term` — full-text scan with a LIKE query.\n4. Logs each request with method, path, and duration.\n5. Shuts down gracefully on SIGTERM.\n\nThe project structure: `cmd/api/main.go` (wiring), `internal/store/duckdb.go` (DB layer), `internal/api/handlers.go` (HTTP handlers). Each layer is independently testable. The whole binary is ~8 MB and starts in under 100ms."
      }
    ],
    keyCommands: ["go build -ldflags='-s -w' -o api ./cmd/api", "curl http://localhost:8080/summary | jq .", "go test ./... -cover"],
    exercises: [
      {
        question: "How does Go's 1.22 enhanced ServeMux differ from older versions for path parameters?",
        answer: "Go 1.22 added method-specific routing (`GET /path`) and path parameters (`/users/{id}`) accessible via `r.PathValue(\"id\")`. Before 1.22, ServeMux only matched path prefixes and had no method dispatch or path parameters, requiring third-party routers like `chi` or `gorilla/mux`."
      },
      {
        question: "Why is graceful shutdown important and what does `server.Shutdown(ctx)` actually do?",
        answer: "Without graceful shutdown, in-flight requests are cut off mid-response when the process exits. `Shutdown` stops the listener (no new connections), waits for active connections to finish their current request, then closes idle connections. The context provides a timeout so a stuck handler doesn't block the deploy forever."
      },
      {
        question: "Describe the three-layer architecture of the capstone project and why each layer is separated.",
        answer: "1. `cmd/api/main.go` — wiring and startup: creates the DB, injects dependencies, starts the server. 2. `internal/store/` — data access: all SQL lives here, testable with a fake DB. 3. `internal/api/handlers.go` — HTTP: decodes requests, calls the store, encodes responses. Separation means each layer is testable without the others, and you can swap the DB or HTTP framework without touching business logic."
      }
    ],
    lab: {
      goal: "Build a minimal JSON API with two endpoints: GET /ping and GET /stats.",
      steps: [
        "Create an http.ServeMux and register GET /ping returning {\"ok\":true}.",
        "Register GET /stats returning a JSON struct with uptime and request count.",
        "Wrap the mux with a logging middleware that prints method, path, and duration."
      ],
      verifyId: "http-api",
      starter: `package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "log"\n    "net/http"\n    "sync/atomic"\n    "time"\n)\n\nvar (\n    start    = time.Now()\n    reqCount atomic.Int64\n)\n\nfunc logging(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        t := time.Now()\n        reqCount.Add(1)\n        next.ServeHTTP(w, r)\n        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(t))\n    })\n}\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc("GET /ping", func(w http.ResponseWriter, r *http.Request) {\n        json.NewEncoder(w).Encode(map[string]bool{"ok": true})\n    })\n    mux.HandleFunc("GET /stats", func(w http.ResponseWriter, r *http.Request) {\n        json.NewEncoder(w).Encode(map[string]any{\n            "uptime":   time.Since(start).String(),\n            "requests": reqCount.Load(),\n        })\n    })\n    fmt.Println("listening on :8080")\n    log.Fatal(http.ListenAndServe(":8080", logging(mux)))\n}\n`
    }
  }
];

export const chapters: Chapter[] = [..._CH1, ..._CH2, ..._CH3, ..._CH4, ..._CH5];

export function getChapter(id: string) { return chapters.find((c) => c.id === id); }
