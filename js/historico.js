document.addEventListener("DOMContentLoaded", () => {

    const historicoList =
        document.getElementById("historico-list");

    const emptyState =
        document.getElementById("empty-state");

    const historico = JSON.parse(
        localStorage.getItem("historicoPacientes")
    ) || [];

    if (historico.length === 0) {

        historicoList.style.display = "none";
        emptyState.style.display = "block";

        return;
    }

    historicoList.style.display = "block";
    emptyState.style.display = "none";

    // =========================
    // LIMPAR CONTAINER
    // =========================

    historicoList.innerHTML = "";

    // =========================
    // CRIAR CARDS
    // =========================

    historico.forEach((triagem, index) => {

        const card = document.createElement("article");

        card.classList.add(
            "card",
            "paciente-card"
        );

        card.innerHTML = `
            <div class="paciente-info">

            <div class="info-item">
                <strong class="label">
                    Nome:
                </strong>

                <span class="value nome-paciente">
                   ${triagem.paciente.nome}
                </span>
             </div>

            <div class="info-item">
                <strong class="label">
                    Idade:
                </strong>

                <span class="value">
                   ${triagem.paciente.idade} anos
                </span>
             </div>

            <div class="info-item">
                <strong class="label">
                    Prioridade:
                </strong>

                <span class="value">
                    ${triagem.prioridade || "Não definida"}
                </span>
            </div>

            <div class="info-item">
                <strong class="label">
                    Queixas:
                </strong>

                <span class="value">
                    ${triagem.queixas.length}
                </span>
            </div>

        </div>
        <div class="button-section">

            <button
                type="button"
                class="btn btn--primary btn-visualizar"
                data-index="${index}"
            >
                Visualizar
            </button>

            <button
                type="button"
                class="btn btn--primary btn-editar"
                data-index="${index}"
            >
                Editar
            </button>

            <button
                type="button"
                class="btn btn--secondary btn-excluir"
                data-index="${index}"
            >
                Excluir
            </button>

        </div>
        `;

        historicoList.appendChild(card);

    });

    const botoesExcluir =
        document.querySelectorAll(".btn-excluir");

    botoesExcluir.forEach((botao) => {

        botao.addEventListener("click", () => {

            const index =
                Number(botao.dataset.index);

            historico.splice(index, 1);

            localStorage.setItem(
                "historicoPacientes",
                JSON.stringify(historico)
            );

            location.reload();

        });

    });

    const botoesVisualizar =
        document.querySelectorAll(".btn-visualizar");
    botoesVisualizar.forEach((botao) => {

        botao.addEventListener("click", () => {

            const index =
                Number(botao.dataset.index);

            const triagemSelecionada =
                historico[index];

            localStorage.setItem(
                "triagemAtual",
                JSON.stringify(triagemSelecionada)
            );

            window.location.href =
                "resultado.html";
        });

    });

    const botoesEditar =
    document.querySelectorAll(".btn-editar");

    botoesEditar.forEach((botao) => {

        botao.addEventListener("click", () => {

            const index =
                Number(botao.dataset.index);

            const triagemSelecionada =
                historico[index];

            localStorage.setItem(
                "triagemEdicao",
                JSON.stringify(triagemSelecionada)
            );

            window.location.href =
                "editar.html";

        });

    });

    const campoBusca =
        document.getElementById("search-paciente");

    campoBusca.addEventListener("input", () => {

        const textoBusca =
            campoBusca.value.toLowerCase();

        const cards =
            document.querySelectorAll(".paciente-card");

        cards.forEach((card) => {

            const nomePaciente =
                card
                    .querySelector(".nome-paciente")
                    .textContent
                    .toLowerCase();

            if (nomePaciente.includes(textoBusca)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});