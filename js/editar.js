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
        localStorage.getItem("triagemEdicao")
    );

    if (!triagem) {
        window.location.href = "historico.html";
        return;
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
    // DENTES
    // =========================

    const dentes =
        document.querySelectorAll(".dente");

    dentes.forEach((dente) => {

        const numero =
            dente.dataset.tooth;

        const denteSalvo =
            triagem.dentes.find(
                (item) => item.numero === numero
            );

        if (denteSalvo) {

            dente.dataset.status =
                denteSalvo.status;

            dente.classList.remove(
                "dente--saudavel",
                "dente--atencao",
                "dente--urgente",
                "dente--tratado"
            );

            dente.classList.add(
                `dente--${denteSalvo.status}`
            );
        }

    });

    const statusOrdem = [
        "saudavel",
        "atencao",
        "urgente",
        "tratado"
    ];

    dentes.forEach((dente) => {

        dente.addEventListener("click", () => {

            const statusAtual =
                dente.dataset.status;

            const indiceAtual =
                statusOrdem.indexOf(statusAtual);

            let proximoIndice =
                indiceAtual + 1;

            if (proximoIndice >= statusOrdem.length) {
                proximoIndice = 0;
            }

            const novoStatus =
                statusOrdem[proximoIndice];

            dente.dataset.status =
                novoStatus;

            dente.classList.remove(
                "dente--saudavel",
                "dente--atencao",
                "dente--urgente",
                "dente--tratado"
            );

            dente.classList.add(
                `dente--${novoStatus}`
            );

        });

    });

    // =========================
    // QUEIXAS
    // =========================

    triagem.queixas.forEach((queixa) => {

        const checkbox =
            document.querySelector(
                `input[value="${queixa}"]`
            );

        if (checkbox) {
            checkbox.checked = true;
        }

    });

    // =========================
    // OBSERVAÇÕES
    // =========================

    document.getElementById("observacoes").value =
        triagem.observacoes || "";


    // =========================
    // SALVAR ALTERAÇÕES
    // =========================

    const formEditar =
        document.getElementById("form-triagem");

    formEditar.addEventListener("submit", (event) => {

        event.preventDefault();

        const historico = JSON.parse(
            localStorage.getItem("historicoPacientes")
        ) || [];

        const indiceEdicao = Number(
            localStorage.getItem("indiceEdicao")
        );

        const dentesAtualizados = [];

        dentes.forEach((dente) => {

            dentesAtualizados.push({
                numero: dente.dataset.tooth,
                status: dente.dataset.status
            });

        });

        const queixasAtualizadas = [];

        document
            .querySelectorAll(
                'input[name="queixa"]:checked'
            )
            .forEach((queixa) => {

                queixasAtualizadas.push(
                    queixa.value
                );

            });

        const observacoesAtualizadas =
            document
                .getElementById("observacoes")
                .value
                .trim();

        triagem.dentes =
            dentesAtualizados;

        triagem.queixas =
            queixasAtualizadas;

        triagem.observacoes =
            observacoesAtualizadas;

        triagem.prioridade =
            calcularPrioridade(triagem);

        historico[indiceEdicao] =
            triagem;

        localStorage.setItem(
            "historicoPacientes",
            JSON.stringify(historico)
        );

        localStorage.removeItem(
            "triagemEdicao"
        );

        localStorage.removeItem(
            "indiceEdicao"
        );

        window.location.href =
            "historico.html";

    });
});