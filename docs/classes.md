### Clases
Es importante tener clases en JavaScript como un ítem de primera clase ya que: 
1. [Ofrecen un nivel de abstracción estructural útil](./tips/classesAreUseful.md)
2. Proveen una forma consistente para que desarrolladores utilicen clases en lugar de que cada framework (emberjs, reactjs, etc) inventen su propia versión
3. Desarolladores orientados a objetos ya entienden como utilizarlas

Finalmente, desarrolladores JavaScript pueden *tener `class`*. Aquí tenemos una clase básica lladada Point:

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    add(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
    }
}

var p1 = new Point(0, 10);
var p2 = new Point(10, 20);
var p3 = p1.add(p2); // {x:10,y:30}
```
Esta clase genera el siguiente JavaScript al ser emitida a ES5:
```ts
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (point) {
        return new Point(this.x + point.x, this.y + point.y);
    };
    return Point;
})();
```
Un patrón de clase tradicional y bastante idiomático de JavaScript ahora existe como un constructor de primera clase.

### Herencia
Las clases en TypeScript (como en otros lenguajes) soportan herencia *singular* utilizando la palabra clave `extends` como se ve a continuación:  

```ts
class Point3D extends Point {
    z: number;
    constructor(x: number, y: number, z: number) {
        super(x, y);
        this.z = z;
    }
    add(point: Point3D) {
        var point2D = super.add(point);
        return new Point3D(point2D.x, point2D.y, this.z + point.z);
    }
}
```
Si tienes un constructor en tu clase entonces *debes* llamar al contructor del constructor del padre (TypeScript te lo señalará). Esto asegur que las cosas que tienen que ser montadas en `this` son montadas. A continuación de la llamada a `super` puedes agregar cosas adicionales que quieras hacer en tu constructor (aquí agregamos un miembro `z`).

Nota que puedes anular las funciones del padre fácilmente (aquí anulamos `add`) y todavía utilizamos la funcionalidad de de la clase super en tus miembros (utilizando la sintaxis `super`)

### Estadísticas
las clases de TypeScript soportan propiedades `static` (estáticas) que son comppartidas por todas las instancias de la clase. Un lugar natural para ponerlas (y acceder a ellas) en es la clase misma, y eso es lo que TypeScript hace:

```ts
class Something {
    static instances = 0;
    constructor() {
        Something.instances++;
    }
}

var s1 = new Something();
var s2 = new Something();
console.log(Something.instances); // 2
```
Puedes tener tanto miembros como funciones estáticas

### Modificadores de acceso
TypeScript soporta los modificadores de acceso `public` (público), `private` (privado) y `protected` (protegido) los que determiann la accesibilidad de un miembro de una `class`:

| accessible on   | `public` | `protected` | `private` |
|-----------------|----------|-------------|-----------|
| clase           | si       | si          | si        |
| clase hija      | si       | si          | no        |
| clase instancia | si       | no          | no        |


Si un modificador de acceso no se encuentra especificado, es `public` implícitamente, ya que eso coincide con la naturaleza *conveniente* de Javascript 🌹.

Notemos que durante el tiempo de ejecución (en el JS generado) estos no tendrán significado, pero te darán errores de compilación si los utilizas incorrectamente. Mostramos un ejemplo de cada uno a continuación:

```ts
class FooBase {
    public x: number;
    private y: number;
    protected z: number;
}

// EFFECT ON INSTANCES
var foo = new FooBase();
foo.x; // okay
foo.y; // ERROR : private
foo.z; // ERROR : protected

// EFFECT ON CHILD CLASSES
class FooChild extends FooBase {
    constructor() {
      super();
        this.x; // okay
        this.y; // ERROR: private
        this.z; // okay
    }
}
```

Como siempre, estos modificadores funcionan para tanto propiedades como funciones de la clase.

### Abstract
Se puede considerar a `abstract` como un modificador de acceso. Lo presentamos en forma separada porque a diferencia de los modificadores mencionados previamente, puede encontrarse tanto en una clase como en cualquier miembro de la clase. Tener un modificador `abstract` significa que la funcionalidad *no puede ser invocada directamente* y una clase hija debe proveer la funcionalidad.

* **clases** `abstract` no pueden ser instanciadas directamente. En su lugar, el usuario debe crear una clase que hereda de la `abstract class`.
* **miembros** `abstract` no pueden ser accedidos directamente y una clase hija debe proveer la funcionalidad.

### El constructor es opcional

La clase no necesita tener un constructor. El siguiente ejemplo esta perfectamente bien:

```ts
class Foo {}
var foo = new Foo();
```

### Definir utilizando un constructor

Tener un miembro en una clase e inicializandolo de la siguiente manera: 

```ts
class Foo {
    x: number;
    constructor(x:number) {
        this.x = x;
    }
}
```
es un patrón tan común que TypeScript provee un atajo con el que podés prefijar el miembro con un *modificador de acceso* y es declarado automáticamente en la clase y copiado desde el constructor. Asi que el ejemplo anterior puede ser reescrito de la siguiente manera: (notá `public x:number`):

```ts
class Foo {
    constructor(public x:number) {
    }
}
```

### Inicializador de propiedades
Esta es una caracterísitica elegante soportada por TypeScript (pertenece a ES7, en realidad). Puedes inicializar cualquier mimebro de una clase por fuera del constructor, lo cual es útil para proveer valores default (nota `members = []`)

```ts
class Foo {
    members = [];  // Initialize directly
    add(x) {
        this.members.push(x);
    }
}
```
