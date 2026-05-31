document.addEventListener("DOMContentLoaded", () => {

    const triagem = JSON.parse(
        localStorage.getItem("triagemAtual")
    );

    if (!triagem) {
        return;
    }

    // =========================
    // PRIORIDADE DA TRIAGEM
    // =========================

    let prioridade = "Preventivo";

    const possuiUrgente = triagem.dentes.some(
        (dente) => dente.status === "urgente"
    );

    const possuiAtencao = triagem.dentes.some(
        (dente) => dente.status === "atencao"
    );

    if (possuiUrgente) {

        prioridade = "Urgente";

    } else if (
        possuiAtencao ||
        triagem.queixas.length > 0
    ) {

        prioridade = "Moderado";
    }

    const statusText =
        document.getElementById("status-text");

    const statusDescription =
        document.getElementById("status-description");

    const statusBadge =
        document.getElementById("status-badge");

    if (prioridade === "Urgente") {

        statusText.textContent = "Urgente";

        statusDescription.textContent =
            "Paciente necessita atendimento prioritário.";

        statusBadge.dataset.priority = "urgente";

    } else if (prioridade === "Moderado") {

        statusText.textContent = "Moderado";

        statusDescription.textContent =
            "Paciente necessita acompanhamento odontológico.";

        statusBadge.dataset.priority = "moderado";

    } else {

        statusText.textContent = "Preventivo";

        statusDescription.textContent =
            "Paciente classificado como atendimento preventivo.";

        statusBadge.dataset.priority = "preventivo";
    }

    // =========================
    // DADOS DO PACIENTE
    // =========================

    document.getElementById("paciente-nome").textContent =
        triagem.paciente.nome;

    document.getElementById("paciente-idade").textContent =
        triagem.paciente.idade;

    document.getElementById("paciente-contato").textContent =
        triagem.paciente.contato;

    // =========================
    // QUEIXAS
    // =========================

    const queixasList =
        document.getElementById("queixas-list");

    if (triagem.queixas.length > 0) {

        queixasList.innerHTML = "";

        triagem.queixas.forEach((queixa) => {

            const item = document.createElement("p");

            item.textContent = queixa;

            queixasList.appendChild(item);
        });
    }

    // =========================
    // DENTES AFETADOS
    // =========================

    const dentesAfetados =
        document.getElementById("dentes-afetados");

    if (triagem.dentes.length > 0) {

        dentesAfetados.innerHTML = "";

        triagem.dentes.forEach((dente) => {

            const item = document.createElement("p");

            item.textContent =
                `Dente ${dente.numero} - ${dente.status}`;

            dentesAfetados.appendChild(item);
        });
    }

    // =========================
    // SALVAR NO HISTÓRICO
    // =========================
    const btnSalvarPaciente =
        document.getElementById("btn-salvar-paciente");

    btnSalvarPaciente.addEventListener("click", () => {

        let historico = JSON.parse(
            localStorage.getItem("historicoPacientes")
        ) || [];

        triagem.prioridade = prioridade;

        historico.push(triagem);

        localStorage.setItem(
            "historicoPacientes",
            JSON.stringify(historico)
        );

        window.location.href = "historico.html";
    });

});