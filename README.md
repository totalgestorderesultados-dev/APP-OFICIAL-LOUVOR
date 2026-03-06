# Louvor Videira Camboriu

Aplicação web completa destinada à organização de grupos de louvor de igreja.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Gerenciamento de Datas:** date-fns
- **Banco de Dados:** Supabase (PostgreSQL)

## 📦 Como rodar o projeto localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://srnrfjcelesvobhvjfzi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_dX60htrGw_jTJ-Sej5MZJA_7Nxn2Iz9
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000` no seu navegador.

## 🗄️ Banco de Dados (Supabase)

O projeto está integrado ao Supabase. As tabelas necessárias são:

### `members`
- `id`: uuid (primary key)
- `name`: text
- `roles`: text[] (array de strings)

### `songs`
- `id`: uuid (primary key)
- `name`: text
- `artist`: text
- `category`: text
- `link`: text (opcional)

### `schedules`
- `id`: uuid (primary key)
- `date`: date
- `eventType`: text
- `minister`: uuid (references members.id)
- `backvocals`: uuid[] (array de referências a members.id)
- `guitar`: uuid (references members.id)
- `cajon`: uuid (references members.id)
- `bass`: uuid (references members.id)
- `soundDesk`: uuid (references members.id)
- `songs`: uuid[] (array de referências a songs.id)
- `createdAt`: timestamp with time zone (default: now())

## 🌐 Deploy na Vercel

O projeto está pronto para ser hospedado na Vercel.

1. Suba o código para um repositório no GitHub.
2. Acesse [Vercel](https://vercel.com/) e crie um novo projeto importando o seu repositório.
3. Configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel.
4. Clique em **Deploy**.
