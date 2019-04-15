### Desestructurando

TypeScript soporta las siguientes formas de Desestructuración (literalmente tomado de de-estructurando, es decir, rompiendo la estructura):
 
 1. Desestructuración de objetos
 2. Desestructuración de arrays

 Es fácil pensar en desestructurar como lo inverso de *estructurar*. El método de *estructurar* en JavaScript es el objeto literal:

```ts
var foo = {
    bar: {
        bas: 123
    }
};
```
Sin el increible soporte para *estructurar* que se encuentra incluido en JavaScript, crear nuevos objetos sobre la marcha sería muy molesto. La desestructuración trae el mismo nivel de conveniencia a extraer información de una estructura.

#### Desestructuración de objetos
La desestructuración es útil porque te permite hacer en una sola línea algo que sino llevaría muchas. Considerá el siguiente caso:

```ts
var rect = { x: 0, y: 10, width: 15, height: 20 };

// Asignación desestructurante
var {x, y, width, height} = rect;
console.log(x, y, width, height); // 0,10,15,20

rect.x = 10;
({x, y, width, height} = rect); // Asigna a variables existentes utilizando paréntesis externos
console.log(x, y, width, height); // 10,10,15,20
```
Si la desestructuración no existiera, deberías seleccionar `x,y,width,height` uno a uno de `rect`.

Para asignar una variable extraida a una variable con un nuevo nombre, puedes hacer lo siguiente:

```ts
// structure
const obj = {"una propiedad": "un valor"};

// destructure
const {"una propiedad": unaPropiedad} = obj;
console.log(unaPropiedad === "un valor"); // verdadero
```

Adicionalmente, puedes obtener datos *profundos* de una estructura a través de la desestructuración: 

```ts
var foo = { bar: { bas: 123 } };
var {bar: {bas}} = foo; // `var bas = foo.bar.bas;`
```

#### Desestructurando objetso con rest
Puedes levantar cualquier número de elementos de un objeto y obtener *un objeto* compuesto por los elementos restantes a través de desestructurar con rest.

```ts
var {w, x, ...resto} = {w: 1, x: 2, y: 3, z: 4};
console.log(w, x, resto); // 1, 2, {y:3,z:4}
```
Un caso común de uso es ignorar ciertas propiedades:
```ts
// Example function
function goto(point2D: {x: number, y: number}) {
  // Imagine some code that might break
  // if you pass in an object
  // with more items than desired
}
// Some point you get from somewhere
const point3D = {x: 1, y: 2, z: 3};
/** A nifty use of rest to remove extra properties */
const { z, ...point2D } = point3D;
goto(point2D);
```

#### Desestructuración de arrays
Una pregunta de programación común es: "Cómo intercambio dos variables sin utilizar una tercera?" La solución de Typescript:

```ts
var x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2,1
```
Nota que la desestructuración de arrays es equivalente al decir que el compilador está haciendo `[0], [1], ...` por vos. No hay garantía de que estos valores existirán.

#### Desestructuración de arrays con rest
Puedes levanta cualquier número de elementos de un array y obtener *un array* compuesto por los elementos restantes a través de desestructurar con rest.

```ts
var [x, y, ...resto] = [1, 2, 3, 4];
console.log(x, y, resto); // 1, 2, [3,4]
```

#### Desestructuración de arrays ignorando
Puedes ignorar cualquier índice dejando su ubicación vacía, es decir `, ,` en el lado izquierdo de la asignación. Por ejemplo:
```ts
var [x, , ...resto] = [1, 2, 3, 4];
console.log(x, resto); // 1, [3,4]
```

#### Generación JS
La generación de Javascript para targets que no sean ES6 implica crear variables temporales, como tendrías que hacer vos mismo sin el soporte a desestructurar nativo del lenguage. Ejemplo:

```ts
var x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2,1

// se convierte en //

var x = 1, y = 2;
_a = [y,x], x = _a[0], y = _a[1];
console.log(x, y);
var _a;
```

#### Resumen
Desestructurar puede mejorar la legibilidad de tu código y su mantenibilidad al reducr la cantidad de líneas y mostrar claramente la intención. La desestructuración de arrays te permite utilizarlos como si fueran tuples.
