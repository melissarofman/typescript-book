#### Que pasa con la IIFE
El JS generado para la clase podría haber sido:
```ts
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.add = function (point) {
    return new Point(this.x + point.x, this.y + point.y);
};
```
La razón por la cual está envuelto en una Función Invocada Inmediatamente (IIFE), como la siguiente

```ts
(function () {

    // BODY

    return Point;
})();
```

tiene que ver con el concepto de herencia. Le permite a JavaScript capturar la clase base como una variable `_super`. Por ejemplo

```ts
var Point3D = (function (_super) {
    __extends(Point3D, _super);
    function Point3D(x, y, z) {
        _super.call(this, x, y);
        this.z = z;
    }
    Point3D.prototype.add = function (point) {
        var point2D = _super.prototype.add.call(this, point);
        return new Point3D(point2D.x, point2D.y, this.z + point.z);
    };
    return Point3D;
})(Point);
```
Nota como la IIFE le permite a TypeScript capturar fácilmente la clase base `Point` en una variable `_super` y 
Notice that the IIFE allows TypeScript to easily capture the base class `Point` in a `_super` variable and that is used consistently in the class body.

### `__extends`
Notarás que apenas heredás una clase TypeScript también genera la siguiente función:

```ts
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
```
Aquí `d` hace referencia a la clase derivada y `b` hace referencia a la clase base. Esta función hace dos cosas:
1. Copia los miembros estáticos de la clase base a la clase hija, por ejemplo: `for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];`
2. prepara al prototipo de la clase hija  para buscar, opcionalmente, a los miembros del `proto` del padre. Es decir, `d.prototype.__proto__ = b.prototype`

La gente raramente tiene problemas entendiendo 1, pero mucha gente tiene dificultades con 2. Así que corresponde brindar una explicación.

#### `d.prototype.__proto__ = b.prototype`

Luego de haber enseñado este tema a mucha gente, encuentro que esta explicación es la más simple. Primero explicaremos como el código de `__extends` es equivalente a `d.prototype.__proto__ = b.prototype`, y luego por qué esta línea en si misma es importante. Para entender todo esto debes saber lo siguiente: 

1. `__proto__`
1. `prototype`
1. el efecto de `new` sobre `this` en la función llamda
1. el efecto de `new` en `prototype` y `__proto__`

Todos los objetos en JavaScript contienen un miembro `__proto__`. Este miembro suele no ser accesible en navegadores viejos (a veces la documentación se refiere a esta propiedad mágica como `[[prototype]]`). Tiene un objetivo: si la propiedad no se encuentra en un objeto durante la búsqueda (ejemplo, `obj.property`) entonce es buscada en `obj.__proto__.property`. Si tampoco es encontrada entonces es buscada en `obj.__proto__.__proto__.property` hasta que o *es encontrada* o *el últmo `__proto__` es nulo*. Esto explica por qué se dice que JavaScript soporta *herencia prototípica*. Esto se puede observar ne el siguiente ejemplo, que puedes correr en la consola de Chrome o en Node.js:

```ts
var foo = {}

// setup en foo y en foo.__proto__
foo.bar = 123;
foo.__proto__.bar = 456;

console.log(foo.bar); // 123
delete foo.bar; // eliminar del objeto
console.log(foo.bar); // 456
delete foo.__proto__.bar; // eliminar de foo.__proto__
console.log(foo.bar); // undefined
```

Así que ahora entendés `__proto__`. Otro dato útil es que todas las `funciones` en JavaScript tienen una propiedad llamada `prototype` y que esta tiene un miembro `constructor` que apunta de vuelta a la función. Eso se muestra a continuación:

```ts
function Foo() { }
console.log(Foo.prototype); // {}, es decir, existe y no es undefined
console.log(Foo.prototype.constructor === Foo); // Tiene un miembro `constructor`que apunta de vuelta a la función
```

Ahora consideremos el *efecto de `new` sobre `this` dentro de la función llamada*. Basicamente, `this` en la función llamda apuntará al nuevo objeto que será devuelto de la función. Es simple de observar si mutas una propiedad en `this` dentro de la función:

```ts
function Foo() {
    this.bar = 123;
}

// llamar con el nuevo operador
var newFoo = new Foo();
console.log(newFoo.bar); // 123
```

La únicao tra cosa que debes saber ahora es que llamar `new` en una función asigna al `prototype` de la función a el `__proto__` del nuevo objeto que es devuelto de la llamada de la función. Aquí está el código que tienes que correr para  entenderlo completamente:

```ts
function Foo() { }

var foo = new Foo();

console.log(foo.__proto__ === Foo.prototype); // Verdadero!
```

Eso es todo. Ahora mirá lo siguiente, sacado de `__extends~. Me tomé la libertad de numerar estas líneas:

```ts
1  function __() { this.constructor = d; }
2   __.prototype = b.prototype;
3   d.prototype = new __();
```

Leyendo esta función en el orden inverso, el `d.prototype = new __()` en la tercera línea significa `d.prototype = {__proto__: __.prototype}` (debido al efecto de `new` en `prototype` y `__proto__`), y al combinarlo con la línea anterior (línea 2 `__.prototype = b.prototype`) queda `d.prototype = {__proto__ : b.prototype}`.

Pero esperen, queríamos `d.prototype.__proto__`, es decir que solo el proto cambió y mantener el `d.prototype.constructor` anterior. En este punto cobra importancia la primera línea (`funcion __() { this.constructor = d; }).` En este punto tendremos `d.prototype = {__proto__ : __.prototype, constructor : d}` (debido al efecto de `new` sobre `this` dentro de la función llamada). Entonces, dado que restablecemos `d.prototype.constructor`, lo único que hemos mutado realmente es el `__proto__`, y por lo tanto, `d.prototype.__proto__ = b.prototype`.

#### significado de `d.prototype.__proto__ = b.prototype`

El significado es que te permite agregar funciones miembros a una clase hija y heredar otros de la clase base. Esto está demostrado en el siguiente ejemplo:

```ts
function Animal() { }
Animal.prototype.walk = function () { console.log('walk') };

function Bird() { }
Bird.prototype.__proto__ = Animal.prototype;
Bird.prototype.fly = function () { console.log('fly') };

var bird = new Bird();
bird.walk();
bird.fly();
```
Basicamente `bird.fly` será buscada de `bird.__proto__.fly` (acuerdate que `new` hace que `bird.__proto__` apunte a `Bird.prototype`) y `bird.wald` (un miembro heredado) será buscado de `bird.__proto__.__proto__.walk` (como `bird.__proto__ == Bird.prototype` y `bird.__proto__.__proto__` == `Animal.prototype`).
