# Checklist antes da publicação

Use esta lista antes de publicar a página no site institucional ou de
divulgar o link publicamente.

## Conteúdo e dados
- [ ] Todos os itens de `PENDENCIAS.md` foram resolvidos ou aceitos
      conscientemente como pendentes (com prazo definido).
- [ ] Nenhuma intervenção continua com `demonstrativo: true` apontando
      dados fictícios como se fossem reais.
- [ ] Nenhum número (indicador, percentual, valor de contrato) foi inventado
      — tudo vem de fonte identificável ou está marcado como "A confirmar" /
      "Dado em validação".
- [ ] Nenhum link aponta para um endereço falso ou de exemplo — campos sem
      URL oficial mostram "Link a inserir".
- [ ] Campos sem informação mostram "Não informado", nunca ficam em branco.
- [ ] Data de atualização (`meta.ultimaAtualizacao`) e data de referência
      (`meta.dataReferencia`) em `js/dados.js` estão corretas.
- [ ] O aviso de versão beta (`meta.avisoVersaoBeta`) foi removido ou
      atualizado quando a página deixar de ser protótipo.

## Visual e responsividade
- [ ] Página testada em desktop, tablet e celular (a partir de 320 px de
      largura), sem rolagem horizontal.
- [ ] Tabela de intervenções vira lista de cartões legível no celular.
- [ ] Logotipo oficial do IRM inserido (ou espaço reservado claramente
      identificado como placeholder, se ainda não disponível).

## Navegação e funcionalidade
- [ ] Menu de âncoras funciona em desktop e no menu mobile.
- [ ] Busca e filtros da tabela de intervenções funcionam (município, fase,
      situação e texto livre) e o botão "Limpar filtros" funciona.
- [ ] Mensagem de "nenhum resultado" aparece corretamente ao filtrar sem
      correspondência.
- [ ] Modal de detalhes de cada intervenção abre, mostra todos os campos e
      fecha corretamente (botão "×", tecla Esc e clique fora do modal).

## Acessibilidade
- [ ] Navegação completa por teclado (Tab/Shift+Tab), incluindo o modal.
- [ ] Foco visível em todos os elementos interativos.
- [ ] Link "Pular para o conteúdo" funciona.
- [ ] Textos alternativos revisados nas imagens (logo, ilustração de
      abertura, mapa do território).
- [ ] Contraste de cores adequado (paleta institucional azul/verde já segue
      WCAG 2.1 AA, mas revalidar caso a paleta oficial seja substituída).

## Técnico
- [ ] Nenhum erro no console do navegador (F12 → Console).
- [ ] Página abre corretamente ao clicar duas vezes em `index.html`
      (funciona localmente, sem depender de servidor).
- [ ] Meta tags de SEO e Open Graph revisadas (título, descrição, URL
      canônica, imagem de compartilhamento).
- [ ] Testado nos principais navegadores modernos (Chrome, Edge, Firefox).

## Institucional
- [ ] Equipe de Comunicação treinada para editar `js/dados.js`.
- [ ] Decisão tomada sobre a forma de incorporação ao site institucional
      atual (ver seção correspondente no `README.md`).
- [ ] Canal de contato para dúvidas/correções (`saneamento@irm.rj.gov.br`)
      confirmado como o canal correto a ser publicado.

## Navegação e interação (adicionados após o Guia de Melhores Práticas UI/UX)
- [ ] Botão "Voltar ao topo" aparece ao rolar a página e funciona.
- [ ] O item do menu correspondente à seção visível fica destacado ao rolar.
- [ ] Ordenação por coluna na tabela de intervenções funciona (clicar no
      cabeçalho ordena; clicar de novo inverte a ordem).
- [ ] Etiquetas de situação seguem a paleta do guia (inclusive "Atrasada").

## Privacidade, segurança e LGPD
- [ ] A publicação final ocorre em endereço com HTTPS.
- [ ] Nenhuma credencial, chave ou informação técnica interna está exposta
      no código-fonte da página.
- [ ] Nenhum documento interno foi linkado publicamente por engano.
- [ ] Confirmado com o IRM que os nomes/e-mails de contato do GT
      (`js/dados.js`, bloco 13) podem ser publicados nesta página pública,
      em conformidade com a LGPD (dados de agentes públicos em exercício
      de função, e não dados pessoais sensíveis de terceiros).

---

## Checklist consolidado do Guia de Melhores Práticas UI/UX do IRM

Reprodução do checklist final do `Docs/Guia_Melhores_Praticas_UI_UX_Projeto_Iguacu.docx`,
para ser conferido em conjunto com as seções acima.

**Conteúdo e dados**
- [ ] Objetivo, situação e responsabilidades estão claros.
- [ ] Datas, números e fontes foram conferidos.
- [ ] Dados não validados estão identificados.
- [ ] Não existem campos vazios nem dados demonstrativos (na versão final).

**Experiência e acessibilidade**
- [ ] Página funciona no celular, tablet e computador.
- [ ] Navegação por teclado e foco visível foram testados.
- [ ] Contraste e textos alternativos foram verificados.
- [ ] Filtros, pesquisa e mensagens de estado funcionam.

**Governança e segurança**
- [ ] Comunicação e área técnica aprovaram o conteúdo.
- [ ] Links e documentos públicos foram conferidos.
- [ ] Não há dados pessoais, credenciais ou conteúdo confidencial.
- [ ] Data da atualização e canal para correções estão visíveis.

**Critério de aceite** (conforme o guia): a página estará pronta para
publicação quando o conteúdo estiver tecnicamente validado, a experiência
funcionar nos principais dispositivos e navegadores, os requisitos de
acessibilidade forem atendidos e a origem e a data de cada informação
relevante estiverem claramente identificadas.
