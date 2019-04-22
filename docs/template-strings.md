### Strings de Plantillas
De ahora en más llamaremos a las plantillas *templates*. Sintácticamente éstas son strings que usan acentos graves (es decir, \`) en lugar de comillas simples(') o dobles ("). Los strings de templates existen por tres motivos:
* la interpolación de strings
* strings que abarquen múltiples líneas, y
* la etiquetación de templates

#### Interpolación de strings
Un caso de uso común es la intención de generar una string a partir de otras strings estáticas y variables. Para esto, tendrías que utilizar *lógica de template* y de ahi es que las *strings de templates* sacaron su nombre. Anteriormente, hubiesemos generado una string de HTML de la siguiente manera:

```ts
var lyrics = 'Never gonna give you up';
var html = '<div>' + lyrics + '</div>';
```
Ahora, con las strings de templates puedes hacer lo mismo de forma más legible:

```ts
var lyrics = 'Never gonna give you up';
var html = `<div>${lyrics}</div>`;
```

Notá que cualquier elemento dentro de la interpolación (`${` y `}`) es tratado como una expresión de Javascript y evaluado como tal. Es decir, puedes colocar variables (como en el caso anterior), o realizar operaciones. Por ejemplo, puedes hacer matemática:

```ts
console.log(`1 más 1 dan ${1 + 1}`);
```

#### Párrafos
Quisite poner una nueva línea en una string JavaScript alguna vez? Tal vez quisiste incluir la letra de una canción. Habrás tenido que *escapar el literal de la nueva lína* utilizando el caracter de escape `\`, y luego escribir manualmente `/n` en la nueva línea. Este proceso es el que mostramos a continuación: 

```ts
var lyrics = "Never gonna give you up \
\nNever gonna let you down";
```

Con TypeScript, puedes hacer lo mismo solo con strings de template:

```ts
var lyrics = `Never gonna give you up
Never gonna let you down`;
```

#### Templates etiquetados

Puedes colocar una función (llamada `tag`) antes de la string de template. Esta puede pre-procesar tu string de template y los valores de todos los elementos que coloques en interpolaciones, para luego devolver un resultado. Un par de notas:
* Todas las strings literales son pasadas en forma de array en el primer argumento de la función `tag`
* Todos los valores de los elementos colocados en interpolaciones son pasados en los argumentos que restan. Comúnmente utilizamos un parámetro rest para convertirlos en un array.

Aquí hay un ejemplo de una función tag (llamada `htmlEscape`) que escapa el HTML de todos los elementos interpolados:

```ts
var dicho = "pajaro en mano > mil volando";
var html = htmlEscape `<div> Solo quisiera decir : ${dicho}</div>`;

// ejemplo de función tag
function htmlEscape(literals: TemplateStringsArray, ...placeholders: string[]) {
    let result = "";

    // intercalá los literales con los elementos interpolados
    for (let i = 0; i < placeholders.length; i++) {
        result += literals[i];
        result += placeholders[i]
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // agregá el último literal
    result += literals[literals.length - 1];
    return result;
}
```
> Nota: puedes anotar `placeholders` de forma que sea cualquier `[]`. Como sea que lo anotes, TypeScript va a chequear el tipo de los valores interpolados para asegurarse que coincidan con tu anotación. Por ejemplo, si esperas lidiar con strings o números, puedes anotar `...placeholders:(string | number)[]`.

#### JS Generado
Para targets de compilación previas a ES6 el código es bastante simple. Los párrafos de strings se convierten en strings escapadas. La interpolación se convierte en *concatenación*. Y los templates etiquetados se convierten en llamadas a funciones.

#### Resumen
Los párrafos de strings y la interpolación de string son geniales de tener en cualquier lenguage. Es bueno que ahora puedes utilizarlos en tu JavaScript (gracias TypeScript!). Los templates etiquetados te permiten crear servicios poderosos.
