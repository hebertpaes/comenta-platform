# Publicar o Comenta em produção (VPS + Docker + Nginx)

Coloca **todos os produtos** no ar sob `comenta.com.br`:

| Produto | Domínio | Serviço |
|---|---|---|
| Site / plataforma (Next.js, carrossel de notícias) | `comenta.com.br` (+ `www`) | `site` (:3000) |
| Painel do SaaS (React/Vite) | `app.comenta.com.br` | `panel` (:8080) |
| API do SaaS (Fastify + Postgres + Redis) | `api.comenta.com.br` | `api` (:4000) |

Os serviços escutam só em `127.0.0.1`; o **Nginx do host** (com TLS via Let's Encrypt) publica os domínios.

---

## Instalação automática (1 comando)

Com o **DNS já apontando** para o VPS (passo 1 abaixo), rode como root:

```bash
curl -fsSL https://raw.githubusercontent.com/hebertpaes/comenta-platform/claude/project-creation-az9g99/deploy/bootstrap.sh \
  | sudo DOMAIN=comenta.com.br [email protected] bash
```

O `bootstrap.sh` instala Docker/Nginx/Certbot, clona os dois repos, builda o
painel, sobe os containers, configura o Nginx e emite o SSL — tudo de uma vez.
Passe `SKIP_SSL=1` para pular o certbot enquanto o DNS não propagou.

Para fazer passo a passo (ou entender o que o script faz), siga as seções abaixo.

---

## 0. Pré-requisitos

- Um **VPS** (Ubuntu 22.04+ recomendado) com IP público.
- **Docker** + **Docker Compose plugin**, **Nginx** e **Certbot** instalados:
  ```bash
  curl -fsSL https://get.docker.com | sh
  sudo apt-get update && sudo apt-get install -y nginx certbot python3-certbot-nginx
  ```
- O domínio **comenta.com.br** sob seu controle (registro.br / Cloudflare).

## 1. DNS

Crie registros **A** apontando para o IP do VPS:

```
@     A   <IP_DO_VPS>
www   A   <IP_DO_VPS>
app   A   <IP_DO_VPS>
api   A   <IP_DO_VPS>
```

Aguarde propagar (`dig comenta.com.br +short` deve retornar o IP).

## 2. Clonar os dois repositórios lado a lado

```bash
sudo mkdir -p /srv/comenta && cd /srv/comenta
git clone https://github.com/hebertpaes/comenta-platform.git
git clone https://github.com/hebertpaes/comenta.git
# Estrutura resultante:
#   /srv/comenta/comenta-platform   (site + deploy)
#   /srv/comenta/comenta            (SaaS)
```

> Enquanto o carrossel/deploy estiver só no branch, use:
> `git -C comenta-platform checkout claude/project-creation-az9g99`
> `git -C comenta checkout claude/project-creation-az9g99`

## 3. Segredos

```bash
cd /srv/comenta/comenta-platform/deploy
cp .env.example .env
# gere os JWT:
openssl rand -hex 32   # cole em JWT_SECRET
openssl rand -hex 32   # cole em JWT_REFRESH_SECRET
# defina DB_PASSWORD, REDIS_PASSWORD e (opcional) ANTHROPIC_API_KEY
nano .env
```

## 4. Build do painel (Vite, uma vez)

```bash
cd /srv/comenta/comenta/saas/web
npm ci
VITE_API_URL=https://api.comenta.com.br npm run build   # ajuste a var conforme saas/web
```
Isso gera `saas/web/dist`, que o serviço `panel` serve.

## 5. Subir tudo

```bash
cd /srv/comenta/comenta-platform/deploy
docker compose --env-file .env up -d --build
docker compose ps        # todos "running"/"healthy"
```

Teste local no VPS:
```bash
curl -sI http://127.0.0.1:3000   # site
curl -sI http://127.0.0.1:8080   # painel
curl -s  http://127.0.0.1:4000/health   # API (ajuste o path de health se preciso)
```

## 6. Nginx + HTTPS

```bash
sudo cp /srv/comenta/comenta-platform/deploy/nginx/comenta.conf /etc/nginx/sites-available/comenta.conf
sudo ln -s /etc/nginx/sites-available/comenta.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d comenta.com.br -d www.comenta.com.br \
                     -d app.comenta.com.br -d api.comenta.com.br
```
O Certbot cria os blocos `443` e a renovação automática.

## 7. Verificar em produção

- https://comenta.com.br → site com o **carrossel de notícias** (imagens reais do portal).
- https://app.comenta.com.br → painel (login/signup).
- https://api.comenta.com.br → API (OpenAPI em `/docs`).

---

## Atualizar (deploy de novas versões)

```bash
cd /srv/comenta/comenta-platform && git pull
cd /srv/comenta/comenta && git pull
# rebuild do painel se saas/web mudou:
(cd saas/web && npm ci && VITE_API_URL=https://api.comenta.com.br npm run build)
cd /srv/comenta/comenta-platform/deploy
docker compose --env-file .env up -d --build
```

## Rollback

```bash
cd /srv/comenta/comenta-platform && git checkout <commit-anterior>
cd /srv/comenta/comenta-platform/deploy && docker compose --env-file .env up -d --build
```

## Logs / diagnóstico

```bash
docker compose logs -f site
docker compose logs -f api
docker compose logs -f panel
sudo tail -f /var/log/nginx/error.log
```

## Notas

- **IA Claude**: sem `ANTHROPIC_API_KEY`, a API responde `503` só nos endpoints de IA; o restante do SaaS funciona.
- **Editor de vídeo** (repo `comenta`, app FFmpeg.wasm) é um app estático separado; se quiser publicá-lo (ex.: `studio.comenta.com.br`), dá para adicionar um serviço `nginx` servindo o `dist` dele e um novo `server {}` no Nginx — me avise que eu incluo.
- Segurança: mantenha as portas dos containers em `127.0.0.1` (já configurado) e exponha só via Nginx/TLS.
