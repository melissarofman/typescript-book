## readonly
El sistema de tipos de TypeScript les permite marcar propiedades individuales de una interface como `readonly`. Esto les permitirá trabajar funcionalmente (mutaciones inesperadas son malas):

```ts
function foo(config: {
    readonly bar: number,
    readonly bas: number
}) {
    // ..
}

let config = { bar: 123, bas: 123 };
foo(config);
// Pueden estar seguros que `config` no es cambiada 🌹
```

Por supuesto que pueden usar `readonly` tanto en interfaces como en definiciones de tipo. Por ejemplo:

```ts
type Foo = {
    readonly bar: number;
    readonly bas: number;
}

// La inicialización está bien
let foo: Foo = { bar: 123, bas: 456 };

// La mutación no
foo.bar = 456; // Error: Left-hand side of assignment expression cannot be a constant or a read-only property
```

También pueden declarar propiedades de clases como `readonly`. Pueden inicializarlas en la declaración on en el constructor, como mostramos a continuación:

```ts
class Foo {
    readonly bar = 1; // OK
    readonly baz: string;
    constructor() {
        this.baz = "hello"; // OK
    }
}
```

## Readonly
Existe un tipo `Readonly` que acepta un tipo `T` y marca todas sus propiedades como `readonly` usando tipos mapeados. A continuación lo ponemos en práctica:

```ts
type Foo = {
  bar: number;
  bas: number;
}

type FooReadonly = Readonly<Foo>; 

let foo:Foo = {bar: 123, bas: 456};
let fooReadonly:FooReadonly = {bar: 123, bas: 456};

foo.bar = 456; // Okay
fooReadonly.bar = 456; // ERROR: bar is readonly
```

### Varios casos de uso

#### ReactJS
Una librería que ama la inmutabilidad es ReactJs. Una posibilidad es marcar sus `Props` y `State` para que sean inmutables. Por ejemplo:

```ts
interface Props {
    readonly foo: number;
}
interface State {
    readonly bar: number;
}
export class Something extends React.Component<Props,State> {
  someMethod() {
    // Pueden quedarse tranquilos que nadie hará
    this.props.foo = 123; // ERROR: (las props son inmutables)
    this.state.baz = 456; // ERROR: (debemos usar this.setState)  
  }
}
```

No ncesitan hacerlo, sin embargo, ya que las definiciones de tipo de React ya las marcan como `readonly` (envolviendo internamente el tipo genérico con el tipo `Readonly` que mencionamos previamente).

```ts
export class Something extends React.Component<{ foo: number }, { baz: number }> {
  // Pueden quedarse tranquilos que nadie hará
  someMethod() {
    this.props.foo = 123; // ERROR: (las props son inmutables)
    this.state.baz = 456; // ERROR: (debemos usar this.setState)  
  }
}
```

#### Inmutabilidad sin fisuras

También pueden marcar las firmas de índices como readonly:

```ts
/**
 * Declaración
 */
interface Foo {
    readonly[x: number]: number;
}

/**
 * Uso
 */
let foo: Foo = { 0: 123, 2: 345 };
console.log(foo[0]);   // Ok (leyendo)
foo[0] = 456;          // Error (mutando): Readonly
```

Esto es genial si quieren hacer uso de los arrays nativos de JavaScript de forma *inmutable*. De hecho, TypeScript incluye una interface `ReadonlyArray<T>` que les permitirá hacer exactamente eso:

```ts
let foo: ReadonlyArray<number> = [1, 2, 3];
console.log(foo[0]);   // Ok
foo.push(4);           // Error: `push` does not exist on ReadonlyArray as it mutates the array
foo = foo.concat([4]); // Ok: crea una copia
```

#### Inferencia automática
En algunos casos, el compiador puede inferir que un ítem en particular es readonly. Por ejemplo, si dentro de una clase declaran una propiedad que tiene un getter pero no un setter, TypeScript asume que es readonly:

```ts
class Person {
    firstName: string = "John";
    lastName: string = "Doe";
    get fullName() {
        return this.firstName + this.lastName;
    }
}

const person = new Person();
console.log(person.fullName); // John Doe
person.fullName = "Dear Reader"; // Error! fullName is readonly
```

### Diferencia con `const`
`const`
1. es para referenciar variables
2. la variable no puede ser reasignada a nada más

`readonly` es
1. para una propiedad
2. la propiedad puede ser modificada debido a los alias

Ejemplo que explica 1:

```ts
const foo = 123; // referencia a variable
var bar: {
    readonly bar: number; // propiedad
}
```

Ejemplo que explica 2:

```ts
let foo: {
    readonly bar: number;
} = {
        bar: 123
    };

function iMutateFoo(foo: { bar: number }) {
    foo.bar = 456;
}

iMutateFoo(foo); // El argumento foo tiene un alias en el parámetro foo
console.log(foo.bar); // 456!
```

Básicamente, `readonly` se asegura de que una propiedad *no pueda ser modificada por nosotros*, pero si se la pasan a algo que no tiene esa garantía (permitido por razones de compatibilidad de tipos), eso podrá modificarla. Por supuesto que si `iMutateFoo` hubiese declarado que no muta a `foo.bar`, el compilador lo hubiese señalado como un error:

```ts
interface Foo {
    readonly bar: number;
}
let foo: Foo = {
    bar: 123
};

function iTakeFoo(foo: Foo) {
    foo.bar = 456; // Error! bar is readonly
}

iTakeFoo(foo); // El argumento foo tiene un alias en el parámetro foo
```
