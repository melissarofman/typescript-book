# Soport JSX

TypeScript soporta la transpilación y el análisis de código JSX. Si JSX no les es familiar, aquí hay un extracto de la [web oficial](https://facebook.github.io/jsx/):

> JSX es una extensión de sintaxis similar a XML para ECMAScript sin ninguna semántica definida. NO es la intención que sea utilizada por motores o navegadores. NO es una propuesta de incorporar JSX a las especificaciones de ECMAScript en sí mismas. La intención es que sea usado por varios preprocesadores (transpiladores) para tranformar estos tokens en ECMAScript estándar.

Los motivos detrás de la creación de JSX es permitir que los usuarios escriban vistas similares a HTML *en JavaScript*, lo que les permitirá:

* Tener la vista con control de Tipos por el mismo código que controlará su JavaScript
* Que la vista esté al tanto del contexto en el que va a operar (para, por ejemplo, fortalecer la conexión *controler-vista* en MVC tradicional)
* Reusar patrones de JavaScript para mantener HTML, como `Array.prototype.map`, `?:`, `switch`, etc, en lugar de crear alternativas nuevas (y probablemente mal tipadas)

Esto disminuye las chances de errores e incrementa la mantenibilidad de tus interfaces de usuarios. El consumidor principal de JSX en este momento ens [ReactJS de Facebook(http://facebook.github.io/react/). Este será el uso de JSX que discutiremos en este libro.
