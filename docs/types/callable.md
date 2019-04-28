## Llamables
Pueden anotar llamables como parte de un tipo o de una interface de la siguiente manera:

```ts
interface ReturnString {
  (): string
}
```
Una instnacia de esta interface sería una función que devuelve una string, por ejemplo:

```ts
declare const foo: ReturnString;
const bar = foo(); // bar se infirere como string
```

### Ejemplos obvios
Por supuesto que una anotación a una *llamable* también puede especificar cualquier argumento / argumento opcional / resto de argumentos como sea necesario. Por ejemplo, aquí hay un caso más complejo:

```ts
interface Complex {
  (foo: string, bar?: number, ...others: boolean[]): number;
}
```

Una interface puede proveer muchas anotaciones a llamables para especificar la sobrecarga de funciones. Por ejemplo: 

```ts
interface Overloaded {
    (foo: string): string
    (foo: number): number
}

// implementación del ejemplo
function stringOrNumber(foo: number): number;
function stringOrNumber(foo: string): string;
function stringOrNumber(foo: any): any {
    if (typeof foo === 'number') {
        return foo * foo;
    } else if (typeof foo === 'string') {
        return `hello ${foo}`;
    }
}

const overloaded: Overloaded = stringOrNumber;

// uso del ejemplo
const str = overloaded(''); // el tipo de `str` se infiere como `string`.
const num = overloaded(123); // el tipo de `num` se infiere como `num`
```

Claro, como el cuerpo de *cualquier* interface, pueden usar el cuerpo de una interface llamable como un tipo de anotación para una variable. Por ejemplo:

```ts
const overloaded: {
  (foo: string): string
  (foo: number): number
} = (foo: any) => foo;
```

### Sintaxis de flecha
Para simplificar la declaración de firmas de llamables, TypeScript también permite la anotación de flecha. Por ejemplo, una función que acepta un `number` y devuelve una `string` puede ser anotada como:

```ts
const simple: (foo: number) => string
    = (foo) => foo.toString();
```

> La única limitación de la sintaxis de flecha: no pueden especificar sobrecargas. Para sobrecargas deben utiliar la sintaxis de cuerpo completo `{ (someArgs): someReturn }`.

### Newable

*Newable* es un tipo especial de anotación de tipo de *llamables* con el prefijo `new`. Simplemente significa que deberan *invocarla* con `new`:

```ts
interface CallMeWithNewToGetString {
  new(): string
}
// Uso
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar es inferida del tipo string
```
