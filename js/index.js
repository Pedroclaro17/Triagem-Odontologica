document.addEventListener("DOMContentLoaded", () => {

    const totalPacientes =
        document.getElementById("total-pacientes");

    const totalTriagens =
        document.getElementById("total-triagens");

    const totalUrgentes =
        document.getElementById("total-urgentes");

    const historico = JSON.parse(
        localStorage.getItem("historicoPacientes")
    ) || [];

    // Total de pacientes

    totalPacientes.textContent =
        historico.length;

    // Total de triagens

    totalTriagens.textContent =
        historico.length;

    // Total de urgências

    const urgentes = historico.filter(
        (triagem) =>
            triagem.prioridade === "Urgente"
    );

    totalUrgentes.textContent =
        urgentes.length;

});