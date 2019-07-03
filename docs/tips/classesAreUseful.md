## Las clases son útiles

Es muy común tener la siguiente estructura:

```ts
function foo() {
    let someProperty;

    // Más código de inicialización

    function someMethod() {
        // hace algo con `someProperty`
        // Y potencialmente otras cosas
    }
    // Tal vez otros métodos

    return {
        someMethod,
        // Tal vez otros métodos
    };
}
```
Este patrón se llama *patrón de revelación de módulos* y es bastante común en JavaScript (aprovecha los cierres de JavaScript).

Si usan [*módulos en archivos* (lo que deberían hacer ya que el ámbito global es malo)](../project/modules.md) entonces *su archivo es el mismo*. Sin embargo, hay muchos casos en los que programadores escribirán código de la siguiente manera:

```ts
let someProperty;

function foo() {
   // Código de inicialización
}
foo(); // Código de inicialización

someProperty = 123; // Algo más de inicialización

// Una función de utilidad no exportada

// luego
export function someMethod() {

}
```

A pesar de que no somos grandes fans de la herencia *encuentramos que dejar que la gente use clases los ayuda a organizar su código mejor*. El mismo desarrollador hubiese escrito lo siguiente intuitivamente:

```ts
class Foo {
    public someProperty;

    constructor() {
        // Código de inicialización
    }

    public someMethod() {
        // algo de código
    }

    private someUtility() {
                // algo de código
    }
}

export = new Foo();
```

Y no son solo desarrolladores, las herramientas de desarrollo que proveen buenas visualizaciones de clases son mucho mas comunes, y hay un patrón menos que su equipo deberá entender y mantener.

> P.D.: No hay anda de malo, en nuestra opinión, con jerarquías *superficiales* de clases si posibilitan su reutilización y reducen la repetición.
