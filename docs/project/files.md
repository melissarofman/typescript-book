## Cuáles archivos?

Usamos `include` y `exclude` para especificar archivos / carpetas / globs. Por ejemplo: 


```json
{
    "include":[
        "./folder"
    ],
    "exclude":[
        "./folder/**/*.spec.ts",
        "./folder/someSubFolder"
    ]
}
```

### Globs

* Para globs: `/**/*` (por ejemplo, `unacarpeta/**/*`) significa todas las carpetas y archivos (las extensiones `.ts`/`.tsx` serán incluidas automáticamente, y si `allowJs:true`, también lo serán las extensiones `.js`/`.jsx`).

### Opción `files`
Puedes usar `files` para ser explícito:

```json
{
    "files":[
        "./some/file.ts"
    ]
}
```

Pero no se recomienda ya que vas a tener que mantenerlo al día. En su lugar, usa `include` para incluir la carpeta contenedora.
