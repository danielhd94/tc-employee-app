# Usa una imagen base de Node para construir la aplicación
FROM node:14 as build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias y construye la aplicación
RUN npm install
RUN npm run build

# Configura Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos de construcción de la aplicación al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80 para tráfico HTTP
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
