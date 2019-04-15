### const

`const` es una adición ofrecida por ES6 / TypeSCript muy bienvenida. Permite la inmutabilidad con variables. Esto es bueno tanto desde una perspectiva de documentación como de tiempo de ejecución. Para usar const, simplemente reemplazá `var` con `const`:

```ts
const foo = 123;
```

> En mi opinión, la sintaxis es mucho mejor que otros lenguages que obligan al usuario a tipear algo como `let constant foo`. Es decir, una variable + un especificador de comportamiento. 

`const`es una buena práctica tanto en términos de legibilidad como de mantenibilidad y evita usar *literales mágicos*. Ejemplo: 

```ts
// Poca legibilidad
if (x > 10) {
}

// Mejor!
const maxRows = 10;
if (x > maxRows) {
}
```

#### las declaraciones const deben ser inicializadas
Lo siguiente resultará en un error de compilación:

```ts
const foo; // ERROR: const declarations must be initialized
```

#### El lado izquierdo de la asignación no puede ser una constante
Las constantes son inmutables luego de su creación, asi que si intentas asignarles un nuevo valor obtendrás un error de compilación: 

```ts
const foo = 123;
foo = 456; // ERROR: Left-hand side of an assignment expression cannot be a constant
```

#### Ámbito de bloque
Una `const` tiene ámbito de bloque, como vimos con [`let`](./let.md):

```ts
const foo = 123;
if (true) {
    const foo = 456; // Permitido, ya que es una nueva variable limitada a este bloque `if`
}
```

#### Inmutabilidad profunda
Una `const` funciona objetos literales también, en lo que respecta a proteger la *referencia* de la variable:

```ts
const foo = { bar: 123 };
foo = { bar: 456 }; // ERROR : Left hand side of an assignment expression cannot be a constant
```

Sin embargo, aún permite que sub-propiedades de los objetos sean mutados, como mostramos a continuación:

```ts
const foo = { bar: 123 };
foo.bar = 456; // Permitido!
console.log(foo); // { bar: 456 }
```

#### Preferí const

Siempre usá `const`, excepto que planees inicializar una variable *lazily*, o reasignarla (usa `let` para esos casos).
