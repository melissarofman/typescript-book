# Por qué Cypress
Cypress es una herramienta de pruebas E2E muy buena. Aquí listamos algunas razones para considerarla:

* Es posible instalarla de forma aislada
* Incluye definiciones de TypeScript por default
* Provee una buena experiencia de depuración interactiva con Google Chrome. Esto es similar a como los desarrolladores de UI trabajan manualmente.
* Tiene separación de comando - ejecución, lo que permite un proceso de depuración y de pruebas de estabilidad más poderoso (más detalle sobre esto a continuación)
* Tiene aserciones implicitas para proveer una experiencia de depuración más significativa, con menos pruebas frágiles (más sobre esto en las tips que siguen).

## Instalación

> Los pasos detallados en este proceso de instalación les darán una linda carpeta `e2e` que pueden usar como plantilla para su empresa. Pueden copiar esta carpeta `e2e` en cualquier proyecto ya existente que quieran evaluar con cypress.

Creen un directorio `e2e` e instalen cypress y sus dependencias para transpilación de TypeScript:

```sh
mkdir e2e
cd e2e
npm init -y
npm install cypress webpack @cypress/webpack-preprocessor typescript ts-loader
```

> A continuación listamos algunas razones para crear una carpeta `e2e` separada, especialmente para cypress:
* Facilita el aislamiento de las dependencias de su `package.json` del resto de su proyecto. Esto resulta en menos conflictos de dependencias.
* Los frameworks de evaluación tienen un mal hábito de contaminar el namespace global con variables como `describe`, `it`, `expect`. Es mejor contener los `node_modules` y el `tsconfig.json` del e2e en esta carpeta especial `e2e` para prevenir que haya conflictos de definiciones de tipo globales. 

Configuren el `tsconfig.json` de TypeScript. Por ejemplo:


```json
{
  "compilerOptions": {
    "strict": true,
    "sourceMap": true,
    "module": "commonjs",
    "target": "es5",
    "lib": [
      "dom",
      "es6"
    ],
    "jsx": "react",
    "experimentalDecorators": true
  },
  "compileOnSave": false
}
```

Hana un simulacro de cypress para preparar la estructura de carpetas. El IDE de Cypress se abrirá. Pueden cerrarlo luego de ver el mensaje de bienvenida.

```sh
npx cypress open
```

Configuren cypress para transpilar typescript editando `e2e/cypress/plugins/index.js` para que contenga lo siguiente:

```js
const wp = require('@cypress/webpack-preprocessor')
module.exports = (on) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: { transpileOnly: true }
          }
        ]
      }
    },
  }
  on('file:preprocessor', wp(options))
}
```

Opcionalmente, agreguen algunos comandos al archivo `e2e/package.json`:

```json
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  },
```

## Más detalles de los archivos clave:
En la carpeta `e2e` deberían tener estos archivos:

* `/cypress.json`: Configura cypress. El archivo dfault está vacío y eso es todo lo que necesitan.
* `/cypress` Subcarpetas: 
    * `/fixtures`: Accesorios de pruebas
        * Viene con un `example.json`. Sientanse libres de eliminarlo.
        * Pueden crear archivos `.json` que peuden ser usados para proveer muestras de datos (es decir, accesorios) que serán utilizadas en las pruebas. 
    * `/integration`: Todas las pruebas. 
        * Viene con una carpeta `examples`. Sientanse libres de eliminarla.
        * Nombren a los archivos de pruebas con `.spec.ts`. Por ejemplo `algo.spec.ts`.
        * Sientanse libres de crear pruebas en subcarpetas para mantenrlas mejor organizadas. e.g. `/someFeatureFolder/something.spec.ts`.

## Primera prueba
* creen un archivo `/cypress/integration/first.spec.ts` con el siguiente contenido: 

```ts
/// <reference types="cypress"/>

describe('google search', () => {
  it('should work', () => {
    cy.visit('http://www.google.com');
    cy.get('#lst-ib').type('Hello world{enter}')
  });
});
```

## Correrlo en desarrollo
Abran el IDE de Cypress usando el siguiente comando:

```sh
npm run cypress:open
```

Y seleccionen una prueba para correr.

## Correrlo en un servidor build

Pueden correr pruebas de cypress en modo CI usando el siguiente comando:

```sh
npm run cypress:run
```

## Tip: Compartan código entre UI y prueba
Las pruebas de Cypress se compilan / empacan y corren en el navegador. Así que siéntanse libres de importar cualquier parte de código de su pryecto a la prueba. 

Por ejemplo, pueden compartir valores de ID entre UI y pruebas, para asegurarse que los selectores de CSS no se vayan a romper:

```js
import { Ids } from '../../../src/app/constants'; 

// Later 
cy.get(`#${Ids.username}`)
  .type('john')
```

## Tip: Creen objetos de página
Crear objetos que provean una manera conveniente de usarlos para todas las interaciones que varias pruebas necesitan realizar con una página es una convención común de evaluación. Pueden crear objetos de páginas usando clases de TypeScript con getters y métodos. Por ejemplo:

```js
import { Ids } from '../../../src/app/constants'; 

class LoginPage {
  visit() {
    cy.visit('/login');
  }
  
  get username() {
    return cy.get(`#${Ids.username}`);
  }
}
const page = new LoginPage();

// Later
page.visit();

page.username.type('john');

```

## Tip: Aserciones implícitas
Cuando un comando de cypress falla, obtendrán un lindo error (en lugar de algo como `null`, como sucede con muchos otros frameworks) por lo que podrán fallar rápido y saber exactamente por qué una prueba falla:

```
cy.get('#foo') 
// If there is no element with id #foo cypress will wait for 4 seconds automatically 
// If still not found you get an error here ^ 


// This \/ will not trigger until an element #foo is found
  .should('have.text', 'something') 
```

## Tip: Aserciones explícitas
Cypress incluye varias ayudas para aserciones para la web. Por ejemplo chai-jquery https://docs.cypress.io/guides/references/assertions.html#Chai-jQuery. Pueden usarlas con el comando `.should`, incluyendo el encadenador como una string. Por ejemplo:

```
cy.get('#foo') 
  .should('have.text', 'something') 
```

## Tip: Comandos y encadenamiento
Cada llamada de función en una cadena de cypress es un `comando`. El comando `should` es una aserción. Es convencional empezar por separado distintas *categorías* de cadenas y acciones. Por ejemplo:

```ts
// No hagan esto
cy.get(/**algo*/) 
  .should(/**algo*/)
  .click()
  .should(/**algo*/)
  .get(/**algo mas*/) 
  .should(/**algo*/)

// Es mejor separar los dos `get` 
cy.get(/**algo*/) 
  .should(/**algo*/)
  .click()
  .should(/**algo*/)

cy.get(/**algo mas*/) 
  .should(/**algo*/)
```

Otras librerías *evalúan y corren* el código al mismo tiempo. Esas librerías los fuerza a tener que elegir una única cadena, lo que puede resultar en una pesadilla de depurar, al tener aserciones y selectores entremezclados.

Los comandos de Cypress son, esencialmente, *declaraciones* que le indican al tiempo de ejecución de cypress que deberá ejecutar los comandos más adelante. En fin: Cypress es más sencillo.

## Tip: Usen `contains` para facilitar el querying

El siguiente código muestra un ejemplo:

```
cy.get('#foo') 
  // una vez que #foo es encontrado, ocurre lo siguiente:
  .contains('Submit') 
  .click()
  // ^ continuará buscando algo que tenga el texto `Submit` y fallará si se acaba el tiempo.
  // ^ Luego de que es encontrado, desencadena un click en el Nodo HTML que contiene el texto `Submit`.
```
## Tip: Aserciones implícitas
Cypress tiene un concepto de aserciones implícitas. Estas solo corren si un comando futuro tiene errores debido a un comando previo. Por ejemplo, el siguiente código no tendrá errores si no hay texto con `Submit`:

```ts
cy.get('#foo') 
// una vez que #foo es encontrado, ocurre lo siguiente:
  .contains('Submit') 
```
Sin embargo, el siguiente ejemplo tendrá un error en `contains` (luego de reintentar automáticamente, por supuesto) ya que no se puede encontarr nada que pueda ser `click`eado:

```ts
cy.get('#foo') 
// una vez que #foo es encontrado, ocurre lo siguiente:
  .contains('Submit') 
  .click()
  // ^ Error: #foo does not have anything that `contains` `'Submit'`
```

Si quieren pueden usar una *aserción explícita* y no dependen de aserciones implícitas. Por ejemplo, en lugar de `contain` deberían usar `cy.should('contain','Submit')`: 

```ts
// Mal. No hay error.
cy.get('#foo') 
  .contains('Submit') 

// Bien. Error: `#foo` does not contain `Submit`
cy.get('#foo') 
  .should('contain', 'Submit')
```

## Tip: Esperar un pedido HTTP
Muchas de las pruebas han sido tradicionalmente frágiles debido a todos los timeouts que son necesarios para los XHRs que hace una aplicación. `cy.server` facilita
* crear un alias para llamadas al backend
* esperar a que ocurran

Por ejemplo:

```ts
cy.server()
  .route('POST', 'https://example.com/api/application/load')
  .as('load') // creen un alias

// Empiecen la prueba
cy.visit('/')

// esperen la llamada
cy.wait('@load') 

// Ahora la data ha sido cargada
```

## Tip: Imitar una respuesta de un pedido HTTP
También pueden imitar la respuesta del pedido fácilmente usando `route`:
```ts
cy.server()
  .route('POST', 'https://example.com/api/application/load', /* Example payload response */{success:true})
```

## Tip: Tiempo de imitación
Pueden usar `wait` para pausar una prueba por un determinado período de tiempo, por ejemplo, para evaluar una pantalla automática de notificación de "están a punto de ser cerrada su sesión":

```ts
cy.visit('/');
cy.wait(waitMilliseconds);
cy.get('#logoutNotification').should('be.visible');
```

Sin embargo, se recomenda imitar tiempo usando `cy.clock` y reenviar tiempo usando `cy.tick`. Por ejemplo:

```ts
cy.clock();

cy.visit('/');
cy.tick(waitMilliseconds);
cy.get('#logoutNotification').should('be.visible');
```

## Tip: Retrasos inteligentes y reintentos
Cypress esperará (y reintentará) automáticamente muchas cosas asincrónicas:
```
// Si no hay un pedido hacia el alias `foo`, cypress esperará 4 segundos automáticamente
cy.wait('@foo') 
// Si no hay un elemento con id #foo, cypress esperará 4 segundos automáticamente y continuará reintentando
cy.get('#foo')
```
Esto previene que tengan que agregar lógica arbitraria de timeout (y reintentar) constantemente en su código de pruebas.


## Tip: Realizar pruebas unitarias para el código de la aplicación
También pueden usar Cypress para pruebas unitarias. Por ejemplo:

```js
import { once } from '../../../src/app/utils'; 

// Later 
it('should only call function once', () => {
  let called = 0;
  const callMe = once(()=>called++);
  callMe();
  callMe();
  expect(called).to.equal(1);
});
```

## Tip: Imitación en pruebas unitarias
Si estan realizando pruebas unitarias en su aplicación, pueden proveer imitaciones usando `cy.stub`. Por ejemplo, si quieren asegurarse que `navigate` es llamada en una función `foo`:

* `foo.ts`
```ts
import { navigate } from 'takeme';

export function foo() {
  navigate('/foo');
}
```

* Pueden hacerlo como en `some.spec.ts`: 
```ts
/// <reference types="cypress"/>

import { foo } from '../../../src/app/foo';
import * as takeme from 'takeme';

describe('should work', () => {
  it('should stub it', () => {
    cy.stub(takeme, 'navigate');
    foo();
    expect(takeme.navigate).to.have.been.calledWith('/foo');
  })
});
```

## Tip: Puntos de quiebre
El registro automático de instantáneas y comandos que las pruebas de Cypress generan es buenísimo para depurar. Habiendo dicho esto, también es posible pausar la ejecución de las pruebas si así lo desean.

Primero deben asegurarse que tienen las herramienta de desarrolladores de chrome ("dev tools") abiertas en el "corredor" de las pruebas (`CMD + ALT + i` en mac / `F12` en windows). Una vez que las dev tools estan abiertas, pueden reiniciar las pruebas y las dev tools permanecerán abiertas. Si están abiertas, podrán pausar las pruebas de dos maneras:

* Puntos de quiebre en el código de la aplicación: usen una declaración `debugger` en el código y el "corredor" parará en él, de la misma forma que en desarrollo web estándar.
* Puntos de quiebre de código de pruebas: Pueden usar el comando `.debug()` y la ejecución de pruebas de Cypress parará en él. Alternativamente, pueden usar una declaración `debugger` en una devolución de llamada `.then` de un comando para provocar una pausa. Por ejemplo, `.then(() => {debugger})`.  También lo pueden usar para agarrar un elemento `cy.get('#foo').then(($ /* referencia al elemento dom */) => { debugger; })` o una llamada de red como `cy.request('https://someurl').then((res /* respuesta */) => { debugger });`. Sin embargo, la forma idiomática es `cy.get('#foo').debug()` y una vez que el "corredor" de pruebas ha pausado en `debug` pueden hacer click en `get` en el registro de comandos para `console.log` cualquier información que necesiten sobre el comando `.get('#foo')` automáticamente (al igual que para cualquier otro comando que quieran depurar).

## Tip: Empezar el servidor y el test
Si necesitan empezar el servidor local antes que sus pruebas puedan correr, pueden agregar `start-server-and-test` https://github.com/bahmutov/start-server-and-test como una dependencia. Acepta los siguientes argumentos:
* un script npm que *corre* el servidor (server)
* un endpoint para controlar si el servidor ha empezador (start)
* un script npm para iniciar las pruebas (test)

Ejemplo package.json: 
```json
{
    "scripts": {
        "start-server": "npm start",
        "run-tests": "mocha e2e-spec.js",
        "ci": "start-server-and-test start-server http://localhost:8080 run-tests"
    }
}
```

## Recursos 
* Website: https://www.cypress.io/
* Escriban su primera prueba cypress (da un buen tour de la IDE de cypress) : https://docs.cypress.io/guides/getting-started/writing-your-first-test.html
* Configuren un ambiente CI (por jeemplo, la imagen docker que funciona por default con `cypress run`): https://docs.cypress.io/guides/guides/continuous-integration.html
* Recetas (Listas de recetas con descripciones. Hagan click en los títulos para navegar al código fuente de cada receta): https://docs.cypress.io/examples/examples/recipes.html
