## Generadores

`function*` es la sintaxis que utilizamos para crear una *función generadora*. Llamar a una función generadora devuelve un *objeto generador*. El objeto generador sigue la interface [iterator][iterator], es decir, las funciones, `next`, `return` y  `throw`. 

Hay dos incetivos detrás de las funciones generadoras:

### Iteradores perezosos

Las funciones generadores se pueden utilizar para crear iteradores perezosos. Por ejemplo, la siguiente función devuleve una lista **infinita** de numeros integrales:

```ts
function* infiniteSequence() {
    var i = 0;
    while(true) {
        yield i++;
    }
}

var iterator = infiniteSequence();
while (true) {
    console.log(iterator.next()); // { value: xxxx, done: false } por siempre
}
```

Claro que si el iterador termina, recibirás el resultado de `{ done: true }` como mostramos a continuación:

```ts
function* idMaker(){
  let index = 0;
  while(index < 3)
    yield index++;
}

let gen = idMaker();

console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { done: true }
```

### Ejecución controlada externamente
Esta es la parte de los generadores que es realmente emocionante. Esencialmente, le permite a una función pausar en su ejecución y ceder el control (destino) de lo que resta de su ejecución a su "llamador".

Una función generadora no ejecuta cuando la llamas. Simplemente crea un objeto generador. Considera el sigueinte ejemplo junto con una ejecución simple:

```ts
function* generator(){
    console.log('La Ejecución comenzó');
    yield 0;
    console.log('La Ejecución continuó');
    yield 1;
    console.log('La Ejecución continuó');
}

var iterator = generator();
console.log('Comenzando la iteración'); // ESto ejecutará antes que cualquier cosa ejecute en el cuerpo de la función generadora
console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

Si corres esto obtendrás el siguiente resultado:

```
$ node outside.js
Comenzando la iteration
La Ejecución comenzó
{ value: 0, done: false }
La Ejecución continuó
{ value: 1, done: false }
La Ejecución continuó
{ value: undefined, done: true }
```
* La función solo comienza a ejecutar una vez que `next` es llamado en el objeto generador.
* La función *pausa* en cuanto encuentra una declaración `yield`.
* La función *continúa* cuando `next` es llamado nuevamente.


> Esencialmente, la ejecución de la función generadora es controlada por el objeto generador.

Nuestra comunicación usando el generador ha sido, principalmente, en una única dirección: el generador devuelve valores pal iterador. Una característica extremadamente poderosa de los generadores en JavaScript es que permiten la comunicación bidireccional (con algunas excepciones).

* Puedes controlar el valor que resulta de la expresión `yield` a través de `iterator.next(valorAInsertar)`
* Puedes tirar una excepción al momento de `yield` usando `iterator.throw(error)`

El siguiente ejemplo demuestra `iterator.next(valorAInsertar)`:

```ts
function* generator() {
    const bar = yield 'foo'; // bar puede tener *any* tipo
    console.log(bar); // bar!
}

const iterator = generator();
// Comienza la ejecución hasta que obtenemos el primer valor yield
const foo = iterator.next();
console.log(foo.value); // foo
// Resume la ejecución insertando bar
const nextThing = iterator.next('bar');
```

Dado que `yield` devuelve el parámetro pasado al `next` de la función iteradora, y todas las funciones iteradoras `next` acpetan un parámetro de cualquier typo, TypeScript siempre asignará el tipo `any` al resultado del operador `yield` (`bar` en el caso anterior).

> Puedes forzar el resultado al tipo que esperas, y asi asegurarte que solo valores de ese tipo sean pasados a next (por ejemplo, utilizando una capa adicional que fuerce los tipos y llame a next por ti). Si el tipeado fuerte es importante para vos, tal vez quieras evitar la comunicación bidireccional por completo, así como aquellos paquetes que dependan en gran medida de esta funcion (por ejemplo, redux-saga).

El siguiente ejemplo pone en práctica `iterator.throw(error)`:

```ts
function* generator() {
    try {
        yield 'foo';
    }
    catch(err) {
        console.log(err.message); // bar!
    }
}

var iterator = generator();
// Comienza la ejecución hasta que obtenemos el primer valor de yield
var foo = iterator.next();
console.log(foo.value); // foo
// Continua la ejecución tirando una excepción 'bar'
var nextThing = iterator.throw(new Error('bar'));
```

Aquí está el resumen:
* `yield` permite a una función generadora pausar su comunicación y ceder el control a un sistema externo.
* el sistema externo puede insertar un valor en el cuerpo de la función generadora.
* el sistema externo puede tirar una excepción en el cuerpo de la función generadora.

Por qué es útil todo esto? Saltá a la próxima sección [**async/await**][async-await] y descubrilo.

[iterator]:./iterators.md
[async-await]:./async-await.md
