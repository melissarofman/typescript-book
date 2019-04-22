## Espacios de declaración

Hay dos tipos de espacios de declaración en TypeScript: el espacio de declaración de *variables* y el espacio de declaración de *tipo*. Estos conceptos son explorados en detalle a continuación.

### Espacio de declaración de Tipo
El espacio de declaración de tipos contiene cosas que pueden ser usadas como anotación de tipos. Por ejemplo, las siguientes son algunas declaraciones de tipos:

```ts
class Foo {};
interface Bar {};
type Bas = {};
```
Esto significa que peudes usar `Foo`, `Bar`, `Bas`, etc como anotaciones de tipo: 

```ts
var foo: Foo;
var bar: Bar;
var bas: Bas;
```

Notemos que aunque tienes la `interface Bar`, *no la puedes usar como una variable* porque no contribuye al *espacio de declaración de variables*. Mostramos esto a continuación: 

```ts
interface Bar {};
var bar = Bar; // ERROR: "cannot find name 'Bar'"
```

La razón por la que dice `cannot find name` ("no es posible enconrar el nombre") es porque el nombre `Bar` *no está definido* en el espacio de declaración de *variables*. Esto nos trae al siguiente tema: "Espacio de declaración de variables"

### Espacio de declaración de variables
El espacio de declaración de variables contiene cosas que puedes usar como variables. Vimos que tener `class Foo` contribuye un tipo `Foo` al espacio de declaración de *tipos*. Adivina qué? También contribuye una *variable* `Foo` al espacio de declaración de *variables*, como mostramos a continuación: 

```ts
class Foo {};
var someVar = Foo;
var someOtherVar = 123;
```
Esto es bárbaro, ya que a veces quieres pasar clases como si fuesen variables. Recuerda que:

* No pudimos usar algo como una `interface` que se encuentra *únicamente* en el espacio de declaración de *tipos* como una variable.

Similarmente, algo que declares con `var`, se encuentra *únicamente* en el espacio de declaración de *variables* y no puede ser usado como anotación de tipo:

```ts
var foo = 123;
var bar: foo; // ERROR: "cannot find name 'foo'"
```
a razón por la que dice `cannot find name` ("no es posible enconrar el nombre") es porque el nombre `foo` *no está definido* en el espacio de declaración de *tipos*.
