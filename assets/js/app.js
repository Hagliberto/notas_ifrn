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
const btnExemplo = document.querySelector("#btnExemplo");

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
  bindEvents();
  calculateAndRender();
});

function bindEvents() {
  form.addEventListener("input", calculateAndRender);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateAndRender(true);
    document.querySelector("#resultado").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  btnLimpar.addEventListener("click", clearForm);
  btnExemplo.addEventListener("click", fillExample);
}

function renderOnlineInputs() {
  onlineGradesContainer.innerHTML = "";

  for (let i = 1; i <= state.unitCount; i++) {
    const item = document.createElement("div");
    item.className = "grade-item";

    item.innerHTML = `
      <label for="online${i}">
        <span>Avaliação Online ${i}</span>
        <span class="grade-number">U${i}</span>
      </label>
      <input
        type="number"
        id="online${i}"
        class="online-grade"
        min="0"
        max="100"
        step="0.01"
        inputmode="decimal"
        placeholder="Nota">
    `;

    onlineGradesContainer.appendChild(item);
  }
}

function getOnlineGrades() {
  return Array.from(document.querySelectorAll(".online-grade"))
    .map((input) => parseGrade(input.value))
    .filter((value) => value !== null);
}

function parseGrade(value) {
  if (value === "" || value === null || value === undefined) return null;

  const grade = Number(String(value).replace(",", "."));

  if (Number.isNaN(grade)) return null;
  if (grade < 0) return 0;
  if (grade > 100) return 100;

  return grade;
}

function calculateAndRender() {
  const onlineGrades = getOnlineGrades();
  const examGrade = parseGrade(examInput.value);

  const unitsAverage = onlineGrades.length ? average(onlineGrades) : null;

  // Média parcial: enquanto a prova não foi preenchida, mostra o peso já conquistado pelas unidades.
  // Ex.: média das unidades 80 gera parcial 32, pois 80 x 40%.
  const partialFinalGrade = unitsAverage !== null && examGrade === null
    ? (unitsAverage * 4) / 10
    : null;

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

function updateStatus(finalGrade, unitsAverage, examGrade, neededExam) {
  statusBadge.className = "status-badge";
  progressBar.className = "progress-bar";

  if (finalGrade === null) {
    statusBadge.classList.add("neutral");
    statusBadge.textContent = "Aguardando notas";
    resultIcon.innerHTML = '<i class="bi bi-speedometer2"></i>';

    feedbackArea.className = "feedback-empty";
    feedbackArea.textContent = "Preencha as notas para receber um diagnóstico.";
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
      label: "Recuperação",
      className: "recovery",
      progressClass: "bg-warning",
      icon: '<i class="bi bi-arrow-repeat"></i>',
      title: "Você está na faixa de recuperação.",
      message: "Ainda dá para reagir. Priorize os conteúdos em que teve menor nota e faça revisões curtas."
    };
  }

  return {
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
    <h3>Simulação parcial</h3>
    <p>${message}</p>
  `;
}

function clearForm() {
  document.querySelectorAll(".online-grade").forEach((input) => input.value = "");
  examInput.value = "";
  calculateAndRender();
  document.querySelector("#notas").scrollIntoView({ behavior: "smooth", block: "start" });
}

function fillExample() {
  const examples = {
    4: [80, 75, 90, 65],
    6: [80, 75, 90, 65, 70, 85],
    8: [80, 75, 90, 65, 70, 85, 78, 88]
  };

  const expander = document.querySelector("#notesExpander");
  if (expander) expander.open = true;

  document.querySelectorAll(".online-grade").forEach((input, index) => {
    input.value = examples[state.unitCount][index] ?? 75;
  });

  examInput.value = 70;
  calculateAndRender();
}
