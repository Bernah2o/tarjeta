FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY ./index.html ./
COPY ./styles.css ./
COPY ./app.js ./
COPY ./profile.json ./
COPY ./manifest.webmanifest ./
COPY ./service-worker.js ./
COPY ./img ./img
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
