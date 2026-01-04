# 📡 Documentación API Xtream Codes

## 🔗 Base URL
```
http://gzytv.vip:8880
```

## 🔐 Autenticación

Todos los endpoints requieren autenticación mediante parámetros de URL:
- `username`: Tu nombre de usuario
- `password`: Tu contraseña

## 📋 Endpoints Principales

### 1. Autenticación y Info de Usuario

```
GET /player_api.php?username={USER}&password={PASS}
```

**Respuesta:**
```json
{
  "user_info": {
    "username": "usuario",
    "password": "contraseña",
    "auth": 1,
    "status": "Active",
    "exp_date": "1735689600",
    "is_trial": "0",
    "active_cons": "1",
    "created_at": "1640995200",
    "max_connections": "2"
  },
  "server_info": {
    "url": "http://gzytv.vip:8880",
    "port": "8880",
    "https_port": "8880",
    "server_protocol": "https",
    "rtmp_port": "1935",
    "timezone": "America/Guayaquil"
  }
}
```

### 2. Categorías de TV en Vivo

```
GET /player_api.php?username={USER}&password={PASS}&action=get_live_categories
```

**Respuesta:**
```json
[
  {
    "category_id": "1",
    "category_name": "Deportes",
    "parent_id": 0
  },
  {
    "category_id": "2",
    "category_name": "Noticias",
    "parent_id": 0
  }
]
```

### 3. Canales de TV en Vivo

```
GET /player_api.php?username={USER}&password={PASS}&action=get_live_streams
```

**Con categoría específica:**
```
GET /player_api.php?username={USER}&password={PASS}&action=get_live_streams&category_id=1
```

**Respuesta:**
```json
[
  {
    "num": 1,
    "name": "ESPN HD",
    "stream_type": "live",
    "stream_id": 1001,
    "stream_icon": "https://example.com/logo.png",
    "epg_channel_id": "espn.ec",
    "added": "1640995200",
    "category_id": "1",
    "custom_sid": "",
    "tv_archive": 1,
    "direct_source": "",
    "tv_archive_duration": 7
  }
]
```

### 4. URL de Stream en Vivo

**Formato M3U8:**
```
http://gzytv.vip:8880/live/{USERNAME}/{PASSWORD}/{STREAM_ID}.m3u8
```

**Formato TS:**
```
http://gzytv.vip:8880/live/{USERNAME}/{PASSWORD}/{STREAM_ID}.ts
```

**Ejemplo:**
```
http://gzytv.vip:8880/live/usuario/contraseña/1001.m3u8
```

### 5. Categorías de Películas (VOD)

```
GET /player_api.php?username={USER}&password={PASS}&action=get_vod_categories
```

**Respuesta:**
```json
[
  {
    "category_id": "10",
    "category_name": "Acción",
    "parent_id": 0
  },
  {
    "category_id": "11",
    "category_name": "Comedia",
    "parent_id": 0
  }
]
```

### 6. Películas (VOD)

```
GET /player_api.php?username={USER}&password={PASS}&action=get_vod_streams
```

**Con categoría:**
```
GET /player_api.php?username={USER}&password={PASS}&action=get_vod_streams&category_id=10
```

**Respuesta:**
```json
[
  {
    "num": 1,
    "name": "Avatar 2",
    "stream_type": "movie",
    "stream_id": 2001,
    "stream_icon": "https://example.com/poster.jpg",
    "rating": "8.5",
    "rating_5based": 4.25,
    "added": "1640995200",
    "category_id": "10",
    "container_extension": "mp4",
    "custom_sid": "",
    "direct_source": ""
  }
]
```

### 7. URL de Película

```
http://gzytv.vip:8880/movie/{USERNAME}/{PASSWORD}/{STREAM_ID}.{EXTENSION}
```

**Ejemplo:**
```
http://gzytv.vip:8880/movie/usuario/contraseña/2001.mp4
```

### 8. Información Detallada de Película

```
GET /player_api.php?username={USER}&password={PASS}&action=get_vod_info&vod_id={VOD_ID}
```

**Respuesta:**
```json
{
  "info": {
    "tmdb_id": "76600",
    "name": "Avatar 2",
    "cover": "https://image.tmdb.org/poster.jpg",
    "plot": "Descripción de la película...",
    "cast": "Sam Worthington, Zoe Saldana",
    "director": "James Cameron",
    "genre": "Acción, Aventura",
    "releasedate": "2022-12-16",
    "duration": "192 min",
    "rating": "8.5"
  },
  "movie_data": {
    "stream_id": 2001,
    "name": "Avatar 2",
    "container_extension": "mp4"
  }
}
```

### 9. Categorías de Series

```
GET /player_api.php?username={USER}&password={PASS}&action=get_series_categories
```

### 10. Series

```
GET /player_api.php?username={USER}&password={PASS}&action=get_series
```

**Con categoría:**
```
GET /player_api.php?username={USER}&password={PASS}&action=get_series&category_id=20
```

**Respuesta:**
```json
[
  {
    "num": 1,
    "name": "Breaking Bad",
    "series_id": 3001,
    "cover": "https://example.com/cover.jpg",
    "plot": "Un profesor de química...",
    "cast": "Bryan Cranston, Aaron Paul",
    "director": "Vince Gilligan",
    "genre": "Drama, Crimen",
    "releaseDate": "2008-01-20",
    "last_modified": "1640995200",
    "rating": "9.5",
    "rating_5based": 4.75,
    "backdrop_path": ["https://example.com/backdrop.jpg"],
    "youtube_trailer": "https://youtube.com/watch?v=...",
    "episode_run_time": "47",
    "category_id": "20"
  }
]
```

### 11. Información de Serie (Temporadas y Episodios)

```
GET /player_api.php?username={USER}&password={PASS}&action=get_series_info&series_id={SERIES_ID}
```

**Respuesta:**
```json
{
  "info": {
    "name": "Breaking Bad",
    "cover": "https://example.com/cover.jpg",
    "plot": "Descripción...",
    "cast": "Bryan Cranston, Aaron Paul",
    "genre": "Drama",
    "rating": "9.5"
  },
  "episodes": {
    "1": [
      {
        "id": "30011",
        "episode_num": 1,
        "title": "Pilot",
        "container_extension": "mp4",
        "info": {
          "duration": "58:13",
          "plot": "Walter White...",
          "rating": "9.0"
        }
      }
    ],
    "2": [
      {
        "id": "30021",
        "episode_num": 1,
        "title": "Seven Thirty-Seven",
        "container_extension": "mp4"
      }
    ]
  },
  "seasons": [
    {
      "season_number": 1,
      "name": "Season 1",
      "episode_count": 7,
      "cover": "https://example.com/season1.jpg"
    }
  ]
}
```

### 12. URL de Episodio de Serie

```
http://gzytv.vip:8880/series/{USERNAME}/{PASSWORD}/{EPISODE_ID}.{EXTENSION}
```

**Ejemplo:**
```
http://gzytv.vip:8880/series/usuario/contraseña/30011.mp4
```

### 13. EPG (Guía Electrónica de Programación)

```
GET /player_api.php?username={USER}&password={PASS}&action=get_simple_data_table&stream_id={STREAM_ID}
```

**Respuesta:**
```json
{
  "epg_listings": [
    {
      "id": "1",
      "epg_id": "espn.ec",
      "title": "SportsCenter",
      "start": "2024-01-01 18:00:00",
      "end": "2024-01-01 19:00:00",
      "description": "Noticias deportivas",
      "channel_id": "espn.ec"
    }
  ]
}
```

## 🔄 Códigos de Estado

| Código | Significado |
|--------|-------------|
| auth: 1 | Autenticación exitosa |
| auth: 0 | Autenticación fallida |
| status: "Active" | Cuenta activa |
| status: "Banned" | Cuenta bloqueada |
| status: "Disabled" | Cuenta deshabilitada |
| status: "Expired" | Cuenta expirada |

## 📊 Tipos de Stream

| Tipo | Descripción |
|------|-------------|
| live | Canal en vivo |
| movie | Película VOD |
| series | Episodio de serie |
| radio | Radio en vivo |

## 🎬 Extensiones de Contenedor

| Extensión | Uso |
|-----------|-----|
| .m3u8 | Streaming adaptativo (HLS) |
| .ts | Transport Stream |
| .mp4 | Video MP4 |
| .mkv | Matroska Video |
| .avi | Audio Video Interleave |

## 🔒 Seguridad

- Usa HTTPS para todas las peticiones
- No compartas tus credenciales
- Las credenciales se envían en texto plano en la URL
- Considera usar un proxy para mayor seguridad

## ⚡ Límites y Consideraciones

- **Max Connections**: Número máximo de streams simultáneos
- **Active Connections**: Streams actualmente en uso
- **Exp Date**: Fecha de expiración en timestamp Unix
- **TV Archive**: Días de archivo disponible para replay

## 🛠️ Implementación en la App

La app usa el servicio `iptvServicio.ts` que encapsula todas estas llamadas:

```typescript
// Login
await iptvServicio.login(username, password);

// Obtener canales
const canales = await iptvServicio.getLiveStreams();

// Obtener URL de stream
const url = iptvServicio.getLiveStreamUrl(streamId, 'm3u8');
```

## 📝 Notas Importantes

1. **Timestamps**: Las fechas están en formato Unix timestamp (segundos desde 1970)
2. **Categorías**: parent_id indica subcategorías (0 = categoría principal)
3. **Ratings**: rating_5based es el rating convertido a escala de 5 estrellas
4. **Archive**: tv_archive indica si el canal tiene función de replay
5. **Direct Source**: Si está presente, usar esa URL en lugar de la generada

## 🔗 URLs de Ejemplo Completas

```bash
# Autenticación
http://gzytv.vip:8880/player_api.php?username=demo&password=demo

# Canales en vivo
http://gzytv.vip:8880/player_api.php?username=demo&password=demo&action=get_live_streams

# Stream en vivo
http://gzytv.vip:8880/live/demo/demo/1001.m3u8

# Películas
http://gzytv.vip:8880/player_api.php?username=demo&password=demo&action=get_vod_streams

# Stream de película
http://gzytv.vip:8880/movie/demo/demo/2001.mp4

# Series
http://gzytv.vip:8880/player_api.php?username=demo&password=demo&action=get_series

# Info de serie
http://gzytv.vip:8880/player_api.php?username=demo&password=demo&action=get_series_info&series_id=3001

# Stream de episodio
http://gzytv.vip:8880/series/demo/demo/30011.mp4
```

## 🧪 Probar la API

Puedes probar los endpoints directamente en el navegador o con curl:

```bash
# Probar autenticación
curl "http://gzytv.vip:8880/player_api.php?username=TU_USUARIO&password=TU_CONTRASEÑA"

# Probar canales
curl "http://gzytv.vip:8880/player_api.php?username=TU_USUARIO&password=TU_CONTRASEÑA&action=get_live_streams"
```

---

**Nota**: Reemplaza `TU_USUARIO` y `TU_CONTRASEÑA` con tus credenciales reales de GZYTV.
