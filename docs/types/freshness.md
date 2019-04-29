
* [Frescura](#freshness)
* [Pemitir propiedades extra](#allowing-extra-properties)
* [Caso de uso: React](#use-case-react-state)

## Frescura

TypeScript provee un concepto de **Frescura** ( también llamado *control de objetos literales estricto*) para facilitar el control de tipos en objetos literales que, de lo contrario, serían compatibles estructrualmente.

El tipado estructural es *extremadamente conveniente* Consideremos la siguiente porción de código. El tipado estructural les permitirá actualizar su JavaScript a TypeScript *de manera muy conveniente* y preservando cierto nivel de seguridad de tipos:

```ts
function logName(something: { name: string }) {
    console.log(something.name);
}

var person = { name: 'matt', job: 'being awesome' };
var animal = { name: 'cow', diet: 'vegan, but has milk of own species' };
var random = { note: `I don't have a name property` };

logName(person); // okay
logName(animal); // okay
logName(random); // Error: property `name` is missing
```

Sin embargo, el tipado *estructural* tiene una debilidad ya que les permite pensar que algo acepta más datos de los que realmente acepta. Demostramos esto en el código que sigue en el que TypeScript tirará un error:

```ts
function logName(something: { name: string }) {
    console.log(something.name);
}

logName({ name: 'matt' }); // okay
logName({ name: 'matt', job: 'being awesome' }); // Error: object literals must only specify known properties. `job` is excessive here.
```

Notemos que este error ocurre *únicamente con objetos literales•. Sin este error, uno podría mirar la llamada `logName({ name: 'matt', job: 'being awesome'})` y pensar que *logName* podría hacer algo útil con `job` cuando, en realidad, lo ignorará completamente.

Otro caso de uso importante refiere a las interfaces que tienen miembros opcionales, y por ende no están sujetos al mismo chequeo de tipos que los objetos literales. En este caso, un error de tipeo pasaría el control de tipos. Lo demostramos a continuación:

```ts
function logIfHasName(something: { name?: string }) {
    if (something.name) {
        console.log(something.name);
    }
}
var person = { name: 'matt', job: 'being awesome' };
var animal = { name: 'cow', diet: 'vegan, but has milk of own species' };

logIfHasName(person); // okay
logIfHasName(animal); // okay
logIfHasName({neme: 'I just misspelled name to neme'}); // Error: object literals must only specify known properties. `neme` is excessive here.
```

La razón por la que únicamente los objetos literales son controlados de esta manera es porque se considera que en estos casos las propiedades adicionales *que no son usadas* son casi siempre un error de tipeo o un error de comprensión de la API.

### Permitir propiedades extra

Un tipo puede incluír una firma del índice para indicar explícitamente que las propiedades extra están permitidas:

```ts
var x: { foo: number, [x: string]: any };
x = { foo: 1, baz: 2 };  // Ok, `baz` matched by index signature
```

### Caso de uso: Estado (State) en React

[ReactJS de Facebook](https://facebook.github.io/react/) ofrece un caso interesante en lo que respecta la frescura de los objetos. Comúnmente, en un componente, llamamos a `setState` con solo algunas de propiedades y no con todas:

```ts
// Assuming
interface State {
  foo: string;
  bar: string;
}

// Quieren hacer esto: 
this.setState({foo: "Hello"}); // Error: missing property bar

// Pero como el state contiene tanto a `foo` como `bar`, TypeScript los obligaría a hacer:
this.setState({foo: "Hello", bar: this.state.bar}};
```

Usando la idea de frescura, podrían marcar todos los miembros como opcionales, e *igual atraparían errores de tipeo*!:

```ts
// Asumiendo
interface State {
  foo?: string;
  bar?: string;
}

// Quieren hacer esto: 
this.setState({foo: "Hello"}); // Yay works fine!

// Debido a la frescura están protegido contra errores de tipeo!
this.setState({foos: "Hello"}}; // Error: Objects may only specify known properties

// Y continuan recibiendo controles de tipos
this.setState({foo: 123}}; // Error: Cannot assign number to a string
```
