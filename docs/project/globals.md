# globals.d.ts

Discutimos módulos *globales* y en *archivos* cuando cubrimos [proyectos](./modules.md) y recomendamos usando los módulos basados en archivo para evitar contaminar el namespace global.

Sin embargo, si tienen desarrolladores TypeScript que recién estan comenzando, pueden darles un archivo `globals.d.ts` donde poner interfaces y tipos en el namespeace global, y así facilitarles el acceso a algunos *tipos* al tenerlos *mágicamente* disponibles en *toda* la base de código de TypeScript.

> Para cualquier código que vaya a generar *JavaScript*, es altamente recomendable usar los *módulos en archivos*.

* `globals.d.ts` es útil para agregar extensiones a `lib.d.ts` en caso de que lo necesiten
* También sirve para `declare module "some-library-you-dont-care-to-get-defs-for";` rápidamente cuando estén migrando JS a TS.
