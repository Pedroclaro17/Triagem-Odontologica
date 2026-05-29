document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTOS
    // =========================

    const pacienteNome = document.getElementById("paciente-nome");
    const pacienteIdade = document.getElementById("paciente-idade");
    const pacienteContato = document.getElementById("paciente-contato");

    const dentes = document.querySelectorAll(".dente");

    const formTriagem = document.getElementById("form-triagem");

    // =========================
    // CARREGAR PACIENTE
    // =========================

    const paciente = JSON.parse(localStorage.getItem("pacienteAtual"));

    if (paciente) {
        pacienteNome.textContent = paciente.nome;
        pacienteIdade.textContent = paciente.idade;
        pacienteContato.textContent = paciente.contato;
    }

    // =========================
    // STATUS DOS DENTES
    // =========================

    const statusOrdem = [
        "saudavel",
        "atencao",
        "urgente",
        "tratado"
    ];

    // =========================
    // TROCAR STATUS AO CLICAR
    // =========================

    dentes.forEach((dente) => {

        atualizarVisualDente(dente);

        dente.addEventListener("click", () => {

            const statusAtual = dente.dataset.status;

            const indiceAtual = statusOrdem.indexOf(statusAtual);

            let proximoIndice = indiceAtual + 1;

            if (proximoIndice >= statusOrdem.length) {
                proximoIndice = 0;
            }

            const novoStatus = statusOrdem[proximoIndice];

            dente.dataset.status = novoStatus;

            atualizarVisualDente(dente);
        });
    });

    // =========================
    // ATUALIZAR VISUAL
    // =========================

    function atualizarVisualDente(dente) {

        dente.classList.remove(
            "dente--saudavel",
            "dente--atencao",
            "dente--urgente",
            "dente--tratado"
        );

        const status = dente.dataset.status;

        dente.classList.add(`dente--${status}`);
    }

    // =========================
    // SALVAR TRIAGEM
    // =========================

    formTriagem.addEventListener("submit", (event) => {

        event.preventDefault();

        // DENTES

        const dentesSelecionados = [];

        dentes.forEach((dente) => {

            dentesSelecionados.push({
                numero: dente.dataset.tooth,
                status: dente.dataset.status
            });
        });

        // QUEIXAS

        const queixasSelecionadas = [];

        const queixas = document.querySelectorAll(
            'input[name="queixa"]:checked'
        );

        queixas.forEach((queixa) => {
            queixasSelecionadas.push(queixa.value);
        });

        // OBSERVAÇÕES

        const observacoes = document
            .getElementById("observacoes")
            .value
            .trim();

        // OBJETO FINAL

        const triagem = {
            paciente,
            dentes: dentesSelecionados,
            queixas: queixasSelecionadas,
            observacoes
        };

        // SALVAR

        localStorage.setItem(
            "triagemAtual",
            JSON.stringify(triagem)
        );

        // REDIRECIONAR

        window.location.href = "resultado.html";
    });

});
