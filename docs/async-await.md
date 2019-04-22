## Async Await

> [Un curso audiovisual PRO de egghead que cubre el mismo contentido](https://egghead.io/courses/async-await-using-typescript)

A modo de experimento mental, imaginate lo siguiente: una manera de decirle a de JavaScript que pause la ejecución del código al encontrarse con la palabra clave `await` utilizada en una promesa, y que resuma *únicamente* si la promesa devuelta de la función ha sido completada:

```ts
// No es código. Es un experimento mental.
async function foo() {
    try {
        var val = await getMeAPromise();
        console.log(val);
    }
    catch(err) {
        console.log('Error: ', err.message);
    }
}
```

Cuando la promesa se completa, la ejecución continua.
* Si la promesa fue resulta, entonces await devolverá el valor de la resolución
* Si la promesa fue rechazada, un error sincrónico que podremos manejar será tirado 

Esto convierte a la programación asincrónica tan fácil como la programación sincrónica. Se necesitan tres cosas para este experimento mental:
* La habilidad de *pausar* la ejecución de una función.
* La habilidad de *insertar un valor* en la función.
* La habilidad de *tirar una excepción dentro* de la función.

Esto es lo que los generadores permiten. El experimento mental *es real* y también lo es la implementación `async`/`await` en JavaSript y TypeScript. Detrás de escenas, usan generators.

### JS Generado

No tenes que entender esto, pero bastante simple si has [estudiado los generadores][generators]. La función `foo` puede ser envuelta de la siguiente manera:

```ts
const foo = wrapToReturnPromise(function* () {
    try {
        var val = yield getMeAPromise();
        console.log(val);
    }
    catch(err) {
        console.log('Error: ', err.message);
    }
});
```

En este caso `wrapToReturnPromise` simplemente ejecuta la función generadora para obtener el `generator` y luego usa `generator.next()`. Si el valor es una `promise`, entonces procederá a `then`+`catch` esa promesa, y dependiendo del resultado, llamaría `generator.next(result)` o `generator.throw(error)`. Eso es todo!


### Soporte para Async Await en TypeScript
**Async - Await** ha sido soportado por [TypeScript desde la versión 1.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html).las funciones asincrónicas se prefijan con la palabra clave *async*; la palabra clave *await* suspende la ejecución hasta que una promesa es devuelta como completa de la función asincrónica. El valor de la *Promesa* es desenvuelto luego. En esta versión el soporte solo cubría **targets ES6** que transpilaran directamente a **generadores ES6**.

**TypeScript 2.1** [agregó la capacidad de soportar los tiempos de ejecución de ES3 y ES5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html). Es decir, podrás utilizar esta característica sin importar que ambiente estés utilizando. Es importante remarcar que podemos usar async / await con TypeScript 2.1 y que muchos navegadores están soportados mediante la implementación de un **polyfill para Promesas** global.

Veamos este **ejemplo** y consideremos este código para entender como la **notación** async / await de TypeScript funciona:

```ts
function delay(milliseconds: number, count: number): Promise<number> {
    return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve(count);
            }, milliseconds);
        });
}

// Una función async siempre devuelve una Promesa
async function dramaticWelcome(): Promise<void> {
    console.log("Hello");

    for (let i = 0; i < 5; i++) {
        // await convierte la Promise<number> a un número
        const count:number = await delay(500, i);
        console.log(count);
    }

    console.log("World!");
}

dramaticWelcome();
```

**Transpiling to ES6 (--target es6)**
```js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function delay(milliseconds, count) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(count);
        }, milliseconds);
    });
}
// Una función async siempre devuelve una Promesa
function dramaticWelcome() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Hello");
        for (let i = 0; i < 5; i++) {
            // await is converting Promise<number> into number
            const count = yield delay(500, i);
            console.log(count);
        }
        console.log("World!");
    });
}
dramaticWelcome();
```
Puedes ver el ejemplo completo [aquí][asyncawaites6code].


**Transpiling to ES5 (--target es5)**
```js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(functionUna función async siempre devuelve una Promesa (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function delay(milliseconds, count) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(count);
        }, milliseconds);
    });
}
// Una función async siempre devuelve una Promesa
function dramaticWelcome() {
    return __awaiter(this, void 0, void 0, function () {
        var i, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Hello");
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 4];
                    return [4 /*yield*/, delay(500, i)];
                case 2:
                    count = _a.sent();
                    console.log(count);
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("World!");
                    return [2 /*return*/];
            }
        });
    });
}
dramaticWelcome();
```
Puedes ver el ejempl completo [aquí][asyncawaites5code].


**Nota**: para ambos escenarios target, tenemso que asegurarons que nuestro tiempo de ejecución tenga disponible una Promesa que cumpla con los estándares ECMA-Script. Esto puede implicar tomar un polyfill de Promesas. También tenemos que asegurarons que TypeScript sepa que las Promesas existen configurando una bandera en la librería a algo como "dom", "es2015", o "dom", "es2015.promise, "es5". 
**Podemos mirar que navegadores soportan Promesas (nativas y pollyfilled)) [aquí](https://kangax.github.io/compat-table/es6/#test-Promise).**

[generators]:./generators.md
[asyncawaites5code]:https://cdn.rawgit.com/basarat/typescript-book/705e4496/code/async-await/es5/asyncAwaitES5.js
[asyncawaites6code]:https://cdn.rawgit.com/basarat/typescript-book/705e4496/code/async-await/es6/asyncAwaitES6.js
