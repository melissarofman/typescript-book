# TypeScript con Node.js

TypeScript ha tenido soporte de *primera clase* para Node.js desde su concepción. Aquí explicamos como preparar un proyecto Node.js rápidamente:

> Nota: muchos de estos pasos en realidad son prácticas comunes al preparar cualquier proyecto con Node.js: 

1. Preparar un `package.json` para tu proyecto Node.js. Rápidamente: `npm init -y`
2. Agregar TypeScript (`npm install typescript --save-dev`)
3. Agregar `node.d.ts` (`npm install @types/node --save-dev`)
4. Inciar una `tsconfig.json` para las opciones TypeScript con agunas opciones claves ya elegidas (`npx tsc --init --rotDir src --outDir lib --esModuleInterop --resolveJsonModule --lib es6,dom --module commonjs`)

Eso es todo! Ahora abran su IDE (eg. `code .`) y empiecen a jugar. Ahora puedes usar todas las características de node modules (por ejemplo, `import * as fs from 'fs'`) con toda la seguridad y ergonomía de desarrolladores TypeScript!

Todo el código TypeScript irá en la carpeta `src` y el JavaScript generado estará en `lib`.

## Bonus: compilar + correr en vivo
* Agreguen `ts-node`, al que usaremos para compilar y correr node en vivo (`npm install ts-node --save-dev`)
* Agreguen `nodemon`, al que usaremos para invocar `ts-node` cada vez que cambie algo en un archivo (`npm install nodemon --save-dev`)

Ahora simplemente agreguen un `script` a su `package.json` basado en el punto de entrada de tu aplicación. Por ejemplo, si asumimos que es `index.ts`:

```json
  "scripts": {
    "start": "npm run build:live",
    "build": "tsc -p .",
    "build:live": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"
  },
```

Ahora pueden correr `npm start` y a medida que editen `index.ts`:

* nodemon repite su comando (ts-node)
* ts-node transpila automáticamente, levantando tsconfig.json y la versión instalada de TypeScript
* ts-node corre el JavaScript generado a través de Node.js.

Y cuando esten listos para publicar su aplicación JavaScript, corran `npm run build`.

## Crear node modules en TypeScript

* [Una clase sobre crear node modules en TypeScript](https://egghead.io/lessons/typescript-create-high-quality-npm-packages-using-typescript)

Usando modulos escritos en TypeScript es super divertido ya que obtienen seguridad a la hora de compilar y autocompletar (esencialmente, es documentación ejecutable).

Crear un módulo de alta calidad en TypeScript es simple. Asumamos la proxima estructura de archivos para tu paquete:

```text
package
├─ package.json
├─ tsconfig.json
├─ src
│  ├─ All your source files
│  ├─ index.ts
│  ├─ foo.ts
│  └─ ...
└─ lib
  ├─ All your compiled files
  ├─ index.d.ts
  ├─ index.js
  ├─ foo.d.ts
  ├─ foo.js
  └─ ...
```


* En su `tsconfig.json`
  * tengan `compilerOptions`: `"outDir": "lib"` y `"declaration": true` < Esto genera declaraciones y archivos js en la carpeta lib
  * tengan `include: ["./src/**/*"]` < Esto incluye todos los archivos del directorio `src`.

* En su `package.json` tengan
  * `"main": "lib/index"` < Esto le dice a node que debe cargar `lib/index.js`
  * `"types": "lib/index"` < Esto le dice a TypeScript que debe cargar `lib/index.d.ts`


Paquete ejemplo:
* `npm install typestyle` [for TypeStyle](https://www.npmjs.com/package/typestyle)
* Usos: `import { style } from 'typestyle';` será completamente seguro respecto de tipos.

MÁS:

* Si sus paquete depende de otros paquetes TypeScript creados por otros autores, incluyanlos en `dependencies`/`devDependencies`/`peerDependencies` al igual que harían con paquetes de JS en bruto.
* Si sus paquete depende de otros paquetes TypeScript creados por otros autores y los quieren usar con seguridad de tipos en su proyecto, incluayn sus tipos (ejemplo, `@types/foo`) en `devDependencies`. Los tipos de JavaScript deberías ser manejados *fuera del alcance* de las corrientes principales de NPM. El ecosistema JavaScript suele romper tipos sin versiones semáticas, por lo que si sus usuarios necesitan tipos para estos paquetes, deberían instalar la versión de `@types/foo` que funciona para ellos.

## Puntos extra

Módulos NPM como estos funcionan perfectamente con browserify (usando tsify) o webpack (usando ts-loader).