# Calculadora de Notas para Aprovação

Versão atual: **2.1.0**

Aplicação web responsiva, em formato de app mobile, criada com **HTML, CSS e JavaScript separados**, usando **Bootstrap** e armazenamento local no navegador.

A aplicação permite salvar disciplinas, preencher notas por unidade, usar segunda nota opcional por Avaliação Online, acompanhar média parcial/final e copiar o resultado.

---

## Funcionalidades principais

- Página inicial com acesso aos modelos de cálculo.
- Páginas separadas para:
  - 4 unidades;
  - 6 unidades;
  - 8 unidades.
- Cadastro local de disciplinas.
- Notas salvas separadamente por disciplina.
- Salvamento automático no navegador com `localStorage`.
- Campo de nome da disciplina.
- Seleção de disciplinas já salvas.
- Exclusão de disciplina.
- Avaliações Online com segunda nota opcional.
- Quando há duas notas em uma unidade, a nota da unidade é a média das duas.
- Máscara de nota da direita para a esquerda.
- Clicar e segurar no card preenche `0,00`.
- Botão para preencher notas vazias com `0,00`.
- Cards com nota vazia destacados visualmente.
- Progresso de preenchimento das avaliações.
- Média parcial automática.
- Média final automática.
- Nota necessária na prova para aprovação.
- Aviso quando aprovação direta for impossível.
- Gráfico visual atualizado em tempo real.
- Feedback com ícones de reação por situação.
- Copiar resultado para a área de transferência.
- Navbar mobile fixa.
- Navegação lateral refatorada.
- Favicon SVG.
- Changelog do projeto.

---

## Regra de cálculo

As avaliações online representam **40%** da nota final.

A prova presencial representa **60%** da nota final.

```txt
Nota Final = (Média das Unidades × 4 + Prova × 6) ÷ 10
```

Quando uma Avaliação Online possui duas atividades:

```txt
Nota da unidade = (Nota 1 + Nota 2) ÷ 2
```

---

## Situação do aluno

```txt
Aprovado: média final maior ou igual a 60
Recuperação: média final entre 20 e 59,99
Reprovado: média final menor que 20
```

---

## Armazenamento local

As disciplinas e notas são salvas no navegador usando `localStorage`.

Isso significa que:

- os dados ficam no próprio dispositivo;
- não há envio para servidor;
- os dados podem ser perdidos se o navegador limpar dados do site;
- cada navegador/dispositivo terá seu próprio conjunto de disciplinas.

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
│   ├── img/
│   │   └── favicon.svg
│   └── js/
│       └── app.js
├── CHANGELOG.md
├── README.md
└── .gitignore
```

---

## Como executar localmente

Abra o arquivo `index.html` no navegador.

Também é possível usar o **Live Server** no VS Code.

---

## Como publicar no GitHub Pages

1. Crie ou acesse o repositório no GitHub.
2. Envie os arquivos do projeto.
3. Vá em:

```txt
Settings > Pages
```

4. Em **Build and deployment**, selecione:

```txt
Source: Deploy from a branch
Branch: main
Folder: /root
```

5. Salve.

---

## Comando base para subir alterações

```bash
git add .
git commit -m "Atualiza calculadora de notas"
git push origin main
```

---

## Desenvolvedor

**Desenvolvido por Hagliberto Alves de Oliveira**


## Versão 2.1.0

- Ajustado o layout desktop para modo **wide**.
- A área principal agora aproveita melhor telas grandes.
- O card de notas ficou mais largo, evitando aparência espremida.
- O painel de média permanece lateral e fixo no desktop.
