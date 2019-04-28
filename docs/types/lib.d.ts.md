* [lib.d.ts](#libdts)
* [Ejemplo de uso](#example-usage)
* [Mirar dentro](#libdts-inside-look)
* [Modificando los tipos nativos](#modifying-native-types)
* [Usando un lib.d.ts customizado](#using-your-own-custom-libdts)
* [Efecto del `target` del compilador sobre lib.d.ts](#compiler-target-effect-on-libdts)
* [Opciones `lib`](#lib-option)
* [Polyfill para motores JavaScript viejos](#polyfill-for-old-javascript-engines)

## `lib.d.ts`

Un archivo de declaración especial `lib.d.ts` es incluido con cada instalación de TypeScript. Este archivo contiene las declaracioens de ambiente para varios constructos comunes de JavaScript que se encuentran presente en los tiempos de ejecución de JavaScript y del DOM.

* Este archivo se incluye automáticametne en el contexto de compilación de un proyecto TypeScript.
* El objetivo de este archivo es simplificarles el proceso de comenzar a escrbir código JavaScript *con control de tipos*

Pueden excluir este archivo del contexto de compilación especificando el la bandera de línea de comandos `--noLib` (o `"noLib": true` en `tsconfig.json`).

### Ejemplo de uso

Como siempre, consideremos ejemplos de este archivo en uso:

```ts
var foo = 123;
var bar = foo.toString();
```
Este código realiza el chequeo de tipos correctamente *debido a que* la función `toString` se encuetnra definida en `lib.d.ts` para todos los objetos JavaScript. 

Si usan el mismo ejemplo de código con la opción `noLib`, obtendrán un error de control de tipo:

```ts
var foo = 123;
var bar = foo.toString(); // ERROR: La propiedad 'toString'no existe en el tipo 'number'
```
Ahora que entienden la importanca de `lib.d.ts`, en que consiste su contenido? Examinaremos eso a continuación.

### Mirando dentro de `lib.d.ts`

El contendio de `lib.d.ts` consiste principalmente de un montón de declaraciones de *variables*. Por ejemplo, `window`, `document`, `math` y un montón de declaraciones de *interfaces* similares, como `Window` , `Document`, `Math`.

La forma más simple de leer la documentación y las anotaciones de cosas globales es tipear código que *saben que funciona*. Por ejemplo, `Math.floor`, seguido de F12 (ir a la definición) usando su IDE (VSCode tiene gran soporte para este tipo de acciones).

Miremos la un ejemplo de declaración de *variable*. `window`, por ejemplo, se define como:

```ts
declare var window: Window;
```
Es decir, consiste de una simple `declare var` seguido del nombre de la variable (en este caso `window`) y una interface para la anotación de tipo (en este caso `Window`). Estas variables generalmente apuntan a alguna *interface* global. Por ejemplo, aquí hay una pequeña muestra de la (en realidad gigante) interface `Window`:

```ts
interface Window extends EventTarget, WindowTimers, WindowSessionStorage, WindowLocalStorage, WindowConsole, GlobalEventHandlers, IDBEnvironment, WindowBase64 {
    animationStartTime: number;
    applicationCache: ApplicationCache;
    clientInformation: Navigator;
    closed: boolean;
    crypto: Crypto;
    // etcétera, etcétera...
}
```
Como pueden observar, hay *mucha* informacion sobre los tipos en estas interfaces. A falta de TypeScript *ustedes* deberían mantener esta información en *su* cabeza. Ahora pueden delegar ese conocimiento en el compilador y conservar el acceso fácil a él usando cosas como `intellisense`.

Hay una buena razon para usar *interfaces* para estas globales. Les permitirá *agregar propiedades adicionales* a estas globales *sin* necesitar cambar `lib.d.ts`. Cubriremos este concepto a continuación:

### Modificando los tipos nativos

El hecho que una `interface` en TypeScript es abierta significa que pueden agregarle miembros a las interfaces declaradas en `lib.d.ts` y TypeScript reconocerá las adiciones. Notemos que necesitarán hacer estos cambios en un [*módulo global*](../project/modules.md) para que las interfaces sean asociadas con `lib.d.ts`. También recomendamos crear un archivo [`globals.d.ts](../project/globals.md) especial para este propósito.

Aquí hay algunos ejemplos en los que agregamos cosas a `window`, `Math`, `Date`:

#### Ejemplo `window`

Simplemente agreguen cosas a la interface `Window`:

```ts
interface Window {
    helloWorld(): void;
}
```

Esto les permitirá usarla de forma *segura respecto de los tipos*:

```ts
// Agreguenlá en tiempo de ejecución
window.helloWorld = () => console.log('hello world');
// Llamenlá
window.helloWorld();
// Usenlá incorrectamente para obtener un error:
window.helloWorld('gracius'); // Error: Supplied parameters do not match the signature of the call target
```

#### Ejemplo `Math`
La variable global `Math` se encuentra definida en `lib.d.ts` como (de nuevo, usen sus herramientas de desarrollo para navegar a la definición):

```ts
/** Un objeto instrínseco que provee las funcionalidades y constantes matemáticas básicas. **/
declare var Math: Math;
```

Por ejemplo, la variable `Math` es una instancia de la interface `Math`. La interface `Math` se define como:

```ts
interface Math {
    E: number;
    LN10: number;
    // etcétera ...
}
```

Esto significa que si quieren agregar cosas a la variable global `Math` tendrán que agregarlo a la interface global `Math`. Por ejemplo, si consideramos el [proyecto `seedrandom`](https://www.npmjs.com/package/seedrandom) el cual agrega una función `seedrandom` al objeto global `Math`, esto puede declararse de forma relativamente sencilla:

```ts
interface Math {
    seedrandom(seed?: string);
}
```

Y luego podrán usarlo:

```ts
Math.seedrandom();
// or
Math.seedrandom("Cualquier string que quieran!");
```

#### Ejemplo `Date`

Si miran la definción de la *variable* `Date` en `lib.d.ts`, encontrarán:

```ts
declare var Date: DateConstructor;
```
La interface `DateConstructor` es similar a lo que hemos visto previamente con `Math` y `Window`, ya que contiene miembros que pueden usar desde la variable global `Date`, por ejemplo, `Date.now()`. Adicionalmente a estos miembros, contiene firmas de *constructores* los que les permiten crear isntancias de `Date` (e.g. `new Date()`). Un fragment de la interface del `DateConstructor` es mostrada a continuación:

```ts
interface DateConstructor {
    new (): Date;
    // ... otras firmas de constructores

    now(): number;
    // ... otras funciones miembro
}
```

Consideren el proyecto [`datejs`](https://github.com/abritinthebay/datejs). DateJS agrega miembors tanto a la variable global `Date` como a las instancias de `Date`. Por lo tanto, una definición de TypeScript para estar librería se vería similar a ([la comunidad ya ha escrito esto para ustedes])(https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/datejs/index.d.ts)):

```ts
/** Métodos Públicos y Estáticos de DateJS */
interface DateConstructor {
    /** Obtiene una fecha que se encuentra fijada a la fecha actual. El horario se encuentra fijado al comienzo del dia (00:00 o 12:00 AM) */
    today(): Date;
    // ... etcétera, etcétera
}

/** Métodos de instancias públicas de DateJS */
interface Date {
    /** Agrega el número especificado de milisegundos a esta instancia. */
    addMilliseconds(milliseconds: number): Date;
    // ... etcétera etcétera
}
```
Esto les permitirá hacer cosas como la siguiente, de forma segura:

```ts
var today = Date.today();
var todayAfter1second = today.addMilliseconds(1000);
```

#### Ejemplo `string`

Si miran dentro de `lib.d.ts` para strings, encontrarán cosas similares a lo que hemos visto para `Date` (`String` como variable global, la interface `StringConstructor`, la interface `String`). Una cosa a notar es que la interface `String también impacta las strings *literales*, como mostramos en el siguiente ejemplo:

```ts

interface String {
    endsWith(suffix: string): boolean;
}

String.prototype.endsWith = function(suffix: string): boolean {
    var str: string = this;
    return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
}

console.log('foo bar'.endsWith('bas')); // falso
console.log('foo bas'.endsWith('bas')); // verdadero
```

Variables e interfaces similares existen para otras cosas que tienen miembros estáticos e instancias, como `Number`, `Boolean`, RegExp`, etc'. y estas interfaces también afectan las instancias literales de estos tipos.

### Ejemplo `string` redux

Recomendamos crear un archivo `global.d.ts` por razones de mantenibilidad. Sin embargo, pueden entrar en el *namespace global* desde un *archivo de módulo* si así lo desean. Esto se hace usando `declare global { /*global namespace here*/ }`. E.g. el siguiente caso se puede escribir de la siguiente manera:

```ts
// Asegurarse que esto es tratado como un módulo
export {};

declare global {
    interface String {
        endsWith(suffix: string): boolean;
    }
}

String.prototype.endsWith = function(suffix: string): boolean {
    var str: string = this;
    return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
}

console.log('foo bar'.endsWith('bas')); // false
console.log('foo bas'.endsWith('bas')); // true
```

### Usando un lib.d.ts customizado
Como mencionamos previamente, la utilización de la bandera de compilación booleana `--noLib`  causa que TypeSCript excluda automáticamente a `lib.d.ts`. Hay varias razones por las cuales esta puede ser una característica útil. Aquí mencionamos algunas de las más comunes:

* Estan corriendo en un ambiente JavaScript que difiere significativamente del ambiente estándar de ejecución de navegadores.
* Les gusta tener un control *estricto* respecto de las *globales* disponibles en su código. Por ejemplo, `lib.d.ts` define `item` como uan variable global y ustedes no quieren que esto entre en su código.

Una vez que hayan excluído el `lib.d.ts` default, pueden incluir un archivo con nombres imilar en su context ode compilación y TypeScript lo utilizará para controlar los tipos.

> Nota: tengan cuidado con `--noLib`. Una vez que han entrado al mundo noLib, si eligen compartir su proyecto con otros, ellos serán *forzados* a seguirlos a ese mundo. Aún peor, si incluyen *el código de ellos* en su proyecto, ustedes tendrán que portarlo a *su base lib*.

### Efecto del `target` del compilador sobre lib.d.ts

Establecer el target del compilador a `ES6` causa que `lib.d.ts` inlcuya declaraciones ambiente *adicionales* para cosas más modernas (ES6) como `Promise`. Este efecto mágico por el que el target del compilador cambia el *ambiente* del código es deseable para algunas personas y para otros es problemático, ya que confunde *generación de código* con *ambiente de código*.

Sin embargo, si quieren un contorl más fino sobre su ambiente, pueden usar la opción `--lib` que discutiremos a continuación.

### Opciones lib 

A veces (muchas veces) querrán separar la rela'ción entre el target de compilación (la versión de JavaScript generada) y el soporte de ambientes de librería. Un ejemplo común es las Promesas: hoy (junio 2016), lo más probable es que deseen `--target es5` pero utilizando las característica sde última generación como `Promise`. Para soportar esto, pueden tomar control explícito de `lib` usando las opciones `lib` del compilador.

> Nota: usar `--lib` seapara cualquier magia de lib de `--target` dándoles mejor control.

Pueden proveer esta opción desde la línea de comandos o en `tsconfig.json` (recomendado):

**Línea de comandos**:
```
tsc --target es5 --lib dom,es6
```
**tsconfig.json**:
```json
"compilerOptions": {
    "lib": ["dom", "es6"]
}
```

Las libs pueden ser clasificadas de la siguiente manera:

* Generación de características JavaScript:
    * es5
    * es6
    * es2015
    * es7
    * es2016
    * es2017
    * esnext
* Ambiente de tiempo de ejecución
    * dom
    * dom.iterable
    * webworker
    * scripthost
* Opciones ESNext Por-Característica(aún más pequeño que por generación)
    * es2015.core
    * es2015.collection
    * es2015.generator
    * es2015.iterable
    * es2015.promise
    * es2015.proxy
    * es2015.reflect
    * es2015.symbol
    * es2015.symbol.wellknown
    * es2016.array.include
    * es2017.object
    * es2017.sharedmemory
    * esnext.asynciterable

> NOTA: la opción `lib` provee un control extremadamente fino. Lo más probable es que quieran un ítem de la categoría generacional y uno de la categoría ambiental.
> Si --lib no se encuentra explicitado, una librería defaul es inyectada:
  - Para --target es5 => es5, dom, scripthost
  - Para --target es6 => es6, dom, dom.iterable, scripthost

Nuestras recomendaciones personales:

```json
"compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom"]
}
```

Ejemplo inlcuyendo Symbol con ES5:

La API de Symbol no se encuentra incluida cuando el target es ES5. De hecho, obtenemos un error similar a: [ts] No es posible encontrar el nombre 'Symbol'. Podemos usar "target": "es5" junto con "lib" para proveer la API de Symbol en TypeScript:

```json
"compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom", "scripthost", "es2015.symbol"]
}
```

## Polyfill para motores JavaScript viejos

> [Video PRO de Egghead sobre este tema](https://egghead.io/lessons/typescript-using-es6-and-esnext-with-typescript)

Hay varias características de tiempo de ejecución similares a `Map`/`Set` y hasta `Promise` (esta lista cambiará a lo largo del tiempo) que pueden usar con opciones modernas de `lib`. Para usarlas, todo lo que necesitan es usar `core-js`. Simplemente instalen::

```
npm install core-js --save-dev
```
Agreguen una importación al punto de entrada de su aplicación:

```js
import "core-js";
```

Debería polyfill estas características de tiempo de ejecución por ustedes 🌹.
