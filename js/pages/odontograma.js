/**
 * Lógica da página de odontograma
 */

let odontogramaAtual = null;

document.addEventListener('DOMContentLoaded', function() {
    inicializarOdontograma();
});

/**
 * Inicializar odontograma
 */
function inicializarOdontograma() {
    const divOdontograma = document.getElementById('odontograma');
    const ultimaTriagemId = sessionStorage.getItem('ultimaTriagemId');
    
    let triagem = null;
    let odontograma = null;

    // Tentar obter da sessão
    if (ultimaTriagemId) {
        triagem = TriagemModule.obterPorId(ultimaTriagemId);
    }

    // Se não estiver na sessão, obter o mais recente
    if (!triagem) {
        const triagens = TriagemModule.listar();
        if (triagens.length > 0) {
            triagem = triagens[triagens.length - 1];
        }
    }

    if (!triagem) {
        divOdontograma.innerHTML = `
            <div class="alert alert-info">
                <p>Nenhuma triagem encontrada. Por favor, realize uma triagem primeiro.</p>
            </div>
        `;
        return;
    }

    // Obter ou criar odontograma
    odontograma = OdontogramaModule.obterPorTriagem(triagem.id);
    
    if (!odontograma) {
        odontograma = OdontogramaModule.criar({
            triagemId: triagem.id,
            pacienteId: triagem.pacienteId
        });
    }

    odontogramaAtual = odontograma;
    renderizarOdontograma(divOdontograma, odontograma);
}

/**
 * Renderizar odontograma
 */
function renderizarOdontograma(container, odontograma) {
    const paciente = PacienteModule.obterPorId(odontograma.pacienteId);
    
    let html = `
        <div class="odontograma-header">
            <h1>Odontograma</h1>
            <p>Paciente: ${paciente.nome}</p>
        </div>

        <div class="odontograma-wrapper">
            <h3>Clique nos dentes para alterar seu status</h3>
            <div class="odontograma-grid" id="odontograma-grid">
    `;

    // Renderizar dentes
    odontograma.dentes.forEach(dente => {
        const classeStatus = `status-${dente.status}`;
        html += `
            <div class="tooth ${classeStatus}" 
                 data-numero="${dente.numero}"
                 onclick="alternarStatusDente(${dente.numero})"
                 title="Dente ${dente.numero}: ${dente.status}">
                ${dente.numero}
            </div>
        `;
    });

    html += `
            </div>

            <div class="odontograma-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #d1d5db;"></div>
                    <span>Saudável</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #dc2626;"></div>
                    <span>Cárie</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #f59e0b;"></div>
                    <span>Tratado</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #6b7280;"></div>
                    <span>Ausente</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #0f766e;"></div>
                    <span>Implante</span>
                </div>
            </div>

            <div class="form-group">
                <label for="notas">Notas Adicionais</label>
                <textarea id="notas" placeholder="Digite notas adicionais sobre os dentes">${odontograma.notas}</textarea>
            </div>

            <div class="form-actions">
                <button onclick="salvarOdontograma()" class="btn btn-primary">Salvar</button>
                <a href="triagem.html" class="btn btn-secondary">Voltar</a>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Alternar status do dente
 */
function alternarStatusDente(numeroDente) {
    if (!odontogramaAtual) return;

    const dente = odontogramaAtual.dentes.find(d => d.numero === numeroDente);
    if (!dente) return;

    const estados = ['saudavel', 'carie', 'tratado', 'ausente', 'implante'];
    const indiceAtual = estados.indexOf(dente.status);
    const proximoIndice = (indiceAtual + 1) % estados.length;

    dente.status = estados[proximoIndice];

    const divDente = document.querySelector(`[data-numero="${numeroDente}"]`);
    if (divDente) {
        divDente.className = `tooth status-${dente.status}`;
        divDente.title = `Dente ${numeroDente}: ${dente.status}`;
    }
}

/**
 * Salvar odontograma
 */
function salvarOdontograma() {
    if (!odontogramaAtual) return;

    const notas = document.getElementById('notas').value;
    OdontogramaModule.atualizarNotas(odontogramaAtual.id, notas);

    alert('Odontograma salvo com sucesso!');
    window.location.href = 'historico.html';
}
