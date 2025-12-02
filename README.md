# DH2OCOL Card

Tarjeta digital estática optimizada para móvil, con QR, vCard, WhatsApp, redes y pago Nequi. Despliegue en VPS con Docker/Nginx.

## Repositorio

- Código fuente: https://github.com/Bernah2o/tarjeta.git

## Desarrollo local

1. Servir la carpeta con cualquier servidor estático (por ejemplo Python):
   - `python -m http.server 8000`
   - Abrir `http://localhost:8000/`

## Docker (Dockploy + Traefik)

- Construir imagen:
  - `docker build -t dh2o-card .`
- Ejecutar local simple (sin Traefik):
  - `docker run -p 8080:80 dh2o-card`
- Despliegue con Dockploy (Traefik gestionado por la plataforma):
  - Crear servicio tipo **Application** usando este Dockerfile.
  - Puerto interno del contenedor: `80`.
  - Asignar dominio y activar HTTPS.
  - Añadir labels Traefik en Dockploy (adaptar al dominio):
    - `traefik.enable=true`
    - `traefik.http.routers.dh2ocol.rule=Host('tarjeta.dh2ocol.com')`
    - `traefik.http.routers.dh2ocol.entrypoints=websecure`
    - `traefik.http.routers.dh2ocol.tls=true`
    - `traefik.http.services.dh2ocol.loadbalancer.server.port=80`
    - `traefik.http.middlewares.dh2ocol-redirect.redirectscheme.scheme=https`
    - `traefik.http.middlewares.dh2ocol-compress.compress=true`
    - `traefik.http.middlewares.dh2ocol-sec.headers.stsSeconds=31536000`
    - `traefik.http.middlewares.dh2ocol-sec.headers.browserXssFilter=true`
    - `traefik.http.middlewares.dh2ocol-sec.headers.contentTypeNosniff=true`
    - `traefik.http.middlewares.dh2ocol-sec.headers.referrerPolicy=no-referrer-when-downgrade`
    - `traefik.http.middlewares.dh2ocol-sec.headers.customFrameOptionsValue=SAMEORIGIN`
    - `traefik.http.routers.dh2ocol.middlewares=dh2ocol-redirect,dh2ocol-compress,dh2ocol-sec`

### docker-compose (opcional)

- Para probar local con Traefik:
  1. Copia `.env.example` a `.env` y ajusta `DOMAIN` y `ACME_EMAIL`.
  2. Arranca Traefik + web:
     - `docker compose --profile local-traefik up -d`
  3. Abre `http://<tu-dominio>` o `https://<tu-dominio>`.
  4. Panel de Traefik (solo local): `http://localhost:8080` si se habilita.

- Solo el sitio (sin Traefik):
  - `docker compose up -d web`

### Logs en producción

- Nginx:
  - `access_log` envía registros al stdout del contenedor y `error_log` a stderr.
  - Los archivos estáticos (`css/js/img/svg/webmanifest`) tienen `access_log off` para reducir ruido.
- Docker:
  - El servicio `web` usa el driver `json-file` con rotación: `max-size=10m`, `max-file=3`.
  - En Dockploy puedes ver los logs del contenedor y configurar retención adicional si tu plan lo permite.
  - Recomendación: activar alertas a nivel de plataforma si hay picos de `error_log`.

## DNS

- Apuntar `card.dh2o.com.co` al VPS (A/AAAA) y configurar certificado TLS.

## Personalización

- Editar `profile.json` para cambiar nombre, título, redes, WhatsApp, correo y Nequi.
- El logo se añadirá en `assets/` y se integrará en la UI (placeholder actual).

## PWA

- `manifest.webmanifest` y `service-worker.js` implementados para cache básico y experiencia instalable.
