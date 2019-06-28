## Tipado nominal
El sistema de tipos de TypeScript es estructural [y este es uno de los principales beneficios de usarlo](../why-typescript.md). Sin embargo, hay casos de uso reales para un sistema en el que es deseable que dos variables sean diferenciadas porque tienen un *nombre de tipo* distinto, aunque sea la misma estructura. Un caso común son las estructuras de *identidad* (las cuales suelen ser strings con semánticas asociadas a sus *nombres* en lenguages como C#/Java).

Existen algunos patrones que han emergido de la comunidad. Los cubriremos en orden de preferencia personal descendiente:

## Usar tipos literales

Este patrón usa genéricos y tipos literales:

```ts
/** Generic Id type */
type Id<T extends string> = {
  type: T,
  value: string,
}

/** Tipos de Id específicos */
type FooId = Id<'foo'>;
type BarId = Id<'bar'>;

/** Opcional: funciones contructoras */
const createFoo = (value: string): FooId => ({ type: 'foo', value });
const createBar = (value: string): BarId => ({ type: 'bar', value });

let foo = createFoo('sample')
let bar = createBar('sample');

foo = bar; // Error
foo = foo; // OK
```

* Ventajas
  - No se necesitan aserciones de tipo
* Desventajas
  - La estructura `{type,value}` puede no ser deseable y necesita soporte de serialización en el servidor

## Usar Enums
[Los enums en TypeScript](../enums.md) ofrecen un cierto nivel de tipado nominal. Dos tipos enum no son iguales si difieren en el nombre. Podemos usar esta característica para proveer tipado nominal para tipos que de otra manera son estructuralmente compatibles.

Esta solución implica:
* crear un enum *marca*
* crear el tipo como la *intersección* (`&`) del enum marca + la estructura real.

Lo mostramos a continuación con un ejemplo en el que la estructura de los tipos es una string:

```ts
// FOO
enum FooIdBrand {}
type FooId = FooIdBrand & string;

// BAR
enum BarIdBrand {}
type BarId = BarIdBrand & string;

/**
 * Demo de uso
 */
var fooId: FooId;
var barId: BarId;

// Seguridad!
fooId = barId; // error
barId = fooId; // error

// Renovando
fooId = 'foo' as FooId;
barId = 'bar' as BarId;

// Ambos tipos son compatibles con la base
var str: string;
str = fooId;
str = barId;
```

## Usar Interfaces

Debido a que los `números` son compatibles con los `enum`s, la técnica anterior no puede ser usada para ellos. En su lugar, podemos usar interfaces para romper la compatibilidad estructural. Este método es usado por el equipo que trabaja sobre el compilador de TypeScript, por lo que vale la pena mencionarlo. Usar el prefijo `_` y un sufijo `Brand` es una convención que recomendamos seguir (y [la que sigue el equipo de TypeScript](https://github.com/Microsoft/TypeScript/blob/7b48a182c05ea4dea81bab73ecbbe9e013a79e99/src/compiler/types.ts#L693-L698)).

La solución implica:
* agregar una propiedad no utilizada en un tipo para romper la compatibilidad estructural
* usar una aserción de tipo cuando se necesita renovar o abatir

Lo mostramos a continuaci'on:

```ts
// FOO
interface FooId extends String {
    _fooIdBrand: string; // Para prevenir errores de tipo
}

// BAR
interface BarId extends String {
    _barIdBrand: string; // Para prevenir errores de tipo
}

/**
 * Demo de uso
 */
var fooId: FooId;
var barId: BarId;

// Seguridad!
fooId = barId; // error
barId = fooId; // error
fooId = <FooId>barId; // error
barId = <BarId>fooId; // error

// Renovar
fooId = 'foo' as any;
barId = 'bar' as any;

// Si necesitan la string base
var str: string;
str = fooId as any;
str = barId as any;
```
