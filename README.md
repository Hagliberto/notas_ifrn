# Calculadora de Notas para Aprovação

Projeto web responsivo, em formato de app mobile, criado com **HTML, CSS e JavaScript separados**, usando **Bootstrap** e boas práticas de organização de arquivos.

A aplicação permite que o aluno calcule a média parcial e final da disciplina, considerando avaliações online e prova presencial.

---

## Funcionalidades

- Página inicial com acesso rápido às calculadoras.
- Página separada para cada modelo:
  - 4 unidades;
  - 6 unidades;
  - 8 unidades.
- Campo para informar as notas das Avaliações Online.
- Campo para informar a nota da Prova Presencial.
- Cálculo automático da média parcial e final.
- Gráfico visual atualizado em tempo real.
- Indicação da nota necessária na prova para aprovação.
- Feedback automático:
  - Aprovado;
  - Recuperação;
  - Reprovado;
  - Média parcial.
- Layout responsivo para celular, tablet e desktop.
- Appbar superior.
- Navbar fixa no rodapé para navegação mobile.
- Cards compactos e organizados.

---

## Regra de cálculo

As avaliações online representam **40%** da nota final.

A prova presencial representa **60%** da nota final.

```txt
Nota Final = (Média das Unidades × 4 + Prova × 6) ÷ 10
```

### Situação do aluno

```txt
Aprovado: média final maior ou igual a 60
Recuperação: média final entre 20 e 59,99
Reprovado: média final menor que 20
```

---

## Estrutura do projeto

```txt
calculadora-notas/
├── index.html
├── pages/
│   ├── 4-unidades.html
│   ├── 6-unidades.html
│   └── 8-unidades.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── README.md
└── .gitignore
```

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons

---

## Como executar localmente

Basta abrir o arquivo `index.html` no navegador.

Também é possível usar uma extensão como **Live Server** no VS Code.

### Usando Live Server

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não tenha.
3. Clique com o botão direito em `index.html`.
4. Escolha **Open with Live Server**.

---

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie os arquivos do projeto para o repositório.
3. No GitHub, vá em:

```txt
Settings > Pages
```

4. Em **Build and deployment**, selecione:

```txt
Source: Deploy from a branch
Branch: main
Folder: /root
```

5. Salve as alterações.

Depois disso, o GitHub irá gerar um link público para acessar a aplicação.

---

## Como subir pelo terminal

Dentro da pasta do projeto, execute:

```bash
git init
git add .
git commit -m "Versão inicial da calculadora de notas"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

Troque `SEU-USUARIO` e `NOME-DO-REPOSITORIO` pelos dados do seu repositório.

---

## Observações

Este projeto não utiliza banco de dados.

As notas são calculadas diretamente no navegador, sem envio de dados para servidor.

---

## Licença

Este projeto pode ser utilizado, estudado e adaptado livremente.


## Atualização de validação

Os campos de nota agora aceitam apenas:

- valores de 0 a 100;
- números inteiros ou decimais;
- no máximo duas casas decimais;
- ponto ou vírgula como separador decimal durante a digitação.

Exemplos válidos:

```txt
0
7
7,5
7.50
85,75
100
100,00
```

Exemplos inválidos:

```txt
-1
100,01
85,999
abc
```


## Atualização de digitação mobile

Os campos de nota foram ajustados para melhorar a digitação em celulares:

- os inputs agora usam teclado decimal/texto em vez de `type="number"`;
- ponto é convertido automaticamente para vírgula;
- a validação acontece enquanto o usuário digita;
- o campo continua aceitando somente notas de 0 a 100;
- o limite de duas casas decimais continua ativo.


## Atualização: máscara de nota da direita para a esquerda

A digitação das notas foi ajustada para funcionar como máscara automática.

O aluno digita apenas números e a vírgula é inserida automaticamente:

```txt
7     -> 0,07
75    -> 0,75
755   -> 7,55
7550  -> 75,50
10000 -> 100,00
```

O sistema continua limitando a nota entre `0,00` e `100,00`.

Também foi adicionado um favicon SVG em:

```txt
assets/img/favicon.svg
```


## Atualização: segunda nota opcional por Avaliação Online

Cada Avaliação Online agora pode ter uma segunda nota opcional.

Quando a segunda nota é ativada, a nota da unidade passa a ser a média das duas atividades:

```txt
Nota da unidade = (Nota 1 + Nota 2) ÷ 2
```

Exemplo:

```txt
Avaliação Online 1:
Nota 1 = 80,00
Nota 2 = 90,00

Média da unidade = 85,00
```

Se a segunda nota não for ativada, o sistema usa apenas a primeira nota da Avaliação Online.


## Ajuste de layout da 2ª nota

- Nota 1 e Nota 2 agora ficam lado a lado quando a segunda nota é ativada.
- O botão de adicionar/remover 2ª nota foi reduzido para um pill mais discreto.


## Ajustes v7

- O texto “A nota da unidade será a média das duas.” agora fica abaixo do bloco das duas notas.
- O resumo inferior agora muda dinamicamente:
  - com uma nota: `Nota:`
  - com duas notas: `Nota Média:`


## Ajustes v8

- Cards de Avaliações Online e Prova Presencial agora recebem destaque visual quando há nota vazia.
- O botão **Calcular** foi removido, pois o cálculo já é automático.
- O card de **Feedback** ganhou mais ícones de reação para cada situação:
  - média parcial;
  - aprovado;
  - recuperação;
  - reprovado;
  - erro de preenchimento.


## Versão 1.9.0

- Adicionado recurso de **clicar e segurar** em um card para preencher a nota com `0,00`.
- Ao preencher com clique longo, a aplicação exibe um toast de confirmação.
- Adicionado pill de créditos: `Desenvolvido por Hagliberto Alves de Oliveira`.
- Adicionada versão discreta da aplicação na interface.
- A versão da aplicação passa a ser atualizada a cada nova entrega.


## Versão 1.10.0

- Refatorada toda a tela de **Navegação** (menu lateral/offcanvas).
- A navegação agora usa cards compactos, com melhor hierarquia visual.
- A versão da aplicação e a assinatura do desenvolvedor foram movidas para a tela de navegação.
- A assinatura e a versão deixaram de aparecer no conteúdo principal, deixando a interface mais limpa.
