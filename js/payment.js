// LEADER: hiển thị QR demo và số tiền theo tín chỉ đã chọn.
(() => {
  "use strict";

  // Giá minh họa; thay bằng mức học phí chính thức khi kết nối backend thanh toán.
  const DEMO_PRICE_PER_CREDIT = 500_000;
  const paymentButton = document.querySelector("#payment-submit");
  const amountElement = document.querySelector("#payment-amount");
  const statusElement = document.querySelector("#payment-status");
  const totalCreditsElement = document.querySelector("#total-credits");
  const dialog = document.querySelector("#qr-dialog");
  const qrFrame = document.querySelector("#qr-code-frame");
  const qrAmount = document.querySelector("#qr-payment-amount");
  const qrPaymentNote = document.querySelector("#qr-payment-note");
  const qrInstructions = document.querySelector("#qr-instructions");
  const closeButtons = [document.querySelector("#qr-close"), document.querySelector("#qr-done")];
  const currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  if (!paymentButton || !amountElement || !statusElement || !totalCreditsElement || !dialog || !qrFrame || !qrAmount) return;

  let totalCredits = Number(totalCreditsElement.textContent) || 0;
  let providedQrAvailable = false;
  let providedQrRequested = false;
  const providedQr = new Image();
  providedQr.className = "payment-qr-image";
  providedQr.alt = "Mã QR thanh toán được cung cấp";
  providedQr.addEventListener("load", () => {
    providedQrAvailable = true;
    if (dialog.open) showProvidedQr();
  });
  providedQr.addEventListener("error", () => {
    providedQrAvailable = false;
  });

  function showProvidedQr() {
    qrFrame.replaceChildren(providedQr);
    if (qrInstructions) qrInstructions.textContent = "Quét mã QR bằng ứng dụng ngân hàng của bạn.";
    if (qrPaymentNote) {
      qrPaymentNote.textContent = "Số tiền đang hiển thị là mức minh họa; hãy đối chiếu số tiền trước khi chuyển.";
    }
  }

  function setStatus(text, state = "") {
    statusElement.textContent = text;
    statusElement.dataset.state = state;
  }

  function updateAmount(credits) {
    totalCredits = Number(credits) || 0;
    amountElement.textContent = currency.format(totalCredits * DEMO_PRICE_PER_CREDIT);
    paymentButton.disabled = totalCredits <= 0;
    setStatus(
      totalCredits > 0
        ? "Đã sẵn sàng. Mã QR sẽ hiển thị trong cửa sổ xác nhận."
        : "Chọn môn học để tạo mã QR demo.",
    );

    if (dialog.open) qrAmount.textContent = currency.format(totalCredits * DEMO_PRICE_PER_CREDIT);
  }

  function addRect(svg, x, y, width, height, fill) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(height));
    rect.setAttribute("fill", fill);
    svg.append(rect);
  }

  // Họa tiết dự phòng nếu ảnh payment-qr.jpg chưa được thêm vào assets/.
  function createDemoQr(seedText) {
    const size = 29;
    const quietZone = 4;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${size + quietZone * 2} ${size + quietZone * 2}`);
    svg.setAttribute("class", "qr-demo-art");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Họa tiết QR minh họa, không thể quét để thanh toán");
    addRect(svg, 0, 0, size + quietZone * 2, size + quietZone * 2, "#ffffff");

    let randomState = [...seedText].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 17);
    const isBlack = () => {
      randomState = (randomState * 1664525 + 1013904223) >>> 0;
      return randomState > 0x7fffffff;
    };
    const finderOrigins = [[0, 0], [size - 7, 0], [0, size - 7]];
    const inFinderArea = (x, y) => finderOrigins.some(([left, top]) =>
      x >= left - 1 && x <= left + 7 && y >= top - 1 && y <= top + 7,
    );
    const modules = [];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (inFinderArea(x, y)) continue;
        if ((x === 6 && y > 7 && y < size - 8) || (y === 6 && x > 7 && x < size - 8)) {
          if ((x + y) % 2 === 0) modules.push([x, y]);
          continue;
        }
        if (isBlack()) modules.push([x, y]);
      }
    }

    for (const [x, y] of modules) addRect(svg, x + quietZone, y + quietZone, 1, 1, "#11130f");

    for (const [left, top] of finderOrigins) {
      addRect(svg, left + quietZone, top + quietZone, 7, 7, "#11130f");
      addRect(svg, left + quietZone + 1, top + quietZone + 1, 5, 5, "#ffffff");
      addRect(svg, left + quietZone + 2, top + quietZone + 2, 3, 3, "#11130f");
    }

    const logoHalo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    logoHalo.setAttribute("cx", String(size / 2 + quietZone));
    logoHalo.setAttribute("cy", String(size / 2 + quietZone));
    logoHalo.setAttribute("r", "4.6");
    logoHalo.setAttribute("fill", "#ffffff");
    logoHalo.setAttribute("stroke", "#e3e9df");
    logoHalo.setAttribute("stroke-width", "0.5");
    svg.append(logoHalo);

    const logoMark = document.createElementNS("http://www.w3.org/2000/svg", "path");
    logoMark.setAttribute("d", `M${size / 2 + quietZone} ${size / 2 + quietZone - 2.6} l2.5 4.6 h-5 z`);
    logoMark.setAttribute("fill", "#f0cb4d");
    svg.append(logoMark);

    return svg;
  }

  function openQrDialog() {
    if (totalCredits <= 0) {
      setStatus("Hãy chọn ít nhất một môn học trước khi tạo mã QR.", "error");
      return;
    }

    const amount = totalCredits * DEMO_PRICE_PER_CREDIT;
    qrAmount.textContent = currency.format(amount);
    if (!providedQrRequested) {
      providedQrRequested = true;
  providedQr.src = "assets/payment-qr.jpg";
    }
    if (providedQrAvailable) {
      showProvidedQr();
    } else {
      qrFrame.replaceChildren(createDemoQr(`${amount}-${Date.now()}`));
      if (qrInstructions) qrInstructions.textContent = "Ảnh QR chưa có trong assets/payment-qr.jpg.";
      if (qrPaymentNote) {
        qrPaymentNote.textContent = "Chưa có ảnh QR trong assets/payment-qr.jpg. Họa tiết hiện tại chỉ để xem trước, không quét được.";
      }
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
      setStatus("Trình duyệt này không hỗ trợ hộp thoại modal chuẩn.", "error");
    }
  }

  paymentButton.addEventListener("click", openQrDialog);
  closeButtons.filter(Boolean).forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    });
  });

  // Nhấp vùng nền tối bên ngoài thẻ QR cũng đóng modal.
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  });
  dialog.addEventListener("close", () => paymentButton.focus());

  document.addEventListener("enrollment:cartchange", (event) => {
    updateAmount(event.detail.totalCredits);
  });

  updateAmount(totalCredits);
})();
