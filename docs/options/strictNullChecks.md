# `strictNullChecks`

Por default `null` y `undefined` son asignables a todos los tipos en TypeScript. Por ejemplo:

```ts
let foo: number = 123;
foo = null; // OK
foo = undefined; // OK
```

Esto se encuentra modelado en base a como muchas personas escriben JavaScript. Sin embargo, como con todo, TypeScript les permite ser *explícito* acerca de lo que *puede y no puede* recibir un `null` o `undefined` como valor.

En modo de control estricto de nulls, `null` y `undefined` son diferentes:

```ts
let foo = undefined;
foo = null; // NOT OK
```

Supongamos que tenemos una interface `Member`:

```ts
interface Member {
  name: string,
  age?: number
}
```

No todo `Member` proveerá su edad, por lo que `age` es una propiedad opcional. Es decir, el valor de `age` puede o no ser `undefined`.

`undefined` es la fuente de todo el mal. Suele desembocar en errores en tiempo de ejecución. Es fácil escribir código que va a tirar un `Error` en tiempo de ejecución:

```ts
getMember()
  .then(member: Member => {
    const stringifyAge = member.age.toString() // Cannot read property 'toString' of undefined
  })
```

Pero en modo de control estricto de nulls, este error será atrapado en tiempo de compilación:

```ts
getMember()
  .then(member: Member => {
    const stringifyAge = member.age.toString() // Object is possibly 'undefined'
  })
```

## Operador de Aserción No-Null

Un nuevo operador sufijo de expresión  `!` puede ser usado para declarar que su operando es un no-null y no-undefined en contextos en el que el control de tipos es incapad de concluir ese hecho. Por ejemplo:

```ts
// compilado con --strictNullChecks
function validateEntity(e?: Entity) {
    // Tira una excepción si e es null o una entidad inválida
}

function processEntity(e?: Entity) {
    validateEntity(e);
    let a = e.name;  // TS ERROR: e may be null.
    let b = e!.name;  // OK. Estamos declarando que e es no-null
}
```

> Noten que es simplemente una declaración, y de la misma forma que las declaraciones de tipo, *ustedes son responsables* de asegurarse que el valor no es null. Una declaración no-null es, esencialmente, lo mismo que decirle al compilador "Yo se que esto no es null así que dejame usarlo como si no fuera null".

### Operador de aserción de asignación definitiva

TypeScript también se quejará si propiedades en clases no son inicializadas. Por ejemplo:

```ts
class C {
  foo: number; // OK ya que es asignado en el constructor
  bar: string = "hello"; // OK ya que tiene una propiedad inicializada
  baz: boolean; // TS ERROR: Property 'baz' has no initializer and is not assigned directly in the constructor.
  constructor() {
    this.foo = 42;
  }
}
```

Pueden usar el operador de aserción de asignación definitiva al nombre de la propiedad para decirle a TypeScript que la estan inicializando en otro lado que no es el constructor. Por ejemplo:

```ts
class C {
  foo!: number;
  // ^
  // Noten el signo de exclamación!
  // Este es el modificador "aserción de asignación definitiva"
  
  constructor() {
    this.initialize();
  }
  initialize() {
    this.foo = 0;
  }
}
```

También pueden usar esta aserción con una simple declaración de variable:

```ts
let a: number[]; // No hay aserción
let b!: number[]; // Aserción

initialize();

a.push(4); // TS ERROR: variable used before assignment
b.push(4); // OK: Gracias a la aserción

function initialize() {
  a = [0, 1, 2, 3];
  b = [0, 1, 2, 3];
}
```

> Como con todas las aserciones, le estan diciendo al compilador que confíe en ustedes. El compilador no se quejará aún si el código no siempre asigna un valor a la propiedad. 
