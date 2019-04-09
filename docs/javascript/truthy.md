## Truthy

JavaScript tiene un concepto `truthy`, es decir, cosas que son evaluadas como `verdaderas` en ciertas situaciones (por ejemplo, en condiciones `if` y los operadores booleanos `&&` y `||`). Las siguientes cosas son truthy en JavaScript. Por ejemplo, cualquier número excepto `0` es evaluado como truthy: 

```ts
if (123) { // será tratado como `true`
  console.log('Cualquier número que no sea 0 es truthy');
}
```

Algo que no es truthy es `falsy`.

Aquí hay una tabla de referencia.


| Tipo de variable   | Cuándo es *falsy*        | Cuándo es *truthy*       |
|--------------------|--------------------------|--------------------------|
| `boolean`          | `false`                  | `true`                   |
| `string`           | `''` (string vacía)      | cualquier otra string    |
| `number`           | `0`  `NaN`               | cualquier otro número    |
| `null`             | siempre                  | nunca                    |
| `undefined`        | siempre                  | nunca                    |
| Cualquier Objeto incluyendo los vacíos (`{}`, `[]`) | nunca | siempre |


### Siendo explícito

> El patrón `!!`

Comúnmente ayuda ser explícito en la intención de tratar un valor como `boolean` y convertirlo en un *verdadero booleano* (`true`|`false`). Puedes convertir valores a verdaderos booleanos al prefixarlos con `!!`, por ejemplo, `!!foo`. Es sólo `!` utilizado dos veces. El primer `!` convierte la variable (en este caso `foo`) a un booleano, pero invierte la lógica <*truthy* - `!` > `false`, *falsy* - `!` > `true`. El segundo vuelve a invertirlo para igualar la naturaleza del objeto original: *truthy* -`!`> `false` -`!`> `true`.

Es común utilizar este patrón en muchos lugares. Por ejemplo, 

```js
// variables directas
const hasName = !!name;

// Como miembros de objetos
const someObj = {
  hasName: !!name
}

// e.g. en ReactJS JSX
{!!someName && <div>{someName}</div>}
```
