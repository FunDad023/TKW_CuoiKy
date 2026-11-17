Cấu trúc dự án:

├── index.html              # Khung HTML chính
├── css/
│   ├── base.css            # Màu sắc chủ đạo, font chữ, chia bố cục 2 cột (layout)
│   ├── cart-table.css      # CSS cho Bảng môn đã chọn & Responsive
│   ├── course-list.css     # CSS cho Thẻ môn học & hiệu ứng Hover
|   ├── header-search.css   # CSS cho Header & Form tìm kiếm
│   └── payment.css         # CSS cho chuyển khoản
└── js/
    ├── search.js           # Logic tìm kiếm & lọc môn học
    ├── cart.js             # Logic Giỏ hàng, tính tín chỉ & chặn > 25 TC
    └── payment.js          # Logic cho phần chuyển khoản
    
    
Phân công:

- Lương Duy Thuận (leader)
    + index.html
    + base.css
    + cart.js
- Trần Trương Duy Nghĩa
    + header-search.css
    + payment.js
    + search.js
- Nguyễn Ngọc Lam Trường
    + cart-table.css
    + course-list.css
    + payment.css
