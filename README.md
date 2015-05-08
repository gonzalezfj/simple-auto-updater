# Simple Auto Updater
Es un pequeño script para hacer actualizaciones automáticas, pensado para correr en nw.js sobre linux, OSX y windows

##Como funciona?

##Cliente
Verifica la versión en el package.json contra un json de un servidor, luego baja el zip por medio de http y lo descomprime en la carpeta indicada, sobreescribiendo los últimos cambios.

### Servidor
Del lado del servidor se deben mantener los diferenciales en zip de cada una de las versiones contra la última:
```
git archive --output=file.zip HEAD $(git diff --name-only SHA1 SHA2)
```
