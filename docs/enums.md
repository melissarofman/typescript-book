* [Enums](#enums)
* [Number Enums y números](#number-enums-and-numbers)
* [Number Enums y strings](#number-enums-and-strings)
* [Cambiar el número asociado con un number enum](#changing-the-number-associated-with-a-number-enum)
* [Enums están abiertos](#enums-are-open-ended)
* [Number Enums como banderas](#number-enums-as-flags)
* [String Enums](#string-enums)
* [Const enums](#const-enums)
* [Enum con funciones estáticas](#enum-with-static-functions)

### Enums
Un enum es una forma de organizar una collección de valores relacionados. Muchos otros lenguajes de programación (C/C#/Java) tienen un tipo de datos `enum` pero JavaScript no. Sin embargo, TypeScript sí. Aquí mostramos un ejemplo de una definición de un enum de TypeScript:

```ts
enum CardSuit {
	Clubs,
	Diamonds,
	Hearts,
	Spades
}

// Ejemplo de uso
var card = CardSuit.Clubs;

// Seguridad
card = "no soy un mimebro de CardSuit"; // Error : string no es asignable al tipo `CardSuit`
```

Estos valores enums son de tipo número (`number`) por los que los llamaremos Number Enum de ahora en adelante.

#### Number Enums y números
Los enums de TypeScript están basados en números. Esto significa que números pueden ser asignados a una instancia del enum, así como cualquier otra cosa que sea compatible con `number`.

```ts
enum Color {
    Red,
    Green,
    Blue
}
var col = Color.Red;
col = 0; // En práctica es lo mismo que Color.Red
```

#### Number Enums y Strings
Antes de que profundicemos más sobre los enums, miremos al JavaScript que generan. Aquí hay un ejemplo en TypeScript:

```ts
enum Tristate {
    False,
    True,
    Unknown
}
```
genera el siguiente JavaScript:

```js
var Tristate;
(function (Tristate) {
    Tristate[Tristate["False"] = 0] = "False";
    Tristate[Tristate["True"] = 1] = "True";
    Tristate[Tristate["Unknown"] = 2] = "Unknown";
})(Tristate || (Tristate = {}));
```

Focalicemos nuestra atención en la línea `Tristate[Tristate["False"] = 0] = "False"`. En ella, `Tristate["False"] = 0` no debería requerir mayores explicaciones: declara que el miembro `"False"` de la variable `Tristate` tiene valor `0`. Notemos que en JavaScript el operador de asignación devuelve el valor asignado, (en este caso, `0`). Por lo tanto, el siguiente paso ejecutado por JavaScript es `Tristate[0] = "False"`. Esto significa que pueden usar la variable `Tristate` para convertir una versión string del enum a un número, o una version númerica del enum a una string. Lo demostramos a continuación:

```ts
enum Tristate {
    False,
    True,
    Unknown
}
console.log(Tristate[0]); // "False"
console.log(Tristate["False"]); // 0
console.log(Tristate[Tristate.False]); // "False" because `Tristate.False == 0`
```

#### Cambiar el número asociado con un Number Enum
Por default, los enums se basan en `0` y aumentan cada valor subsecuente por 1, automáticamente. A modo de ejemplo, consideremos lo siguiente:

```ts
enum Color {
    Red,     // 0
    Green,   // 1
    Blue     // 2
}
```

Sin embargo, pueden cambiar el número asociado con cualquier miembro de un enum realizando una asignación específica. Esto es demostrado a continuación, donde comenzamos con el 3 y incrementamos desde ese punto:

```ts
enum Color {
    DarkRed = 3,  // 3
    DarkGreen,    // 4
    DarkBlue      // 5
}
```

> TIP: Comúnmente iniciamos el primer enum con `= 1` ya que nos permite hacer un chequeo truthy seguro con un valor enum.

#### Number Enums como banderas
Un excelente uso de los enums es utilizarlos como `Banderas`. Las banderas te permiten chequear si una cierta condición de un grupo de condiciones es verdadera. Consideremos el siguiente ejemplo, donde tenemos una lista de propiedades sobre animales:

```ts
enum AnimalFlags {
    None           = 0,
    HasClaws       = 1 << 0,
    CanFly         = 1 << 1,
    EatsFish       = 1 << 2,
    Endangered     = 1 << 3
}
```

Aquí estamos utilizando el operador de desplazamiento a la izquierda para mover `1` alrededor de un cierto nivel de bits para obtener números desunidos a nivel de bits `0001`, `0010`, `0100` y `1000` (estos son los decimales `1`, `2`, `4`, y `8`, en caso de que quisieran saberlo). Los operadores de bits `|` (o) / `&` (y) / `~` (no) son nuestros mejores amigos a la hora de trabajar con banderas, como demostramos a continuación: 

```ts
enum AnimalFlags {
    None           = 0,
    HasClaws       = 1 << 0,
    CanFly         = 1 << 1,
}
type Animal = {
    flags: AnimalFlags
}

function printAnimalAbilities(animal: Animal) {
    var animalFlags = animal.flags;
    if (animalFlags & AnimalFlags.HasClaws) {
        console.log('animal has claws');
    }
    if (animalFlags & AnimalFlags.CanFly) {
        console.log('animal can fly');
    }
    if (animalFlags == AnimalFlags.None) {
        console.log('nothing');
    }
}

let animal: Animal = { flags: AnimalFlags.None };
printAnimalAbilities(animal); // nada
animal.flags |= AnimalFlags.HasClaws;
printAnimalAbilities(animal); // el animal tiene garras
animal.flags &= ~AnimalFlags.HasClaws;
printAnimalAbilities(animal); // nada
animal.flags |= AnimalFlags.HasClaws | AnimalFlags.CanFly;
printAnimalAbilities(animal); // animal tiene garras y puede volar
```

Aquí:
* usamos `|=` para agregar banderas
* una combinación de `&=` y `~` para eliminar una bandera
* `|` para combinar banderas

> Nota: pueden combinar banderas para crear atajos convenientes dentro de la definción del enum. Por ejemplo `EndangeredFlyingClawedFishEating`:

```ts
enum AnimalFlags {
	None           = 0,
    HasClaws       = 1 << 0,
    CanFly         = 1 << 1,
    EatsFish       = 1 << 2,
    Endangered     = 1 << 3,

	EndangeredFlyingClawedFishEating = HasClaws | CanFly | EatsFish | Endangered,
}
```

#### String Enums
Por ahora solo hemos considerado enums donde los valores de los miembros son de tipo `number`. Actualmente, está permitido tener miembros de enums con valores string. Por ejemplo:

```ts
export enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card',
}
```

Estos pueden ser más fáciles de tratar y de depurar ya que proveen valores string con significado / depurables. 

Puedes usar estos valores para hacer comparaciones de strings simples. Por ejemplo:

```ts
// Donde `someStringFromBackend` será '' | 'passport_visa' | 'passport' ... etc.
const value = someStringFromBackend as EvidenceTypeEnum; 

// Ejemplo de uso en código
if (value === EvidenceTypeEnum.PASSPORT){
    console.log('You provided a passport');
    console.log(value); // `passport`
}
```

#### Const Enums

Si tienen una definición de enum como la siguiente:

```ts
enum Tristate {
    False,
    True,
    Unknown
}

var lie = Tristate.False;
```

La lína `var lie = Tristate.False` es compilada a JavaScript como `var lie = Tristate.False` (sí, el output es idéntico al input). Esto singifica que en tiempo de ejecución será necesario buscar `Tristate` y luego `Tristate.False`. Para obtener una mejoría en términos de rendimiento pueden marcar el `enum` como `const enum`. Lo demostraremos a continuación:

```ts
const enum Tristate {
    False,
    True,
    Unknown
}

var lie = Tristate.False;
```

genera el siguiente JavaScript: 

```js
var lie = 0;
```

Es decir, el compilador: 
1. coloca cualquier uso del enum *en línea* (`0` en lugar de `Tristate.False`).
2. No genera JavaScript para la definición del enum (no hay una variable `Tristate` en tiempo de ejecución) ya que sus usos están en línea.

##### Const enum preserveConstEnums
Colocar los usos en línea tiene sus beneficios de rendimiento obvios. El hecho de que no exista una variable `Tristate` en tiempo de ejecución es simplemente el compilador ayudándolos al no generar JavaScript que no será utilizado en tiempo de ejecución. Sin embargo, tal vez quieran que el compilador genere la versión JavaScript del enum de todas formas, para cosas como las búsquedas *número a string* o *string a número* que vimos anteriormente. En estos casos, pueden usar `Tristate["False"]` o `Tristate[0]` manualmente en tiempo de ejecución si así lo desean. Esto no impacta la capacidad de colocar *en línea* de ninguna manera.

### Enum con funciones estáticas
Pueden usar la unificación de declaraciones `enum` +  `namespace` para agregar métodos estáticos a un enum. El siguiente ejemplo demuestra un caso en el que agregamos un miembro estático `isBusinessDay` a un enum `Weekday`:

```ts
enum Weekday {
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday
}
namespace Weekday {
	export function isBusinessDay(day: Weekday) {
		switch (day) {
			case Weekday.Saturday:
			case Weekday.Sunday:
				return false;
			default:
				return true;
		}
	}
}

const mon = Weekday.Monday;
const sun = Weekday.Sunday;
console.log(Weekday.isBusinessDay(mon)); // true
console.log(Weekday.isBusinessDay(sun)); // false
```

#### Enums son abiertos

> Nota: los enums abiertos son relevantes únicamente si no están usando módulos. Deberían usar módulos. De ahí que esta sección sea la última.

Nuevamente, aquí está el JavaSript generado para un enum:

```js
var Tristate;
(function (Tristate) {
    Tristate[Tristate["False"] = 0] = "False";
    Tristate[Tristate["True"] = 1] = "True";
    Tristate[Tristate["Unknown"] = 2] = "Unknown";
})(Tristate || (Tristate = {}));
```

Ya explicamos la porción `Tristate[Tristate["False"] = 0] = "False";`. Ahora noten el código que lo rodea `(function (Tristate) { /*code here */ })(Tristate || (Tristate = {}));` específicamente la parte `(Tristate || (Tristate = {}));`. Básicamente, esto captura una variable local `Tristate` que apuntará a un valor `Tristate` ya definido o lo inicializará con un objeto vacío nuevo `{}`.

Esto significa que pueden dividir y extender una definición enum a lo largo de múltiples archivos. Por ejemplo, debajo tenemos la definición de `Color` dividida en dos bloques:

```ts
enum Color {
    Red,
    Green,
    Blue
}

enum Color {
    DarkRed = 3,
    DarkGreen,
    DarkBlue
}
```

Notemos que *deberían* reiniciar el primer miembro (en este caso `DarkRed = 3`) en la continuación de un enum para evitar que el código generado no se superponga con una definición previa (por ejemplo, los valores `0`, `1`, etc). TypeScript tirará una advertencia si no lo hacen (mensaje error: `En una enum con muchas declaraciones, solo una declaración puede omitir un inicializador para el primer elemento del enum`).
