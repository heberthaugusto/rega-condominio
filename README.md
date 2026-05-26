# 🌿 Rega do Condomínio — Revezamento de Rega das Plantas

> Aplicativo web progressivo (PWA) desenvolvido para organizar e automatizar o revezamento de rega das plantas de um condomínio, com calendário inteligente, registros em tempo real sincronizados entre moradores e notificações push automáticas.

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🌐 Demo ao Vivo

| Portal | Link |
|---|---|
| 🌿 Rega do Condomínio | [heberthaugusto.github.io/rega-condominio](https://heberthaugusto.github.io/rega-condominio/) |

> ℹ️ Acesso restrito por senha individual por morador. Para notificações push no iPhone, instale o app via Safari → "Adicionar à Tela de Início" e abra pelo ícone.

---

## 🎯 Sobre o Projeto

O **Rega do Condomínio** nasceu da necessidade real de organizar o revezamento de rega das plantas de um condomínio de forma justa, transparente e automatizada — eliminando a dependência de grupos de WhatsApp e esquecimentos.

O resultado é um PWA que funciona como um aplicativo nativo, com um calendário inteligente que calcula automaticamente quem rega em cada dia, sincroniza registros em tempo real entre todos os moradores via Firestore e envia notificações push automáticas para o responsável no dia anterior e no próprio dia da rega.

---

## ✨ Funcionalidades Implementadas

### 📅 Calendário Inteligente
- Cálculo automático do responsável de cada dia com base em regras configuráveis
- Visualização mensal com navegação entre meses
- Cada morador possui uma cor própria no calendário
- Banner de destaque mostrando a próxima rega do usuário logado
- Sincronização em tempo real via Firestore — todos veem o mesmo estado simultaneamente

### 📋 Regras de Revezamento
- Grupo A: molha 1 dia, folga 2 dias (intervalo de 3 dias entre regas)
- Karina: domingo sim, domingo não — regra independente do Grupo A
- Colisão com domingo da Karina: candidato na véspera (sábado), segunda ou terça após o domingo é remarcado para a quarta-feira (domingo+3)
- Chuva: conta como dia regado — os 2 dias seguintes ficam dispensados e o próximo responsável vai para o 3º dia após a chuva

### 💧 Registros de Rega
- Confirmação de rega pelo próprio responsável
- Registro de "não consegui regar" com possibilidade de cobertura voluntária
- Registro de chuva com dispensa automática dos dias seguintes
- Registro de voluntário ("eu reguei no lugar")
- Desfazer qualquer registro por engano
- Todos os registros são visíveis para todos os moradores em tempo real

### 🔔 Notificações Push Automáticas
- Notificação de véspera às 19h55 (Brasília): avisa o responsável do dia seguinte
- Notificação no dia da rega às 7h55 (Brasília): lembra o responsável
- Notificações enviadas apenas para o responsável do dia — não incomoda os demais
- Suporte a múltiplos dispositivos por usuário (Android + iPhone simultâneos)
- Implementado com Web Push nativo (VAPID) — compatível com Android Chrome e iOS Safari 16.4+
- Disparado automaticamente via GitHub Actions (cron job)

### 🔐 Autenticação
- Login por seleção de usuário + senha individual
- Sessão persistente — faz login uma única vez
- Acesso restrito apenas aos moradores cadastrados

---

## 🏗️ Arquitetura e Decisões Técnicas

| Decisão | Justificativa |
|---|---|
| **PWA (sem framework)** | Instalável como app nativo sem loja de aplicativos. Vanilla JS mantém o app em arquivo único `.html`, facilitando distribuição e atualização via GitHub Pages. |
| **Firebase Firestore** | Sincronização em tempo real entre dispositivos via `onSnapshot`. Todos os moradores veem os registros instantaneamente sem precisar recarregar. |
| **Web Push nativo (VAPID)** | FCM Web Push não suporta iOS. A Web Push API nativa com VAPID funciona em Android Chrome e iOS Safari 16.4+ (com PWA instalado), cobrindo todos os dispositivos dos moradores. |
| **GitHub Actions (cron)** | Disparo automático das notificações push sem necessidade de servidor dedicado. O workflow roda gratuitamente na infraestrutura do GitHub. |
| **Algoritmo de calendário** | Lógica de datas implementada em JavaScript puro, sem bibliotecas. Replica o mesmo algoritmo no app e no workflow de notificações para garantir consistência. |
| **GitHub Pages** | Hospedagem estática gratuita com HTTPS — necessário para Service Worker, câmera e Web Push. |

---

## 📐 Regras do Algoritmo de Calendário

O calendário é gerado por uma função `buildSchedule` que aplica as seguintes regras em ordem de prioridade:

```
1. Chuva registrada no dia X
   → X+1 e X+2 dispensados → próximo responsável em X+3

2. Candidato cai no próprio domingo da Karina
   → remarca para domingo+3 (quarta-feira)

3. Candidato cai na véspera (sábado) de domingo da Karina
   → remarca para domingo+3 (quarta-feira)

4. Candidato cai na segunda ou terça após domingo da Karina
   → remarca para domingo+3 (quarta-feira)

5. Qualquer outro dia → slot válido
   (Grupo A pode regar em domingos comuns)
```

---

## 🛠️ Stack Tecnológica

```
Frontend:        HTML5 · CSS3 · JavaScript (ES2022)
Banco de Dados:  Firebase Firestore (tempo real)
Notificações:    Web Push API (VAPID) · GitHub Actions (cron)
Tipografia:      DM Sans (Google Fonts)
Hospedagem:      GitHub Pages
PWA:             Web App Manifest · Service Worker
```

---

## 📁 Estrutura do Projeto

```
rega-condominio/
├── index.html              Aplicativo completo (single-file PWA)
├── manifest.json           Configuração PWA (nome, ícone, tema)
├── sw.js                   Service Worker (cache offline + Web Push)
├── icon-192.png            Ícone para tela inicial (192×192)
├── icon-512.png            Ícone para splash screen (512×512)
├── apple-touch-icon.png    Ícone para iPhone (180×180)
├── .github/
│   └── workflows/
│       └── notificacoes.yml  Cron job de notificações push (GitHub Actions)
└── README.md               Este arquivo
```

---

## ⚙️ Como Fazer Deploy

### Pré-requisitos
- Conta no [Firebase](https://firebase.google.com/) com projeto criado
- Repositório no GitHub com GitHub Pages ativado

### 1. Firebase — Firestore
- Crie um projeto no Firebase Console
- Ative o **Firestore Database**
- Configure as regras de segurança:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rega/{document} {
      allow read, write: if true;
    }
  }
}
```
- Copie as credenciais do projeto para o `index.html`

### 2. Chaves VAPID
- Gere um par de chaves VAPID (ex: via `web-push generate-vapid-keys`)
- Insira a chave pública no `index.html` (`VAPID_PUBLIC_KEY`)
- Cadastre a chave privada como secret no GitHub: `VAPID_PRIVATE_KEY`

### 3. GitHub Actions — Notificações
- Cadastre os secrets no repositório (**Settings → Secrets and variables → Actions**):
  - `FIREBASE_PRIVATE_KEY` — chave privada da service account do Firebase
  - `VAPID_PRIVATE_KEY` — chave privada VAPID gerada no passo anterior
- O workflow `.github/workflows/notificacoes.yml` dispara automaticamente nos horários configurados

### 4. GitHub Pages
- **Settings → Pages → Source:** Deploy from branch → `main` / `root`
- Acesse em: `https://SEU_USUARIO.github.io/rega-condominio/`

---

## 📱 Como Instalar

### Android
1. Abra o **Chrome** e acesse o link do app
2. Toque nos 3 pontinhos ⋮ → **"Instalar app"**
3. Confirme a instalação
4. Na tela de login, toque em **"🔔 Ativar alertas de rega"** e confirme a permissão

### iPhone
1. Abra o **Safari** (obrigatório — não funciona pelo Chrome)
2. Acesse o link do app
3. Toque em compartilhar ↑ → **"Adicionar à Tela de Início"**
4. Abra o app pelo ícone na tela inicial (não pelo Safari)
5. Na tela de login, toque em **"🔔 Ativar alertas de rega"** e confirme a permissão

---

## 🔒 Privacidade e Dados

Os registros de rega são armazenados no Firebase Firestore e compartilhados entre os moradores do condomínio em tempo real. As subscriptions de notificação push são armazenadas no Firestore vinculadas ao usuário e dispositivo. Nenhum dado é compartilhado com terceiros.

---

## 👤 Autor

Desenvolvido por **Heberth Augusto**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/heberth-dornela-ti/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/heberthaugusto)

---

*Projeto desenvolvido utilizando a **Claude IA** como assistente de desenvolvimento.*
