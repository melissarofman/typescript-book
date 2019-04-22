## Promesa

La clase `Promise` es algo que existe en muchos motoros modernos de JavaSCript y que puede ser fácilmente  *[polyfilled]*[polyfill]. La razón principal por la que existen las promesas es permitir el manejo sincrónico de errores en código asincrónico o en devoluciones de llamada. 

### Devoluciones de llamada

Para entender y realmente apreciar el poder de las promesas, vamos a presentar un ejemplo simple que muestra cuán dificil es crear código asincrónico confiable usando callbacks únicamente. Consideremos el siguiente caso: cargar JSON de un archivo de forma asincrónica.  Una versión sincrónica puede ser bastante simple:

```ts
import fs = require('fs');

function loadJSONSync(filename: string) {
    return JSON.parse(fs.readFileSync(filename));
}

// buen archivo json
console.log(loadJSONSync('good.json'));

// archivo no-existente, por lo que fs. readFileSync falla
try {
    console.log(loadJSONSync('absent.json'));
}
catch (err) {
    console.log('absent.json error', err.message);
}

// archivo json inválido. El archivo existe pero contiene json que es inválido por lo que JSON.parse falla
try {
    console.log(loadJSONSync('invalid.json'));
}
catch (err) {
    console.log('invalid.json error', err.message);
}
```

Estos son tres casos de la función `loadJSONSync`: una devolución válida, un error en el sistema de archivo, o un error en JSON.parse. Hemos manejado esos errores con un esquema try/catchsimple, de la misma forma que otros lenguages manejan código sincrónico. Ahora, creemos una buena versión asincrónica de la misma función. Un intento inicial razonable, con una lógica trivial para chequear errores podría ser así: 

```ts
import fs = require('fs');

// Un intento inicial... pero no es correcto. Explicaremos por qué a continuación
function loadJSON(filename: string, cb: (error: Error, data: any) => void) {
    fs.readFile(filename, function (err, data) {
        if (err) cb(err);
        else cb(null, JSON.parse(data));
    });
}
```

Simple. Acepta una devolución de llamada, pasa cualquier error del sistema de archivos a la devolución de llamada. Si no hay errores en el sistema de archivos, devuelve el resultado de `JSON.parse`. Pero hay un par de puntos a tener en cuenta al trabajar con funciones asincrónicas basadas en devoluciones de llamada:

1. Nunca llames a la devolución de llamada dos veces.
1. Nunca tires un error.

Esta función simple que hemos escrito no cumple la segunda condición. De hecho, `JSON.parse` tira un error si recibe JSON inválido, y la devolución de llamada nunca es llamada y la aplicación deja de correr (*crashes*). Demostramos esto a continuación:

```ts
import fs = require('fs');

// Un intento inicial... pero no es correcto.
function loadJSON(filename: string, cb: (error: Error, data: any) => void) {
    fs.readFile(filename, function (err, data) {
        if (err) cb(err);
        else cb(null, JSON.parse(data));
    });
}

// cargá JSON inválido
loadJSON('invalid.json', function (err, data) {
    // este código nunca corre
    if (err) console.log('bad.json error', err.message);
    else console.log(data);
});
```

Un intento inocente de arreglar esto sería envolver la función `JSON.parse` en un bloque try/catch, como mostramos a continuación:

```ts
import fs = require('fs');

// Un intento mejor... pero sigue sin ser correcto
function loadJSON(filename: string, cb: (error: Error) => void) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            cb(err);
        }
        else {
            try {
                cb(null, JSON.parse(data));
            }
            catch (err) {
                cb(err);
            }
        }
    });
}

// carga json inválido
loadJSON('invalid.json', function (err, data) {
    if (err) console.log('bad.json error', err.message);
    else console.log(data);
});
```

Sin embargo, hay una bug sutil en este código. Si la devolución de llamada (`cb`), y no `JSON.parse`, tira un error, como la hemos envuelto en un bloque `try`/`catch`, el `catch` ejecuta y volvemos a llamar a la devolución de llamada. Es decir, la devolución de llamada es llamada dos veces! Miremos el ejemplo que sigue:

```ts
import fs = require('fs');

function loadJSON(filename: string, cb: (error: Error) => void) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            cb(err);
        }
        else {
            try {
                cb(null, JSON.parse(data));
            }
            catch (err) {
                cb(err);
            }
        }
    });
}

// un archivo válido pero una devolución de llamada incorrecta... es llamada de nuevo!
loadJSON('good.json', function (err, data) {
    console.log('devolución de llamada, llamada (sic)');

    if (err) console.log('Error:', err.message);
    else {
        // simulemos un error tratando de acceder a una propiedad de una variable undefined
        var foo;
        // El siguente código tira `Error: Cannot read property 'bar' of undefined`
        console.log(foo.bar);
    }
});
```

```bash
$ node asyncbadcatchdemo.js
devolución de llamada, llamada (sic)
devolución de llamada, llamada (sic)
Error: Cannot read property 'bar' of undefined
```

Est ose debe a que nuestra función `loadJSON` envolvió erróneamente a la devolución de llamada en un bloque `try`. Hay una simple enseñanza para recordar aquí:

> Enseñanza: Envolvé todo tu código sincrónico en un try catch, excepto cuando llamas a la devolución de llamada

Si seguimos esta regla, tendremos una versión completamente funcional de nuestra `loadJSON` asincrónica:


```ts
import fs = require('fs');

function loadJSON(filename: string, cb: (error: Error) => void) {
    fs.readFile(filename, function (err, data) {
        if (err) return cb(err);
        // Contené todo tu código sincrónico en un try catch
        try {
            var parsed = JSON.parse(data);
        }
        catch (err) {
            return cb(err);
        }
        // excepto cuando devolvés la devolución de llamada
        return cb(null, parsed);
    });
}
```
Con honestidad, esot no es difícil una vez que lo has hecho un par de veces, pero sigue siendo mucho código repetitivo simplemente para manejar errores de la forma correcta. Por lo tanto, procedamos a considerar una mejor manera de hacerle frente al código asincrónico en JavaScript mediante las promesas.

## Crear una Promesa

Una promesa puede estar pendiente, cumplida, o rechazada (`pending`, `fulfilled` o `rejected`).

![promise states and fates](https://raw.githubusercontent.com/basarat/typescript-book/master/images/promise%20states%20and%20fates.png)

Concentremonos en cómo crear una promesa. Se trata simplemente de llamar a `new` antes de `Promise` (el constructor de promesas). El constructor recibe las funciones  `resolve` y `reject` que le permiten resolver el estado de la Promesa:

```ts
const promise = new Promise((resolve, reject) => {
    // las funciones resolve y reject controlan el destino de la promesa
});
```

### Suscribirse al destino de la promesa.

Es posible subscribirse al destino de la promsea utilizando `.then` (para resoluciones) o `.catch` (para rechazos)

```ts
const promise = new Promise((resolve, reject) => {
    resolve(123);
});
promise.then((res) => {
    console.log('Soy llamada:', res === 123); // Soy llamada: true
});
promise.catch((err) => {
    // Esto nunca es llamado
});
```

```ts
const promise = new Promise((resolve, reject) => {
    reject(new Error("Algo terrible ha sucedido"));
});
promise.then((res) => {
    // Esto nunca es llamado
});
promise.catch((err) => {
    console.log('Soy llamada:', err.message); // Soy llamada: Soy llamada: 'Algo terrible ha sucedido'
});
```

> TIP: Atajos en promesas
* Crear una promesa ya resulta rápidamente: `Promise.resolve(result)`
* Crear una promesa ya rechazada rápidamente: `Promise.reject(error)`

### La posibilidad de encadenar Promesas
La posibilidad de encadenar promesas **es el beneficio que las mismas ofrecen**. Una vez que tienes una promesa puedes, a partir de ese punto, usar la función `then` para encadenar más promesas.

* Si devuelves una promesa en alguna función de la cadena, `.then` sólo será llamado una vez que el valor haya sido resuelto:

```ts
Promise.resolve(123)
    .then((res) => {
        console.log(res); // 123
        return 456;
    })
    .then((res) => {
        console.log(res); // 456
        return Promise.resolve(123); // Notá que estamos devolviendo una promesa
    })
    .then((res) => {
        console.log(res); // 123 : Notá que este `.then` esta siendo llamado con el valor resulto
        return 123;
    })
```

* Puedes combinar el manejo de errores de cualquier porción anterior de la cadena con un único `catch`:

```ts
// Crea una promesa rechazada
Promise.reject(new Error('Algo malo ha ocurrido'))
    .then((res) => {
        console.log(res); // No es llamada
        return 456;
    })
    .then((res) => {
        console.log(res); // No es llamada
        return 123;
    })
    .then((res) => {
        console.log(res); // No es llamada
        return 123;
    })
    .catch((err) => {
        console.log(err.message); // Algo malo ha ocurrido
    });
```

* En realidad, `catch` también devuleve una promesa, creando una nueva cadena:

```ts
// Create a rejected promise
Promise.reject(new Error('Algo malo ha ocurrido'))
    .then((res) => {
        console.log(res); // No es llamada
        return 456;
    })
    .catch((err) => {
        console.log(err.message); // Algo malo ha ocurrido
        return 123;
    })
    .then((res) => {
        console.log(res); // 123
    })
```

* Cualquier error sincrónico que sea tirado en un bloque `.then` (o `catch`) resultará en un fallo en la promesa devuelta:

```ts
Promise.resolve(123)
    .then((res) => {
        throw new Error('Algo malo ha ocurrido'); // tira un error sincrónico
        return 456;
    })
    .then((res) => {
        console.log(res); // No es llamada
        return Promise.resolve(789);
    })
    .catch((err) => {
        console.log(err.message); // Algo malo ha ocurrido
    })
```

* Solo el `catch` relevante (el más cercao) es llamado para un determinado un error (ya que el mismo desencadena una nueva cadena de promesas).

```ts
Promise.resolve(123)
    .then((res) => {
        throw new Error('Algo malo ha ocurrido'); // tira un error sincrónico
        return 456;
    })
    .catch((err) => {
        console.log('primer catch: ' + err.message); // Algo malo ha ocurrido
        return 123;
    })
    .then((res) => {
        console.log(res); // 123
        return Promise.resolve(789);
    })
    .catch((err) => {
        console.log('segundo catch: ' + err.message); // No es llamado
    })
```

* Un `catch`solo es llamado si hay un error en la cadena que lo precede. 

```ts
Promise.resolve(123)
    .then((res) => {
        return 456;
    })
    .catch((err) => {
        console.log("HERE"); // No es llamado
    })
```

El hecho de que:

* los errores saltan al primer `catch`, saltéandose cualquier `then` que pudiese haber en el medio, y
* que los errores sincrónicos también son atrapados por algun `catch` que los suceda, 

nos proveen un paradigma de programación asincrónica que permite un manejo de errores superior al llamado de devoluciones de llamadas. Profundizaremos a continuación.


### TypeScript y las promesas
La gran ventaja de TypeScript es que entiende como fluyen los valores a través de una cadena de promesas:

```ts
Promise.resolve(123)
    .then((res) => {
         // se infiere que res es de tipo `number`
         return true;
    })
    .then((res) => {
        // se infiere que res es de tipo `boolean`

    });
```

Claro que también entiende cómo desenvolver cualquier función que pueda devolver una promesa
Of course it also understands unwrapping any function calls that might return a promise:

```ts
function iReturnPromiseAfter1Second(): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve("Hello world!"), 1000);
    });
}

Promise.resolve(123)
    .then((res) => {
        // se infiere que res es de tipo `number`
        return iReturnPromiseAfter1Second(); // Estamos devolviendo `Promise<string>`
    })
    .then((res) => {
        // se infiere que res de tipo `string`
        console.log(res); // Hello world!
    });
```


### Convertir una función con estilo de devolución de llamada para que devuelva una promesa

Simplemente envolvé la llamada a la función en una promesa y 
- `reject` si ocurre un error,
- `resolve` si está todo ok.

Por ejemplo, hagamoslo con `fs.readFile`:

```ts
import fs = require('fs');
function readFileAsync(filename: string): Promise<any> {
    return new Promise((resolve,reject) => {
        fs.readFile(filename,(err,result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
```

La manera más confiable de hacer esto es escribirlo a mano, y no tiene que ser tan detallado como el ejemplo anterior. Por ejemplo, podemos convertir `setTimeout` a una versión *prometida* llamada `delay` fácilmente:

```ts
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
```

Notá que existe una función útil en NodeJS que hace esta especie de magia (`función estilo node => función que devuelve una promesa`) por vos:

```ts
/** Ejemplo de uso */
import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
```

> Webpack soporta el módulo `util` tal cual. También puedes usarlo en navegadores.

### Revisando el ejemplo JSON

Ahora revisemos nuestro ejemplo `loadJSON` y reescribamoslo a una versión asincrónica que utilice promesas. Todo lo que necesitaremos hacer es leer los contenidos del archivo como una promesa, y luego procesarlos como JSON y habremos terminado.

```ts
function loadJSONAsync(filename: string): Promise<any> {
    return readFileAsync(filename) // Use the function we just wrote
                .then(function (res) {
                    return JSON.parse(res);
                });
}
```

Uso (notá lo similar que es a la versión sincrónica original que escribimos al principio de esta sección 🌹):
```ts
// Archivo JSON válido
loadJSONAsync('good.json')
    .then(function (val) { console.log(val); })
    .catch(function (err) {
        console.log('good.json error', err.message); // No es llamado
    })

// Archivo no existente
    .then(function () {
        return loadJSONAsync('absent.json');
    })
    .then(function (val) { console.log(val); }) // No es llamado
    .catch(function (err) {
        console.log('absent.json error', err.message);
    })

// Archivo JSON inválido
    .then(function () {
        return loadJSONAsync('invalid.json');
    })
    .then(function (val) { console.log(val); }) // No es llamado
    .catch(function (err) {
        console.log('bad.json error', err.message);
    });
```

La razón por la que esta función es más sencilla es porque la consolidación de "`loadFile`(async) + `JSON.parse` (sync) => `catch`" fue hecha por la cadena de promesas. Además la devolución de llamada no fue llamada por *nosotros* sino por la cadena de promesas, por lo que no tuvimos la posiblidad de cometer el error de envolverla en un bloque `try/catch`.

### Flujo de control paralelo

Hemos visto cuan sencillo es crear una secuencia serial de tareas asincrónicas con promesas. Se trata, simplemente, de encadenar llamadas `then`.

Sin embargo, podrías querer correr series de tareas asincrónicas y luego hacer algo con los resultados de esas tareas. La Promes aprovee una función `Promise.all` estática que puedes usar para esperar que un número `n` de promesas terminen. Puedes pasarle un array de `n` promesas y te devolverá un array de `n` valores resueltos. A continuación mostramos encadenamiento y paralelismo:

```ts
// una función asincrónica para simular la carga de un ítem desde un servidor
function loadItem(id: number): Promise<{ id: number }> {
    return new Promise((resolve) => {
        console.log('loading item', id);
        setTimeout(() => { // simulá una demora desde el servidor
            resolve({ id: id });
        }, 1000);
    });
}

// Encadenamiento
let item1, item2;
loadItem(1)
    .then((res) => {
        item1 = res;
        return loadItem(2);
    })
    .then((res) => {
        item2 = res;
        console.log('done');
    }); // El tiempo total será 2s aproximadamente

// Paralelismo
Promise.all([loadItem(1), loadItem(2)])
    .then((res) => {
        [item1, item2] = res;
        console.log('done');
    }); // El tiempo total será 1s aproximadamente
```

A veces quieres correr una serie de tareas asincrónicas, pero todo lo que necesitas es que una de estas tareas termine. Las promesas proveen una función estática `Promise.race` para este escenario:

```ts
var task1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 1000, 'one');
});
var task2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 2000, 'two');
});

Promise.race([task1, task2]).then(function(value) {
  console.log(value); // "one"
  // Ambas resulven, pero task1 resuelve más rápido.
});
```

[polyfill]:https://github.com/stefanpenner/es6-promise
