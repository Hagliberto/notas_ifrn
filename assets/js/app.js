const APP_VERSION = "1.10.0";

const state = {
  unitCount: Number(document.documentElement.dataset.units || 8),
  passGrade: 60,
  recoveryMin: 20
};

const onlineGradesContainer = document.querySelector("#onlineGradesContainer");
const form = document.querySelector("#gradeForm");
const examInput = document.querySelector("#examGrade");
const finalGradeEl = document.querySelector("#finalGrade");
const unitsAverageEl = document.querySelector("#unitsAverage");
const examResultEl = document.querySelector("#examResult");
const neededExamEl = document.querySelector("#neededExam");
const progressBar = document.querySelector("#progressBar");
const statusBadge = document.querySelector("#statusBadge");
const feedbackArea = document.querySelector("#feedbackArea");
const resultIcon = document.querySelector("#resultIcon");
const btnLimpar = document.querySelector("#btnLimpar");

const barUnits = document.querySelector("#barUnits");
const barExam = document.querySelector("#barExam");
const barFinal = document.querySelector("#barFinal");
const barUnitsValue = document.querySelector("#barUnitsValue");
const barExamValue = document.querySelector("#barExamValue");
const barFinalValue = document.querySelector("#barFinalValue");
const chartHelp = document.querySelector("#chartHelp");

document.addEventListener("DOMContentLoaded", () => {
  if (!onlineGradesContainer) return;
  renderOnlineInputs();
  prepareExamInput();
  bindEvents();
  bindLongPressZero();
  renderAppVersion();
  calculateAndRender();
});

function prepareExamInput() {
  if (!examInput) return;

  examInput.type = "text";
  examInput.inputMode = "numeric";
  examInput.maxLength = 6;
  examInput.autocomplete = "off";
  examInput.placeholder = "0,00";
  examInput.title = "Digite apenas números. A vírgula será inserida automaticamente.";
}

function bindEvents() {
  form.addEventListener("input", (event) => {
    if (event.target.matches(".grade-mask, #examGrade")) {
      applyCurrencyLikeGradeMask(event.target);
    }

    calculateAndRender();
  });

  form.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-second-grade");
    if (!button) return;

    const unit = button.dataset.unit;
    const secondArea = document.querySelector(`#secondArea${unit}`);
    const secondInput = document.querySelector(`#online${unit}b`);
    const card = button.closest(".grade-item");

    if (!secondArea || !secondInput || !card) return;

    const isHidden = secondArea.hidden;

    secondArea.hidden = !isHidden;
    card.classList.toggle("has-second-grade", isHidden);
    button.classList.toggle("active", isHidden);
    button.innerHTML = isHidden
      ? '<i class="bi bi-dash-circle"></i> Remover 2ª nota'
      : '<i class="bi bi-plus-circle"></i> 2ª nota';

    if (!isHidden) {
      secondInput.value = "";
      secondInput.classList.remove("is-invalid");
    } else {
      secondInput.focus();
    }

    calculateAndRender();
  });

  form.addEventListener("focus", (event) => {
    if (event.target.matches(".grade-mask, #examGrade") && event.target.value === "") {
      event.target.placeholder = "0,00";
    }
  }, true);

  form.addEventListener("blur", (event) => {
    if (event.target.matches(".grade-mask, #examGrade")) {
      normalizeGradeInput(event.target);
      calculateAndRender();
    }
  }, true);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  if (btnLimpar) btnLimpar.addEventListener("click", clearForm);
}

function renderOnlineInputs() {
  onlineGradesContainer.innerHTML = "";

  for (let i = 1; i <= state.unitCount; i++) {
    const item = document.createElement("div");
    item.className = "grade-item";

    item.innerHTML = `
      <div class="grade-item-header">
        <label for="online${i}">
          <span>Avaliação Online ${i}</span>
          <span class="grade-number">U${i}</span>
        </label>

        <button type="button" class="btn-second-grade" data-unit="${i}" aria-controls="secondArea${i}">
          <i class="bi bi-plus-circle"></i> 2ª nota
        </button>
      </div>

      <div class="dual-grade-grid">
        <div class="grade-input-group grade-primary-area">
          <small>Nota 1</small>
          <input
            type="text"
            id="online${i}"
            class="online-grade grade-mask"
            data-unit="${i}"
            data-grade-part="1"
            inputmode="numeric"
            autocomplete="off"
            maxlength="6"
            placeholder="0,00"
            title="Digite apenas números. A vírgula será inserida automaticamente."
            aria-label="Primeira nota da Avaliação Online ${i}">
        </div>

        <div class="grade-input-group second-grade-area" id="secondArea${i}" hidden>
          <small>Nota 2</small>
          <input
            type="text"
            id="online${i}b"
            class="online-grade grade-mask second-grade"
            data-unit="${i}"
            data-grade-part="2"
            inputmode="numeric"
            autocomplete="off"
            maxlength="6"
            placeholder="0,00"
            title="Digite apenas números. A vírgula será inserida automaticamente."
            aria-label="Segunda nota da Avaliação Online ${i}">
        </div>
      </div>

      <small class="second-grade-help" id="secondHelp${i}" hidden>A nota da unidade será a média das duas.</small>

      <div class="unit-average-preview" id="unitPreview${i}">
        Nota: <strong>--</strong>
      </div>
    `;

    onlineGradesContainer.appendChild(item);
  }
}

function applyCurrencyLikeGradeMask(input) {
  let digits = input.value.replace(/\D/g, "");

  if (digits === "") {
    input.value = "";
    input.classList.remove("is-invalid");
    updateUnitPreview(input.dataset.unit);
    return;
  }

  digits = digits.replace(/^0+(?=\d{3,})/, "");

  let cents = Number(digits);
  if (Number.isNaN(cents)) cents = 0;
  if (cents > 10000) cents = 10000;

  input.value = formatGrade(cents / 100);
  input.classList.remove("is-invalid");
  updateUnitPreview(input.dataset.unit);

  try {
    const end = input.value.length;
    input.setSelectionRange(end, end);
  } catch {}
}

function normalizeGradeInput(input) {
  const value = parseGrade(input.value);

  if (value === null) {
    input.value = "";
    input.classList.remove("is-invalid");
    updateUnitPreview(input.dataset.unit);
    return;
  }

  input.value = formatGrade(value);
  setInputValidity(input);
  updateUnitPreview(input.dataset.unit);
}

function validateAllGrades() {
  const inputs = document.querySelectorAll(".grade-mask, #examGrade");
  let isValid = true;

  inputs.forEach((input) => {
    if (input.closest("[hidden]")) return;
    if (!setInputValidity(input)) isValid = false;
  });

  return isValid;
}

function setInputValidity(input) {
  const rawValue = input.value.trim();
  input.classList.remove("is-invalid");

  if (rawValue === "") return true;

  const pattern = /^(100,00|[0-9]{1,2},\d{2})$/;
  const numericValue = Number(rawValue.replace(",", "."));
  const isValid = pattern.test(rawValue) && numericValue >= 0 && numericValue <= 100;

  if (!isValid) input.classList.add("is-invalid");
  return isValid;
}

function getUnitInputs(unit) {
  const grade1Input = document.querySelector(`#online${unit}`);
  const grade2Input = document.querySelector(`#online${unit}b`);
  const secondArea = document.querySelector(`#secondArea${unit}`);
  return { grade1Input, grade2Input, secondArea };
}

function getUnitGrade(unit) {
  const { grade1Input, grade2Input, secondArea } = getUnitInputs(unit);

  const grade1 = parseGrade(grade1Input?.value);
  const grade2 = !secondArea?.hidden ? parseGrade(grade2Input?.value) : null;

  if (grade1 !== null && grade2 !== null) return (grade1 + grade2) / 2;
  if (grade1 !== null) return grade1;
  if (grade2 !== null) return grade2;

  return null;
}

function updateUnitCardState(unit) {
  const { grade1Input, grade2Input, secondArea } = getUnitInputs(unit);
  const card = grade1Input?.closest(".grade-item");
  if (!card) return;

  const grade1 = parseGrade(grade1Input?.value);
  const secondVisible = secondArea && !secondArea.hidden;
  const grade2 = secondVisible ? parseGrade(grade2Input?.value) : null;

  const isEmpty = !secondVisible
    ? grade1 === null
    : grade1 === null || grade2 === null;

  card.classList.toggle("empty-note-card", isEmpty);
  card.classList.toggle("complete-note-card", !isEmpty && (grade1 !== null || grade2 !== null));
}

function updateExamCardState() {
  const examBox = document.querySelector(".exam-box");
  if (!examBox) return;

  const examGrade = parseGrade(examInput.value);
  const isEmpty = examGrade === null;

  examBox.classList.toggle("empty-note-card", isEmpty);
  examBox.classList.toggle("complete-note-card", !isEmpty);
}

function getOnlineGrades() {
  const grades = [];

  for (let i = 1; i <= state.unitCount; i++) {
    const grade = getUnitGrade(i);
    if (grade !== null) grades.push(grade);
    updateUnitPreview(i);
    updateUnitCardState(i);
  }

  return grades;
}

function updateUnitPreview(unit) {
  if (!unit) return;

  const preview = document.querySelector(`#unitPreview${unit}`);
  const help = document.querySelector(`#secondHelp${unit}`);
  const { grade1Input, grade2Input, secondArea } = getUnitInputs(unit);

  if (!preview) return;

  const grade1 = parseGrade(grade1Input?.value);
  const grade2 = !secondArea?.hidden ? parseGrade(grade2Input?.value) : null;
  const hasSecondGrade = secondArea && !secondArea.hidden;
  const grade = getUnitGrade(unit);

  if (help) help.hidden = !hasSecondGrade;

  const label = hasSecondGrade ? "Nota Média:" : "Nota:";
  preview.innerHTML = `${label} <strong>${formatGrade(grade)}</strong>`;
}

function parseGrade(value) {
  if (value === "" || value === null || value === undefined) return null;

  const normalizedValue = String(value).trim().replace(".", ",");
  const pattern = /^(100,00|[0-9]{1,2},\d{2})$/;

  if (!pattern.test(normalizedValue)) return null;

  const grade = Number(normalizedValue.replace(",", "."));

  if (Number.isNaN(grade)) return null;
  if (grade < 0 || grade > 100) return null;

  return grade;
}

function calculateAndRender() {
  const onlineGrades = getOnlineGrades();
  const examGrade = parseGrade(examInput.value);

  updateExamCardState();

  const unitsAverage = onlineGrades.length ? average(onlineGrades) : null;
  const partialFinalGrade = unitsAverage !== null && examGrade === null ? (unitsAverage * 4) / 10 : null;
  const finalGrade = unitsAverage !== null && examGrade !== null
    ? ((unitsAverage * 4) + (examGrade * 6)) / 10
    : partialFinalGrade;

  const neededExam = unitsAverage !== null
    ? (state.passGrade * 10 - unitsAverage * 4) / 6
    : null;

  updateNumbers({ unitsAverage, examGrade, finalGrade, neededExam, isPartial: examGrade === null });
  updateStatus(finalGrade, unitsAverage, examGrade, neededExam);
  updateLiveChart({ unitsAverage, examGrade, finalGrade, isPartial: examGrade === null });
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatGrade(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return value.toFixed(2).replace(".", ",");
}

function updateNumbers({ unitsAverage, examGrade, finalGrade, neededExam, isPartial }) {
  unitsAverageEl.textContent = formatGrade(unitsAverage);
  examResultEl.textContent = formatGrade(examGrade);
  finalGradeEl.textContent = formatGrade(finalGrade);

  if (neededExam === null) {
    neededExamEl.textContent = "--";
  } else if (neededExam <= 0) {
    neededExamEl.textContent = "0,00";
  } else if (neededExam > 100) {
    neededExamEl.textContent = "> 100";
  } else {
    neededExamEl.textContent = formatGrade(neededExam);
  }

  const progressValue = finalGrade === null ? 0 : Math.min(Math.max(finalGrade, 0), 100);
  progressBar.style.width = `${progressValue}%`;
  progressBar.title = isPartial ? "Média parcial considerando apenas as unidades preenchidas" : "Média final";
}

function updateLiveChart({ unitsAverage, examGrade, finalGrade, isPartial }) {
  setBar(barUnits, barUnitsValue, unitsAverage);
  setBar(barExam, barExamValue, examGrade);
  setBar(barFinal, barFinalValue, finalGrade);

  if (barFinal) {
    barFinal.classList.remove("approved", "recovery", "failed");

    if (finalGrade !== null && !isPartial) {
      if (finalGrade >= state.passGrade) barFinal.classList.add("approved");
      else if (finalGrade >= state.recoveryMin) barFinal.classList.add("recovery");
      else barFinal.classList.add("failed");
    }
  }

  if (!chartHelp) return;

  if (unitsAverage === null) {
    chartHelp.textContent = "O gráfico aparece conforme as notas são digitadas.";
  } else if (isPartial) {
    chartHelp.textContent = "Média parcial: mostra os pontos já acumulados pelas unidades, sem a prova presencial.";
  } else {
    chartHelp.textContent = "Média final: combina unidades online com prova presencial.";
  }
}

function setBar(barElement, valueElement, value) {
  if (!barElement || !valueElement) return;

  const safeValue = value === null || value === undefined || Number.isNaN(value)
    ? 0
    : Math.min(Math.max(value, 0), 100);

  barElement.style.width = `${safeValue}%`;
  valueElement.textContent = value === null || value === undefined || Number.isNaN(value)
    ? "--"
    : formatGrade(value);
}

function reactionMarkup(type) {
  const map = {
    partial: [
      ["bi-eye-fill", "Observando"],
      ["bi-calculator-fill", "Simulando"],
      ["bi-graph-up-arrow", "Acompanhando"]
    ],
    approved: [
      ["bi-emoji-smile-fill", "Ótimo"],
      ["bi-trophy-fill", "Aprovado"],
      ["bi-stars", "Parabéns"]
    ],
    recovery: [
      ["bi-emoji-neutral-fill", "Atenção"],
      ["bi-arrow-repeat", "Recuperação"],
      ["bi-lightbulb-fill", "Ainda dá"]
    ],
    failed: [
      ["bi-emoji-frown-fill", "Alerta"],
      ["bi-exclamation-triangle-fill", "Baixa média"],
      ["bi-journal-x", "Revisar"]
    ],
    error: [
      ["bi-shield-exclamation", "Corrigir"],
      ["bi-123", "Formato"],
      ["bi-x-circle-fill", "Inválido"]
    ]
  };

  const items = map[type] || [];
  return `
    <div class="reaction-strip">
      ${items.map(([icon, text]) => `
        <span class="reaction-pill">
          <i class="bi ${icon}"></i>
          <small>${text}</small>
        </span>
      `).join("")}
    </div>
  `;
}

function updateStatus(finalGrade, unitsAverage, examGrade, neededExam) {
  statusBadge.className = "status-badge";
  progressBar.className = "progress-bar";

  if (finalGrade === null) {
    statusBadge.classList.add("neutral");
    statusBadge.textContent = "Aguardando notas";
    resultIcon.innerHTML = '<i class="bi bi-speedometer2"></i>';

    feedbackArea.className = "feedback-empty";
    feedbackArea.innerHTML = `
      ${reactionMarkup("partial")}
      <p>Preencha as notas para receber um diagnóstico.</p>
    `;
    return;
  }

  if (examGrade === null) {
    statusBadge.classList.add("neutral");
    statusBadge.textContent = "Média parcial";
    resultIcon.innerHTML = '<i class="bi bi-activity"></i>';
    progressBar.classList.add("bg-primary");
    renderPartialFeedback(neededExam, finalGrade);
    return;
  }

  const status = getStatus(finalGrade);
  statusBadge.classList.add(status.className);
  statusBadge.textContent = status.label;
  progressBar.classList.add(status.progressClass);
  resultIcon.innerHTML = status.icon;

  renderFullFeedback(finalGrade, unitsAverage, examGrade, neededExam, status);
}

function getStatus(finalGrade) {
  if (finalGrade >= state.passGrade) {
    return {
      type: "approved",
      label: "Aprovado",
      className: "approved",
      progressClass: "bg-success",
      icon: '<i class="bi bi-check-circle"></i>',
      title: "Parabéns! Você atingiu a média.",
      message: "Você está dentro da faixa de aprovação. Continue revisando para manter o desempenho."
    };
  }

  if (finalGrade >= state.recoveryMin) {
    return {
      type: "recovery",
      label: "Recuperação",
      className: "recovery",
      progressClass: "bg-warning",
      icon: '<i class="bi bi-arrow-repeat"></i>',
      title: "Você está na faixa de recuperação.",
      message: "Ainda dá para reagir. Priorize os conteúdos em que teve menor nota e faça revisões curtas."
    };
  }

  return {
    type: "failed",
    label: "Reprovado pela média atual",
    className: "failed",
    progressClass: "bg-danger",
    icon: '<i class="bi bi-exclamation-triangle"></i>',
    title: "A média atual está muito baixa.",
    message: "Organize um plano de estudos e procure orientação para recuperar o desempenho."
  };
}

function renderFullFeedback(finalGrade, unitsAverage, examGrade, neededExam, status) {
  const distance = state.passGrade - finalGrade;
  let extra = "";

  if (finalGrade >= state.passGrade) {
    extra = `Você ficou ${formatGrade(finalGrade - state.passGrade)} ponto(s) acima da média mínima.`;
  } else {
    extra = `Faltaram ${formatGrade(distance)} ponto(s) para chegar à média 60.`;
  }

  feedbackArea.className = "feedback-box";
  feedbackArea.innerHTML = `
    ${reactionMarkup(status.type)}
    <h3>${status.title}</h3>
    <p>${status.message}</p>
    <hr>
    <p><strong>Resumo:</strong> média das unidades ${formatGrade(unitsAverage)}, prova ${formatGrade(examGrade)} e média final ${formatGrade(finalGrade)}. ${extra}</p>
  `;
}

function renderPartialFeedback(neededExam, partialFinalGrade) {
  let message = "";

  if (neededExam <= 0) {
    message = "Com sua média das unidades, qualquer nota na prova mantém a média mínima de aprovação.";
  } else if (neededExam > 100) {
    message = "Mesmo tirando 100 na prova, a aprovação direta não seria alcançada com as notas online atuais.";
  } else {
    message = `Parcial atual: ${formatGrade(partialFinalGrade)} ponto(s) já acumulado(s). Para alcançar média 60, você precisa tirar pelo menos ${formatGrade(neededExam)} na prova presencial.`;
  }

  feedbackArea.className = "feedback-box";
  feedbackArea.innerHTML = `
    ${reactionMarkup("partial")}
    <h3>Simulação parcial</h3>
    <p>${message}</p>
  `;
}

function showFeedbackError() {
  feedbackArea.className = "feedback-box feedback-error";
  feedbackArea.innerHTML = `
    ${reactionMarkup("error")}
    <h3>Verifique as notas informadas</h3>
    <p>Digite apenas números. A vírgula será inserida automaticamente, no formato 0,00 até 100,00.</p>
  `;
}


function bindLongPressZero() {
  let pressTimer = null;
  let targetCard = null;
  let didLongPress = false;

  const clearPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    targetCard = null;
  };

  document.addEventListener("pointerdown", (event) => {
    const ignoredElement = event.target.closest("button, a, summary, .bottom-nav, .appbar, .mobile-nav");
    if (ignoredElement) return;

    const card = event.target.closest(".grade-item, .exam-box");
    if (!card) return;

    targetCard = card;
    didLongPress = false;

    pressTimer = setTimeout(() => {
      didLongPress = true;
      setCardInputsToZero(targetCard);
      showToast("Nota 0,00 adicionada ao card.");
      targetCard.classList.add("long-press-pulse");
      setTimeout(() => targetCard?.classList.remove("long-press-pulse"), 450);
      calculateAndRender();
    }, 700);
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    document.addEventListener(eventName, clearPress);
  });

  document.addEventListener("click", (event) => {
    if (!didLongPress) return;
    event.preventDefault();
    event.stopPropagation();
    didLongPress = false;
  }, true);
}

function setCardInputsToZero(card) {
  if (!card) return;

  const inputs = card.querySelectorAll(".grade-mask, #examGrade");

  inputs.forEach((input) => {
    if (input.closest("[hidden]")) return;
    input.value = "0,00";
    input.classList.remove("is-invalid");
    updateUnitPreview(input.dataset.unit);
  });
}

function showToast(message) {
  let toast = document.querySelector("#appToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "app-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="bi bi-check-circle-fill"></i><span>${message}</span>`;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

function renderAppVersion() {
  document.querySelectorAll("[data-app-version]").forEach((element) => {
    element.textContent = `v${APP_VERSION}`;
  });
}


function clearForm() {
  document.querySelectorAll(".grade-mask").forEach((input) => {
    input.value = "";
    input.classList.remove("is-invalid");
  });

  document.querySelectorAll(".second-grade-area").forEach((area) => {
    area.hidden = true;
  });

  document.querySelectorAll(".second-grade-help").forEach((help) => {
    help.hidden = true;
  });

  document.querySelectorAll(".grade-item").forEach((card) => {
    card.classList.remove("has-second-grade", "empty-note-card", "complete-note-card");
  });

  document.querySelectorAll(".btn-second-grade").forEach((button) => {
    button.classList.remove("active");
    button.innerHTML = '<i class="bi bi-plus-circle"></i> 2ª nota';
  });

  if (examInput) {
    examInput.value = "";
    examInput.classList.remove("is-invalid");
  }

  for (let i = 1; i <= state.unitCount; i++) {
    updateUnitPreview(i);
    updateUnitCardState(i);
  }

  updateExamCardState();
  calculateAndRender();
  document.querySelector("#notas").scrollIntoView({ behavior: "smooth", block: "start" });
}
