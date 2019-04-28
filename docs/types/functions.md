* [Anotación de parámetros](#parameter-annotations)
* [Anotación de tipos de devolución](#return-type-annotation)
* [Parámetros opcionales](#optional-parameters)
* [Sobrecarga](#overloading)

## Functions
El sistema de tipos de TypeScript le da mucho amor a las funciones. Después de todo, son los bloques fundacionales de un sistema componible.

### Anotación de parámetros
Pueden anotar parámetros de la misma forma que pueden anotar otras variables:

```ts
// anotación de variable
var sampleVariable: { bar: number }

// anotación de parámetro de función
function foo(sampleParameter: { bar: number }) { }
```

Aquí utilizamos anotaciones en línea. También pueden usar interfaces, etc.

### Anotación de tipos de devolución

Pueden anotar el tipo de devolución luego de la lista de parámetros de la función con el mismo estilo que usan para las varaibles: `: Foo`, por ejemplo. Miremos el siguiente ejemplo:

```ts
interface Foo {
    foo: string;
}

// Anotación de devolución de tipo Foo
function foo(sample: Foo): Foo {
    return sample;
}
```

En este caso utilizamos una `interface`, pero son libres de usar otros tipos de anotaciones, como las anotaciones en línea.

Comúnmente, no *necesitan* anotar el tipo de devolución de una función ya que, generalemente, puede ser inferido por el compilador.

```ts
interface Foo {
    foo: string;
}

function foo(sample: Foo) {
    return sample; // Tipo de devolución inferido Foo
}
```

Sin embargo, generalmente es una buena idea agregar estas anotaciones para ayudar con errores:

```ts
function foo() {
    return { fou: 'John Doe' }; // Tal vez no encontrarán este error de tipeo de `foo` hasta que sea demasiado tarde
}

sendAsJSON(foo());
```

Si no planean devolver nada de una función, pueden anotarla como `:void`. Generalmente, pueden dejar `:void` de lado y dejar que el motor lo infiera.

### Parámetros opcionales
Pueden marcar un parámetro como opcional:

```ts
function foo(bar: number, bas?: string): void {
    // ..
}

foo(123);
foo(123, 'hello');
```

Alternativamente, pueden proveer un valor default (usando `= someValue`) despues de la declaracón el parámetro, y este será inyectado por ustedes si la llamada a la función no provee ese argumento:

```ts
function foo(bar: number, bas: string = 'hello') {
    console.log(bar, bas);
}

foo(123);           // 123, hello
foo(123, 'world');  // 123, world
```

### Sobrecarga
TypeScript permite que *declaren* sobrecargas de funciones. Esto es útil para documentación y seguridad de tipos. Consideren el sigueinte código:

```ts
function padding(a: number, b?: number, c?: number, d?: any) {
    if (b === undefined && c === undefined && d === undefined) {
        b = c = d = a;
    }
    else if (c === undefined && d === undefined) {
        c = a;
        d = b;
    }
    return {
        top: a,
        right: b,
        bottom: c,
        left: d
    };
}
```

Si miran de cerca al código, notarán que el significado de `a`,`b`,`c`,`d` cambia dependiendo de cuántos argumentos son pasados a la función. A su vez, la función sólo espera `1`, `2`, o `4` arguemtnos. Estas limitaciones pueden ser *impuestas* y *documentadas* usando la sobrecarga de funciones. Simplemente deben declarar la cabeza de la función múltiples veces. La última declaración será la que se encuentra realmente activa *dentro* del cuerpo de la función pero no se encontrará disponible para el mundo exterior.

Mostramos esto a continuación:

```ts
// Sobrecargas
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
// Implementación real que contiene todos los casos que el cuerpo de la función necesita para correr correctamente
function padding(a: number, b?: number, c?: number, d?: number) {
    if (b === undefined && c === undefined && d === undefined) {
        b = c = d = a;
    }
    else if (c === undefined && d === undefined) {
        c = a;
        d = b;
    }
    return {
        top: a,
        right: b,
        bottom: c,
        left: d
    };
}
```

Aquí las primeras tres cabezas de funciones están disponibles como llamadas válidas a `padding`:

```ts
padding(1); // Ok: all
padding(1,1); // Okay: topAndBottom, leftAndRight
padding(1,1,1,1); // Okay: top, right, bottom, left

padding(1,1,1); // Error: No es parte de las sobrecargas disponibles
```

Por supuesto que es importante para la declaracion final (la verdader declaración pensandola desde la perspectiva interna de la función) que sea compatible con todas las sobrecargas. Esto se debe a que el cuerpo de la función debe cubrir la verdadera naturaleza de las llamadas a la función.

> La sobrecarga de funciones en TypeScript no conlleva un aumento de carga sobre el tiempo de ejecución. Simplemente les permitirá documentar la manera en la que esperan que la función sea llamdaa y el compilador mantendrá el resto de su código.

[](### Declaring Functions)
[](With lambda, with interfaces which allow overloading declarations)

[](### Type Compatibility)
