### let

Variables `var` en JavaScript están en el *ámbito de función*. Esto es diferente de muchos otros lenguages (C# / Java, etc) donde las variables están en el *ámbito de bloque*. Si vienes a JavaScript con una mentalidad de *ámbito de bloque*, puedes esperar que lo siguiente imprima `123`, cuando en realidad imprimirá `456`:

```ts
var foo = 123;
if (true) {
    var foo = 456;
}
console.log(foo); // 456
```
Esto se debe a que `{` no crea un nuevo *ámbito de variable*. La variable `foo` es la misma dentro del *bloque* if como fuera del bloque. Esta es una fuente común de errores de programación en JavaScript. Es por esto que TypeScript (y ES6) intoducieron la palabra clave `let`, que permite definir variables con verdadero *ámbito de bloque*. Es decir que si usan `let` en lugar de `var` tendrán un único elemento, desconectado de lo que haya fuera del ámbito. El mismo ejemplo con `let`:

```ts
let foo = 123;
if (true) {
    let foo = 456;
}
console.log(foo); // 123
```

Otro lugar donde `let` puede salvarte de errores es en bucles (loops).
```ts
var index = 0;
var array = [1, 2, 3];
for (let index = 0; index < array.length; index++) {
    console.log(array[index]);
}
console.log(index); // 0
```
Con toda sinceridad, creemos que es mejor usar `let` donde sea posible ya que lleva a menos sorpresas para nuevos desarrolladores y desarrolladores con experiencia en múltiples lenguages.

#### Las funciones crean un ámbito
Ya que lo mencionamos, nos gustaría demostrar que las funciones crean un nuevo ámbito de variables en JavaSCript. Considerá los siguiente:

```ts
var foo = 123;
function test() {
    var foo = 456;
}
test();
console.log(foo); // 123
```
Eso se comporta como esperarías. Sin esto, sería muy dificil escribir código en JavaScript.

#### JS generado
El JS generado por TypeScript simplemente renombra la variable `let` si ya existe una variable con un nombre similar existe en el ámbito que la rodea. Por ejemplo, el siguiente caso es generado tal cual con un simple reemplado de `let` por `var`: 

```ts
if (true) {
    let foo = 123;
}

// becomes //

if (true) {
    var foo = 123;
}
```
Sin embargo, si el nombre de la variable ya se encuentra tomada por el ambiente que la rodea, un nuevo nombre es generado, como se muestra a continuación (nota `foo_1`):

```ts
var foo = '123';
if (true) {
    let foo = 123;
}

// becomes //

var foo = '123';
if (true) {
    var foo_1 = 123; // Renamed
}
```

#### Switch
Puedes envolver los cuerpos de tus casos `case` en `{}` para reutilizar nombres de variables con confianza:

```ts
switch (name) {
    case 'x': {
        let x = 5;
        // ...
        break;
    }
    case 'y': {
        let x = 10;
        // ...
        break;
    }
}
```

#### let en cierres
Una pregunta de entrevista para desarrollador JavaScript que surge comúnmente es que imprime el siguiente archivo:

```ts
var funcs = [];
// Crea muchas funciones
for (var i = 0; i < 3; i++) {
    funcs.push(function() {
        console.log(i);
    })
}
// las llama
for (var j = 0; j < 3; j++) {
    funcs[j]();
}
```
Uno hubiese esperado que sea `0,1,2`. Sorprendemente, va a ser `3` para las 3 funciones. La razón es que las tress funciones están utilizando la variable `ì` desde el ámbito externo y al momento de ejecutarlas (en el segundo bucle) el valor de `i` va a ser `3` (la condición de terminación del primer bucle).

Una solución sería crear una nueva variable en cada bucle, específica para esa iteración. Como hemos aprendido antes, podemos crear una nueva variable por ámbito creando una nueva función y ejecutándola inmediatamente. Es decir, el patrón IIFE que vimos con las clases (`(function() { /* body */ })();`) como mostramos a continuación:

```ts
var funcs = [];
// crea muchas funciones
for (var i = 0; i < 3; i++) {
    (function() {
        var local = i;
        funcs.push(function() {
            console.log(local);
        })
    })();
}
// las llama
for (var j = 0; j < 3; j++) {
    funcs[j]();
}
```
Aquí las funciones cierran sobre la variable *local* (de ahí el nombre `cierres`) y usan esa variable en lugar de la variable `i` del bucle.

> Notá que los cierres vienen con un impacto en rendimiento (tienen que guardar el estado que las rodea).

La palabra clave `let` en un bucle tendría el mismo comportamiento que el ejemplo anterior:

```ts
var funcs = [];
// crea muchas funciones
for (let i = 0; i < 3; i++) { // Notemos el uso de let
    funcs.push(function() {
        console.log(i);
    })
}
// las llama
for (var j = 0; j < 3; j++) {
    funcs[j]();
}
```

Usar `let` en lugar de `var` crea una variable `i` única para cada iteración del bucle.

#### Resumen
`let` es extremadamente útil para la gran mayoría del código. Puede mejorar la legibilidad de tu código y disminuir las chances de un error de programación.

[](https://github.com/olov/defs/blob/master/loop-closures.md)
