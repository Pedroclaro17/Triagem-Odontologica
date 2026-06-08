document.addEventListener("DOMContentLoaded", () => {

    function calcularPrioridade(triagem) {

        let prioridade = "Preventivo";

        const possuiUrgente = triagem.dentes.some(
            (dente) => dente.status === "urgente"
        );

        const possuiAtencao = triagem.dentes.some(
            (dente) => dente.status === "atencao"
        );

        const possuiDor =
            triagem.queixas.includes("dor-dente");

        const possuiInflamacao =
            triagem.queixas.includes("inflamacao");

        const possuiQuebra =
            triagem.queixas.includes("quebra-dental");

        const possuiSensibilidade =
            triagem.queixas.includes("sensibilidade");

        const possuiSangramento =
            triagem.queixas.includes("sangramento");

        if (
            possuiUrgente ||
            possuiDor ||
            possuiInflamacao ||
            possuiQuebra
        ) {

            prioridade = "Urgente";

        } else if (
            possuiAtencao ||
            possuiSensibilidade ||
            possuiSangramento
        ) {

            prioridade = "Moderado";

        }

        return prioridade;
    }

    const triagem = JSON.parse(
        localStorage.getItem("triagemAtual")
    );

    if (!triagem) {
        return;
    }

    // =========================
    // PRIORIDADE DA TRIAGEM
    // =========================

    const prioridade =
        calcularPrioridade(triagem);

    triagem.prioridade =
        prioridade;

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

        const nomesQueixas = {
            "dor-dente": "Dor de dente",
            "sensibilidade": "Sensibilidade dental",
            "sangramento": "Sangramento gengival",
            "inflamacao": "Inflamação gengival",
            "quebra-dental": "Quebra dental"
        };

        triagem.queixas.forEach((queixa) => {

            const item = document.createElement("p");

            item.textContent =
                nomesQueixas[queixa];

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

        triagem.dentes
            .filter((dente) => dente.status !== "saudavel")
            .forEach((dente) => {

                const item = document.createElement("p");

                item.textContent =
                    `Dente ${dente.numero} - ${dente.status}`;

                dentesAfetados.appendChild(item);
            });
    }

    // =========================
    // OBSERVAÇÕES
    // =========================

    const observacoes =
        document.getElementById("observacoes-text");

    if (triagem.observacoes) {

        observacoes.textContent =
            triagem.observacoes;
    }

    // =========================
    // SALVAR NO HISTÓRICO
    // =========================
    const btnSalvarPaciente =
        document.getElementById("btn-salvar-paciente");

    btnSalvarPaciente.addEventListener("click", () => {

        triagem.prioridade = prioridade;

        let historico = JSON.parse(
            localStorage.getItem("historicoPacientes")
        ) || [];

        historico.push(triagem);

        localStorage.setItem(
            "historicoPacientes",
            JSON.stringify(historico)
        );

        btnSalvarPaciente.disabled = true;

        window.location.href = "historico.html";
    });

});