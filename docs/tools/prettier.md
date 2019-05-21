# Prettier 

Prettier es una gran herramienta desarrollada por Facebook que facilita tanto el proceso de formateo de código que amerita mencionarla. Incluirla en un proyecto TypeScript usando nuestra preparación de proyectos recomendada (es decir, todo en la carpeta `src`) es súper fácil:

## Preparación 

* `npm install prettier -D` 
* Agregar `series de comandos` a `package.json`: 

```
    "prettier:base": "prettier --parser typescript --single-quote",
    "prettier:check": "npm run prettier:base -- --list-different \"src/**/*.{ts,tsx}\"",
    "prettier:write": "npm run prettier:base -- --write \"src/**/*.{ts,tsx}\""
```

## Uso
En el servidor de construcción:
* `npm run prettier:check` 

Durante desarrollo (o como enganche de pre commit):
* `npm run prettier:write`
