export type Level = "beginner" | "intermediate" | "advanced" | "expert";

export interface Lab { goal: string; steps: string[]; verifyId: string; starter: string }
export interface Section { heading: string; body: string }
export interface Chapter {
  id: string;
  level: Level;
  number: number;
  title: string;
  summary: string;
  duration: string;
  sections: Section[];
  keyCommands: string[];
  lab?: Lab;
}

export const chapters: Chapter[] = [
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
      }
    ],
    keyCommands: ["go run main.go", "go build -o app .", "go fmt ./...", "go vet ./..."],
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
        body: "Go has a verbose declaration form and a short form. The verbose form names the type explicitly: `var name string = \"ada\"`. The short form uses **type inference** with the `:=` operator: `name := \"ada\"`. Inside a function, you'll use `:=` almost exclusively. At package scope only `var` and `const` are allowed.\n\n```go\nvar count int        // declared, no value yet\ncount = 42           // assigned later\n\nname := \"ada\"        // declared + inferred + assigned\nratio := 3.14        // float64\nactive := true       // bool\n```\n\nThe **zero value** is the rule that makes Go safer than C: every variable starts at a defined value, never garbage. `int` is `0`, `string` is `\"\"`, `bool` is `false`, pointers are `nil`. You can rely on this. It changes how you write code: you rarely need constructors because the zero value is usually already useful."
      },
      {
        heading: "Constants and untyped numbers",
        body: "`const` declares a value that the compiler bakes in. Constants can be **untyped**, which means they take on whatever type the surrounding expression needs. This is why `const pi = 3.14159` works as both `float32` and `float64` depending on where you use it. Once you assign an untyped constant to a typed variable, it becomes that type."
      },
      {
        heading: "The basic numeric types and when each one matters",
        body: "`int` is the default; on a 64-bit machine it's 64 bits wide. Use it for counts, indices, and loop variables. `int32` and `int64` are for when you're serializing to a wire format and need an exact width. `float64` is the default float; use `float32` only if you're touching graphics APIs that demand it. `byte` is an alias for `uint8` and `rune` is an alias for `int32`. `rune` represents a Unicode code point — important the moment you index into a string."
      }
    ],
    keyCommands: ["go run .", "go doc builtin"],
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
        body: "Go has no `while`, no `do-while`, no ternary. It has `if`, `for`, and `switch`. The `if` is unusual in that it lets you bind a variable scoped to the if/else block:\n\n```go\nif err := doThing(); err != nil {\n    return err\n}\n```\n\nThis pattern is everywhere. It keeps the error variable from leaking into the surrounding scope and reads as 'do the thing; if it failed, bail.' Once you've written it ten times it becomes invisible."
      },
      {
        heading: "for is the only loop",
        body: "Three forms cover everything:\n\n```go\nfor i := 0; i < 10; i++ { ... }   // classic C-style\nfor cond { ... }                   // the 'while' Go doesn't have\nfor { ... }                        // infinite\n```\n\nAnd `for ... range` walks slices, maps, channels, and strings:\n\n```go\nfor i, v := range items { ... }\nfor key, val := range counts { ... }\nfor _, r := range \"héllo\" { ... }   // r is a rune, not a byte\n```\n\nUse `_` to discard an index or value you don't need."
      },
      {
        heading: "switch is more powerful than it looks",
        body: "Go's `switch` doesn't fall through by default — each case is independent. Cases can be **expressions**, which means you can collapse long if/else chains:\n\n```go\nswitch {\ncase score >= 90: grade = \"A\"\ncase score >= 80: grade = \"B\"\ndefault:          grade = \"F\"\n}\n```\n\nThis form (switch with no value) is idiomatic when you want pattern-matching ergonomics. The `type switch` lets you branch on an interface's concrete type — we'll see it in chapter 6."
      }
    ],
    keyCommands: ["go run .", "go vet ./..."],
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
  },
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
        body: "**`error` is an interface with one method: `Error() string`.** Any type that implements it is an error. The standard library provides `errors.New` and `fmt.Errorf` for ad-hoc errors, but for libraries you'll define your own type so callers can inspect it:\n\n```go\ntype NotFoundError struct{ Key string }\nfunc (e *NotFoundError) Error() string { return \"not found: \" + e.Key }\n```\n\nCallers use `errors.As` and `errors.Is` (Go 1.13+) to introspect wrapped errors."
      },
      {
        heading: "defer, panic, and recover — used sparingly",
        body: "**`defer`** schedules a call to run when the surrounding function returns. It's how you close files, unlock mutexes, and clean up — without try/finally:\n\n```go\nf, err := os.Open(name)\nif err != nil { return err }\ndefer f.Close()\n```\n\n**`panic`** unwinds the stack and **`recover`** catches that unwind. Don't use them for control flow. They exist for unrecoverable states or to seal a goroutine boundary so a runaway panic doesn't kill your server."
      },
      {
        heading: "Named returns and when not to use them",
        body: "Go lets you name return values: `func split(sum int) (x, y int)`. The names act as pre-declared variables and a bare `return` returns their current values. Use this for **short** functions where the names document intent. Avoid it in long functions — the implicit-return behavior becomes a footgun."
      }
    ],
    keyCommands: ["go doc errors", "go run ."],
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
        body: "A Go **array** has a fixed size baked into its type — `[3]int` and `[4]int` are different types. You'll rarely use arrays directly. A **slice** is a view into an underlying array, with three fields: pointer, length, capacity. `[]int` is the type. `append` grows the slice, allocating a new backing array when capacity runs out.\n\n```go\ns := []int{1, 2, 3}\ns = append(s, 4)\nfmt.Println(s, len(s), cap(s))\n```\n\nThe footgun: when you slice a slice (`s[1:3]`), you share the backing array. Mutating one view mutates the other. If you need an independent copy, use `copy` or `slices.Clone`."
      },
      {
        heading: "Maps — fast, but order-less",
        body: "`map[K]V` is Go's hash table. Declaration uses `make` because the zero value (`nil`) can be read from but not written to:\n\n```go\ncounts := make(map[string]int)\ncounts[\"go\"]++\n\nif v, ok := counts[\"rust\"]; ok {\n    fmt.Println(v)\n}\n```\n\n**The comma-ok idiom** distinguishes 'key absent' from 'key present with zero value.' Iteration order is intentionally randomized — never depend on it. If you need order, keep a separate slice of keys."
      },
      {
        heading: "Structs are records, not objects",
        body: "A struct groups named fields. Go has no classes; methods are functions with a **receiver**:\n\n```go\ntype Point struct{ X, Y float64 }\n\nfunc (p Point) Distance(q Point) float64 {\n    dx, dy := p.X-q.X, p.Y-q.Y\n    return math.Sqrt(dx*dx + dy*dy)\n}\n```\n\nReceivers come in two flavors. A **value receiver** gets a copy. A **pointer receiver** (`func (p *Point)`) gets a reference and can mutate. Use a pointer receiver when the method modifies the struct, when the struct is large, or for consistency across a type's methods."
      }
    ],
    keyCommands: ["go doc slices", "go doc maps"],
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
        body: "The standard library's most-used interfaces have one method: `io.Reader`, `io.Writer`, `io.Closer`, `error`, `fmt.Stringer`. Small interfaces compose. Large interfaces ossify. **Accept interfaces, return structs** — this is the most cited piece of Go API advice and it follows from structural typing."
      },
      {
        heading: "Type assertions and the type switch",
        body: "When you hold an interface value and need to recover the concrete type, you assert:\n\n```go\nif sw, ok := w.(io.StringWriter); ok {\n    sw.WriteString(s)\n}\n```\n\nA **type switch** branches on the dynamic type:\n\n```go\nswitch v := x.(type) {\ncase int:    fmt.Println(\"int\", v)\ncase string: fmt.Println(\"string\", v)\ndefault:     fmt.Println(\"other\")\n}\n```\n\nReach for type assertions sparingly. If you're doing them everywhere, your interface is probably too narrow."
      }
    ],
    keyCommands: ["go doc io.Reader", "go doc fmt.Stringer"],
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
  },
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
        body: "`select` is `switch` for channels. It blocks until one of its cases can proceed.\n\n```go\nselect {\ncase v := <-results: handle(v)\ncase <-time.After(time.Second): return errTimeout\ncase <-ctx.Done(): return ctx.Err()\n}\n```\n\nWith `select` you compose fan-out, fan-in, timeouts, and cancellation. The `context.Context` pattern (next chapter) is built on top of this."
      },
      {
        heading: "Closing channels and the range loop",
        body: "A sender closes a channel with `close(ch)` to signal 'no more values.' A receiver can `for v := range ch { ... }` and exit when the channel closes. **Only the sender closes**, and only when no further sends will happen. Sending on a closed channel panics — intentional, it forces clean ownership."
      }
    ],
    keyCommands: ["go run -race .", "go doc context"],
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
    title: "context, cancellation, and patterns that hold up in production",
    summary: "How real Go services manage deadlines, cancellation, and resource cleanup — and why context.Context is in every function signature.",
    duration: "22 min",
    sections: [
      {
        heading: "Why context exists",
        body: "Long-running operations — RPC calls, DB queries, HTTP handlers — need a way to be told 'stop, the caller no longer cares.' Without that, a slow downstream service backs up your whole system.\n\n**`context.Context`** is Go's answer. It carries a deadline, a cancellation signal, and request-scoped key/value pairs through a call stack. Every function that does I/O or blocks should take `ctx context.Context` as its **first argument**:\n\n```go\nfunc fetchUser(ctx context.Context, id string) (*User, error)\n```"
      },
      {
        heading: "Deadlines and cancellation",
        body: "Build a context with a deadline; pass it down; respect `ctx.Done()`:\n\n```go\nctx, cancel := context.WithTimeout(parent, 2*time.Second)\ndefer cancel()\n\nresult, err := db.QueryContext(ctx, sql, args...)\n```\n\n`cancel` is always called — defer it the moment you create the context, or you leak a timer goroutine. The `database/sql`, `net/http`, and `os/exec` packages all integrate with `context`."
      },
      {
        heading: "errgroup — the pattern you'll use everywhere",
        body: "`golang.org/x/sync/errgroup` is the production idiom for 'launch N goroutines, wait for all, abort on the first error':\n\n```go\ng, ctx := errgroup.WithContext(ctx)\nfor _, url := range urls {\n    url := url\n    g.Go(func() error { return fetch(ctx, url) })\n}\nif err := g.Wait(); err != nil { return err }\n```\n\nThe `url := url` shadowing captures each iteration's value. Go 1.22 fixed loop variable scoping so this dance is no longer required, but you'll see it in millions of lines of existing code."
      },
      {
        heading: "Three patterns that prevent goroutine leaks",
        body: "A goroutine that never terminates is a memory leak. Three rules:\n\n1. **Always have a way out.** Every long-lived `for select` should include a `case <-ctx.Done(): return`.\n2. **Close channels from exactly one place.** The owner is the sender.\n3. **Limit fan-out.** Don't spawn one goroutine per item if items are unbounded. Use a worker pool or a semaphore.\n\nThe race detector (`go test -race`) finds bugs you missed. Run it in CI."
      }
    ],
    keyCommands: ["go run -race .", "go test -race ./...", "go doc context.WithTimeout"],
    lab: {
      goal: "Run three operations with a 500ms timeout using context.",
      steps: [
        "Create a context with WithTimeout(500ms).",
        "Launch three goroutines that simulate work with time.Sleep durations 200/400/800 ms.",
        "Use select to either collect each result or abort when ctx.Done() fires."
      ],
      verifyId: "context",
      starter: `package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc slow(ctx context.Context, id, ms int) (string, error) {\n    select {\n    case <-time.After(time.Duration(ms) * time.Millisecond):\n        return fmt.Sprintf("job %d done", id), nil\n    case <-ctx.Done():\n        return "", ctx.Err()\n    }\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)\n    defer cancel()\n\n    durations := []int{200, 400, 800}\n    results := make(chan string, len(durations))\n\n    for i, d := range durations {\n        i, d := i, d\n        go func() {\n            r, err := slow(ctx, i, d)\n            if err != nil {\n                results <- fmt.Sprintf("job %d: %v", i, err)\n                return\n            }\n            results <- r\n        }()\n    }\n    for range durations {\n        fmt.Println(<-results)\n    }\n}\n`
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
        body: "A **module** is a versioned collection of packages. `go mod init github.com/you/project` creates a `go.mod` file. Add a dependency by importing it and running `go mod tidy`.\n\n```\nmodule github.com/you/project\n\ngo 1.22\n\nrequire (\n    github.com/jackc/pgx/v5 v5.5.0\n)\n```\n\nMinimum version selection (MVS) means Go picks the **lowest** version that satisfies all requirements. This makes builds reproducible without a lockfile-resolution step. Use `go get -u ./...` to upgrade intentionally."
      },
      {
        heading: "The standard project layout (or the absence of one)",
        body: "Go has no enforced layout, but a convention has emerged:\n\n```\ncmd/\n  api/main.go\ninternal/\n  user/\n  http/\nmigrations/\ngo.mod\n```\n\n**`internal/`** is special: the compiler enforces that only the parent module can import it. Use it liberally to keep your public surface small. `cmd/` is the convention for executables when you have more than one."
      },
      {
        heading: "Testing — the boring kind that ships",
        body: "Go's testing tool is part of the standard library. A test file ends in `_test.go`:\n\n```go\nfunc TestAdd(t *testing.T) {\n    got := Add(2, 3)\n    if got != 5 { t.Fatalf(\"got %d, want 5\", got) }\n}\n```\n\nThere is no assertion library by convention. **Table-driven tests** are the idiom:\n\n```go\nfor _, tc := range []struct{ a, b, want int }{ {2,3,5}, {0,0,0} } {\n    if got := Add(tc.a, tc.b); got != tc.want {\n        t.Errorf(\"Add(%d,%d) = %d, want %d\", tc.a, tc.b, got, tc.want)\n    }\n}\n```\n\nBenchmarks and fuzz tests live alongside. `go test -race ./...` should be green before you merge."
      },
      {
        heading: "Profiling and the 3am tools",
        body: "When a service misbehaves in production, three tools matter:\n\n1. **`net/http/pprof`** — import it for its side effect and your service exposes `/debug/pprof/` with CPU, heap, goroutine, and mutex profiles.\n2. **The race detector** — `-race` instruments memory accesses; it catches data races deterministically when triggered.\n3. **`runtime/trace`** — a flight recorder of scheduler events.\n\nGood Go ops looks boring: structured logs, a `/healthz` endpoint, graceful shutdown that respects `context.Context`, a single static binary in a `FROM scratch` Docker image."
      }
    ],
    keyCommands: ["go mod init github.com/you/project", "go mod tidy", "go test -race ./...", "go test -bench=. ./...", "go tool pprof http://localhost:6060/debug/pprof/heap"],
    lab: {
      goal: "Demonstrate a simple Add function and verify it.",
      steps: [
        "Define Add(a, b int) int.",
        "Call it with several inputs and print results.",
        "On a real project you'd put assertions in _test.go and run `go test`."
      ],
      verifyId: "table-test",
      starter: `package main\n\nimport "fmt"\n\nfunc Add(a, b int) int { return a + b }\n\nfunc main() {\n    cases := []struct{ a, b, want int }{\n        {2, 3, 5},\n        {0, 0, 0},\n        {-1, 1, 0},\n        {100, -50, 50},\n    }\n    ok := true\n    for _, tc := range cases {\n        got := Add(tc.a, tc.b)\n        status := "ok"\n        if got != tc.want {\n            status = "FAIL"\n            ok = false\n        }\n        fmt.Printf("Add(%d,%d) = %d (want %d) %s\\n", tc.a, tc.b, got, tc.want, status)\n    }\n    if ok {\n        fmt.Println("\\nall cases passed")\n    }\n}\n`
    }
  }
];

export function getChapter(id: string) { return chapters.find((c) => c.id === id); }
