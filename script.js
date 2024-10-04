/* Variáveis de controle de interface */
let seuVotoPara = document.querySelector('.info-voto-titulo span');
let cargo = document.querySelector('.info-voto-cargo');
let descricao = document.querySelector('.info-voto-detalhes');
let aviso = document.querySelector('.instrucoes');
let lateral = document.querySelector('.info-imagem');
let numeros = document.querySelector('.info-voto-numeros');

/* Variáveis de controle de ambiente */
let etapaAtual = 0;
let numero = '';
let votoBranco = false;
let votos = [];

function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    let numeroHtml = '';
    numero = '';
    votoBranco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
            numeroHtml += '<div class="numero"></div>';
        }
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item) => item.numero === numero);

    if (candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}<br/>Vice: ${candidato.vice || 'N/A'}`;

        let fotosHtml = '';
        for (let i in candidato.fotos) {
            if (candidato.fotos[i].small) {
                fotosHtml += `<div class="info-imagem small"><img src="images/${candidato.fotos[i].url}" alt="Imagem do candidato" class="imagem-candidato"/>${candidato.fotos[i].legenda}</div>`;
            } else {
                fotosHtml += `<div class="info-imagem"><img src="images/${candidato.fotos[i].url}" alt="Imagem do candidato" class="imagem-candidato"/>${candidato.fotos[i].legenda}</div>`;
            }
        }

        lateral.innerHTML = fotosHtml;
    } else {
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
    }
}

document.addEventListener('keydown', function(event) {
    let tecla = event.key;

    // Verifica se a tecla é um número de 0 a 9
    if (!isNaN(tecla) && tecla !== ' ') {
        clicou(tecla);
    }

    // Se a tecla for 'Backspace', corrige o voto
    if (tecla === 'Backspace') {
        corrige();
    }

    // Se a tecla for 'Enter', confirma o voto
    if (tecla === 'Enter') {
        confirma();
    }

    // Se a tecla for 'b' ou 'B', vota em branco
    if (tecla.toLowerCase() === 'b') {
        branco();
    }
});

function clicou(n) {
    let elNumero = document.querySelector('.numero.pisca');
    if (elNumero !== null) {
        elNumero.innerHTML = n;
        numero += n;

        elNumero.classList.remove('pisca');
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface();
        }
    }
}

function branco() {
    if (numero === '') {
        votoBranco = true;
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
        numeros.innerHTML = '';
        lateral.innerHTML = '';
    } else {
        alert("Para votar em BRANCO, não pode digitar nenhum número");
    }
}

function corrige() {
    comecarEtapa();
}

function confirma() {
    let etapa = etapas[etapaAtual];
    let votoConfirmado = false;

    if (votoBranco === true) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
        console.log("Confirmando como BRANCO...");
    } else if (numero.length === etapa.numeros) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
        console.log("Confirmando como " + numero);
    }

    if (votoConfirmado) {
        etapaAtual++;
        if (etapas[etapaAtual] !== undefined) {
            comecarEtapa();
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante">FIM.</div>';
            console.log(votos);
        }
    }
}

comecarEtapa();