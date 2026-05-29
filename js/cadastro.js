document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("form-cadastro");

    formCadastro.addEventListener("submit", (event) => {
        event.preventDefault();

        const nomeCompleto = document.getElementById("nome-completo").value.trim();
        const idade = document.getElementById("idade").value.trim();
        const contato = document.getElementById("contato").value.trim();

        if (!nomeCompleto || !idade || !contato) {
            alert("Preencha todos os campos.");
            return;
        }

        const paciente = {
            nomeCompleto,
            idade,
            contato
        };

        localStorage.setItem("pacienteAtual", JSON.stringify(paciente));

        window.location.href = "triagem.html";
    });
});