# JSX por fuera de React

TypeScript les permitirá utilizar algo más que React con JSX preservando la seguridad de tipos. La sigueinte lista muestra los items customizables, pero noten que esto es para autores de frameworks UI avanzados:

* Pueden inhabilitar la emisión de estilo `react` usando la opción `"jsx": "preserve"`. Esto significa que JSX es emitido *como está* y que luego podrán usar su propio transpilador para las porciones con JSX.
* Usando el módulo global `JSX`:
    * Podrán controlar que etiquetas HTML se encuentran disponibles y cómo son controlados los tipos mediante la customización de los miembros de la interfaz `JSX.IntrisicElements`.
    * Al usar componentes:
        * Pueden controlar cuál `clase` puede ser heredada por componentes mediante la customización de la declaración default `interface ElementClass extends React.Component<any, any> { }`.
        * Pueden controlar qué propiedad es usanda para controlar los tipos de los atributos (el default es `props`) customizando la declaración `declare module JSX { interface ElementAttributesProperty { props: {}; } }`.

## `jsxFactory`

Pasar `--jsxFactory <JSX factory Name>` junto con `--jsx react` permite que se use una fábrica JSX diferente `React`.

El nuevo nombre de la fábrica será usado para llamar las funciones `createElement`.

### Ejemplo

```ts
import {jsxFactory} from "jsxFactory";

var div = <div>Hello JSX!</div>
```

Compilado con:

```shell
tsc --jsx react --reactNamespace jsxFactory --m commonJS
```

Resulta:

```js
"use strict";
var jsxFactory_1 = require("jsxFactory");
var div = jsxFactory_1.jsxFactory.createElement("div", null, "Hello JSX!");
```

## `jsx` pragma

Hasta pueden especificar una `jsxFactory` diferente por archivo, usando `jsxPragma`:


```js
/** @jsx jsxFactory */
import {jsxFactory} from "jsxFactory";

var div = <div>Hola JSX!</div>
```

Con `--jsx react` este archivo emitirá para usar la fábrica declarada en el jsx pragma:
```js
"use strict";
var jsxFactory_1 = require("jsxFactory");
var div = jsxFactory_1.jsxFactory.createElement("div", null, "Hello JSX!");
```
