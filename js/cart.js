// LEADER: giỏ môn học, tổng tín chỉ và giới hạn 25 tín chỉ.
(() => {
  "use strict";

  const CREDIT_LIMIT = 25;
  const courses = new Map();
  const cartItems = document.querySelector("#cart-items");
  const totalCreditsElement = document.querySelector("#total-credits");
  const emptyState = document.querySelector("#cart-empty-state");
  const tableWrapper = document.querySelector(".cart-table-wrapper");
  const message = document.querySelector("#cart-message");
  const courseList = document.querySelector("#course-list");

  if (!cartItems || !totalCreditsElement || !emptyState || !message) return;

  const getTotalCredits = () =>
    [...courses.values()].reduce((total, course) => total + course.credits, 0);

  function announce(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
  }

  function syncAddButtons() {
    document.querySelectorAll('[data-cart-action="add"]').forEach((button) => {
      const card = button.closest("[data-course-id]");
      if (!card) return;

      if (!button.dataset.cartDefaultLabel) {
        button.dataset.cartDefaultLabel = button.textContent.trim() || "Thêm môn";
      }

      const id = card.dataset.courseId;
      const selected = courses.has(id);
      const full = getTotalCredits() >= CREDIT_LIMIT && !selected;
      button.disabled = selected || full;
      const label = selected
        ? "Đã thêm"
        : full
          ? "Đã đủ 25 TC"
          : button.dataset.cartDefaultLabel;
      if (button.textContent !== label) button.textContent = label;
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function renderCart() {
    const total = getTotalCredits();
    cartItems.replaceChildren();

    for (const course of courses.values()) {
      const row = document.createElement("tr");
      const codeCell = document.createElement("td");
      const nameCell = document.createElement("td");
      const creditsCell = document.createElement("td");
      const actionCell = document.createElement("td");
      const removeButton = document.createElement("button");

      codeCell.textContent = course.code;
      nameCell.textContent = course.name;
      creditsCell.textContent = String(course.credits);
      removeButton.type = "button";
      removeButton.className = "cart-remove-button";
      removeButton.dataset.cartAction = "remove";
      removeButton.dataset.courseId = course.id;
      removeButton.setAttribute("aria-label", `Xóa môn ${course.name}`);
      removeButton.textContent = "Xóa";

      actionCell.append(removeButton);
      row.append(codeCell, nameCell, creditsCell, actionCell);
      cartItems.append(row);
    }

    totalCreditsElement.textContent = String(total);
    emptyState.hidden = courses.size > 0;
    if (tableWrapper) tableWrapper.hidden = courses.size === 0;
    totalCreditsElement.closest("strong")?.classList.toggle("is-at-limit", total >= CREDIT_LIMIT);
    syncAddButtons();
  }

  function addCourse(card) {
    const id = card.dataset.courseId?.trim();
    const code = card.dataset.courseCode?.trim() || card.dataset.code?.trim() || id;
    const name =
      card.dataset.courseName?.trim() ||
      card.dataset.courseTitle?.trim() ||
      card.querySelector("[data-course-title], h3, h4")?.textContent.trim() ||
      code;
    const credits = Number(card.dataset.credits);

    if (!id || !Number.isInteger(credits) || credits <= 0) {
      announce("Thông tin môn học không hợp lệ. Vui lòng kiểm tra mã môn và data-credits.", true);
      return;
    }
    if (courses.has(id)) {
      announce(`${name} đã có trong danh sách chọn.`);
      return;
    }
    if (getTotalCredits() + credits > CREDIT_LIMIT) {
      announce(`Không thể thêm ${name}: tổng tín chỉ không được vượt quá ${CREDIT_LIMIT}.`, true);
      return;
    }

    courses.set(id, { id, code, name, credits });
    renderCart();
    announce(`Đã thêm ${name} (${credits} tín chỉ).`);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button || button.disabled) return;

    const action = button.dataset.cartAction;
    if (action === "add") {
      const card = button.closest("[data-course-id]");
      if (card) addCourse(card);
      return;
    }

    if (action === "remove") {
      const course = courses.get(button.dataset.courseId);
      if (!course) return;
      courses.delete(course.id);
      renderCart();
      announce(`Đã xóa ${course.name} khỏi danh sách chọn.`);
    }
  });

  renderCart();

  // Cập nhật trạng thái nút nếu danh sách môn học được JavaScript khác tạo động.
  if (courseList) {
    new MutationObserver(syncAddButtons).observe(courseList, {
      childList: true,
      subtree: true,
    });
  }
})();
