## Cierre

Lo mejor que JavaScript son los cierres. Una función en JavaScript tiene acceso a cualquier variable que haya sido definida en su ámbito externo (outer scope). Los cierres se explican mejor con ejemplos:

```ts
function outerFunction(arg) {
    var variableInOuterFunction = arg;

    function bar() {
        console.log(variableInOuterFunction); // Acceso a una variable del ámbito externo
    }

    // Llama a la función local para demostrar que tiene acceso a arg
    bar();
}

outerFunction("hello closure"); // imprime "hello closure!"
```

Puedes ver que la función interna tinene acceso a una variable (`variableInOuterFunction`) del ámbito externo. Las variables en el ámbito externo han sido cerradas (o rodeadas) por la función interior. De ahí el término **cierres** (o closures). El concepto en si mismo es simple y bastante intuitivo.

Ahora la parte increíble: La función interna puede acceder las variables de su ámbito externo *incluso luego de que la función externa ya haya devuelto (o returned).* Esto se debe a que las variables siguen conectadas en la función interna y no dependen de la función externa. De nuevo, miremos un ejemplo: 

```ts
function outerFunction(arg) {
    var variableInOuterFunction = arg;
    return function() {
        console.log(variableInOuterFunction);
    }
}

var innerFunction = outerFunction("hello closure!");

// Noten que la función externa ha devuelto
innerFunction(); // imprime "hello closure!"
```

### Razón por la cual es genial
Te permite construir objetos fácilmente, por ejemplo, revelando el patrón modelo:

```ts
function createCounter() {
    let val = 0;
    return {
        increment() { val++ },
        getVal() { return val }
    }
}

let counter = createCounter();
counter.increment();
console.log(counter.getVal()); // 1
counter.increment();
console.log(counter.getVal()); // 2
```
A un nivel más alto, también es lo que permite que algo como Node.js exista (no te preocupes si no hace click en tu cerebro en este momento, lo hará eventualmente 🌹):

```ts
// Pseudo código para explicar el concepto
server.on(function handler(req, res) {
    loadData(req.id).then(function(data) {
        // la `res` ha sido cerrado y está disponible
        res.send(data);
    })
});
```
