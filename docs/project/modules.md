## Módulos

### Módulo Global

Por default, cuando comenzas a tipear código en un archivo de TypeScript, tu código se encuentra en un espacio de nombre (*namespace*) global. A modo de demostración, consideremos el archivo `foo.ts`:

```ts
var foo = 123;
```

Si ahora creases un *nuevo* archivo `bar.ts` en el mismo proyecto, el sistema de tipos de TypeScript te *permitiría* usar la variable `foo` como si estuviese disponible globalmente:

```ts
var bar = foo; // permitido
```
No es necesario decir que tener un namespace global es peligroso, ya que abre la posibilidad de conflictos de nombramiento en tu código. Recomendamos utilizar módulos en su lugar, los cuales presentaremos a continuación.

### Módulo como archivo
También llamados *módulos externos*. Si tienes un `import` o un `export` en el nivel raíz de un archivo TypeScript, entonces este crea un ámbito *local* dentro de ese archivo. Por lo tanto, si fueramos a cambiar el archivo `foo.ts` de la siguiente manera (prestá atención a la utilización de `export`):

```ts
export var foo = 123;
```

ya no tendriamos a `foo` en el namespace global. Esto puede ser demostrado creado un nuevo archivo `bar.ts` de la siguiente manera:

```ts
var bar = foo; // ERROR: "cannot find name 'foo'"
```

Si quieres usar cosas de `foo.ts` en `bar.ts` *neceistas importarlas explícitamente*. A continuación mostramos un `bar.ts` actualizado:

```ts
import { foo } from "./foo";
var bar = foo; // Permitido
```
Usar `import` en `bar.ts` no solo te permite traer cosas de otros archivos, sino que también marca el archivo `bar.ts` como un *módulo* y, por lo tanto, cualquier declaración hecha en `bar.ts` tampoco contamina el namespace global.

El tipo de código JavaScript que es generado a partir de un archivo TypeScript que utiliza módulos externos es "decidido" por la flag de compilación `module`.
