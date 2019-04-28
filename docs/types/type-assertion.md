## Aserción de tipo
Typescript permite anular su visión de tipos inferidos y analizados como ustedes deseen. Esto se logra mediante un mecanismo llamado "aserción de tipos". La aserción de tipos de TypeScript consiste puramente en ustedes diciendole al compialdor que saben mejor que él qué tipos son, y que no debería cuestionarlos.

Un caso de uso común para la aserción de tipos es cuando estan migrando código de JavaScript a TypeScript. Por ejemplo, consideren el siguiente patrón:

```ts
var foo = {};
foo.bar = 123; // Error: la propiedad 'bar' no existe en `{}`
foo.bas = 'hello'; // Error: la propiedad 'bas' no existe en `{}`
```

Aquí hay erroes de código porque el tipo *inferido* de `foo` es `{}`, es decir, un objeto con cero propiedades. Por lo tanto, no está permitido agregarle `bar` o `bas`. Pueden arreglar esto simplemente usando la aserción de tipo `as Foo`:

```ts
interface Foo {
    bar: number;
    bas: string;
}
var foo = {} as Foo;
foo.bar = 123;
foo.bas = 'hello';
```

### `as foo` vs. `<foo>`
Originalmente, la sintaxis que se agregaba era `<foo>`. Esto es demostrado a continuación:

```ts
var foo: any;
var bar = <string> foo; // bar ahora tiene tipo "string"
```

Sin embargo hay una ambiguedad en la gramática del lenguaje cuando se usa aserciones de estilo `<foo>` en JSX:

```ts
var foo = <string>bar;
</string>
```

Por lo tanto, se recomienda que usen `as foo` por cuestiones de consistencia.

### Aserción de tipo vs casting
La razón por la cual no es llamado "casting de tipos" es que *casting* generalmente implica algun tipo de soporte en tiempo de ejecución. Sin embargo, las *aserciones de tipo* son una construcción pura de tiempo de compilación y una manera para que ustedes le den pistas al compilador sobre como quieren que analice su código.

### La aserción como algo dañino
En mucho casos, las aserciones les permitirán migrar código heredado fácilmente (e incluso copiar y pegar otras muestras de códigos a su base). Sin embargo, deben tener cuidad con el uso de aserciones. Tomen nuestro código orignal como un ejemplo, el compilador no los protegerá de olvidarse de *realmente agregar las propiedades que prometieron*:

```ts
interface Foo {
    bar: number;
    bas: string;
}
var foo = {} as Foo;
// ahhhh .... olvidaron algo?
```

Otra idea común es usar una aserción como una maner ade proveer *autocompleción*:

```ts
interface Foo {
    bar: number;
    bas: string;
}
var foo = <Foo>{
    // el compilador proveera autocompleción para las propiedades de Foo
    // Pero es fácil que el desarrollador se olvide de agregar todas las propiedades
    // Además, es probable que este código se rompa si Foo es refactorizado (e.g. si agregamos una nueva propiedad)
};
```

pero el peligro aquí es el mismo, ya que si olvidan una propiedad el compilador no se quejará. Es mejor si hacen lo siguiente:

```ts
interface Foo {
    bar: number;
    bas: string;
}
var foo:Foo = {
    // El compialdor ofrecerá opciones de autocompleción para Foo
};
```

En algunos casos tal vez necesiten crear una variable temporal, pero al mnos no estarán haciendo promesas (posiblemente falsas) y recayendo en la inferencia de tipos para que haga el control de tipos por ustedes.

### Aserción doble
La aserción de tipos, a pesar de ser ligerametne insegura como hemos mostrado, no es completamente mala. Por ejemplo, el siguiente es un caso de uso muy válido (el usuario piensa que el evento que será pasado será un caso más específico de un evento) y la aserción de tipo funciona como esperamos:

```ts
function handler (event: Event) {
    let mouseEvent = event as MouseEvent;
}
```

Sin embargo, lo sigueitne probablemente sea un error y TypeScript se quejará, a pesar de la aserción de tipo del usuario:

```ts
function handler(event: Event) {
    let element = event as HTMLElement; // Error: 'Event' y 'HTMLElement' no son asignables mutuamente.
}
```

Si *aún quieren ese tipo, pueden usar una doble aserción*, primer afirmando a `any`, lo que es compatible con todos los tipos y, por lo tanto, el compilador ya no se quejará:

```ts
function handler(event: Event) {
    let element = event as any as HTMLElement; // Ok!
}
```

#### Cómo determina TypeScript si una aserción simple no es suficiente
Básicamente, la aserción de tipo `S` a `T` triunfa si `S` es un subtipo de `T` o si `T` es un subtipo de `S`. Esto es para proveer extra seguridad al hacer aserciones de tipo... aserciones completamente aleatorias pueden ser realmente inseguras y necesitarán usar `any` para que sea aceptado.
