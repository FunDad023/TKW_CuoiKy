// nghia — Logic tìm kiếm và lọc môn học.
(() => {
  "use strict";

  const form = document.querySelector("#course-search-form");
  const input = document.querySelector("#course-search-input");
  const courseList = document.querySelector("#course-list");
  const emptyState = document.querySelector("#course-empty-state");
  const courseCount = document.querySelector("#course-count");

  if (!form || !input || !courseList || !emptyState) return;

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
    if (courseCount) courseCount.textContent = `${visibleCount} môn học`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterCourses();
  });

  input.addEventListener("input", filterCourses);
  filterCourses();
})();

