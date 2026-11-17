# Smart Enrollment — Cổng đăng ký môn học thông minh

Bài tập HTML5, CSS3 và JavaScript thuần. Mở `index.html` trực tiếp bằng trình duyệt; dự án hiện không cần cài thư viện hay chạy build.

## Cấu trúc và phân công

```text
index.html                 Khung trang và các điểm tích hợp — Leader
css/
  base.css                 Bảng màu, font chữ, layout dùng chung — Leader
  header-search.css        Header và form tìm kiếm — Nghĩa
  course-list.css          Thẻ môn học và hiệu ứng hover — Trương
  cart-table.css           Bảng môn đã chọn và responsive — Trương
js/
  search.js                Tìm kiếm và lọc môn học — Nghĩa
  cart.js                  Giỏ hàng và giới hạn 25 tín chỉ — Leader
```

## Quy ước giao diện

- Font chữ: `Arial, Helvetica, sans-serif` (sans-serif, không cần tải font ngoài).
- Màu chủ đạo: xanh lá chuối và vàng nhạt. Dùng các CSS custom properties trong `css/base.css` thay vì đặt màu rời rạc:
  - `--green-950`, `--green-900`, `--green-800`, `--green-700`
  - `--green-100`, `--green-50`
  - `--banana-500`, `--banana-300`
  - `--ink`, `--muted`, `--surface`, `--page`, `--line`, `--danger`
- Nền header có vân sọc chéo xanh-vàng. Giữ phong cách này khi bổ sung chi tiết để các phần giao diện thống nhất.
- Layout chính dùng `.page-layout` với hai cột trên màn hình rộng và tự chuyển thành một cột trên màn hình nhỏ. Các vùng nội dung dùng `.panel`.
- CSS của từng thành viên nên tập trung vào phần được giao, tái sử dụng biến màu và bo góc chung (`--radius-card`, `--radius-control`), tránh đặt lại style toàn cục cho `body`, `h1`, `button`.
- Giữ nguyên các ID trong `index.html` vì JavaScript dựa vào chúng để kết nối giao diện.

## Hợp đồng dữ liệu giữa danh sách và giỏ hàng

Mỗi thẻ môn học do phần danh sách tạo cần có `data-course-id` và `data-credits`. Giỏ hàng đọc thêm `data-course-code` và `data-course-name` để hiện đúng thông tin. Nút thêm môn đặt `data-cart-action="add"` bên trong thẻ:

```html
<article
  class="course-card"
  data-course-id="WEB101"
  data-course-code="WEB101"
  data-course-name="Lập trình Web"
  data-credits="3"
>
  <h3>Lập trình Web</h3>
  <button type="button" data-cart-action="add">Thêm môn</button>
</article>
```

`data-credits` phải là số nguyên dương. Nút xóa trong giỏ dùng `data-cart-action="remove"` và `data-course-id`; `js/cart.js` tạo các nút này tự động. Không cần viết xử lý giỏ hàng trong `search.js` hay `course-list.css`.

## Quy ước khi cùng phát triển

1. Chỉ sửa các file thuộc phần mình phụ trách; nếu cần đổi ID hoặc hợp đồng dữ liệu, thống nhất trước với người đang làm `index.html`/`cart.js`.
2. Giữ nguyên `defer` và thứ tự liên kết script trong `index.html`; script được chạy sau khi DOM đã sẵn sàng.
3. Dùng class riêng cho component, không tạo ID trùng lặp. Các nút thao tác phải khai báo `type="button"` để tránh submit form tìm kiếm.
4. Khi hoàn tất, mở `index.html` và thử ở màn hình rộng lẫn hẹp; kiểm tra console nếu có lỗi JavaScript.
