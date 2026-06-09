export interface Question {
  id: string;
  chapterId: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    id: "q1",
    chapterId: "hello-go",
    level: "beginner",
    prompt: "You write a function named `helper` in package `util`. From another package you try to call `util.helper()` and the compiler refuses. Why?",
    choices: [
      "Go requires an explicit `export` keyword you forgot to add.",
      "Lowercase identifiers are package-private; only capitalized names are exported.",
      "You need to add `helper` to a manifest in go.mod.",
      "Cross-package calls must go through an interface."
    ],
    answer: 1,
    explanation: "Visibility in Go is encoded in the case of the first letter. `helper` is unexported; `Helper` would be callable from outside the package."
  },
  {
    id: "q2",
    chapterId: "hello-go",
    level: "beginner",
    prompt: "What does `go run main.go` do that `go build` does not?",
    choices: [
      "It produces a smaller binary.",
      "It executes the resulting binary immediately and doesn't leave it on disk.",
      "It downloads dependencies; `go build` does not.",
      "It runs tests in addition to compiling."
    ],
    answer: 1,
    explanation: "`go run` compiles to a temporary file and executes it. `go build` produces a persistent binary you can copy to a server."
  },
  {
    id: "q3",
    chapterId: "types-and-variables",
    level: "beginner",
    prompt: "What is the value of a `var score int` declared without initialization?",
    choices: ["nil", "undefined", "0", "A compile error — Go requires initialization."],
    answer: 2,
    explanation: "Go's zero-value rule guarantees `int` starts at 0, `string` at \"\", `bool` at false, pointers at nil. This is why constructors are often unnecessary."
  },
  {
    id: "q4",
    chapterId: "types-and-variables",
    level: "beginner",
    prompt: "Why can `const pi = 3.14159` be assigned to both a `float32` and a `float64` variable?",
    choices: [
      "Go silently converts numeric types at runtime.",
      "Constants in Go can be untyped; they take on the type required by the surrounding expression.",
      "`float32` and `float64` are the same type under the hood.",
      "The `const` keyword disables type checking."
    ],
    answer: 1,
    explanation: "Untyped constants keep their abstract numeric nature until pinned to a concrete type by use, avoiding most numeric-conversion boilerplate."
  },
  {
    id: "q5",
    chapterId: "control-flow",
    level: "beginner",
    prompt: "Which keyword does Go use to write a 'while' loop?",
    choices: ["while", "loop", "for", "until"],
    answer: 2,
    explanation: "`for cond { ... }` is Go's while. There is only one loop keyword — part of the language's deliberate minimalism."
  },
  {
    id: "q6",
    chapterId: "control-flow",
    level: "beginner",
    prompt: "By default in a Go `switch`, what happens at the end of a matched case?",
    choices: [
      "Execution falls through to the next case.",
      "Execution exits the switch — no fallthrough.",
      "Execution loops back to the top of the switch.",
      "Execution panics unless `break` is used."
    ],
    answer: 1,
    explanation: "Cases are independent in Go. To intentionally fall through, you use the `fallthrough` keyword — but it's rare."
  },
  {
    id: "q7",
    chapterId: "functions-errors",
    level: "intermediate",
    prompt: "Why does Go not have exceptions?",
    choices: [
      "The runtime is too small to support them.",
      "Returning errors as values makes failure modes explicit in the type signature, which the designers preferred over invisible control flow.",
      "Exceptions are too slow on modern hardware.",
      "Go's compiler couldn't implement them in time for the 1.0 release."
    ],
    answer: 1,
    explanation: "`(T, error)` puts failure in the function's contract; the caller has to acknowledge it. Exceptions hide the failure path."
  },
  {
    id: "q8",
    chapterId: "functions-errors",
    level: "intermediate",
    prompt: "When is `defer` resolved?",
    choices: [
      "Immediately, in document order.",
      "When the program exits.",
      "When the surrounding function returns, in LIFO order.",
      "On the next garbage collection cycle."
    ],
    answer: 2,
    explanation: "Deferred calls run when the enclosing function returns, in reverse order of registration. That's why `defer f.Close()` works on every early return."
  },
  {
    id: "q9",
    chapterId: "slices-maps-structs",
    level: "intermediate",
    prompt: "You do `b := a[1:3]` then modify `b[0]`. What happens to `a`?",
    choices: [
      "Nothing — slices are deep-copied by default.",
      "`a[1]` is also modified, because both slices share a backing array.",
      "The program panics: slices are immutable.",
      "`a` is reallocated to remain unchanged."
    ],
    answer: 1,
    explanation: "Sub-slicing shares the underlying array. This is the most common slice footgun. Use `slices.Clone` or `copy` for independence."
  },
  {
    id: "q10",
    chapterId: "slices-maps-structs",
    level: "intermediate",
    prompt: "Why is `if v, ok := m[\"x\"]; ok { ... }` preferred over `if v := m[\"x\"]; v != zero { ... }`?",
    choices: [
      "It's faster.",
      "It distinguishes 'key absent' from 'key present with the zero value.'",
      "It avoids a goroutine leak.",
      "Go disallows reading absent map keys without the ok form."
    ],
    answer: 1,
    explanation: "Reading an absent key returns the zero value, which is indistinguishable from a key whose value is the zero value. The comma-ok idiom is the only way to tell."
  },
  {
    id: "q11",
    chapterId: "interfaces",
    level: "advanced",
    prompt: "How does a Go type declare that it implements an interface?",
    choices: [
      "With an `implements` keyword in the type declaration.",
      "It doesn't — if the method set matches, the type satisfies the interface implicitly.",
      "By embedding the interface in the struct.",
      "By registering itself in an `init()` block."
    ],
    answer: 1,
    explanation: "Structural (implicit) interface satisfaction is the defining feature. The producing package doesn't need to know about the interface."
  },
  {
    id: "q12",
    chapterId: "interfaces",
    level: "advanced",
    prompt: "The advice 'accept interfaces, return structs' exists because…",
    choices: [
      "Returning interfaces is slower at runtime.",
      "Concrete return types preserve method sets and avoid forcing callers into your abstractions; small input interfaces maximize the set of usable callers.",
      "Go's compiler can't inline interface methods.",
      "Structs are the only things you can serialize to JSON."
    ],
    answer: 1,
    explanation: "Inputs gain flexibility from interfaces. Outputs lose information when wrapped in interfaces. The combination keeps your API ergonomic."
  },
  {
    id: "q13",
    chapterId: "goroutines-channels",
    level: "advanced",
    prompt: "What happens if you send on a closed channel?",
    choices: [
      "The send is silently dropped.",
      "The goroutine blocks forever.",
      "A panic.",
      "The channel is reopened automatically."
    ],
    answer: 2,
    explanation: "Sending on a closed channel panics. The rule 'only the sender closes, and only when no more sends will happen' exists to prevent this."
  },
  {
    id: "q14",
    chapterId: "goroutines-channels",
    level: "advanced",
    prompt: "What does an unbuffered channel guarantee that a buffered one with capacity 10 does not?",
    choices: [
      "Unbuffered channels are faster.",
      "An unbuffered send blocks until a receiver is ready — it's a synchronization point between the two goroutines.",
      "Unbuffered channels never panic.",
      "Buffered channels can't be used with `select`."
    ],
    answer: 1,
    explanation: "Unbuffered channels are a rendezvous. The send completes only when the receive completes, which is often the actual synchronization the program needs."
  },
  {
    id: "q15",
    chapterId: "context-and-concurrency-patterns",
    level: "expert",
    prompt: "Why is `defer cancel()` the standard pair for `ctx, cancel := context.WithTimeout(...)`?",
    choices: [
      "It's cosmetic; you don't really need to call cancel.",
      "Without calling cancel, the timer goroutine and tree-node leak until the deadline fires.",
      "`cancel` is required to read `ctx.Err()`.",
      "It propagates the context to child goroutines."
    ],
    answer: 1,
    explanation: "Every WithTimeout/WithCancel allocates resources reclaimed only when cancel runs. `defer cancel()` is mandatory hygiene — `go vet` warns if missing."
  },
  {
    id: "q16",
    chapterId: "production-go",
    level: "expert",
    prompt: "What is the role of the `internal/` directory in a Go module?",
    choices: [
      "It's purely conventional; the compiler treats it like any other directory.",
      "Packages under `internal/` can only be imported by code rooted at the parent of that `internal/` — the compiler enforces this.",
      "It's where `go mod tidy` stores cached dependencies.",
      "It's the only place where `package main` may live."
    ],
    answer: 1,
    explanation: "The `internal/` rule is compiler-enforced, not stylistic. It lets you ship a small public API while organizing the rest of the module freely."
  }
];
