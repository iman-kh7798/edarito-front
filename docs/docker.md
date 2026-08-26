# Docker

The Docker setup supports local development and production-style static serving.

## Development

Run the Vite dev server in Docker:

```bash
docker compose up --build
```

Open:

```text
http://localhost:5173
```

## Production Build

Build the production image:

```bash
docker build --target production -t frontend-boilerplate .
```

Run it:

```bash
docker run --rm -p 8080:80 frontend-boilerplate
```

Open:

```text
http://localhost:8080
```

## Node LTS

Docker and GitLab CI use Node 24, the active LTS line for this template.

## Images

`development`
: Runs `npm run dev -- --host 0.0.0.0` for local work.

`production`
: Builds the app with Vite and serves `dist/` from Nginx.
