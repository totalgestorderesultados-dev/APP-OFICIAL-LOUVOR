# Louvor Videira Camboriu

Aplicação web completa destinada à organização de grupos de louvor de igreja.

## 🚀 Tecnologias Utilizadas

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Gerenciamento de Datas:** date-fns
- **Armazenamento:** LocalStorage (Mock API) - Preparado para Supabase/Firebase

## 📦 Como rodar o projeto localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000` no seu navegador.

## 🗄️ Configuração do Banco de Dados (Supabase/Firebase)

Atualmente, o projeto utiliza uma camada de abstração em `lib/store.ts` que simula chamadas assíncronas a uma API, mas salva os dados no `localStorage` do navegador. Isso permite que o projeto seja testado imediatamente sem necessidade de configuração de banco de dados.

Para migrar para um banco de dados real (ex: Supabase):

1. Crie um projeto no [Supabase](https://supabase.com/).
2. Crie as tabelas `members`, `songs` e `schedules` conforme a estrutura definida em `types/index.ts`.
3. Instale o cliente do Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Adicione suas credenciais no arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```
5. Substitua o conteúdo de `lib/store.ts` pelas chamadas reais ao Supabase:

```typescript
import { createClient } from "@supabase/supabase-js";
import { Member, Song, Schedule } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from("members").select("*");
  if (error) throw error;
  return data;
};

// Implemente as demais funções (addMember, updateMember, deleteMember, etc.) seguindo o mesmo padrão.
```

## 🌐 Deploy na Vercel

O projeto está pronto para ser hospedado na Vercel.

1. Suba o código para um repositório no GitHub.
2. Acesse [Vercel](https://vercel.com/) e crie um novo projeto importando o seu repositório.
3. A Vercel detectará automaticamente que é um projeto Next.js.
4. Clique em **Deploy**.
