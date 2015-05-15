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
Bajando el paquete con npm
```
npm install simple-auto-updater
```
Un simple ejemplo
```
var updater = require('simple-auto-updater');

updater.Init();
//Verficar por una nueva version
.then(updater.comparar_versiones)
.then(function(resultado){
    //Una nueva version esta disponible
    if(resultado){
        //Descarga y descomprime el paquete
        updater.descomprimir().then(function(){
            console.log("actualizado con éxito");
        },function(e){
            console.log(e);//algo salió mal
        },function(progress){
            /**
            * progress.percent (porcentaje descargado actualmente)
            * progress.remaining_time (tiempo restante de la descarga)
            * progress.formatted_speed (velocidad actual en formato legible -  B/s,KB/s,MB/s, and so on)
            */
            console.log(progress); 
        })
        .done();
    }
});

//Con este metodo se puede cancelar la descarga en cualquier momento
updater.abortar();

```
