# Manejo de excepciones

JavaScript tiene una clase `Error` que pueden usar para excepciones. Pueden tirar un error con la palabra clave `throw`. Pueden atraparlo con un bloque `try` / `catch`. Por ejemplo:

```js
try {
  throw new Error('Algo malo pasó!');
}
catch(e) {
  console.log(e);
}
```

## Sub tipos de Error

Más allá de la clase incluída `Error`hay algunas clases de error incluídas que heredan del `Error` que el tiempo de ejecución de JavaScript puede tirar:

### RangeError

Crea una instancia representado un error que ocurre cuando una variable o parámetro numérico se encuentra fuera de su rango válido.

```js
// Llamen a console con demasiados argumentos
console.log.apply(console, new Array(1000000000)); // RangeError: Invalid array length
```

### ReferenceError

Crea una instancia representand oun error que ocurre cuando desreferimos una referencia inválida:

```js
'use strict';
console.log(notValidVar); // ReferenceError: notValidVar is not defined
```

### SyntaxError

Crea una instancia representando un error sintáctico que ocurre al analizar código que no es JavaScript válido.

```js
1***3; // SyntaxError: Unexpected token *
```

### TypeError

Crea una instancia representando un error que ocurre cuando una variable o parámetro no es de tipo válido.

```js
('1.2').toPrecision(1); // TypeError: '1.2'.toPrecision is not a function
```

### URIError

Crea una instancia representando un error que ocurre cuando `encodeURI()` o `decodeURI()` reciben parámetros inválidos.

```js
decodeURI('%'); // URIError: URI malformed
```

## Siempre usen `Error`

Muchos desarrolladores JavaScript principantes a veces tiran strings puras:

```js
try {
  throw 'Algo malo pasó!';
}
catch(e) {
  console.log(e);
}
```

*No hagan eso*. El beneficio fundamental del objeto `Error` es que mantienen un registro de donde fueron construidos y originados con la propiedad `stack`.

Las strings puras resultan en una experiencia de depuración dolorosa y complican el proceso de análisis de errores a partir de registros.

## No es necesario que tiren un error

Está bien pasar un objeto `Error`. Esto es convención en código escrito siguiente el estilo de Nodejs, de aceptar devoluciones de llamada con el primer arguemtno como un objeto error.

```js
function myFunction (callback: (e?: Error)) {
  doSomethingAsync(function () {
    if (somethingWrong) {
      callback(new Error('This is my error'))
    } else {
      callback();
    }
  });
}
```

## Casos excepcionales

`Las excepciones deberían ser excepcionales` es un dicho común en ciencias de la computación. Hay algunas razones por las que esto también es verdadero para JavaScript (y TypeScript).

### Poca claridad sobre el origen del `throw`

Consideren el siguiente segmento de código:

```js
try {
  const foo = runTask1();
  const bar = runTask2();
}
catch(e) {
  console.log('Error:', e);
}
```
El próximo desarrollador que lo mire no podrá saber cuál función es la que puede tirar el error. La persona que revisa el código tampoco podrá saberlo sin leer el detalle de la implementación de task1 / task2.

### Dificulta el manejo elegante de errores

Pueden intentar mejorar la claridad escribiendo un bloque `catch` alrededor de cada cosa que pueda tirar un error:

```js
try {
  const foo = runTask1();
}
catch(e) {
  console.log('Error:', e);
}
try {
  const bar = runTask2();
}
catch(e) {
  console.log('Error:', e);
}
```

Pero si ahora necesitan pasar cosas de la primera tarea a la segunda, el código se desordena bastante (noten que la mutación de `foo` requiere una declaración `let` + la necesidad de la anotación explícita porque no puede ser inferido de la devolución de `runTask1`):

```ts
let foo: number; // Noten la utilización de `let` y de anotaciones de tipo explícitas
try {
  foo = runTask1();
}
catch(e) {
  console.log('Error:', e);
}
try {
  const bar = runTask2(foo);
}
catch(e) {
  console.log('Error:', e);
}
```

### No se encuentra bien representado en el sistema de tipos

Consideren la función:

```ts
function validate(value: number) {
  if (value < 0 || value > 100) throw new Error('Invalid value');
}
```

Usar `Error` para casos de este tipo es una mala idea ya que no se encuentra representado en la definición de tipos de la función `validate` (que es `(value:number) => void`). En su lugar, una mejor manera de crear un método de validación sería:

```ts
function validate(value: number): {error?: string} {
  if (value < 0 || value > 100) return {error:'Invalid value'};
}
```

Y ahora se encuentra representado en el sistema de tipos:

> A no ser que quieran manejar el error de manera genérica (simple / catch-all, etc), no *tiren* un error.
