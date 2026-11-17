// nghia — Logic tìm kiếm và lọc môn học.
(() => {
  "use strict";

  const COURSE_CATALOG = [
    {
      id: "WEB101",
      code: "WEB101",
      name: "Lập trình Web",
      credits: 3,
      description: "Nền tảng HTML, CSS và JavaScript để xây dựng ứng dụng web.",
    },
    {
      id: "PRF192",
      code: "PRF192",
      name: "Lập trình cơ bản",
      credits: 3,
      description: "Làm quen với tư duy thuật toán và kỹ năng lập trình.",
    },
    {
      id: "DBI202",
      code: "DBI202",
      name: "Cơ sở dữ liệu",
      credits: 3,
      description: "Thiết kế, truy vấn và quản lý dữ liệu quan hệ.",
    },
    {
      id: "JPD113",
      code: "JPD113",
      name: "Tiếng Nhật sơ cấp",
      credits: 3,
      description: "Phát triển từ vựng, ngữ pháp và giao tiếp tiếng Nhật.",
    },
    {
      id: "MAD101",
      code: "MAD101",
      name: "Toán rời rạc",
      credits: 3,
      description: "Các cấu trúc toán học nền tảng trong ngành máy tính.",
    },
    {
      id: "SWE201",
      code: "SWE201",
      name: "Nhập môn Kỹ thuật phần mềm",
      credits: 3,
      description: "Tìm hiểu quy trình phân tích và phát triển phần mềm.",
    },
  ];

  const form = document.querySelector("#course-search-form");
  const input = document.querySelector("#course-search-input");
  const courseList = document.querySelector("#course-list");
  const emptyState = document.querySelector("#course-empty-state");

  if (!form || !input || !courseList || !emptyState) return;

  function createCourseCard(course) {
    const card = document.createElement("article");
    card.className = "course-card";
    card.dataset.courseId = course.id;
    card.dataset.courseCode = course.code;
    card.dataset.courseName = course.name;
    card.dataset.credits = String(course.credits);

    const details = document.createElement("div");
    details.className = "course-card-details";

    const code = document.createElement("p");
    code.className = "course-code";
    code.textContent = course.code;

    const name = document.createElement("h3");
    name.dataset.courseTitle = "";
    name.textContent = course.name;

    const description = document.createElement("p");
    description.className = "course-description";
    description.textContent = course.description;
    details.append(code, name, description);

    const footer = document.createElement("div");
    footer.className = "course-card-footer";

    const credits = document.createElement("span");
    credits.className = "course-credits";
    credits.textContent = `${course.credits} tín chỉ`;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "course-add-button";
    addButton.dataset.cartAction = "add";
    addButton.textContent = "Thêm môn";

    footer.append(credits, addButton);
    card.append(details, footer);
    return card;
  }

  // Dùng nội dung đã có trong HTML nếu danh sách được điền sẵn.
  if (!courseList.querySelector(".course-card[data-course-id]")) {
    const cards = COURSE_CATALOG.map(createCourseCard);
    courseList.replaceChildren(...cards);
  }

  const normalize = (value) =>
    value
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();

  function filterCourses() {
    const query = normalize(input.value);
    const cards = [...courseList.querySelectorAll(".course-card[data-course-id]")];
    let visibleCount = 0;

    for (const card of cards) {
      const searchableText = normalize(
        [card.dataset.courseCode, card.dataset.courseName, card.textContent].join(" "),
      );
      const matches = !query || searchableText.includes(query);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    }

    emptyState.hidden = visibleCount > 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCourses();
  });

  input.addEventListener("input", filterCourses);
  filterCourses();
})();

