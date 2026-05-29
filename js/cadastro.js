document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("form-cadastro");

    formCadastro.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const idade = document.getElementById("idade").value.trim();
        const contato = document.getElementById("contato").value.trim();

        if (!nome || !idade || !contato) {
            alert("Preencha todos os campos.");
            return;
        }

        const paciente = {
            nome,
            idade,
            contato
        };

        localStorage.setItem("pacienteAtual", JSON.stringify(paciente));

        window.location.href = "triagem.html";
    });
});