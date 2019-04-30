## Literales
Los literales son valores *exactos* que son primitivos de JavaScript.

### Literales String

Pueden usar un literal string como un tipo. Por ejemplo:

```ts
let foo: 'Hola';
```

Aquí hemos creado una variable llamada `foo` que *aceptará que se le asigne únicamente el valor literal `'Hola'`*. Lo demostramos a continuación:

```ts
let foo: 'Hola';
foo = 'Bar'; // Error: "Bar" is not assignable to type "Hola"
```

No son muy útiles por su cuenta, pero pueden ser usados en uniones de tipo para crear abstracciones poderosas (y útiles). Por ejemplo:

```ts
type CardinalDirection =
    | "North"
    | "East"
    | "South"
    | "West";

function move(distance: number, direction: CardinalDirection) {
    // ...
}

move(1,"North"); // Ok
move(1,"Nurth"); // Error!
```

### Otros tipos literales
TypeScript también soporta los tipos literales `boolean` y `number`, por ejemplo:

```ts
type OneToFive = 1 | 2 | 3 | 4 | 5;
type Bools = true | false;
```

### Inferencia
Es común obtener un error del tipo `Type string is not assignable to type "foo"`. El siguiente ejemplo demuestra esto:

```js
function iTakeFoo(foo: 'foo') { }
const test = {
  someProp: 'foo'
};
iTakeFoo(test.someProp); // Error: Argument of type string is not assignable to parameter of type 'foo'
```

Esto se debe a que TypeScript infiere que `test` es de tipo `{ someProp: string }`. La solución en este caso sería usar una simple aserción de tipo para señalarle a TypeScript el literal que quieren que infiera, como mostramos a continuación:

```js
function iTakeFoo(foo: 'foo') { }
const test = {
  someProp: 'foo' as 'foo'
};
iTakeFoo(test.someProp); // Ok!
```

o usar una anotación en el punto de declaracion de tipo que ayude a TypeScript a inferir qué es lo correcto:

```
function iTakeFoo(foo: 'foo') { }
type Test = {
  someProp: 'foo',
}
const test: Test = { // Anotación - someProp inferida es siempre === 'foo'
  someProp: 'foo' 
}; 
iTakeFoo(test.someProp); // Okay!
```

### Casos de uso
Los casos de uso válido para los tipos de string literales son:

#### Enums basadas en strings

[Los enums de TypeScript tienen base numérica](../enums.md). Pueden usar string literales con unión de tipos para fingir un enum basado en strings, como hicimos en el ejemplo anterior para `CardinalDirection`. También pueden generar una estructura `Clave:Valor` usando la siguiente función:

```ts
/** Función de utilidad para crear una K:V a partir de una lista de strings */
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
```

Y luego generen la union de tipo literal usando `keyof typeof`. Aquí está el ejemplo completo:

```ts
/** Función de utilidad para crear una K:V a partir de una lista de strings */
function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

/**
  * Muestra crear una enum de strings
  */

/** Crear una K:V */
const Direction = strEnum([
  'North',
  'South',
  'East',
  'West'
])
/** Crear un tipo */
type Direction = keyof typeof Direction;

/** 
  *  Muestra crear una enum de strings
  */
let sample: Direction;

sample = Direction.North; // Okay
sample = 'North'; // Okay
sample = 'AnythingElse'; // ERROR!
```

#### Modelando APIs de JavaScript ya existentes

Por ejemplo, [el editor CodeMirror tiene una opción `readOnly`](https://codemirror.net/doc/manual.html#option_readOnly) que puede ser o un `boolean` o la string literal `"nocursor"` (valores válidos: `true,false,"nocursor"`). Puede ser declarado como:

```ts
readOnly: boolean | 'nocursor';
```

#### Uniones discriminadas

Cubriremos este tema [más adelante en el libro](./discriminated-unions.md).
