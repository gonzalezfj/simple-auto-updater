# Simple Auto Updater
Es un pequeño script para hacer actualizaciones automáticas, pensado para correr en nw.js sobre linux, OSX y windows

## Como funciona?

### Cliente
Verifica la versión en el package.json contra un json de un servidor, luego baja el zip por medio de http y lo descomprime en la carpeta indicada, sobreescribiendo los últimos cambios.

### Servidor
Del lado del servidor se deben mantener los diferenciales en zip de cada una de las versiones contra la última:
```
git archive --output=file.zip HEAD $(git diff --name-only SHA1 SHA2)
```

## Dependencias
```
auto-updater@1.0.0
|
+-- adm-zip@0.4.7 (git://github.com/cthackers/adm-zip.git#eeb763317092232b73f4adb5c25d1f63e7b33db6)
|
+-- q@1.3.0
|
+-- request@2.55.0
|
+-- request-progress@0.3.1
|
+-- unit.js@2.0.0
```
## Como empezar
```
npm install simple-auto-updater

var updater = require(process.cwd() + '/src/app.js')
updater.Init()
.then(updater.comparar_versiones)
.then(function(result){            
    if(result) 
    {
	console.log("nueva version");
	updater.descomprimir().then(function(){
	    console.log("descomprimido con exito C :")
	});
    }else{ 
	console.log("ya esta en la ultima version");
    }
});

```
