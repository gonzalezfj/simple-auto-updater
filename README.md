# Simple Auto Updater
Es un pequeño script para hacer actualizaciones automáticas, pensado para correr en nw.js sobre linux, OSX y windows

##Como funciona?

###Cliente
Verifica la versión en el package.json contra un json de un servidor, luego baja el zip por medio de http y lo descomprime en la carpeta indicada, sobreescribiendo los últimos cambios.

###Servidor
Del lado del servidor se deben mantener los diferenciales en zip de cada una de las versiones contra la última:
```
git archive --output=file.zip HEAD $(git diff --name-only SHA1 SHA2)
```

##Dependencias
```
auto-updater@1.0.0
│ C:\Users\ServicioTC\Documents\FACUNDO\simple-auto-updater
│ Self auto updates mechanism git based
│ https://github.com/gonzalezfj/simple-auto-updater
│ https://github.com/gonzalezfj/simple-auto-updater
├── adm-zip@0.4.7 (git://github.com/cthackers/adm-zip.git#eeb763317092232b73f4adb5c25d1f63e7b33db6)
│   A Javascript implementation of zip for nodejs. Allows user to create or extract zip files both in memory or to/from disk
│   https://github.com/cthackers/adm-zip.git
│   http://github.com/cthackers/adm-zip
├── q@1.3.0
│   A library for promises (CommonJS/Promises/A,B,D)
│   git://github.com/kriskowal/q.git
│   https://github.com/kriskowal/q
├── request@2.55.0
│   Simplified HTTP request client.
│   https://github.com/request/request.git
│   https://github.com/request/request
├── request-progress@0.3.1
│   Tracks the download progress of a request made with mikeal/request
│   git://github.com/IndigoUnited/node-request-progress
│   https://github.com/IndigoUnited/node-request-progress
└── unit.js@2.0.0
    Simple, intuitive and flexible unit testing framework for javascript / Node.js (browser and server). Integrates awesome assertions libraries like Must.js, Should.js, Assert of Node.js, Sinon.js and other friendly features (promise, IoC, plugins, ...).
    git://github.com/unitjs/unit.js.git
    http://unitjs.com
```
##Como empezar(todo)
```
npm install
npm test
npm start
```