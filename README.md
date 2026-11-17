# Smart Enrollment — Cổng đăng ký môn học thông minh

Bài tập HTML5, CSS3 và JavaScript thuần. Mở `index.html` trực tiếp bằng trình duyệt; dự án hiện không cần cài thư viện hay chạy build.

Phiên bản hiện tại có danh mục 9 môn học mẫu khai báo trực tiếp trong `index.html`, tìm kiếm/lọc trực tiếp, giỏ hàng môn học, giới hạn 25 tín chỉ và luồng checkout mô phỏng. Dữ liệu chọn được giữ trong phiên mở trang; tải lại trang sẽ đặt giỏ về rỗng.

## Cấu trúc và phân công

```text
index.html                 Khung trang và các điểm tích hợp — Leader
css/
  base.css                 Bảng màu, font chữ, layout dùng chung — Leader
  header-search.css        Header và form tìm kiếm — Nghĩa
  course-list.css          Thẻ môn học và hiệu ứng hover — Trương
  cart-table.css           Bảng môn đã chọn và responsive — Trương
  payment.css              Checkout demo và trạng thái giao dịch — Leader
assets/
  payment-qr.jpg           Ảnh QR thanh toán
js/
  search.js                Tìm kiếm và lọc môn học — Nghĩa
  cart.js                  Giỏ hàng và giới hạn 25 tín chỉ — Leader
  payment.js               Tính tiền minh họa và mô phỏng thanh toán — Leader
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
- Các mốc responsive chung là `820px` (chuyển layout chính thành một cột) và `540px` (tối ưu khoảng cách, form và bảng trên điện thoại).
- CSS của từng thành viên nên tập trung vào phần được giao, tái sử dụng biến màu và bo góc chung (`--radius-card`, `--radius-control`), tránh đặt lại style toàn cục cho `body`, `h1`, `button`.
- Giữ nguyên các ID trong `index.html` vì JavaScript dựa vào chúng để kết nối giao diện: `course-search-form`, `course-search-input`, `course-list`, `course-empty-state`, `course-count`, `cart-items`, `cart-empty-state`, `cart-count`, `total-credits`, `credit-progress`, `credit-progress-label`, `cart-message`, `payment-amount`, `payment-submit`, `payment-status`, `qr-dialog`, `qr-code-frame`, `qr-payment-amount`, `qr-close`, `qr-done`.

## Hợp đồng dữ liệu giữa danh sách và giỏ hàng

Mỗi thẻ môn học trong `#course-list` cần có `data-course-id` và `data-credits`. Giỏ hàng đọc thêm `data-course-code` và `data-course-name` để hiện đúng thông tin. Nút thêm môn đặt `data-cart-action="add"` bên trong thẻ:

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

`data-credits` phải là số nguyên dương. Nút xóa trong giỏ dùng `data-cart-action="remove"` và `data-course-id`; `js/cart.js` tạo các nút này tự động. Không cần viết xử lý giỏ hàng trong `search.js` hay `course-list.css`. Mã môn và tín chỉ trong danh mục hiện là dữ liệu mẫu; thay bằng danh mục chính thức của trường trước khi sử dụng thật.

## Thanh toán QR

Nút thanh toán mở modal có lớp nền tối và mờ, ảnh QR từ `assets/payment-qr.jpg` cùng số tiền cần chuyển. Đóng modal bằng nút, nhấp vùng nền hoặc nhấn Escape; nền trang sẽ trở lại bình thường. Nếu chưa có ảnh, trang hiện họa tiết QR dự phòng không quét được. Mức `500.000 ₫ / tín chỉ` trong `js/payment.js` là giá giả lập, không phải học phí chính thức.

Để tạo QR ngân hàng dùng được thật cần cung cấp ngân hàng/mã ngân hàng, số tài khoản nhận, tên chủ tài khoản, nội dung chuyển khoản và học phí chính thức/cách tính tiền. Cũng cần thống nhất chuẩn QR hoặc cổng thanh toán, backend triển khai HTTPS và cách đối soát giao dịch. Thông tin tài khoản nhận nên đặt trong cấu hình triển khai; khóa bí mật của cổng phải nằm ở biến môi trường phía máy chủ, không đưa vào HTML/JavaScript phía trình duyệt hoặc commit lên Git.

## Phạm vi hiện tại và hướng phát triển

QR thật, kiểm tra môn tiên quyết và tự động tối ưu thời khóa biểu là các phần phát triển tiếp theo. Bài tập hiện tại có modal QR minh họa để trình bày trải nghiệm thanh toán; tạo lệnh chuyển tiền và xác nhận giao dịch thật vẫn cần thông tin người nhận cùng backend.

## Quy ước khi cùng phát triển

1. Chỉ sửa các file thuộc phần mình phụ trách; nếu cần đổi ID hoặc hợp đồng dữ liệu, thống nhất trước với người đang làm `index.html`/`cart.js`.
2. Giữ nguyên `defer` và thứ tự liên kết script trong `index.html`; script được chạy sau khi DOM đã sẵn sàng.
3. Dùng class riêng cho component, không tạo ID trùng lặp. Các nút thao tác phải khai báo `type="button"` để tránh submit form tìm kiếm.
4. Khi hoàn tất, mở `index.html` và thử ở màn hình rộng lẫn hẹp; kiểm tra console nếu có lỗi JavaScript.
