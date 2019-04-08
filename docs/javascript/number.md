## Número
Cuando estés manipulando números en cualquier lenguage de programación debés estar al tanto de las idiosincracias sobre como el lenguage manipula los números. Aquí hay algunas piezas crítica de información que deberías tener en cuenta sobre números en JavaScript.

### Tipo núcleo
JavaScript sólamente tiene un tipo de número. Es un `Number` de doble precisión y 64-bits. A continuación desarrollamos sus limitación junto con una solución recomendada.

### Decimal
Para aquellos que conozcan los números dobles y los números flotantes, sabrán que los números flotantes *no se asignan* correctamente a números Decimales. Un ejemplo trivial (y famoso) con los números incluídos en JavaScript es el siguiente:

```js
console.log(.1 + .2); // 0.30000000000000004
```

> Para matemática decimal verdadera usen `big.js`, mencionada más adelante

### Integral
Los limites integrales representados por el tipo de número incluido son `Number.MAX_SAFE_INTEGER` y `Number.MIN_SAFE_INTEGER`.

```js
console.log({max: Number.MAX_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER});
// {max: 9007199254740991, min: -9007199254740991}
```

**Safe**, en este contexto, hace referencia a el hecho de que el valor *no puede ser el resultado de un error de redondeo*.

Los valores *unsafe*, o inseguros, son los números seguros `+1 / -1` y cualquier cantidad de adición o sustracción *redondeará* el resultado.

```js
console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2); // verdadero!
console.log(Number.MIN_SAFE_INTEGER - 1 === Number.MIN_SAFE_INTEGER - 2); // verdadero!

console.log(Number.MAX_SAFE_INTEGER);      // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER + 1);  // 9007199254740992 - Correcto
console.log(Number.MAX_SAFE_INTEGER + 2);  // 9007199254740992 - redondeado!
console.log(Number.MAX_SAFE_INTEGER + 3);  // 9007199254740994 - redondeado - correcto por suerte
console.log(Number.MAX_SAFE_INTEGER + 4);  // 9007199254740996 - redondeado!
```

Para chequear si es seguro, puedes utilizar `Number.isSafeInteger` de ES6:

```js
// valor seguro
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // verdadero

// valor inseguro
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // falso

// Dado que puede haber sido redondeado debido a exceso
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 10)); // falso
```
> Eventualmente, JavaScript recibirá soporte para [BigIng](https://developers.google.com/web/updates/2018/05/bigint). Por ahora, si quieres matemática integral con precisión arbitraria, utilizá `big.js`.

### big.js
Cada vez que utilices la matemática para cálculos financieros (por ejemplo, cálculos GST, dinero con centavos, sumas, etc) utilizá una libreria como [big.js](https://github.com/MikeMcl/big.js/) la cual está diseñada para realizar
* matemática decimal perfecta
* Valores integrales seguros fuera de los límites

El método de instalación es sencillo:
```bash
npm install big.js @types/big.js
```

Ejemplo corto de utilización:

```js
import { Big } from 'big.js';

export const foo = new Big('111.11111111111111111111');
export const bar = foo.plus(new Big('0.00000000000000000001'));

// To get a number:
const x: number = Number(bar.toString()); // Loses the precision
```

> No utilices esta librería para matemáticas para Interfaces de Usuario o propósitos de performance intensivos, como gráficos, dibujo en canvas, etc.

### NaN
Cuando un cálculo numérico no es representable por un número válido, JavaScript devuelve un valor especial `NaN`. Un ejemplo clásico son los números imaginarios:

```js
console.log(Math.sqrt(-1)); // NaN
```

Note: Chequeos de igualdad **no** funcionan con `NaN`. Utilizá `Number.isNaN` en su lugar:

```js
// No hagas esto
console.log(NaN === NaN); // falso!!

// Hacé esto
console.log(Number.isNaN(NaN)); // verdadero
```

### Infinito
Los valores límites representables en Numero están disponibles en los valores estáticos `Number.MAX_VALUE` y `-Number.MAX_VALUE`

```js
console.log(Number.MAX_VALUE);  // 1.7976931348623157e+308
console.log(-Number.MAX_VALUE); // -1.7976931348623157e+308
```

Valores fuera del rango donde la precision no cambia están atados a estos límites. Por ejemplo:

```js
console.log(Number.MAX_VALUE + 1 == Number.MAX_VALUE);   // true!
console.log(-Number.MAX_VALUE - 1 == -Number.MAX_VALUE); // true!
```

Valores afuera del rango donde la precisión cambia resulven a los valores especiales `Infinity`/`-Infinity`. Por ejemplo:

```js
console.log(Number.MAX_VALUE + 10**1000);  // Infinity
console.log(-Number.MAX_VALUE - 10**1000); // -Infinity
```

Por supuesto, estos valores infinitos especiales también aparecen con aritmética que los requiere. Por ejemplo: 

```js
console.log( 1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
```

Puedes usar estos valores `Infinity` manualmente o a través de miembros estáticos de la clase `Number`: 

```js
console.log(Number.POSITIVE_INFINITY === Infinity);  // verdadero
console.log(Number.NEGATIVE_INFINITY === -Infinity); // verdadero
```

Por suerte, los valores infinitos funcionan confiablemente con los operadores de comparación (`<` / `>`):

```js
console.log( Infinity >  1); // verdadero
console.log(-Infinity < -1); // verdadero
```

### Infinitesimal

El número más pequeño representable en Number que no es cero esta disponible como el valor estático `Number.MIN_VALUE`

```js
console.log(Number.MIN_VALUE);  // 5e-324
```

Valores más pequeños que el `MIN_VALUE` son convertidos a 0.

```js
console.log(Number.MIN_VALUE / 10);  // 0
```

> Más intuición: De la misma manera que los valores más grandes que `Number.MAX_VALUE` quedan atados a INFINITY, los valores más pequeños que `Number.MIN_VALUE` quedan atados a 0.
