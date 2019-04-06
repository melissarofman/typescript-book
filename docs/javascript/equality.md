## Igualdad

One cosa con la que hay que tener cuidado en Javascript es la diferencia entre `==` y `===`. Como JavaScript trata de ser resiliente contra errores de programación, `==` trata de coercer los tipos de dos variables. Por ejemplo, convierte una string a un número para que los puedas comparar: 

```js
console.log(5 == "5"); // verdadero   , TS Error
console.log(5 === "5"); // falso , TS Error
```

Sin embargo, las elecciones de Javascript no siempre son ideales. Por ejemplo, en el ejemplo que sigue la primera declaración es falsa porque `""` y `"0"` son los dos strings y claramente no iguales. Sin embargo, en el segundo caso, ambos `0` y la string vacía (`""`) son falsy (en otras palabras, se comportan como `falso`) y son, por lo tanto, iguales en lo que respecta a `==`. Ambas declaraciones son falsas cuando se utiliza `===`.

```js
console.log("" == "0"); // falso
console.log(0 == ""); // verdadero

console.log("" === "0"); // falso
console.log(0 === ""); // falso
```

> Notemos que tanto `string == numbero` como `string === numbero`  son errores de compilación en TypeScript, asi que normalmente no tienes que preocuparte por esto.

De forma similar a `==` vs. `===`, hay un `!=` vs. `!==`

Así que un consejo Pro: siempre usá `===` y `!==` excepto para checkear nulls (cubriremos por qué luego).
Similar to `==` vs. `===`, there is `!=` vs. `!==`

## Igualdad estructural
Si quieres comparar dos objectos para igualdad estructural, `==`/`===` ***no*** son suficientes. Por ejemplo,  

```js
console.log({a:123} == {a:123}); // Falso
console.log({a:123} === {a:123}); // Falso
```
Para hacer este tipo de chequeos debes usar el paquete de npm [deep-equal](https://www.npmjs.com/package/deep-equal). Por ejemplo: 

```js
import * as deepEqual from "deep-equal";

console.log(deepEqual({a:123},{a:123})); // Verdadero
```

Sin embargo, generalmente no es necesario realizar chequeos profundos y todo lo que realmente es necesario es chequear por medio de un `id`. Por ejemplo: 

```ts
type IdDisplay = {
  id: string,
  display: string
}
const list: IdDisplay[] = [
  {
    id: 'foo',
    display: 'Foo Select'
  },
  {
    id: 'bar',
    display: 'Bar Select'
  },
]

const fooIndex = list.map(i => i.id).indexOf('foo');
console.log(fooIndex); // 0
```
