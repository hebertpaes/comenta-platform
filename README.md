# Comenta Platform

Plataforma de cursos online com IA integrada construída em Next.js 14. O frontend oferece trilhas personalizadas, área do aluno, blog e componentes de chat com assistente virtual alimentado por IA.

> **Stack principal:** Next.js (App Router), React 18, TypeScript 5 e Tailwind CSS.

## 📁 Estrutura do projeto

```
.
├── app/              # Páginas e layouts no App Router
├── pages/            # Prévia de layout e exemplos isolados
├── public/           # Assets estáticos (favicons, imagens)
├── next.config.js    # Configurações do Next.js
├── package.json      # Scripts e dependências
└── README.md         # Este documento
```

## 🚀 Funcionalidades

- **Catálogo de cursos** com recomendações personalizadas e destaques curados.
- **Assistente IA** para esclarecer dúvidas sobre aulas, comunidade e suporte.
- **Área do aluno** com autenticação, histórico de aulas, certificados e progresso em tempo real.
- **Blog e landing page** otimizados para SEO e legibilidade por crawlers tradicionais e de LLMs.
- **Streaming seguro** com proteção de rotas e controles de acesso.

## 🧱 Pré-requisitos

1. **Node.js >= 18** (conforme "engines" do `package.json`).
2. **npm** ou **yarn** para gerenciamento de dependências.
3. Conta no **Firebase** (Firestore/Auth/Functions) para integrar recursos em tempo real.
4. (Opcional) **Docker** e **gcloud CLI** para publicar no Cloud Run.

## ⚙️ Configuração local

1. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

2. Crie um arquivo `.env.local` na raiz com as chaves de terceiros (exemplo abaixo). Altere conforme suas credenciais:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   NEXT_PUBLIC_OPENAI_PROJECT=...
   ```

3. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

   O site ficará disponível em http://localhost:3000.

## 📦 Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Levanta o servidor Next.js em modo desenvolvimento com HMR. |
| `npm run build` | Gera o bundle otimizado para produção (Next.js 14). |
| `npm run start` | Executa o servidor em modo produção com o bundle gerado. |
| `npm run lint` | Roda ESLint para garantir estilo e qualidade do código. |

## 🔐 Integração com Firebase

1. Configure o projeto no Firebase console e crie um app Web.
2. Copie as credenciais fornecidas e preencha o `.env.local` (ver seção de configuração).
3. Habilite os serviços necessários:
   - Firestore (modo production).
   - Authentication (e-mail/senha, OAuth ou provedores desejados).
   - Storage para upload de vídeos e materiais (opcional).
4. Para consumir Cloud Functions, configure o endpoint no código ou em uma variável `NEXT_PUBLIC_FUNCTIONS_URL`.

## ☁️ Deploy no Cloud Run

1. Gere o build de produção:

   ```bash
   npm run build
   ```

2. Crie a imagem Docker:

   ```bash
   docker build -t gcr.io/SEU_PROJETO/comenta-platform .
   ```

3. Faça push para o registry do Google Cloud:

   ```bash
   gcloud auth configure-docker
   docker push gcr.io/SEU_PROJETO/comenta-platform
   ```

4. Publique no Cloud Run (exemplo usando região us-central1):

   ```bash
   gcloud run deploy comenta-platform \
     --image gcr.io/SEU_PROJETO/comenta-platform \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

5. Configure variáveis de ambiente no serviço do Cloud Run com o mesmo conjunto do `.env.local`.

## ✅ Checklist de verificação

- [ ] App inicia sem erros em `npm run dev`.
- [ ] Landing page, dashboard e blog carregam dados esperados.
- [ ] Autenticação no Firebase funciona (login, logout, recuperação).
- [ ] Chat IA responde e registra histórico conforme esperado.
- [ ] Build de produção (`npm run build`) executa sem warnings críticos.
- [ ] Deploy (Cloud Run ou Firebase Hosting) finaliza sem falhas e retorna código 200.

## 🤝 Como contribuir

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração: `git checkout -b minha-feature`.
3. Após implementar, rode `npm run lint` e testes relevantes.
4. Abra um Pull Request descrevendo as mudanças, impactos e testes realizados.

## 📚 Recursos úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Firebase para Web](https://firebase.google.com/docs/web/setup)
- [Cloud Run - Deploy de containers](https://cloud.google.com/run/docs/deploying)

---

Se tiver dúvidas ou ideias de melhoria, abra uma issue. Feedbacks são sempre bem-vindos! 💬
