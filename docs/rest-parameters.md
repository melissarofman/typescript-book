### Parámetros Rest
Los parámetros rest (denotados por `...NombreDelUltimoArgumento` ) permiten aceptar múltiples argumentos en una función y obtenerlos como un array. Esto se demuestra en el ejemplo a continuación.

```ts
function iTakeItAll(first, second, ...allOthers) {
    console.log(allOthers);
}
iTakeItAll('foo', 'bar'); // []
iTakeItAll('foo', 'bar', 'bas', 'qux'); // ['bas','qux']
```

Los parámetros rest pueden ser utilizados en cualquier función ya sea `function`/`()=>`/`class member`.
