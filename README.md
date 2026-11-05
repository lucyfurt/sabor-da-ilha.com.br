# Sabor da Ilha

Site responsivo para divulgar marmitas e captar pedidos e orçamentos pelo WhatsApp. Projeto leve em JavaScript, CSS e Vite, pronto para publicar na Vercel.

## Ofertas e contato

- Marmitinha econômica: **R$ 12,00 por unidade**.
- Pedidos diários **acima de 20 marmitas**: **a partir de R$ 15,00 por unidade**, com composição e condições sob consulta. É uma oferta distinta da marmitinha econômica.
- Eventos: confraternizações, festas de fim de ano e encontros, com orçamento personalizado.
- WhatsApp: **(98) 99201-9061**.

Os botões abrem uma conversa com o restaurante. O formulário prepara uma mensagem com os dados preenchidos; o visitante revisa e envia no WhatsApp. Não há banco de dados, pagamento ou confirmação automática de pedidos. Nenhuma mensagem é enviada pelo site sem a ação do visitante.

## Executar no computador

Requer Node.js **22.12 ou superior** e npm. Ambiente validado com Node.js 24.22.1 e npm 11.9.0.

```sh
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite. Para gerar e conferir a versão de produção:

```sh
npm run build
npm run preview
```

O resultado fica em `dist/`. Os comandos não precisam de variáveis de ambiente nem chaves de API. As fontes e imagens são servidas pelo próprio projeto.

## Publicar na Vercel

### Pelo terminal, após baixar e extrair o projeto

Na pasta que contém `package.json`:

```sh
npm ci
npm run build
npx vercel --prod
```

Faça login na sua conta Vercel quando solicitado. Use o diretório atual como raiz do projeto. A configuração `vercel.json` já define Vite, o comando `npm run build` e a saída `dist`. O comando acima publica o site; ele deve ser executado por você quando estiver pronto.

### Pelo painel Vercel com GitHub

1. Adicione os arquivos deste projeto ao seu repositório no GitHub, incluindo `package-lock.json` e `public/images`.
2. Na Vercel, escolha **Add New → Project** e importe o repositório.
3. Use o preset **Vite**, a raiz do projeto, build **npm run build** e diretório de saída **dist**.
4. Clique em **Deploy**. Configure um domínio próprio nas configurações do projeto, se desejar.

O projeto foi preparado para publicação, mas este trabalho não publica automaticamente na Vercel nem envia alterações ao GitHub.

## Personalizar

- `index.html`: textos, ofertas, links de contato e metadados de busca/compartilhamento.
- `src/config.js`: WhatsApp usado pelo formulário e configuração pública do restaurante. Se trocar preços ou telefone, atualize também as informações visíveis, links e metadados em `index.html`.
- `src/style.css`: cores, tipografia, espaçamentos e layout responsivo.
- `public/images/logo.png`: logo enviada, preparada como PNG para a web. Substitua por uma versão original em alta resolução se desejar.
- `public/images/marmita.webp` e `eventos.webp`: imagens ilustrativas produzidas para este site. Substitua por fotografias reais do restaurante, mantendo os nomes, e atualize os textos alternativos e o aviso de imagens ilustrativas se apropriado.

Não foram inventados endereço, cidade, horários, avaliações de clientes, descontos percentuais ou condições de entrega. Inclua essas informações após confirmá-las com o restaurante.

## Verificação do fluxo

1. Confira a página em telas de computador e celular.
2. Abra uma oferta e preencha nome, WhatsApp com DDD e quantidade. A data é opcional.
3. Em pedidos diários acima de 20 marmitas, a quantidade mínima é 21. Nos demais, é 1.
4. Confirme que a mensagem preparada usa o número correto e contém os dados informados. Testar não exige enviar a mensagem.
5. Confira os botões de evento, o menu móvel e as perguntas frequentes.

O site usa formulário nativo com validação, navegação por teclado, foco no modal, respeito à preferência por movimento reduzido e textos alternativos. Os dados do formulário não são armazenados no navegador ou em servidor; eles são transferidos ao WhatsApp ao continuar. O próprio WhatsApp aplica seus termos e política de privacidade.
