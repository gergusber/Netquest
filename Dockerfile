# imagen de la cual se va a levantar este docker
FROM node 

# directorio donde se va a trabajar 
WORKDIR /app   

#primero copiamos el package json para poder generar el npm install y con esto no tener que correr siempre el npm install
COPY package.json .

RUN npm install


# Especificamos que el "." es el directorio del proyecto /Example1/ .. pero al cambiar el workdir, 
# ahora pasamos de . source al /app 
# Si quisieramos podriamos poner COPY . . <={este ultimo .}(ya trabajando en /app por el workdir)
COPY . .

#esto sirve para documentar
#Con esto vemos el puerto 80 desde nuestra pc, sino no va a poder comunicarse con un contenedor 
#Los contenedores son "isolated"
ARG DEFAULT_PORT=3000

ENV PORT $DEFAULT_PORT

EXPOSE $PORT
#para especificar el puerto,lo vamos a hacer desde el docker run con el -p <puerto de la app> :<puerto expuesto en la maquina>  ej: 3000:80 



# El cmd se ejecuta cuando se levanta el container.
# Si no tenemos este parametro. cuando se levante el container va a producirse un error
# el cmd Siempre es el ultimo comando 
CMD ["npx", "nodemon", "app.js"]