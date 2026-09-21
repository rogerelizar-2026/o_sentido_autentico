# -*- coding: utf-8 -*-
"""
Script de Otimização e Padronização de Imagens
Desenvolvido por Rogério Ramão Lopes (Setembro de 2026 - by rogerelizar)

Este script auxilia na preparação local das capas de livros e infográficos
no formato padrão correto (.png de tamanho uniforme) para carregamento perfeito
no seu Portal de Estudos das Línguas Bíblicas.

Pré-requisito: Instale a biblioteca Pillow executando no seu terminal:
    pip install Pillow
"""

import os
from PIL import Image

def processar_imagens():
    print("==================================================")
    print("Iniciando o Processamento e Otimização de Imagens")
    print("==================================================")
    
    # Define pastar raiz e subpasta de imagens
    raiz = "."
    img_dir = os.path.join(raiz, "imagens")
    
    # Cria a pasta de imagens se ela não existir
    if not os.path.exists(img_dir):
        os.makedirs(img_dir)
        print(f"Pasta '{img_dir}' criada com sucesso.")
    
    # Mapeamento de capas de livros e arquivos
    capas = {
        "capa-ross": {"alt": "Gramática do Hebraico Bíblico - Allen P. Ross", "width": 150, "height": 225},
        "capa-rega": {"alt": "Noções do Grego Bíblico - Lourenço Stelio Rega", "width": 150, "height": 225},
        "capa-mounce": {"alt": "Fundamentos do Grego Bíblico - William Mounce", "width": 150, "height": 225},
        "capa-wallace": {"alt": "Gramática Grega: Sintaxe Exegética - Daniel Wallace", "width": 150, "height": 225}
    }
    
    # Procura por capas JPG na raiz ou pasta imagens para converter
    sucessos = 0
    erros = 0
    
    for nome, dim in capas.items():
        # Extensões possíveis de origem
        extensoes = [ ".jpg", ".jpeg", ".png" ]
        arquivo_origem = None
        ext_encontrada = None
        
        # Procura primeiro na pasta raiz, depois na pasta imagens/
        for ext in extensoes:
            path_raiz = os.path.join(raiz, nome + ext)
            path_img = os.path.join(img_dir, nome + ext)
            
            if os.path.exists(path_raiz):
                arquivo_origem = path_raiz
                ext_encontrada = ext
                break
            elif os.path.exists(path_img):
                arquivo_origem = path_img
                ext_encontrada = ext
                break
                
        if arquivo_origem:
            try:
                print(f"Encontrado: {arquivo_origem}")
                img = Image.open(arquivo_origem)
                
                # Converte para RGB se necessário (evita erro com RGBA -> JPEG)
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGBA')
                else:
                    img = img.convert('RGB')
                
                # Redimensiona para o tamanho padrão mantendo suavização (LANCZOS)
                print(f"  Redimensionando para {dim['width']}x{dim['height']}...")
                resampling_filter = getattr(Image, "Resampling", Image)
                filter_type = getattr(resampling_filter, "LANCZOS", Image.LANCZOS)
                
                img_redimensionada = img.resize((dim['width'], dim['height']), filter_type)
                
                # Salva como PNG na pasta imagens/
                path_destino = os.path.join(img_dir, nome + ".png")
                img_redimensionada.save(path_destino, "PNG", optimize=True)
                print(f"  ✓ Salvo com sucesso: {path_destino}")
                sucessos += 1
                
            except Exception as err:
                print(f"  ✗ Erro ao processar {nome}: {err}")
                erros += 1
        else:
            print(f"  ℹ {nome} não encontrado em JPG, JPEG ou PNG para conversão.")
            
    # Processa os infográficos (apenas para garantir que estejam na pasta correta com compressão otimizada)
    infograficos = ["infografico-hebraico", "infografico-grego", "infografico-gemini", "infografico-notebook"]
    for info in infograficos:
        for ext in [".png", ".jpg", ".jpeg"]:
            origem = os.path.join(raiz, info + ext)
            if os.path.exists(origem):
                try:
                    img = Image.open(origem)
                    destino = os.path.join(img_dir, info + ".png")
                    
                    # Salva como PNG na subpasta imagens/
                    if img.mode != 'RGBA':
                        img = img.convert('RGBA')
                    img.save(destino, "PNG", optimize=True)
                    print(f"  ✓ Infográfico '{info}' otimizado em: {destino}")
                    sucessos += 1
                    break
                except Exception as err:
                    print(f"  ✗ Erro ao otimizar infográfico {info}: {err}")
                    erros += 1
                    
    print("==================================================")
    print(f"Processamento Concluído! {sucessos} imagens processadas com sucesso. {erros} erros.")
    print("==================================================")
    print("Como testar no seu portal:")
    print("1. Certifique-se de que os arquivos 'index.html', 'styles.css' e 'script.js' estão na pasta raiz.")
    print("2. Abra o 'index.html' no navegador e as imagens otimizadas carregarão perfeitamente!")
    print("==================================================")

if __name__ == "__main__":
    processar_imagens()
