# Changelog

## v2.1.3

- Removido o card fixo de disciplina das páginas da calculadora.
- Adicionado modal de gerenciamento de disciplinas.
- Adicionado botão **Criar disciplinas** na página inicial.
- Adicionadas sugestões automáticas de disciplinas de programação ao criar uma nova disciplina.
- Mantido o salvamento local por disciplina e por modelo de 4, 6 e 8 unidades.


Todas as mudanças relevantes deste projeto serão documentadas aqui.

## [2.1.2] - Correção do seletor de disciplina

### Corrigido
- O seletor de disciplina agora carrega corretamente a disciplina escolhida, sem voltar para a anterior.
- As páginas de 4, 6 e 8 unidades agora exibem o painel de disciplinas com seletor, campo de nome, botão Nova, Excluir e Salvar.
- O salvamento local continua separado por quantidade de unidades e por disciplina.

## [2.0.0] - Disciplinas e melhorias completas

### Adicionado
- Cadastro local de disciplinas.
- Notas salvas separadamente por disciplina.
- Salvamento automático usando `localStorage`.
- Campo de nome da disciplina.
- Seleção e exclusão de disciplinas salvas.
- Barra de progresso das Avaliações Online preenchidas.
- Botão para preencher notas vazias com `0,00`.
- Botão para copiar o resultado.
- Feedback visual por situação com cores e ícones.
- Mensagem clara quando a aprovação direta é impossível.
- Centralização das configurações no objeto `CONFIG`.
- Arquivo `CHANGELOG.md`.

### Melhorado
- Feedback da média parcial e final.
- Organização do README.
- Fluxo de uso para celular.
- Visual dos cards de disciplina e progresso.


## [2.1.0] - Layout wide desktop

### Melhorado
- Layout desktop ampliado para telas grandes.
- Container principal aumentado.
- Grid da calculadora reajustado para dar mais espaço ao card de notas.
- Painel de média mantido na lateral direita.
