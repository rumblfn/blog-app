## Working deployment:
http://46.17.99.137:5173

## Self configuration

### Dev

Running backend and database
```
docker-compose -f docker-compose.yaml up
```

Running frontend
```
cd frontend
pnpm i
pnpm run dev
```

### Prod

> Change `CLIENT_URL` and `VITE_HOST_URL` in docker-compose.prod.yaml

Running
```
docker-compose -f docker-compose.prod.yaml up
```