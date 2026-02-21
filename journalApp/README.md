# FleetFlow — Spring Boot Service

## Overview
Spring Boot 2.7.16 / Java 1.8 service implementing fleet management features:
- **Vehicles** (assets) CRUD
- **Drivers** management
- **Dashboard** KPIs
- **Reports** CSV export
- JWT validation (HS256 tokens issued by Node)
- Redis Pub/Sub → STOMP WebSocket push

## Prerequisites
- Docker & Docker Compose

## Run with Docker Compose

```bash
cd journalApp
docker-compose up --build
```

This starts:
- MongoDB (replica set on port 27017)
- Redis (port 6379)
- Spring Boot app (port 8080)

## Run locally (dev)

Ensure MongoDB and Redis are running, then:

```bash
export AUTH_SHARED_SECRET=changeme
./mvnw spring-boot:run
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATA_MONGODB_URI` | `mongodb://mongo:27017/fleetflow` | MongoDB connection |
| `SPRING_REDIS_HOST` | `redis` | Redis host |
| `AUTH_SHARED_SECRET` | `changeme` | JWT HS256 shared secret |

## Authentication

All endpoints require a valid JWT in `Authorization: Bearer <token>`. Tokens are issued by the Node auth service using HS256 with the shared secret.

JWT claims expected:
```json
{
  "_id": "user-id",
  "role": "Fleet Manager | Dispatcher | Safety Office | Financial Analyst"
}
```

## Sample curl Commands

### Register a new vehicle (Fleet Manager)
```bash
curl -X POST http://localhost:8080/api/vehicles/register-new-asset \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Cargo Truck 01",
    "model": "Volvo FH16",
    "licensePlate": "ABC-1234",
    "vehicleType": "Truck",
    "region": "North",
    "maxLoadCapacity": 20000,
    "acquisitionCost": 85000
  }'
```

### Get fleet KPIs (Fleet Manager / Dispatcher / Financial Analyst)
```bash
curl http://localhost:8080/api/dashboard/get-fleet-kpis \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## API Endpoints

### Vehicles
| Method | Endpoint | Roles |
|---|---|---|
| GET | `/api/vehicles/get-all-assets` | Fleet Manager, Dispatcher, Safety Office |
| POST | `/api/vehicles/register-new-asset` | Fleet Manager |
| PATCH | `/api/vehicles/update-asset-details/{vehicleId}` | Fleet Manager |
| PATCH | `/api/vehicles/toggle-retirement-status/{vehicleId}` | Fleet Manager |
| GET | `/api/vehicles/get-available-for-dispatch` | Dispatcher |

### Drivers
| Method | Endpoint | Roles |
|---|---|---|
| GET | `/api/drivers/get-all-profiles` | Fleet Manager, Dispatcher, Safety Office |
| POST | `/api/drivers/onboard-new-driver` | Fleet Manager, Safety Office |
| PATCH | `/api/drivers/update-duty-status/{driverId}` | Safety Office, Fleet Manager |
| GET | `/api/drivers/verify-license-compliance/{driverId}` | Dispatcher, Safety Office |

### Dashboard
| Method | Endpoint | Roles |
|---|---|---|
| GET | `/api/dashboard/get-fleet-kpis` | Fleet Manager, Dispatcher, Financial Analyst |

### Reports
| Method | Endpoint | Roles |
|---|---|---|
| GET | `/api/reports/export-operational-data` | Fleet Manager, Financial Analyst |

## WebSocket

Connect via STOMP to `ws://localhost:8080/ws` and subscribe to `/topic/fleet/availability` for real-time fleet updates.

