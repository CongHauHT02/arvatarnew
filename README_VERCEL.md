# Hướng Dẫn Triển Khai Game Avatar 2D Lên Vercel

Dự án này đã được cấu hình sẵn sàng để bạn có thể tải lên **Vercel** chỉ bằng 1 thao tác kết nối Git!

---

## 1. Kiến trúc hệ thống khi chạy trên Vercel

```
[ Người Chơi Vào Trình Duyệt / Điện Thoại ]
                     │
                     ▼
         [ Vercel Cloud (Web CDN) ]
         - Giao diện Web Portal hiện đại
         - Trình giả lập chơi game trên Web (CheerpJ WebAssembly)
         - Bàn phím ảo cảm ứng (D-Pad, phím số 0-9)
         - API Đăng ký tài khoản (/api/register)
         - Link tải bộ cài đặt JAR / Android / PC
                     │
                     ▼ (WebSocket Proxy)
         [ Game Server Java & MySQL ]
         (Chạy trên Máy tính cá nhân HOẶC Cloud VPS / Render / Railway)
```

---

## 2. Cách tải lên (Deploy) Vercel

1. **Đưa mã nguồn lên GitHub/GitLab**:
   - Khởi tạo Git repo và commit toàn bộ thư mục này.
   - Push lên tài khoản GitHub của bạn.

2. **Import vào Vercel**:
   - Truy cập [vercel.com](https://vercel.com) và đăng nhập.
   - Bấm **Add New...** -> **Project** -> Chọn repository vừa push.
   - Tại mục **Build and Output Settings**, giữ nguyên mặc định (Vercel sẽ tự động đọc file `vercel.json` đã được tạo sẵn).
   - (Tùy chọn) Tại mục **Environment Variables**, nếu bạn có Database MySQL online (Aiven, TiDB, Clever Cloud):
     - `DB_HOST`: Địa chỉ host MySQL
     - `DB_USER`: Tên user MySQL
     - `DB_PASSWORD`: Mật khẩu MySQL
     - `DB_NAME`: `avatar_2x`
   - Bấm **Deploy**.

Sau khoảng 30 giây, bạn sẽ nhận được một đường link miễn phí dạng:  
`https://avatar-teamobi-xxx.vercel.app`

---

## 3. Cách chạy Server Game để Web kết nối vào

Do Vercel là nền tảng Serverless tĩnh, game server Java (`Avatar2D-1.0-SNAPSHOT.jar`) cần chạy trên máy bạn hoặc VPS:

### Cách 1: Chạy trực tiếp trên máy tính của bạn (Localhost)
1. **Cài đặt JDK 17 & MySQL**:
   ```powershell
   winget install Microsoft.OpenJDK.17
   winget install Oracle.MySQL
   ```
2. **Tạo Database và import dữ liệu**:
   - Tạo DB `avatar_2x` trong MySQL.
   - Import file `database/avatar_2x.sql`.
3. **Chạy Server Game**:
   ```powershell
   java -jar target/Avatar2D-1.0-SNAPSHOT.jar
   ```
4. **Chạy WebSocket Proxy Bridge**:
   ```powershell
   npm install
   node ws-proxy.js
   ```
5. **Mở cổng ra ngoài Internet (để link Vercel kết nối được vào máy bạn)**:
   ```powershell
   # Dùng ngrok miễn phí:
   ngrok http 19129
   ```
   Sau đó nhập địa chỉ `wss://...ngrok-free.app` vào ô **WebSocket Proxy** trên giao diện Web Vercel.

---

### Cách 2: Chạy bằng Docker (1 lệnh duy nhất)
Nếu máy bạn hoặc VPS có cài Docker:
```bash
docker compose up -d
```
Hệ thống sẽ tự động khởi tạo MySQL, nạp 10MB dữ liệu `avatar_2x.sql`, bật Server Java và mở WebSocket Proxy sẵn sàng!
