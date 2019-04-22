### Conceptos básicos
Es extremadamente fácil crear `tsconfig.json`, ya que el archivo base que necesitas es:
```json
{}
```
Es decir, un archivo JSON vacío, ubicado en la *raíz* de tu proyecto. De esta forma TypeScript incluirá *todos* los archivos `.ts` en esa carpeta (y sus subcarpetas) como parte del contexto de compilación. También elegirá algunas opciones por defecto para el compilador.

### compilerOptions

Puedes customizar las opciones del compilador usando `compilerOptions`:

```json
{
  "compilerOptions": {

    /* Opciones Básicas */                       
    "target": "es5",                       /* Especificar la versión target de ECMAScript: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', o 'ESNEXT'. */
    "module": "commonjs",                  /* Especificar la generación de módulos de código: 'commonjs', 'amd', 'system', 'umd' or 'es2015'. */
    "lib": [],                             /* Especificar los archivos de librería que serán incluidos en la compilación. */
    "allowJs": true,                       /* Permitir que los archivos JavaSCript sean compilados. */
    "checkJs": true,                       /* Reportar errores en los archivos .js */
    "jsx": "preserve",                     /* Especificar la generación de código JSX: 'preserve', 'react-native', o 'react'. */
    "declaration": true,                   /* Genera el archivo '.d.ts' correspondiente. */
    "sourceMap": true,                     /* Genera el archivo '.map' correspondiente. */
    "outFile": "./",                       /* Concatenar y emitir el output en un único archivo. */
    "outDir": "./",                        /* Redirigir la estructura del output a un directorio. */
    "rootDir": "./",                       /* Especificar el directorio raíz de los archivos de input. Controlar el directorio de output con --outDir. */
    "removeComments": true,                /* No emitir los comentarios al output. */
    "noEmit": true,                        /* No emitir outputs. */
    "importHelpers": true,                 /* Importar ayudantes (helpers) de emisión de 'tslib'. */
    "downlevelIteration": true,            /* Proveer soporte completo para iterables en 'for-of', propagación y desestructuración al tener 'ES5' o 'ES6' como targets. */
    "isolatedModules": true,               /* Transpilar cada archivo como un módulo separado (similar a 'ts.transpileModule'). */
                                              
    /* Opciones de chequeo de tipado estrictas */        
    "strict": true,                        /* Habilitar todas las opciones de chequeado de tipado estrictas. */
    "noImplicitAny": true,                 /* Tirar errores en expresiones o declaraciones que tengan un tipo 'any'implícito. */
    "strictNullChecks": true,              /* Habilitar chequeos de null estrictos. */
    "noImplicitThis": true,                /* Tirar errores en expresiones 'this' que tengan un tipo 'any' implícito. */
    "alwaysStrict": true,                  /* Analizar en modo estricto y emitir "use strict" para cada archivo fuente. */
                                              
    /* Controles adicionales */                   
    "noUnusedLocals": true,                /* Tirar errores en locales no usadas. */
    "noUnusedParameters": true,            /* Tirar errores en parámetros no usados. */
    "noImplicitReturns": true,             /* Tirar errores cuando no todos los "caminos" de una función devuelven un valor. */
    "noFallthroughCasesInSwitch": true,    /* Tirar errores para casos de fallthrough en declaraciones switch. */
                                              
    /* Opciones de resolución de modulos */           
    "moduleResolution": "node",            /* Especificar la estrategia de resolución de módulos: 'node' (Node.js) o 'classic' (TypeScript pre-1.6). */
    "baseUrl": "./",                       /* Directorio base para resolver nombres de módulos no absolutos. */
    "paths": {},                           /* Una serie de entradas que re-map importa a ubicaciones de busqueda, relativas al 'baseUrl'. */
    "rootDirs": [],                        /* Lista de carpetas raíz cuyo contenido combinado representa la estructura del proyecto en tiempo de ejecución. */
    "typeRoots": [],                       /* Lista de carpetas desde las cuales incluir definiciones de tipo. */
    "types": [],                           /* Archivos de declaraciones de tipos a ser incluídos en la compilación. */
    "allowSyntheticDefaultImports": true,  /* Permitir importar defaults desde módulos sin export default. Esto no afecta la emisión de código, sino el control de tipos. */
                                              
    /* Opciones del mapa fuente */                  
    "sourceRoot": "./",                    /* Especificar la ubicación donde el debugger debe ubicar los archivos TypeScript, en vez de las ubicaciones fuente. */
    "mapRoot": "./",                       /* Especificar la ubicación donde el debugger debe ubicar los archivos mapa en vez de las ubicaciones generadas. */
    "inlineSourceMap": true,               /* Emitir un único arcihvo con mapas fuente en vez de tener un archivo separado. */
    "inlineSources": true,                 /* Emitir la fuente junto con los mapas fuente dentr ode un mismo archivo. Requiere '--inlineSourceMap' o '--sourceMap'. */
                                              
    /* Opciones experimentales */                
    "experimentalDecorators": true,        /* Permite el soporte experimental de decoradores ES7. */
    "emitDecoratorMetadata": true          /* Permite el soporte experimental para emitir metadata sobre tipos para decoradores. */
  }
}
```

Estas (y otras) opciones de compilación serán discutidas más adelante.

### Compilador TypeScript
Las buenas IDEs incluyen soporte para compilación instantánea de `ts` a `js`. Sin embargo, si quieres correr el compilador de TypeScript manualmente desde la línea de comandos cuando usas `tsconfig.json`, lo puedes hacer de dos maneras:
* Corriendo `tsc`, que buscará a `tsconfig.json` en el actual directorio (así como sus directorios padres) hasta encontrarlo.
* Corriendo `tsc -p ./path-to-project-directory`. El path puede ser absoluto o relativo al directorio actual.

También puedes inciar el compilador TypeScript en modo *observacion* usando `tsc -w`, y controlará si hay cambios en los archivos TypeScript de tu proyecto.
