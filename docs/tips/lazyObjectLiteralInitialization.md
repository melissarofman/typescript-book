## Inicialización perezosa de objetos literales

En bases de código JavaScript comúnmente se inicializan los objetos literales de la siguiente manera:

```ts
let foo = {};
foo.bar = 123;
foo.bas = "Hello World";
```

Apenas muevan su códito a TypeScript empezarán a tener errores como los siguientes:

```ts
let foo = {};
foo.bar = 123; // Error: Property 'bar' does not exist on type '{}'
foo.bas = "Hello World"; // Error: Property 'bas' does not exist on type '{}'
```

Esto se debe a que a partir del estado `let foo = {}`, TypeScript *infiere* que el tipo de `foo` (lado izquierdo de la asignación inicializante) es el tipo del lado derecho `{}` (es decir, un objeto sin propiedades). Por lo tanto, tira un error si intentan asignarle a una propiedad que TypeScript no reconoce.

### Solución ideal

La manera *apropiada* de inicializar un objeto en TypeScript es hacerlo en el momento de la asignación:

```ts
let foo = {
    bar: 123,
    bas: "Hello World",
};
```

Esto también es bueno para la revisión de código y para la mantenibilidad de la base.

> Las soluciones rápida y a medio camino mostradas en los patrones de inicialización *perezosos* que describimos a continuación sufren de *un olvido al inicializar una propiedad*.

### Solución rápida

Si tienen una base de código JavaScript grande y estan migrando a TypeScript, la solución ideal puede que no sea viable para su caso. En su lugar, pueden usar (con cuidado) una *aserción de tipo* que haga callar al compilador:

```ts
let foo = {} as any;
foo.bar = 123;
foo.bas = "Hello World";
```

### Punto medio

Claro que usar la aserción `any` puede ser una muy mala decisión ya que elimina el beneficio de la seguridad de tipos que obtienen con TypeScript. La solución de medio camino es crear una interface para asegurar:

* Buena documentación
* Asignaciones seguras

Lo mostramos a continuación:

```ts
interface Foo {
    bar: number
    bas: string
}

let foo = {} as Foo;
foo.bar = 123;
foo.bas = "Hello World";
```

Aquí hay un ejemplo corto que muestra como el hecho de usar esa interface puede llegar a salvarlos:

```ts
interface Foo {
    bar: number
    bas: string
}

let foo = {} as Foo;
foo.bar = 123;
foo.bas = "Hello World";

// más adelante en el código:
foo.bar = 'Hello Stranger'; // Error: You probably misspelled `bas` as `bar`, cannot assign string to number
```
