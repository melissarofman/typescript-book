# Tipos móviles

El sistema de tipos de TypeScript es extremadamente poderoso y permite mover y dividir tipos en maneras que no son posibles en ningún otro lenguaje existente.

Esto se debe a que TypeScript fue diseñado para permitirles trabajar sin fricciones con un lenguaje *altamente dinámico* como JavaScript. Aquí cubriremos algunos trucos para mover tipos en TypeScript. 

La fundamentación principal es que: si cambian una sola cosa, todo lo demás se actualizará automáticamente y recibirán errors útiles si algo se rompe a partir de los cambios, como un sistema de restricciones bien diseñado.

## Copiando tanto el Tipo como el Valor

Si quieren mover una clase, tal vez estén tentados de hacer lo siguiente:

```ts
class Foo { }
var Bar = Foo;
var bar: Bar; // ERROR: cannot find name 'Bar'
```

Este es un error porque `var` únicamente copio `Foo` en el espacio de declaración de *variables* y, por lo tanto, no podrán usar `Bar` como una anotación de tipos. La estrategia correcta es usar la palabra clave `import`. Noten que solo podrán usarla de esta manera si estan usando *namespaces* o *módulos* (más detalles sobre esto luego):

```ts
namespace importing {
    export class Foo { }
}

import Bar = importing.Foo;
var bar: Bar; // Okay
```

Este truco de `import` solo funciona para cosas que son *tanto tipos como variables*.

## Capturar el tipo de una variable

Pueden usar una variable en una anotación de tipos usando el operador `typeof`. Esto les permitirá decirle al compilador que una variable es del mismo tipo que otra. Aquí mostramos un ejemplo:

```ts
var foo = 123;
var bar: typeof foo; // `bar` tiene el mismo tipo que `foo` (acá, `number`)
bar = 456; // OK
bar = '789'; // ERROR: Type `string` is not `assignable` to type `number`
```

## Capturar el tipo de un miembro de una clase

De manera similar a como capturamos el tipo de una variable, pueden declarar una variable únicamente para capturar tipos:

```ts
class Foo {
  foo: number; // algun miembro cuyo tipo queremos capturar
}

// Únicamente para capturar el tipo
declare let _foo: Foo;

// Lo mismo que antes
let bar: typeof _foo.foo; // `bar` tiene el tipo `number`
```

## Capturando el tipo de strings mágicas

Muchas librerías de JavaScript y frameworks usan strings de JavaScript puras. Pueden usar variables `const` para capturar sus tipos:

```ts
// Captura tanto el *tipo* como el *valor* de la string mágica:
const foo = "Hello World";

// Usa el tipo capturado:
let bar: typeof foo;

// bar solo puede recibir `Hello World`
bar = "Hello World"; // Okay!
bar = "anything else "; // Error!
```

En este ejemplo, `bar` tiene el tipo literal `"Hello World"`. Cubrimos esto en mayor profundidad en la [sección de tipos literales](https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html "Tipos Literales").

## Capturando nombres clave

El operador `keyof` les permitirá capturar los nombres clave de un tipo. Por ejemplo, pueden usarlo para capturar los nombres clave de una variable al agarrar primero su tipo con `typeof`:

```ts
const colors = {
  red: 'reddish',
  blue: 'bluish'
}
type Colors = keyof typeof colors;

let color: Colors; // idéntico a let color: "red" | "blue"
color = 'red'; // OK
color = 'blue'; // OK
color = 'anythingElse'; // Error: Type '"anythingElse"' is not assignable to type '"red" | "blue"'
```

Esto les permitirá tener cosas como string enums + constantes de forma sencilla, como han visto en el ejemplo anterior.
