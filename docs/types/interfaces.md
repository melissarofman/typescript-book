## Interfaces

Las interfaces tienen *cero* impacto en el tiempo de ejecución de JavaScript. Hay mucho poder para declarar la estructura de variables en las interfaces de TypeScript.

Los siguientes dos ejemplos son declaraciones equivalentes. La primera utiliza *anotaciones en línea* y la segunda *interfaces*:

```ts
// Ejemplo A
declare var myPoint: { x: number; y: number; };

// Ejemplo B
interface Point {
    x: number; y: number;
}
declare var myPoint: Point;
```

Sin embargo, la belleza del *Ejemplo B* es que si alguien escribe una librería que se basa en `myPoint` para agregar nuevos miembros, pueden agregar a la declaración de `myPoint` existente fácilmente:

```ts
// Lib a.d.ts
interface Point {
    x: number; y: number;
}
declare var myPoint: Point;

// Lib b.d.ts
interface Point {
    z: number;
}

// Nuestro código
var myPoint.z; // Permitido!
```

Esto se debe a que las **interfaces en TypeScript son abiertas**. Este es un principio vital de TypeScript que le permite imitar la extensibilidad de JavaScript utilizando *interfaces*.


## Las clases pueden implementar interfaces

Si quieren usar *clases* que deban seguir una estructura de objeto que alguien haya declarado para ustedes en una interface, pueden hacerlo usando la palabra clave `implements` para asegurar compatibilidad:

```ts
interface Point {
    x: number; y: number;
}

class MyPoint implements Point {
    x: number; y: number; // Igual a Point
}
```

Básicamente, en presencia de ese ìmplements  cualquier cambio en la interface externa `Point` resultará en un error de compilación en tu cóidgo base, lo que permitirá mantenerlo sincronizado. 

```ts
interface Point {
    x: number; y: number;
    z: number; // Miembro nuevo
}

class MyPoint implements Point { // ERROR : Falta el miembro `z`
    x: number; y: number;
}
```

Notemos que `implement` restringe la estructura de las *instancias* de clase. Ejemplo:

```ts
var foo: Point = new MyPoint();
```

Y cosas como `foo: Point = MyPoint` no son lo mismo.


## TIPs

### No todas las interfaces se implemnetan fácilmente

Las interfaces son diseñadas para declarar cualquier estructura *arbitrariamente loca* que pueda encontrarse presente en JavaScript. 

Consideremos la siguiente interface donde algo es llamable con `new`:

```ts
interface Crazy {
    new (): {
        hello: number
    };
}
```

Esencialmente, tendrían algo similar a:

```ts
class CrazyClass implements Crazy {
    constructor() {
        return { hello: 123 };
    }
}
// Ya que
const crazy = new CrazyClass(); // crazy sería {hello:123}
```

Pueden *declarar* todas las locuras de JS que exiten con interfaces y utilizarlas con seguridad desde TypeScript. Esto no significa que puedan usar clases de TypeScript para implementarlas.
