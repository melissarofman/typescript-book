### Archivo de declaración
Pueden decirle a TypeScript que estan tratando de describir código que existe en otro lado (por ejemplo, escrito JavaScript/CoffeeScript/en un ambiente de ejecución como el navegador o Node.js) usando la palabra clave `declare`. A modo de ejemplo rápido:

```ts
foo = 123; // Error: `foo` no está definido
```
vs.
```ts
declare var foo: any;
foo = 123; // permitido
```

Tienen la opción de poner estas declaraciones en un archivo `.ts` o en un archivo `.d.ts`. Nosotros recomendamos que en sus proyectos reales usen un `d.ts` separado. Comiencen con un archivo llamado `globals.d.ts` o `vendor.d.ts`, o algo similar.

Si un archivo tiene la extensión `.d.ts`, etnonces cada definición a nivel raíz debe tener la palabra clave `declare` precediéndola. Esto ayuda a clarificarle al autor que *no habrá código emitido por TypeScript*. El autor debe asegurarse que el ítem declarado existirá al momento de ejecución.

> * Las declaraciones ambiente son una promesa que estan haciendo con el compilador. Si estas no existen en el momento de ejecución y ustedes intentan utilizarlas, las cosas se romperan sin advertencia previa.
* Las declaraciones ambiente son como documentación. Si la fuente cambia, la documentación debe ser actualizada. Por lo que tal vez tengan nuevos comportamientos que funcionan en tiempo de ejecución pero nadie actualizó las declaraciones de ambiente y, por ende, recibirián errores de compilación.
