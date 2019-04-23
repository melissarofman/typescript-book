# TypeScript en el navegador

Si están usando TypeScript para crear una aplicación web, aquí están nuestras recomendaciones para crear un proyecto TypeScript + React (nuestro framework preferido) rápidamente.

## Preparacion general de la máquina

* Instalen [Node.js](https://nodejs.org/en/download/)
* Instalen [Git](https://git-scm.com/downloads)

## Preparación del proyecto
Usen [https://github.com/basarat/react-typescript](https://github.com/basarat/react-typescript) a modo de base. 

```
git clone https://github.com/basarat/react-typescript.git
cd react-typescript
npm install
```

Ahora saltemos a [desarrollar su increíble aplicación](#develop-your-amazing-application)

## Detalles de la preparación del proyecto
A continuación documentamos como fue creado este proyecto:

* Creen un directorio para el proyecto:

```
mkdir your-project
cd your-project
```

* Creen `tsconfig.json`:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "module": "commonjs",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "target": "es5",
    "jsx": "react",
    "lib": [
      "dom",
      "es6"
    ]
  },
  "include": [
    "src"
  ],
  "compileOnSave": false
}
```

* Creen `package.json`.

```json
{
  "name": "react-typescript",
  "version": "0.0.0",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/basarat/react-typescript.git"
  },
  "scripts": {
    "build": "webpack -p",
    "start": "webpack-dev-server -d --content-base ./public"
  },
  "dependencies": {
    "@types/react": "16.4.10",
    "@types/react-dom": "16.0.7",
    "clean-webpack-plugin": "0.1.19",
    "html-webpack-plugin": "3.2.0",
    "react": "16.4.2",
    "react-dom": "16.4.2",
    "ts-loader": "4.4.2",
    "typescript": "3.0.1",
    "webpack": "4.16.5",
    "webpack-cli": "3.1.0",
    "webpack-dev-server": "3.1.5"
  }
}
```

* Creen un `webpack.config.js` para agrupar sus módulos en un único archivo `app.js` que contenga todos tus recursos:

```js
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app/app.tsx',
  plugins: [
    new CleanWebpackPlugin(['public/build']),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html'
    }),
  ],
  output: {
    path: __dirname + '/public',
    filename: 'build/[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
```

* El archivo `src/templates/index.html`. Lo usaremos a modo de plantilla para el `index.html` generado por webpack. El arcihvo generado se encontrará en la carpeta `public` y será servido desde su servidor web: 

```html
<html>
  <body>
      <div id="root"></div>
  </body>
</html>

```

* `src/app/app.tsx` es el punto de entrada de tu aplicación frontend: 

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Hello: React.FunctionComponent<{ compiler: string, framework: string }> = (props) => {
  return (
    <div>
      <div>{props.compiler}</div>
      <div>{props.framework}</div>
    </div>
  );
}

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("root")
);
```

# Desarollen su increible aplicación

> Puedes obtener los últimos paquetes usando `npm install typescript@latest react@latest react-dom@latest @types/react@latest @types/react-dom@latest webpack@latest webpack-dev-server@latest webpack-cli@latest ts-loader@latest clean-webpack-plugin@latest html-webpack-plugin@latest --save-exact`

* Desarrollen en vivo corriendo `npm start`. 
    * Vayan a [http://localhost:8080](http://localhost:8080)
    * Editen el archivo `src/app/app.tsx` (o cualquier archivo ts/tsx que sea usado de alguna forma u otra por `src/app/app.tsx`) y la aplicación recargará instantáneamente. 
    * Editen el archivo `src/templates/index.html` y el servidor recargara instantáneamente.
* Construyan su proyecto para producción corriendo `npm run build`. 
    * Sirvan la carpeta `public` (contiene los elementos construidos) desde el servidor.
