// Funcionalidades de Resultado da Triagem
document.addEventListener('DOMContentLoaded', function() {
    // Carregar e exibir dados da triagem
    carregarResultado();
    // Configurar botão de salvar paciente
    configurarBotaoSalvar();
});
/**
 * Carrega os dados da triagem do localStorage e renderiza na página
 */
function carregarResultado() {
    try {
        // Recuperar dados do paciente
        const pacienteJSON = localStorage.getItem('pacienteAtual');
        const triagemJSON = localStorage.getItem('triagemAtual');
        if (!pacienteJSON) {
            console.log('Nenhum paciente encontrado');
            return;
        }
        const paciente = JSON.parse(pacienteJSON);
        const triagem = triagemJSON ? JSON.parse(triagemJSON) : null;
        // Preencher dados do paciente
        preencherDadosPaciente(paciente);
        // Se houver triagem, processar e exibir
        if (triagem) {
            processarTriagem(triagem);
        }
    } catch (error) {
        console.error('Erro ao carregar resultado:', error);
    }
}
/**
 * Preenche os dados do paciente na página
 */
function preencherDadosPaciente(paciente) {
    document.getElementById('paciente-nome').textContent = paciente.nome || '-';
    document.getElementById('paciente-idade').textContent = paciente.idade || '-';
    document.getElementById('paciente-contato').textContent = paciente.contato || '-';
}
/**
 * Processa a triagem e calcula prioridade
 */
function processarTriagem(triagem) {
    // Calcular prioridade baseado na triagem
    const prioridade = calcularPrioridade(triagem);
    // Atualizar badge de status
    atualizarStatus(prioridade);
    // Renderizar queixas
    renderizarQueixas(triagem.queixas || []);
    // Renderizar dentes afetados
    renderizarDentes(triagem.dentes || []);
    // Renderizar observações
    renderizarObservacoes(triagem.observacoes || '');
}
/**
 * Calcula a prioridade da triagem
 */
function calcularPrioridade(triagem) {
    let prioridade = 'preventivo';
    let urgentes = 0;
    let comAtencao = 0;
    // Contar dentes com problemas
    if (triagem.dentes && Array.isArray(triagem.dentes)) {
        triagem.dentes.forEach(dente => {
            if (dente.status === 'urgente') {
                urgentes++;
            } else if (dente.status === 'atencao') {
                comAtencao++;
            }
        });
    }
    // Contar queixas
    const temQueixas = triagem.queixas && triagem.queixas.length > 0;
    // Determinar prioridade
    if (urgentes > 0 || (temQueixas && triagem.queixas.some(q => q.includes('dor')))) {
        prioridade = 'urgente';
    } else if (comAtencao > 0 || (temQueixas && triagem.queixas.length > 0)) {
        prioridade = 'moderado';
    }
    return prioridade;
}
/**
 * Atualiza o card de status/prioridade
 */
function atualizarStatus(prioridade) {
    const badge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');
    const statusDesc = document.getElementById('status-description');
    badge.setAttribute('data-priority', prioridade);
    // Definir texto e descrição baseado em prioridade
    const statusConfig = {
        urgente: {
            texto: 'Urgente',
            descricao: 'Paciente necessita avaliação prioritária. Agendar atendimento em caráter de urgência.',
            icon: '⚠️'
        },
        moderado: {
            texto: 'Moderado',
            descricao: 'Paciente apresenta sinais que requerem avaliação. Recomenda-se agendar atendimento em breve.',
            icon: '📋'
        },
        preventivo: {
            texto: 'Preventivo',
            descricao: 'Paciente não apresenta sinais de urgência. Recomenda-se acompanhamento periódico.',
            icon: '✓'
        }
    };
    const config = statusConfig[prioridade] || statusConfig.preventivo;
    statusText.textContent = config.texto;
    statusDesc.textContent = config.descricao;
}
/**
 * Renderiza a lista de queixas
 */
function renderizarQueixas(queixas) {
    const container = document.getElementById('queixas-list');
    if (!queixas || queixas.length === 0) {
        container.innerHTML = '<p class="info-placeholder">Nenhuma queixa registrada</p>';
        return;
    }
    // Mapear queixas para nomes legíveis
    const queixasMap = {
        'dor-de-dente': 'Dor de dente',
        'sensibilidade-dental': 'Sensibilidade dental',
        'inflamacao-da-gengiva': 'Inflamação da gengiva'
    };
    let html = '';
    queixas.forEach(queixa => {
        const nome = queixasMap[queixa] || queixa;
        html += `<div class="queixa-item"><span class="queixa-text">${nome}</span></div>`;
    });
    container.innerHTML = html;
}
/**
 * Renderiza os dentes afetados
 */
function renderizarDentes(dentes) {
    const container = document.getElementById('dentes-afetados');
    if (!dentes || dentes.length === 0) {
        container.innerHTML = '<p class="info-placeholder">Nenhum dente selecionado</p>';
        return;
    }
    // Agrupar dentes por status
    const dentesAgrupadosPorStatus = {};
    dentes.forEach(dente => {
        if (dente.status !== 'saudavel') {
            if (!dentesAgrupadosPorStatus[dente.status]) {
                dentesAgrupadosPorStatus[dente.status] = [];
            }
            dentesAgrupadosPorStatus[dente.status].push(dente.numero);
        }
    });
    let html = '';
    // Renderizar dentes urgentes
    if (dentesAgrupadosPorStatus['urgente']) {
        dentesAgrupadosPorStatus['urgente'].forEach(numero => {
            html += `<span class="dente-badge urgente" title="Dente urgente">${numero}</span>`;
        });
    }
    // Renderizar dentes com atenção
    if (dentesAgrupadosPorStatus['atencao']) {
        dentesAgrupadosPorStatus['atencao'].forEach(numero => {
            html += `<span class="dente-badge atencao" title="Dente com atenção">${numero}</span>`;
        });
    }
    // Renderizar dentes tratados
    if (dentesAgrupadosPorStatus['tratado']) {
        dentesAgrupadosPorStatus['tratado'].forEach(numero => {
            html += `<span class="dente-badge" title="Dente tratado">${numero}</span>`;
        });
    }
    if (html === '') {
        container.innerHTML = '<p class="info-placeholder">Nenhum dente com problemas</p>';
    } else {
        container.innerHTML = html;
    }
}
/**
 * Renderiza as observações
 */
function renderizarObservacoes(observacoes) {
    const container = document.getElementById('observacoes-text');
    if (!observacoes || observacoes.trim() === '') {
        container.innerHTML = '<p class="info-placeholder">Nenhuma observação registrada</p>';
        return;
    }
    container.innerHTML = `<p>${escapeHtml(observacoes)}</p>`;
}
/**
 * Configura o evento do botão "Salvar Paciente"
 */
function configurarBotaoSalvar() {
    const btnSalvar = document.getElementById('btn-salvar-paciente');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', function() {
            salvarPacienteNoHistorico();
        });
    }
}
/**
 * Salva o paciente e triagem no histórico
 */
function salvarPacienteNoHistorico() {
    try {
        // Recuperar dados atuais
        const pacienteJSON = localStorage.getItem('pacienteAtual');
        const triagemJSON = localStorage.getItem('triagemAtual');
        if (!pacienteJSON) {
            alert('Erro: Nenhum paciente para salvar.');
            return;
        }
        // Recuperar histórico existente
        let historico = [];
        const historicoJSON = localStorage.getItem('historico');
        if (historicoJSON) {
            try {
                historico = JSON.parse(historicoJSON);
            } catch (e) {
                console.error('Erro ao ler histórico:', e);
                historico = [];
            }
        }
        // Criar entrada no histórico
        const paciente = JSON.parse(pacienteJSON);
        const triagem = triagemJSON ? JSON.parse(triagemJSON) : null;
        const entrada = {
            id: Date.now(),
            data: new Date().toLocaleString('pt-BR'),
            paciente: paciente,
            triagem: triagem,
            prioridade: triagem ? calcularPrioridade(triagem) : 'preventivo'
        };
        // Adicionar ao histórico
        historico.push(entrada);
        // Salvar histórico
        localStorage.setItem('historico', JSON.stringify(historico));
        // Limpar dados atuais
        localStorage.removeItem('pacienteAtual');
        localStorage.removeItem('triagemAtual');
        // Feedback ao usuário
        alert('Triagem salva com sucesso! Redirecionando...');
        // Redirecionar para página inicial ou histórico
        setTimeout(() => {
            window.location.href = 'historico.html';
        }, 1500);
    } catch (error) {
        console.error('Erro ao salvar paciente:', error);
        alert('Erro ao salvar triagem. Tente novamente.');
    }
}
/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
