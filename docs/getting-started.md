* [Empezando con TypeScript](#empezando-con-typescript)
* [Version de TypeScript](#version-de-typescript)

# Empezando con TypeScript

TypeScript compila a Javascript. Javascript es lo que vas a ejecutar realmente (sea en el navegador o en el servidor). Por lo tanto vas a necesitar lo siguiente:

* Compliador para TypeScript (OSS disponible [como fuente](https://github.com/Microsoft/TypeScript/) y en [NPM](https://www.npmjs.com/package/typescript))
* Un editor de TypeScript (puedes usar un bloc de notas si quieres, pero yo use [vscode 🌹](https://code.visualstudio.com/) con una [extensión que escribí](https://marketplace.visualstudio.com/items?itemName=basarat.god). Ademas [muchos otros IDES también lo soportan]( https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support))


## Version de TypeScript

En lugar de usar la version *estable* del compilador de TypeScript, vamos a estar presentando mucha información nueva en este libro que puede no estar asociada con una version numerada todavía. Generalmente, recomiendo que se utilize la version nightly, porque **el suite de tests del compilador solo atrapa mas bugs a lo largo del tiempo**.

Lo puedes instalar en la línea de comando

```
npm install -g typescript@next
```

Y ahora el comando `tsc` será el ultimo y el mejor. Varios IDEs tambien lo soportan, etc.

* Puedes pedirle a vscode que utilice esta versión creando `.vscode/settings.json` con el siguiente contenido:

```json
{
  "typescript.tsdk": "./node_modules/typescript/lib"
}
```

## Obtener el Código Fuente
El código para este libro se encuentra disponible en el repositorio de github https://github.com/basarat/typescript-book/tree/master/code. La mayoría de los ejemplos pueden ser copiados a vscode y puedes jugar con ellos como están. Para ejemplos que necesitan preparacion adicional (por ejemplo, módulos npm), presentaremos un link a la fuente antes de presentar el código. Por ejemplo, 

`este/sera/el/link/a/la/fuente.ts`
```ts
// Este será el código del que hablamos
```

Con la preparación ya resulta, comenzemos con la sintaxis de TypeScript.
