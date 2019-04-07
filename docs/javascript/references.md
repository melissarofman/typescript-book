## Referencias

Más allá de los literales, cualquier Objeto en JavaScript (incluyendo funciones, arrays, regexp, etc) son referencias. Esto significa lo siguiente:

### Las mutaciones ocurren en todas las referencias

```js
var foo = {};
var bar = foo; // bar es una referencia al mismo objeto

foo.baz = 123;
console.log(bar.baz); // 123
```

### La igualdad corresponde a las referencias

```js
var foo = {};
var bar = foo; // bar es una referencia
var baz = {}; // baz es un *nuevo objecto* diferente a `foo`

console.log(foo === bar); // verdadero
console.log(foo === baz); // falso
```
