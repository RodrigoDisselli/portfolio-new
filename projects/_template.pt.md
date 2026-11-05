---
# ─────────────────────────────────────────────────────────────────────────────
# MODELO DE PROJETO (versão em português)
# Copie este arquivo para projects/<seu-slug>.pt.md. A versão em inglês fica em
# projects/<seu-slug>.md (copie _template.md). Use o MESMO slug nos dois.
# Linhas que começam com # neste cabeçalho são comentários.
# ─────────────────────────────────────────────────────────────────────────────
title: Título do projeto
# cardTitle: Título mais curto para o card da galeria (opcional)
categoryLabel: Corporativo · Web app
year: 2026
# Imagem de capa do card e do topo da página (opcional).
# Sem ela, é usada uma capa provisória no estilo v1–v6.
# cover: assets/projects/seu-slug/cover.jpg
coverStyle: v1
# Imagem de banner no topo da página do projeto (opcional, imagens largas funcionam melhor):
# header: projects/projects-assets/seu-slug/seu-slug-header.png
# headerAlt: Descrição curta da imagem
summary: Descrição de uma linha exibida abaixo do título da página.
meta:
  - Papel: Lead UX/UI Designer
  - Cliente: Nome do cliente
  - Duração: 12 semanas
  - Plataforma: Web
---

O primeiro parágrafo antes de qualquer título vira o texto de introdução em destaque. A formatação funciona em qualquer lugar: **negrito**, *itálico*, `código` e [links](https://example.com).

<!-- Comentários HTML são ignorados. Use-os para anotações. -->

## Título de seção {#context}

Todo título `##` vira uma seção numerada e aparece no menu "Nesta página". O `{#id}` opcional define a âncora.

Parágrafos comuns são escritos como texto simples, separados por uma linha em branco.

### Subtítulo

Um título `###` é um título menor dentro de uma seção.

## Imagens e GIFs {#media}

![Texto exibido na imagem provisória](placeholder "Legenda abaixo da imagem (opcional)")

![Captura de tela do dashboard](assets/projects/seu-slug/dashboard.png "Imagem real: coloque o caminho do arquivo entre os parênteses.")

![GIF de interação](assets/projects/seu-slug/flow.gif "Arquivos terminados em .gif recebem o selo GIF automaticamente.")

![GIF provisório](placeholder "Use {gif} para marcar uma imagem provisória como GIF, e ratio para definir o formato. Imagens reais sempre mantêm a proporção original."){gif ratio="16/10"}

## Citações e listas {#lists}

> Uma citação de um usuário ou stakeholder.
> — Nome, cargo

- Item de lista
- Outro item

1. Item numerado
2. Outro item numerado

- [x] Item de checklist (com marcação animada)
- [x] Outro item marcado

## Tabela {#table}

| Coluna A | Coluna B | Coluna C |
| --- | --- | --- |
| Célula | Célula | Célula |
| Célula | Célula | Célula |

## Blocos especiais {#blocks}

:::callout
Uma nota destacada em vermelho, ideal para aprendizados ou resultados.
:::

:::stats
40% | Conclusão de tarefas mais rápida
3x | Mais usuários ativos por semana
12 | Sessões de usabilidade
:::

:::cards
### Termo ou conceito
Explicação curta exibida em um card.
### Outro termo
Os cards aparecem em uma grade de duas colunas.
:::

:::principles
### Primeiro princípio
Blocos escuros numerados para princípios de design ou decisões principais.
### Segundo princípio
Cada `###` inicia um novo item.
:::

:::split
### Incluído
- Item no escopo
- Outro item no escopo
### Fora do escopo {out}
- Item fora do escopo
:::

:::accordion
### Grupo expansível {REQ-001}
Parágrafo opcional dentro do grupo.
- Detalhe um
- Detalhe dois
### Outro grupo {REQ-002}
- Detalhe
:::

## Protótipo {#prototype}

:::prototype title="Experimente o protótipo" url="https://www.figma.com/proto/…" embed="https://www.figma.com/embed?embed_host=share&url=…"
Descrição curta do que o protótipo mostra. `url` abre em nova aba; `embed` é exibido dentro da janela de prévia.
:::
