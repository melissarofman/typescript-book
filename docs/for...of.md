### for...of
Un error común para desarrolladores JavaScript principantes, es que `for...in` no itera sobre los ítems de un array. En realidad, itera sobre las *keys* del objeto seleccionado. Esto se demuestra en el ejemplo siguiente, en el que esperarías `9,2,5` pero en realidad obtienes los índices ``0,1,2`:

```ts
var someArray = [9, 2, 5];
for (var item in someArray) {
    console.log(item); // 0,1,2
}
```

Esta es una de las razones por las cuales `for...of` existe en TypeScript (y ES6). Como se puede ver a continuación, este mecanismo de iteración produce el resultado esperado:

```ts
var someArray = [9, 2, 5];
for (var item of someArray) {
    console.log(item); // 9,2,5
}
```

Similarmente, Typescript no tiene problema en iterar sobre los caracteres de una string usando `for...of`:

```ts
var hello = "is it me you're looking for?";
for (var char of hello) {
    console.log(char); // is it me you're looking for?
}
```

#### Generación JS
Para contextos pre ES6, TypeScript generará el bucle estándar `for (var i = 0; i < list.length; i++)`:
```ts
var someArray = [9, 2, 5];
for (var item of someArray) {
    console.log(item);
}

// se convierte en //

for (var _i = 0; _i < someArray.length; _i++) {
    var item = someArray[_i];
    console.log(item);
}
```
Puedes ver que al utilizar `for...of` la *intención* se vuelve más clara, y decrece la cantidad de código que tienes que escribir (así como la cantidad de nombres de variables que debes inventar).

#### Limitaciones
Si no te encuentras en contextos ES6+, el código generado asume que la propiedad `length` existe y que el objeto puede ser indexado a través de números (ejemplo, `obj[2]`). Por lo tanto, en estos casos, solamente es soportado para `string` y `array`.

Si TypeScript puede ver que no estas usando un array o una string, te dará un claro error *"no es de tipo array o string"*:
```ts
let articleParagraphs = document.querySelectorAll("article > p");
// Error: Nodelist is not an array type or a string type
for (let paragraph of articleParagraphs) {
    paragraph.classList.add("read");
}
```

Usá `for...of` solamente para cosas que *sabés* con seguridad que son arrays o strings. Notá que esta limitación tal vez sea removida en versiones futuras de TypeScript.

#### Resumen
Estarías sorprendido respecto de cauntas veces iterarás sobre elementos de arrays. La próxima vez que te encuentres haciéndolo, probá `for...of`. Puede que hagas feliz a la siguiente persona que deba revisar tu código.
