## Importación dinámica de expresiones

La **Importación dinámica de expresiones** es una nueva característica y parte de **ECMAScript** que permite a los usuarios solicitar un módulo de forma asincrónica en un punto arbitrario de tu programa.
El comité de JavaScirpt **TC39** tiene su propia propuesta, la cual está en etapa 3, y se llama [propuesta import() para JavaScript](https://github.com/tc39/proposal-dynamic-import).

Alternativamente, el agrupador de **webpack** tiene una característica llamada [**Separación de Código**](https://webpack.js.org/guides/code-splitting/) la cual permite dividir tu código en pedazos que pueden ser descargados asincrónicamente en otro momento. Por ejemplo, esto permite servir un paquete mínimo primero y luego agregar características adicionales asincrónicamente.

Es natural pensar (si usamos webpack en nuestro proceso de desarrollo) que [las expresiones dinámicas de importación de TypeScript 2.4](https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#dynamic-import-expressions) **producirán automáticamente** pedazos del paquete y que dividirán tu JS final automáticamente. PERO, esto no es tan fácil como parece, ya que depende de la **configuración de tsconfig.json** con la que estemos trabajando.

La cuestión yace en que el proceso de división de código de webpack soporta dos técnicas similares para lograr este objetivo: usar **import()** (técnica preferida y propuesta de ECMAScript) y **require.ensure()** (técnica histórica, y específica a webpack). Esto significa que el output esperado de TypeScript suele **dejar la declaración import() tal cual** en lugar de transpilarla a algo diferente.

Vemaos un eejmplo para entender como configurar webpack + TypeScript 2.4.

En el siguiente código, queremos **lazy load la libreria _moment_** a la vez que dividimos el código. Es decir, queremos contener la libreria moment en una pedazo de JS (archivo JavaScript) separado, que solo será cargado cuando sea necesario. 

```ts
import(/* webpackChunkName: "momentjs" */ "moment")
  .then((moment) => {
      // lazyModule tiene todos los tipos correctos, la autocompletar funciona,
      // el chequeo de tipos funciona y las referencias de código también \o/
      const time = moment().format();
      console.log("TypeScript >= 2.4.0 Dynamic Import Expression:");
      console.log(time);
  })
  .catch((err) => {
      console.log("Failed to load moment", err);
  });
```

Aquí esta el archivo tsconfig.json:

```json
{
    "compilerOptions": {
        "target": "es5",                          
        "module": "esnext",                     
        "lib": [
            "dom",
            "es5",
            "scripthost",
            "es2015.promise"
        ],                                        
        "jsx": "react",                           
        "declaration": false,                     
        "sourceMap": true,                        
        "outDir": "./dist/js",                    
        "strict": true,                           
        "moduleResolution": "node",               
        "typeRoots": [
            "./node_modules/@types"
        ],                                        
        "types": [
            "node",
            "react",
            "react-dom"
        ]                                       
    }
}
```


**Notas Importantes**:

- Usar TypeScript **"module": "esnext"** produce la imitación de la declaración import() que será incluida en Webpack para realizar la división de código.
- Para más información, leer el siguiente artículo: [Dynamic Import Expressions and webpack 2 Code Splitting integration with TypeScript 2.4](https://blog.josequinto.com/2017/06/29/dynamic-import-expressions-and-webpack-code-splitting-integration-with-typescript-2-4/).


Puedes ver el ejemplo completo [aquí][dynamicimportcode].

[dynamicimportcode]:https://cdn.rawgit.com/basarat/typescript-book/705e4496/code/dynamic-import-expressions/dynamicImportExpression.js
