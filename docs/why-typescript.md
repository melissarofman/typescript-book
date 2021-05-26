# Por qué TypeScript
Hay dos objetivos principales de TypeScript: 
* Proveer un *sistema tipado opcional* para Javascript
* Proveer características de futuras ediciones de Javascript a motores actuales de Javascript


El por qué de estos objetivos se explica a continuación

## El sistema tipado de typescript

Puedes estar preguntandote "**Por qué agregar tipos a Javascript?**"

Los tipos han probado su habilidad para mejorar la calidad y comprensibilidad del código. Equipos grandes (Google, Microsoft, Facebook) han alcanzado esta conclusión multiples veces. Específicamente:

* Los tipos mejoran la velocidad cuando hay que refactorizar. *Es mejor que el compilador atrape los errores a que fallen cosas en tiempo de ejecución*
* Los tipos son una de las mejores formas de documentación que se puede tener. *La firma de una función es un teorema y el cuerpo de la función es la prueba*

Sin embargo, los tipos tienen una característica de ser innecesariamente ceremoniales. TypeScript es muy particular en cuanto a mantener la barrera de entrada lo más baja posible. Así es como lo hace:

### Javascript es Typescript
TypeScript provee seguridad al momento de compilar para tu codigo JavaScript. Esto no es gran sorpresa dado su nombre. La ventaja es que los tipos son completamente opcionales. Tu código JavaScript en archivos `.js` pueden ser renombrados a `.ts` y Typescript igual devolverá un archivo `.js` válido y equivalente al archivo `.js` original. Typescript es *intencionalmente* y estrictamente un superconjunto de Javascript con chequeo de tipado opcional. 

### Los tipos pueden ser implicitos
TypeScript intentará inferir la máxima información posible sobre el tipo, para brindar seguirdad de tipo con un costo mínimo de productividad durante el desarrollo de código. Por ejemplo, en el siguiente ejemplo TypeScript sabrá que `foo` es de tipo `numero` y devolverá un error en la segunda línea (error en inglés: traducido al español): 

```ts
var foo = 123;
foo = '456'; // Error: cannot assign `string` to `number` (Error: no es posible asignar `string``a `numero`)

// Is foo a number or a string? (Es foo un número o una string?)
```

Esta inferencia del tipo está bien motivada. Si haces cosas como las que se ven en este ejemplo, entonces en el resto de tu código es imposible estar seguro sobre que `foo` es un `numero` o una `string`. Problemas de este tipo ocurren habitualmente en bases de código grandes y con múltiples archivos. Ahondaremos en las reglas sobre la inferencia de tipos más adelante.

### Los tipos pueden ser explícitos
Como hemos mencionado previamente, TypeScript inferirá lo máximo que pueda en forma segura. Sin embargo, puedes usar anotaciones para: 
1. Ayudar al compilador, y más importante, documentar cosas para el siguente desarrollador que deba leer tu código (podría ser el futuro vos!)
2. Imponer que lo que el compilador ve es lo que vos pensaste que debería ver. Es decir, tu entendimiento del código coincide con un análisis algorítmico del código (hecho por el compilador)

Typescript utiliza anotaciones de tipo postfix populares en otros lenguajes *opcionalmente* anotados (ejemplo, ActionScript y F#)

```ts
var foo: number = 123;
```
Si haces algo erróneo el compliador tirará un error:

```ts
var foo: number = '123'; // Error: cannot assign a `string` to a `number` (Error: no puedes asignar una `string` a un `numero`)
```

Discutiremos los detalles sobre qué anotaciones son soportadas por TypeScript en otro capítulo.

## Los tipos son estructurales
En algunos lenguages (específicamente de tipado nominal) el tipado estático resulta en complejidad innecesaria porque, que *vos sabés* que el código funcionará bien, la semántica del lenguaje te fuerza a copiar y duplicar cosas. Por eso, cosas como el [automapper de C#](http://automapper.org/) son *esenciales* para C#. En TypeScript, como queremos que sea sencillo de adoptar para desarrolladores Javascript, los tipos son *estructurales*. Esto significa que *duck typing* es una construcción del lenguage de primera clase. Considera el siguiente ejemplo. la funcion `yoAceptoPuntos2D` aceptará cualquier cosa que contenga todas las cosas (`x` e `y`) que espera: 

```ts
interface Punto2D {
    x: number;
    y: number;
}
interface Punto3D {
    x: number;
    y: number;
    z: number;
}
var punto2D: Punto2D = { x: 0, y: 10 }
var punto3D: Punto3D = { x: 0, y: 10, z: 20 }
function yoAceptoPuntos2D(punto: Punto2D) { /* hacé algo */ }

yoAceptoPuntos2D(punto2D); // coincidencia exacta okay
yoAceptoPuntos2D(punto3D); // información extra okay
yoAceptoPuntos2D({ x: 0 }); // Error: falta la información `y`
```

### Errores de tipo no previenen que JavaScript emita
Para facilitar la migración de Javascript a Typescript, aunque hayan errores de compilación, por default Typescript emitirá *Javascript válido* de la mejor manera posible. Por ejemplo: 

```ts
var foo = 123;
foo = '456'; // Error: cannot assign a `string` to a `number` (Error: no es posible asignar `string` a `numero`)
```

emitirá el siguiente js:

```ts
var foo = 123;
foo = '456';
```

Así que podrás migrar tu Javascript a Typescript de manera incremental. Esto es muy diferente de como muchos otros copiladores de lenguajes funcionan y otra razón para cambiar a TypeScript.

### Los tipos pueden ser ambientes
Uno de los principales objetivos en el diseño de TypeScript fue permitirte utilizar librerias existentes de JavaScript en TypeScript. TypeScript permite esto a través de la *declaración*. TypeScript te provee con una escala móvil respecto de cuánto esfuerzo quieres poner en tus declaraciones. A mayor esfuerzo, más seguridad + inteligencia en el código que obtenés. Notá que las definiciones para las librerias más populares ya han sido escritas para ti por la [comunidad DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped). Por lo tanto, para la mayoría de los casos: 

1. El archivo con definiciones ya existe, o
2. por lo menos, hay una larga lista de modelos de declaraciones de TypeScript ya revisadas

A modo de ejemplo sobre como podrías escribir tu propio archivo de declaraciones, considerá un ejemplo trivial de [jquery](https://jquery.com/). Por default (como es de esperar en buen código JS) TypeScript espera que declares (es decir, utilices `var` en algún lugar), antes de utilizar una variable.

```ts
$('.genial').show(); // Error: cannot find name `$` (Error: no es posible encontrar el nombre `$`)
```
A modo de solución, *le puedes indicar a TypeScript* que existe algo llamado `$`: 
```ts
declare var $: any;
$('.genial').show(); // Ok!
```
Si quieres puedes construir sobre esta definición básica y proveer más información para ayudar a protegerte de errores: 
```ts
declare var $: {
    (selector:string): any;
};
$('.genial').show(); // Ok!
$(123).show(); // Error: selector needs to be a string (Error: el selector tiene que ser una string)
```

Discutiremos los detalles sobre create definiciones de Typescript para JavaScript ya existente en mayor detalle una vez que sepas mas sobre TypeScript. (por ejemplo, sobre cosas como `interfaces` y el tipo `any`).

## Javascript Futuro => Ahora
TypeScript provee un número de caracterísiticas ya están planeadas en ES6 para motores actuales de Javascript (que solo soportan ES5, etc). El equipo de TypeScript agrega estas características contantemente y esta lista solo va a crecer a lo largo del tiempo. Cubriremos esta temática en su propia sección. Pero, a modo de vistazo, aquí hay un ejemplo de una clase: 

```ts
class Point {
    constructor(public x: number, public y: number) {
    }
    add(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
    }
}

var p1 = new Point(0, 10);
var p2 = new Point(10, 20);
var p3 = p1.add(p2); // { x: 10, y: 30 }
```

y la adorable función de flecha gorda:

```ts
var inc = x => x+1;
```

### Resumen
En esta sección hemos cubierto el por qué de TypeScript y los objetivos de su diseño. Ahora podremos adentrarnos en los detalles esenciales de Typescript.

[](Interfaces are open ended)
[](Type Inferernce rules)
[](Cover all the annotations)
[](Cover all ambients : also that there are no runtime enforcement)
[](.ts vs. .d.ts)
