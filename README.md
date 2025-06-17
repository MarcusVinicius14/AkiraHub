# Projeto Next.js

Este é um projeto Next.js inicializado com `create-next-app`.

## 🚀 Primeiros Passos

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando o arquivo `app/page.js`. A página será atualizada automaticamente à medida que você salvar as alterações.

Este projeto utiliza `next/font` para otimizar e carregar automaticamente a fonte **Geist**, uma nova família tipográfica da Vercel.

---

## ⚙️ Configuração

Crie um arquivo `.env.local` com base no `.env.example` e preencha com suas credenciais do Supabase.

Você também precisará de uma tabela `comments` com as seguintes colunas:

- `id`
- `identifier`
- `username`
- `content`
- `created_at`

Esses dados são utilizados para armazenar os comentários dos usuários.

Os comentários aparecem no final de cada página de obra, incluindo episódios e capítulos individuais, utilizando o componente `CommentsSection`.
