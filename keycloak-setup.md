# Keycloak Setup cho Project Hola

✅ **STATUS: HOÀN THÀNH - Keycloak đã được setup thành công!**

## 1. Khởi chạy Keycloak

### Option A: Simple Keycloak (Đã chạy - sẵn sàng sử dụng)
```bash
# Current running instance
docker ps | grep keycloak
# => hola_keycloak_simple running on port 9080
```

### Option B: Full Docker Compose với PostgreSQL
```bash
# Start Keycloak và PostgreSQL
docker compose -f docker-compose.keycloak.yml up -d

# Kiểm tra status
docker compose -f docker-compose.keycloak.yml ps

# Xem logs (nếu cần troubleshoot)
docker compose -f docker-compose.keycloak.yml logs -f keycloak
```

## 2. Truy cập Keycloak (READY!)

### Simple Instance (Sẵn sàng):
- **Admin Console**: http://localhost:9080/admin
- **Public URL**: http://localhost:9080
- **Username**: `admin`
- **Password**: `hola_admin_2025`

### Docker Compose Instance:
- **Admin Console**: http://localhost:8080/admin
- **Public URL**: http://localhost:8080
- **Username**: `admin`
- **Password**: `hola_admin_2025`

## 3. Cấu hình ban đầu

### Tạo Realm cho app Hola:
1. Vào Admin Console
2. Click "Create Realm"
3. Realm name: `hola-realm`
4. Click "Create"

### Tạo Client cho React Native app:
1. Trong realm `hola-realm`, vào "Clients"
2. Click "Create client"
3. **Client ID**: `hola-app`
4. **Client type**: `Public` (cho mobile app)
5. **Valid redirect URIs**: 
   - `http://localhost:*` (development)
   - `hola://auth/callback` (deep link cho app)
6. **Web origins**: `*` (development) hoặc specific origins cho production

### Tạo User test:
1. Vào "Users"
2. Click "Create new user"
3. Username: `testuser`
4. Email: `test@hola.app`
5. Set password ở tab "Credentials"

## 4. Environment Variables

Đã được thêm vào `.env`:
```
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=hola-realm
KEYCLOAK_CLIENT_ID=hola-app
KEYCLOAK_ADMIN_URL=http://localhost:8080/admin
```

## 5. Tắt Keycloak

```bash
# Stop services
docker compose -f docker-compose.keycloak.yml down

# Stop và xóa volumes (reset data)
docker compose -f docker-compose.keycloak.yml down -v
```

## 6. Database Info

- **Host**: localhost:5432
- **Database**: keycloak
- **Username**: keycloak
- **Password**: keycloak_secure_password_2025

## 7. Troubleshooting

### Nếu container không start:
```bash
# Check logs
docker compose -f docker-compose.keycloak.yml logs

# Restart services
docker compose -f docker-compose.keycloak.yml restart
```

### Nếu port 8080 đã được sử dụng:
Sửa port trong `docker-compose.keycloak.yml`:
```yaml
ports:
  - "8081:8080"  # Change to different port
```

## 8. Next Steps để integrate với React Native

1. Cài đặt Keycloak client library cho React Native
2. Configure authentication flows
3. Implement login/logout functionality
4. Handle token storage và refresh