---
title: A minimal and pure yet useful language
publish_date: 2023-10-11
---

At a number of points in my career I've desired a small, jq-like language for representing a transformation from some input to an output. I'd like it to be simple enough for things like loop counters to be simply `i + 1`, while flexible enough to process sequence mappings and reductions. I'd like it to be pure and deterministic, allowing the embedder to handle IO and any interaction with the world. I'd like it to be minimal, even to the point of the embedder providing things like numbers and strings. Some environments will want numbers to be python-like bigints, while others might want a simple double. Finally, I'd like it to be eventually fast and able to be compiled.

I'd like this to happen in 2 stages. (1) define an interpreted language that satisfies each of these points. (2) empower compilation in an autograd-like manner; using operator overloading to make execution of the program actually output a WASM or native binary.

## The interpreted language
There are 4 primitive types:
1. `!never`
2. symbol
3. external_value
4. function
```
vec3 x y z = {
  x, y, z
  dot other = x * other.x + y * other.y + z * other.z
}
```
This defines a curried function. `vec3 1 2 3` results in a desugared function like this:
```
_:(!host.union .x) -> 1,
_:(!host.union .y) -> 2,
_:(!host.union .z) -> 3,
_:(!host.union .dot) -> other -> !host.add (!host.add (!host.mul 1 other .x) (!host.mul 2 other .y)) (!host.mul 3 other .z)
```
`.x`, `.y`, and `.z` are symbols. `value:type -> result` is an anonymous function. Literals are created via calls to the host embedder, which returns an external_value. For example, `a = 1` is desugared to something like this:
```
a = !host.literal_number 1
```
The parser handles things like precedence rules, string parsing, and number parsing (which results in either a bigint or a double that the embedder can further mutate/normalize). This provides a uniform structure for dialects and reduces surprise. The actual behavior of those values is handled by the embedder.

## Overloading

Let's talk about `!never`, which is used to implement our type system. A type is merely a function that accepts a value, and returns any non-`!never` value if the value matches the type, and returns `!never` if the value doesn't match the type. `!never` is contagious; like all primitives it behaves as a function but always returns `!never`. Passing it as an argument will always return `!never`, because it can't match any type signature. Thus, `!never`s are only useful for implementing our type system.

This brings us to our final feature; types. Notice the desugared function above has 4 clauses, each with a different type. For example, `!host.union .x` is a function that returns `.x` if the argument is `.x`, and `!never` otherwise. It behaves as the type. The runtime will naively type-test each clause to determine the function body to invoke.

This might seem a little weirder than it should be, and you'd be right, but the magic happens now that we can pass any kind of value to our function. A compiler would pass a set representing all possible values that the function could be called with. Each function clause whose type union doesn't return the empty set (represented as `!never`), will be invoked with the argument as the unioned type. Following clauses are matched to the new argument of the difference of the preceding argument and the preceding union (using `!host.difference`), and finally, the result accumulated using `!host.merge`.

`a:string -> handleStr a, a:numberGt100 -> handleBigNum a, a:number -> handleNumber a` becomes something like this:
```
arg -> (
    union = !host.union arg string
    res = handleStr union
    arg = !host.difference arg union
    
    union = !host.union arg numberGt100
    res = !host.merge res (handleBigNum union)
    arg = !host.difference arg union
    
    union = !host.union arg number
    res = !host.merge res (handleNumber union)
    arg = !host.difference arg union
    
    res // Return this value
)
```

So for a compiler, we're passing sets and merging them, but for a simple interpreted program, our host becomes very simple:
```
!host.union x x = x
!host.union x y = !never

!host.difference x x = !never
!host.difference x !never = x

!host.merge x !never = x
!host.merge !never x = x
```

Of course all of this feels very slow, and indeed probably will be. However, the goal is to empower simple transformations that touch their values (numbers, strings, file descriptors, sets) as lightly as possible, easing the injection of disparate library implementations. This enables fun things like compilation, metering, full differentiation, or fuzzing.