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
