[README.md](https://github.com/user-attachments/files/31808689/README.md)
# Portal da CRA — IFES Campus Colatina

Protótipo funcional estático baseado na especificação enviada para a nova estrutura do Portal da CRA.

## O que já está implementado

- Página institucional limpa e responsiva.
- Busca textual por procedimentos.
- 25 objetos de requerimento cadastrados a partir da lista fornecida na especificação.
- Procedimentos agrupados por categoria.
- Fluxograma individual e interativo para cada objeto.
- Etapa explícita de fonte oficial.
- Etapa explícita de assinatura digital GOV.BR.
- Seleção visual dos três canais de e-mail da CRA via `mailto:`.
- Tela de conclusão sem prometer prazo.
- Marcação de procedimentos sem fonte específica cadastrada como “em revisão”.

## Ponto que precisa ser preenchido pela CRA antes da publicação oficial

O pacote recebido nesta conversa não continha o PDF exato do Requerimento Geral. Por isso, o botão de download fica protegido por configuração e não aponta para um arquivo inventado.

Abra `js/data.js` e preencha:

```js
requerimentoUrl: 'URL_DO_PDF_OFICIAL_DO_REQUERIMENTO_GERAL'
```

Também é necessário revisar, procedimento por procedimento, a fonte normativa, artigos, páginas, documentos exigidos e eventual Nada Consta antes de publicar como versão oficial.

## Publicação

Pode ser publicado como site estático em Netlify, GitHub Pages, Vercel ou hospedagem do campus.

A página inicial é `index.html`.
