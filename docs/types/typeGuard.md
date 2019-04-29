* [Guardia de tipos](#type-guard)
* [Guardias de tipo definidas por el usuario](#user-defined-type-guards)

## Guardia de tipos
Las guardias de tipos les permitirán reducir los posibles tipos de un objeto dentro de un bloque condicional.

### typeof

TypeScript está al tanto del uso de los operadores `instanceof` y `typeof` de JavaScript. Si los usan en un bloque condicional, TypeScript entenderá que el tipo de la variable es diferente al interior de ese bloque condicional. Aquí mostramos un ejemplo corto en el que TypeScript se da cuenta que una función en particular no existe en `string` y señala que esto probablemente haya sido causado por un error de tipeo del usuario:

```ts
function doSomething(x: number | string) {
    if (typeof x === 'string') { // Dentro del bloque TypeScript sabe que `x` debe ser una string
        console.log(x.subtr(1)); // Error, 'subtr' no existe en `string`
        console.log(x.substr(1)); // OK
    }
    x.substr(1); // Error: No hay garantía de que `x` sea una `string`
}
```

### instanceof

Aquí hay un ejemplo con una clase e `instanceof`:

```ts
class Foo {
    foo = 123;
    common = '123';
}

class Bar {
    bar = 123;
    common = '123';
}

function doStuff(arg: Foo | Bar) {
    if (arg instanceof Foo) {
        console.log(arg.foo); // OK
        console.log(arg.bar); // Error!
    }
    if (arg instanceof Bar) {
        console.log(arg.foo); // Error!
        console.log(arg.bar); // OK
    }

    console.log(arg.common); // OK
    console.log(arg.foo); // Error!
    console.log(arg.bar); // Error!
}

doStuff(new Foo());
doStuff(new Bar());
```

TypeScript incluso entiende `else`, así que cuando un `if` descarta un tipo, sabe que dentro del bloque `else` *defintiivamente no será ese tipo*. Aquí hay un ejemplo:

```ts
class Foo {
    foo = 123;
}

class Bar {
    bar = 123;
}

function doStuff(arg: Foo | Bar) {
    if (arg instanceof Foo) {
        console.log(arg.foo); // OK
        console.log(arg.bar); // Error!
    }
    else {  // DEBE SER Bar!
        console.log(arg.foo); // Error!
        console.log(arg.bar); // OK
    }
}

doStuff(new Foo());
doStuff(new Bar());
```

### in 

El operador `in` hace un chequeo de seguridad respecto de la existencia de una propiedad en un objeto y puede ser usado como una guardia de tipo:

```ts
interface A {
  x: number;
}
interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ('x' in q) {
    // q: A
  }
  else {
    // q: B
  }
}
```

### Guardias de tipos literales

Cuando tengan tipos literales en una unión pueden controlarlos para diferenciar, por ejemplo:

```ts
type Foo = {
  kind: 'foo', // Tipo literal 
  foo: number
}
type Bar = {
  kind: 'bar', // Tipo literal 
  bar: number
}

function doStuff(arg: Foo | Bar) {
    if (arg.kind === 'foo') {
        console.log(arg.foo); // OK
        console.log(arg.bar); // Error!
    }
    else {  // DEBE SER Bar!
        console.log(arg.foo); // Error!
        console.log(arg.bar); // OK
    }
}
```

### Guardias de tipo definidas por el usuario
JavaScript no tiene soporte para un sistema de introspección durante tiempo de ejecución incluído. Cuando estén usando objetos de JavaScript simples (usando el tipeo estructural para su conveniencia), ni siquiera tendrán que tener acceso a `instanceof` o `typeof`. Para estos casos podrán crear *Guardias de tipo definidas por el usuario*. Estas son funciones que deuelven `unArgumento is UnTipo`. Aquí hay un ejemplo:

```ts
/**
 * Algunas interfaces
 */
interface Foo {
    foo: number;
    common: string;
}

interface Bar {
    bar: number;
    common: string;
}

/**
 * Guardia de tipo definida por el usuario!
 */
function isFoo(arg: any): arg is Foo {
    return arg.foo !== undefined;
}

/**
 * Ejemplo de uso de las Guardias de tipo definidas por el usuario
 */
function doStuff(arg: Foo | Bar) {
    if (isFoo(arg)) {
        console.log(arg.foo); // OK
        console.log(arg.bar); // Error!
    }
    else {
        console.log(arg.foo); // Error!
        console.log(arg.bar); // OK
    }
}

doStuff({ foo: 123, common: '123' });
doStuff({ bar: 123, common: '123' });
```

### Guardias de tipo y devoluciones de llamada

TypeScript no asume que las guardias de tipo continuan activas en las devoluciones de llamada, ya que esta suposición es peligrosa. Por ejemplo:

```js
// Ejemplo
declare var foo:{bar?: {baz: string}};
function immediate(callback: () => void) {
  callback();
}


// Guardia de tipo
if (foo.bar) {
  console.log(foo.bar.baz); // Okay
  functionDoingSomeStuff(() => {
    console.log(foo.bar.baz); // TS error: Object is possibly 'undefined'"
  });
}
```

La solución es tan sencilla como guardar el valor seguro inferido en una variable local, asegurandonos automáticamente que no es cambiado externamente, y TypeScript puede entender eso fácilmente:

```js
// Gardia de tipo
if (foo.bar) {
  console.log(foo.bar.baz); // Okay
  const bar = foo.bar;
  functionDoingSomeStuff(() => {
    console.log(bar.baz); // Okay
  });
}
```
