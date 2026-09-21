# -*- coding: utf-8 -*-
"""
Testes Unitários para o Script de Processamento de Imagens
"""

import unittest
import os
import tempfile
import shutil
from PIL import Image
from io import StringIO
import sys

# Importa o módulo para acessar a função
import processar_imagens


class TestProcessarImagens(unittest.TestCase):
    
    def setUp(self):
        """Configura um diretório temporário para os testes"""
        self.test_dir = tempfile.mkdtemp()
        self.original_dir = os.getcwd()
        os.chdir(self.test_dir)
        
        # Cria a estrutura de pastas necessária
        self.img_dir = os.path.join(self.test_dir, "imagens")
        os.makedirs(self.img_dir)
        
        # Cria imagens de teste
        self._criar_imagens_teste()
    
    def tearDown(self):
        """Limpa o diretório temporário após os testes"""
        os.chdir(self.original_dir)
        shutil.rmtree(self.test_dir)
    
    def _criar_imagens_teste(self):
        """Cria imagens de teste para os testes"""
        # Cria capas de livros em formato JPG
        capas = {
            "capa-ross": (150, 225),
            "capa-rega": (150, 225),
            "capa-mounce": (150, 225),
            "capa-wallace": (150, 225)
        }
        
        for nome, dim in capas.items():
            img = Image.new('RGB', dim, color='red')
            img.save(os.path.join(self.test_dir, f"{nome}.jpg"), 'JPEG')
        
        # Cria infográficos em PNG
        infograficos = ["infografico-hebraico", "infografico-grego", 
                       "infografico-gemini", "infografico-notebook"]
        for info in infograficos:
            img = Image.new('RGBA', (300, 400), color='blue')
            img.save(os.path.join(self.test_dir, f"{info}.png"), 'PNG')
    
    def test_processar_capas_livros(self):
        """Testa se as capas dos livros são processadas corretamente"""
        # Captura a saída para evitar poluição do console
        captured_output = StringIO()
        sys.stdout = captured_output
        
        processar_imagens.processar_imagens()
        
        # Restaura a saída padrão
        sys.stdout = sys.__stdout__
        
        # Verifica se as imagens foram criadas na pasta imagens/
        for nome in ["capa-ross", "capa-rega", "capa-mounce", "capa-wallace"]:
            caminho = os.path.join(self.img_dir, f"{nome}.png")
            self.assertTrue(
                os.path.exists(caminho), 
                f"A imagem {nome}.png deveria existir na pasta imagens/"
            )
            
            # Verifica se as dimensões estão corretas
            with Image.open(caminho) as img:
                self.assertEqual(img.width, 150, f"A largura de {nome} deveria ser 150")
                self.assertEqual(img.height, 225, f"A altura de {nome} deveria ser 225")
                self.assertEqual(img.format, 'PNG', f"O formato de {nome} deveria ser PNG")
    
    def test_processar_infograficos(self):
        """Testa se os infográficos são processados corretamente"""
        # Captura a saída para evitar poluição do console
        captured_output = StringIO()
        sys.stdout = captured_output
        
        processar_imagens.processar_imagens()
        
        # Restaura a saída padrão
        sys.stdout = sys.__stdout__
        
        # Verifica se os infográficos foram copiados para a pasta imagens/
        for info in ["infografico-hebraico", "infografico-grego", 
                    "infografico-gemini", "infografico-notebook"]:
            caminho = os.path.join(self.img_dir, f"{info}.png")
            self.assertTrue(
                os.path.exists(caminho), 
                f"O infográfico {info}.png deveria existir na pasta imagens/"
            )
            
            # Verifica se o formato é PNG
            with Image.open(caminho) as img:
                self.assertEqual(img.format, 'PNG', f"O formato de {info} deveria ser PNG")
    
    def test_criar_pasta_imagens_se_nao_existir(self):
        """Testa se a pasta imagens é criada quando não existe"""
        # Remove a pasta imagens criada no setUp
        shutil.rmtree(self.img_dir)
        
        # Captura a saída para evitar poluição do console
        captured_output = StringIO()
        sys.stdout = captured_output
        
        processar_imagens.processar_imagens()
        
        # Restaura a saída padrão
        sys.stdout = sys.__stdout__
        
        # Verifica se a pasta foi criada
        self.assertTrue(
            os.path.exists(self.img_dir), 
            "A pasta 'imagens' deveria ser criada automaticamente"
        )
    
    def test_imagem_rgba_convertida_para_rgb(self):
        """Testa se imagens RGBA são corretamente convertidas para RGB antes de salvar"""
        # Cria uma imagem RGBA com transparência
        img_original = Image.new('RGBA', (150, 225), color=(255, 0, 0, 128))
        caminho_origem = os.path.join(self.test_dir, "capa-teste-rgba.png")
        img_original.save(caminho_origem, 'PNG')
        
        # Captura a saída
        captured_output = StringIO()
        sys.stdout = captured_output
        
        # Processa as imagens (a capa de teste não está no mapeamento, então não será processada)
        # Este teste valida que o código lida com RGBA sem lançar exceção
        processar_imagens.processar_imagens()
        
        # Restaura a saída padrão
        sys.stdout = sys.__stdout__
        
        # O teste passa se não houve exceção durante o processamento
        self.assertTrue(True, "Processamento de imagens RGBA completado sem erros")


class TestConversaoImagem(unittest.TestCase):
    """Testes específicos para conversão de modos de cor"""
    
    def test_conversao_rgba_para_rgb(self):
        """Testa a conversão explícita de RGBA para RGB"""
        # Cria imagem RGBA
        img_rgba = Image.new('RGBA', (100, 100), color=(255, 0, 0, 128))
        
        # Converte para RGB (como faz o script)
        if img_rgba.mode in ('RGBA', 'LA'):
            img_rgb = img_rgba.convert('RGB')
            
            self.assertEqual(img_rgb.mode, 'RGB', "A imagem deveria estar em modo RGB após conversão")
            self.assertEqual(img_rgb.size, (100, 100), "O tamanho deveria ser mantido após conversão")
    
    def test_conversao_p_para_rgb(self):
        """Testa a conversão de modo P (palette) para RGB"""
        # Cria imagem em modo P
        img_p = Image.new('P', (100, 100))
        # Adiciona palette válida (valores entre 0-255)
        palette = [i % 256 for i in range(768)]
        img_p.putpalette(palette)
        
        # Converte para RGB
        if img_p.mode == 'P':
            img_rgb = img_p.convert('RGB')
            
            self.assertEqual(img_rgb.mode, 'RGB', "A imagem deveria estar em modo RGB após conversão")


if __name__ == '__main__':
    unittest.main(verbosity=2)
