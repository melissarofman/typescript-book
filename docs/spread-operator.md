### Operador de propagación

El principal objetivo del operador de propagación es *propagar* los elementos de un array u objeto. Esto se explica mejor con ejemplos.

#### Apply
Un caso de uso común es propagar un array en los argumentos de una función. Previamente, necesitabas usar `Function.prototype.apply`:

```ts
function foo(x, y, z) { }
var args = [0, 1, 2];
foo.apply(null, args);
```

Ahora puedes hacerlo solamente prefijando los argumentso con `...` como mostramos a continuación: 

```ts
function foo(x, y, z) { }
var args = [0, 1, 2];
foo(...args);
```

Aquí estamos *propagando* el array `args` en un `arguments` posicional.

#### Desestructurando
Ya hemos visto un uso de esto en *Desestructurando*:

```ts
var [x, y, ...remaining] = [1, 2, 3, 4];
console.log(x, y, remaining); // 1,2,[3,4]
```
La motivación aquí es simplicar el proceso de capturación de los elementos restantes de un array cuando desestructuramos.

#### Asignación de array
El operador de propagación te permite colocar una *versión extendida* de un array dentro de otro array. Lo demostramos en el ejemplo que sigue:

```ts
var list = [1, 2];
list = [...list, 3, 4];
console.log(list); // [1,2,3,4]
```

Puedes poner el array expandido en cualquier posición y obtener el efecto que esperas:

```ts
var list = [1, 2];
list = [0, ...list, 4];
console.log(list); // [0,1,2,4]
```

#### Propagación de objeto
También puedes propagar un objeto dentro de otro objeto. Un caso de uso común es simplemente agregar una propiedad a un objeto sin mutar el objeto original:

```ts
const point2D = {x: 1, y: 2};
/** Crea un nuevo objeto utilizando todas las props de point2D y z */
const point3D = {...point2D, z: 3};
```

Para objetos, el orden en el que pones el propagador importa. Funciona de forma similar a `Object.assign` y hace lo que esperarías: lo que viene primero se encuentra anulado por lo que sigue:

```ts
const point2D = {x: 1, y: 2};
const anotherPoint3D = {x: 5, z: 4, ...point2D};
console.log(anotherPoint3D); // {x: 1, y: 2, z: 4}
const yetAnotherPoint3D = {...point2D, x: 5, z: 4}
console.log(yetAnotherPoint3D); // {x: 5, y: 2, z: 4}
```

Otro caso de uso es una extención superficial:

```ts
const foo = {a: 1, b: 2, c: 0};
const bar = {c: 1, d: 2};
/** Combinar foo y bar */
const fooBar = {...foo, ...bar};
// fooBar ahora es {a: 1, b: 2, c: 1, d: 2}
```

#### Resumen
`apply` es algo que utilizas habitualmente en JavaScript, por lo que es bueno tener una mejor sintaxis donde no tenes ese feo `null` para el argumento `this`. Además, tener una sintaxis dedicada a mover arrays fuera de (desestructurando) o hacia dentro de (asignar) otros arrays provee una forma limpia de procesar arrays parciales.


[](https://github.com/Microsoft/TypeScript/pull/1931)
