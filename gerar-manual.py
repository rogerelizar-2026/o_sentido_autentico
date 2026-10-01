#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera Manual-do-Usuario.pdf (versão impressa do manual, para leigos)."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, ListFlowable, ListItem, PageBreak, KeepTogether)

GREEN = colors.HexColor('#0F3731')
GOLD = colors.HexColor('#C5A059')
GOLDINK = colors.HexColor('#7A5C1E')
INK = colors.HexColor('#1A2530')
MUT = colors.HexColor('#64748B')
SOFT = colors.HexColor('#F3EFE6')
BORD = colors.HexColor('#E4DFD3')

st_h1 = ParagraphStyle('h1', fontName='Helvetica-Bold', fontSize=22, textColor=GREEN, spaceAfter=4)
st_sub = ParagraphStyle('sub', fontName='Helvetica', fontSize=11, textColor=MUT, spaceAfter=18)
st_h2 = ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=14.5, textColor=GREEN, spaceBefore=16, spaceAfter=6)
st_h3 = ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=11.5, textColor=INK, spaceBefore=10, spaceAfter=4)
st_p = ParagraphStyle('p', fontName='Helvetica', fontSize=10, textColor=INK, leading=14.5, spaceAfter=6)
st_li = ParagraphStyle('li', parent=st_p, spaceAfter=3)
st_code = st_p

def P(t, s=st_p): return Paragraph(t, s)

def box(titulo, corpo, cor=GOLDINK):
    tbl = Table([[P(f'<b>{titulo}</b>', st_p)], [P(corpo, st_p)]], colWidths=[168 * mm])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SOFT),
        ('BOX', (0, 0), (-1, -1), 0.8, BORD),
        ('LINEBEFORE', (0, 0), (0, -1), 3, cor),
        ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    tbl.hAlign = 'CENTER'
    return tbl

def bullets(items):
    return ListFlowable(
        [ListItem(P(i, st_li), leftIndent=10) for i in items],
        bulletType='bullet', leftIndent=14, spaceAfter=6)

def numeros(items):
    return ListFlowable(
        [ListItem(P(i, st_li), leftIndent=10) for i in items],
        bulletType='1', leftIndent=14, spaceAfter=6)

def tabela(linhas, larguras):
    dados = [[P(f'<b>{c}</b>', st_li) if r == 0 else P(c, st_li) for c in row] for r, row in enumerate(linhas)]
    t = Table(dados, colWidths=larguras, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SOFT),
        ('GRID', (0, 0), (-1, -1), 0.6, BORD),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    t.hAlign = 'CENTER'
    return t

def rodape(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUT)
    canvas.drawString(20 * mm, 12 * mm, 'Sentido Autêntico — by rogerelizar · Manual do Usuário v2.0')
    canvas.drawRightString(190 * mm, 12 * mm, f'Página {doc.page}')
    canvas.restoreState()

el = []
el.append(P('Sentido Autêntico', st_h1))
el.append(P('Manual do Usuário — O Sentido Autêntico (versão 2.0)', st_sub))
el.append(box('Resumo de 30 segundos',
    'O Sentido Autêntico é um programa de estudo das línguas bíblicas (hebraico, aramaico e grego) que funciona '
    '<b>sem internet</b>. Para usar, faça uma única vez: descompacte a pasta e clique duas vezes no instalador '
    'do seu sistema. Este manual acompanha cada clique.', GOLDINK))
el.append(Spacer(1, 6))

el.append(P('1 · O que veio no pacote', st_h2))
el.append(tabela([
    ['Arquivo', 'Para que serve'],
    ['index.html', 'O portal completo (o “programa” em si).'],
    ['INSTALAR-WINDOWS.bat', 'Iniciar no Windows com duplo clique.'],
    ['INSTALAR-MAC-LINUX.command', 'Iniciar no Mac ou Linux com duplo clique.'],
    ['servidor.py / servidor.js', 'O motor que os instaladores acionam (não mexa).'],
    ['abrir-sem-servidor.html', 'Versão de arquivo único: abre com dois cliques, sem instalar nada.'],
    ['manual.html / Manual-do-Usuario.pdf', 'Este manual (na tela e para imprimir).'],
    ['Pastas css, js, assets', 'Visual, cérebro e imagens do portal. Não apague.'],
], [70 * mm, 98 * mm]))
el.append(Spacer(1, 4))
el.append(box('Regra de ouro', 'Nunca mova o index.html para fora da pasta: ele precisa das pastas ao lado.', colors.HexColor('#A62639')))

el.append(P('2 · Jeito mais fácil: o arquivo único (2 cliques)', st_h2))
el.append(numeros([
    'Dê duplo clique no arquivo <b>abrir-sem-servidor.html</b>.',
    'Ele abre no navegador (Chrome, Edge, Firefox ou Safari).',
    'Pronto! Navegue à vontade — até sem internet.',
]))
el.append(P('<i>Limitação:</i> nessa versão não aparece o botão “Instalar” como aplicativo. Para a experiência completa, siga a instalação das próximas seções — leva 5 minutos, uma única vez.', st_p))

el.append(P('3 · Instalação no Windows', st_h2))
el.append(P('<b>Passo 1 — Instale o Python (uma vez só, gratuito)</b>', st_h3))
el.append(numeros([
    'Acesse <b>python.org/downloads</b> e clique no botão amarelo Download Python.',
    'Abra o instalador e marque a caixinha <b>“Add python.exe to PATH”</b> — a parte mais importante!',
    'Clique em Install Now e aguarde terminar.',
]))
el.append(P('<b>Passo 2 — Descompacte a pasta</b>', st_h3))
el.append(numeros([
    'Clique com o botão direito no Sentido-Autentico-v2.1.zip.',
    'Escolha “Extrair Tudo…” e confirme.',
]))
el.append(P('<b>Passo 3 — Inicie o portal</b>', st_h3))
el.append(numeros([
    'Dê duplo clique em INSTALAR-WINDOWS.bat.',
    'Uma janelinha preta abre (o servidor local) e o navegador entra em http://localhost:8080 sozinho.',
    'Use normalmente, deixando a janelinha preta aberta (pode minimizar).',
    'Para encerrar, feche a janelinha preta.',
]))
el.append(box('Da próxima vez', 'Não precisa instalar nada de novo: é só dar duplo clique no mesmo INSTALAR-WINDOWS.bat.', GOLDINK))
el.append(box('Aviso do SmartScreen', 'Se o Windows mostrar a proteção SmartScreen, clique em “Mais informações” → “Executar assim mesmo”. O aviso aparece só porque o arquivo é novo; o conteúdo é seguro e offline.', colors.HexColor('#A62639')))

el.append(P('4 · Instalação no Mac', st_h2))
el.append(numeros([
    'Instale o Python 3 gratuito em python.org/downloads (uma vez só).',
    'Dê duplo clique no .zip para descompactar.',
    'Dê duplo clique em INSTALAR-MAC-LINUX.command.',
    'Se aparecer “desenvolvedor não identificado”: botão direito no arquivo → Abrir → Abrir. Só uma vez.',
    'O Terminal abre e o navegador entra em http://localhost:8080. Para encerrar, feche o Terminal.',
]))

el.append(P('5 · Instalação no Linux', st_h2))
el.append(numeros([
    'O Python 3 já vem instalado na maioria das distribuições. Descompacte o .zip.',
    'Dê duplo clique em INSTALAR-MAC-LINUX.command — ou rode no Terminal: ./INSTALAR-MAC-LINUX.command',
    'Se pedir permissão: Propriedades → Permissões → “Permitir execução como programa”.',
    'O navegador abre em http://localhost:8080. Feche o Terminal para encerrar.',
]))

el.append(P('6 · Instalar como aplicativo (recomendado!)', st_h2))
el.append(P('Com o portal aberto pelo servidor local, você pode fixá-lo na tela inicial — vira um aplicativo de '
            'verdade, com ícone próprio, e funciona 100% sem internet a partir daí.', st_p))
el.append(bullets([
    '<b>Computador (Chrome/Edge):</b> botão “Instalar” no topo da página, ou o ícone de instalação na barra de endereços.',
    '<b>Android (Chrome):</b> menu ⋮ → “Instalar aplicativo” (ou “Adicionar à tela inicial”).',
    '<b>iPhone/iPad (Safari):</b> Compartilhar → “Adicionar à Tela de Início” → Adicionar.',
]))
el.append(box('No celular', 'O portal roda no computador. Para abri-lo no celular, ambos devem estar no mesmo Wi-Fi: use o endereço de rede mostrado na janela do servidor (algo como http://192.168.0.10:8080), não o “localhost”.', GOLDINK))

el.append(P('7 · Conhecendo o portal em 3 minutos', st_h2))
el.append(tabela([
    ['Tela', 'O que você encontra'],
    ['Início', 'Visão geral e os caminhos de estudo.'],
    ['Rota', 'O plano completo: 5 níveis do alfabeto à exegese, 60 min/dia e infográficos.'],
    ['Hebraico · Aramaico · Grego', 'Alfabetos, sons e leitura guiada de Gênesis 1.1, Daniel 5.25 e João 1.1 — toque em cada palavra original.'],
    ['Ferramentas', 'Interlinear e transliteradores.'],
    ['Livros', 'A estante recomendada (Ross, Rega, Mounce, Wallace, Carson…) por nível.'],
    ['Exegese', 'O método de interpretação em 7 passos.'],
    ['Sobre', 'Propósitos, tecnologia, instituições e instalação.'],
], [48 * mm, 120 * mm]))

el.append(P('8 · Acessibilidade: o botão dourado', st_h2))
el.append(P('O círculo dourado no canto inferior direito abre a central de acessibilidade. Cada opção fica salva no aparelho:', st_p))
el.append(bullets([
    '<b>A− / A+</b> — ajusta o tamanho de todas as letras.',
    '<b>Tema escuro</b> — fundo escuro para leitura noturna.',
    '<b>Alto contraste</b> — bordas e letras mais fortes.',
    '<b>Fonte para dislexia</b> — mais espaçamento entre letras e palavras.',
    '<b>Ouvir página</b> — lê o conteúdo em voz alta.',
    '<b>Reduzir animações</b> — desliga os movimentos da tela.',
]))

el.append(P('9 · Perguntas frequentes', st_h2))
el.append(bullets([
    '<b>Preciso de internet para estudar?</b> Não — após a primeira abertura, tudo fica no seu aparelho.',
    '<b>Cobra algo ou tem anúncios?</b> Nunca: gratuito, sem cadastro e sem rastreamento.',
    '<b>Meus textos digitados saem do aparelho?</b> Não: as ferramentas rodam dentro do seu navegador.',
    '<b>Como desinstalo?</b> Apague a pasta; se instalou como app, remova-o como qualquer aplicativo.',
    '<b>Posso usar em aulas?</b> Sim, com atribuição (conteúdo Creative Commons, código MIT).',
]))

el.append(P('10 · Solução de problemas', st_h2))
el.append(tabela([
    ['Sintoma', 'Solução'],
    ['Janela piscou e sumiu ao clicar no instalador', 'Falta o Python: instale-o marcando “Add python.exe to PATH”.'],
    ['O navegador não abriu sozinho', 'Digite na barra de endereços: http://localhost:8080'],
    ['Endereço virou 8081, 8082…', 'Normal: outro programa usava a 8080. Use o endereço exibido na janela.'],
    ['Página em branco ou versão antiga', 'Atualize com Ctrl+F5 (Mac: Cmd+Shift+R).'],
    ['Antivírus/firewall perguntou sobre o servidor', 'Autorize somente rede local: é o portal falando com o seu navegador.'],
    ['Hebraico aparece como quadradinhos', 'Abra uma vez com internet para gravar as fontes embutidas.'],
], [64 * mm, 104 * mm]))

el.append(P('11 · Palavras técnicas explicadas de forma simples', st_h2))
el.append(bullets([
    '<b>Descompactar / extrair</b> — transformar o .zip em uma pasta comum.',
    '<b>Servidor local</b> — programa pequeno no seu computador que “serve” as páginas ao navegador. Não é internet!',
    '<b>localhost:8080</b> — o endereço do seu próprio computador.',
    '<b>PWA / instalar como app</b> — site instalado como aplicativo, funcionando offline.',
    '<b>Cache</b> — memória temporária do navegador que guarda o portal.',
]))

el.append(P('Créditos e licenças', st_h2))
el.append(P('Conteúdo educacional sob licença Creative Commons (uso livre com atribuição) · código-fonte MIT · '
            'Textos de referência: tradição massorética (BHS/BHQ) e texto grego crítico (NA28/UBS5) · Capas de '
            'livros apenas para fins educacionais, direitos reservados às editoras.', st_p))

doc = SimpleDocTemplate('Manual-do-Usuario.pdf', pagesize=A4,
                        leftMargin=20 * mm, rightMargin=20 * mm,
                        topMargin=18 * mm, bottomMargin=18 * mm,
                        title='Manual do Usuário — Sentido Autêntico', author='Sentido Autêntico')

el.append(P('Usar no celular (Android e iPhone)', st_h2))
el.append(P('O Sentido Autêntico se instala no celular como um aplicativo comum, direto pelo navegador: sem Play Store, sem App Store e sem cadastro. Depois de instalado, funciona sem internet.', st_p))

el.append(P('<b>Os tres caminhos, do mais simples ao mais completo</b>', st_h3))
el.append(numeros([
    '<b>Arquivo unico:</b> envie <b>abrir-sem-servidor.html</b> para o celular (WhatsApp, e-mail, cabo USB) e toque nele. Abre na hora, mas nao vira icone na tela.',
    '<b>QR Code na mesma rede Wi-Fi:</b> no computador, de dois cliques em <b>ABRIR-NO-CELULAR.bat</b> (Windows) ou <b>ABRIR-NO-CELULAR.command</b> (Mac e Linux). Aparecera um QR Code; aponte a camera do celular para ele.',
    '<b>Publicar em HTTPS (recomendado):</b> arraste a pasta Sentido-Autentico para <b>app.netlify.com/drop</b> e receba um endereco com cadeado. E a unica forma de ter o modo offline completo no iPhone.',
]))
el.append(box('Por que o cadeado importa', 'Navegadores so permitem que um site funcione offline e vire aplicativo se a conexao for segura (HTTPS). E uma regra do proprio Android e do iPhone. O passo a passo gratuito esta no arquivo COMO-PUBLICAR-HTTPS.txt.', GOLDINK))

el.append(P('<b>Instalar no Android</b>', st_h3))
el.append(numeros([
    'Abra o endereco do Sentido Autêntico no <b>Chrome</b>.',
    'Aguarde a faixa "Instalar aplicativo" aparecer e toque nela.',
    'Se a faixa nao surgir, toque no menu de tres pontinhos (canto superior direito) e escolha "Instalar aplicativo".',
    'Confirme em Instalar. O icone aparecera junto dos seus outros aplicativos.',
]))

el.append(P('<b>Instalar no iPhone e iPad</b>', st_h3))
el.append(numeros([
    'Abra o endereco no <b>Safari</b> — somente ele instala aplicativos web no iPhone.',
    'Toque no botao <b>Compartilhar</b>: o quadrado com uma seta apontando para cima.',
    'Role a lista de opcoes e toque em <b>Adicionar a Tela de Inicio</b>.',
    'Confirme em <b>Adicionar</b>, no canto superior direito.',
]))
el.append(P('O proprio aplicativo mostra essas instrucoes na tela quando detecta que voce esta no Safari do iPhone.', st_p))

el.append(P('<b>Como saber se deu certo: o teste dos 20 segundos</b>', st_h3))
el.append(numeros([
    'Abra o Sentido Autêntico pelo <b>icone</b> na tela do celular, nao pelo navegador.',
    'Confira: a barra de endereco nao deve aparecer.',
    'Ative o <b>modo aviao</b> do aparelho.',
    'Feche o app por completo e abra de novo pelo icone.',
    'Navegue entre Hebraico, Grego e Ferramentas. Se tudo carregar, esta perfeito.',
]))
el.append(P('O guia ilustrado completo, com solucao de problemas, esta no arquivo <b>INSTALAR-NO-CELULAR.html</b>, que tambem abre no proprio celular.', st_p))

doc.build(el, onFirstPage=rodape, onLaterPages=rodape)
print('[pdf] Manual-do-Usuario.pdf gerado')
