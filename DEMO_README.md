# 🎬 VERSÃO DEMO - APENAS FRONTEND

Esta é uma **versão DEMO** criada exclusivamente para captura de vídeos/motion design.

## ⚠️ IMPORTANTE

- **SEM BACKEND**: Todas as requisições HTTP foram desabilitadas
- **APENAS MOCKS**: Todos os dados são simulados localmente
- **SEM INTEGRAÇÃO**: Nenhuma conexão externa é feita

## 🚀 Como usar

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Rodar em desenvolvimento:**
   ```bash
   pnpm dev
   ```

3. **Fazer login:**
   - **Admin**: `admin@demo.com` / `admin123`
   - **Seller**: `seller@demo.com` / `seller123`

## 📊 Dashboard

O dashboard mostra dados simulados com:
- Faturamento variando até 840k
- Números animados para motion design
- Dados realistas mas totalmente mockados

## 🎯 Funcionalidades disponíveis

✅ Login mock (admin e seller)  
✅ Dashboard com dados simulados  
✅ Números animados  
✅ Navegação entre páginas  

❌ Checkout (desabilitado)  
❌ Requisições HTTP reais (todas desabilitadas)  
❌ Integração com backend (nenhuma)  

## 🔧 Arquitetura

- `src/lib/mock/` - Dados mockados
- `src/lib/api/client.ts` - Cliente API sempre retorna erro (não faz requests)
- `src/lib/api/auth-service.ts` - Sempre usa mocks
- `src/lib/api/dashboard-service.ts` - Sempre usa mocks
- `src/middleware.ts` - Apenas valida JWT mock localmente

## 📦 Deploy na Vercel

Este projeto pode ser deployado na Vercel sem problemas pois:
- Não faz nenhuma requisição HTTP real
- Não precisa de variáveis de ambiente de backend
- Funciona 100% no cliente (client-side)

