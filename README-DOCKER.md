# Docker - Ambiente de Desenvolvimento

Este guia explica como executar o frontend em modo de desenvolvimento usando Docker.

## 📋 Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0

## 🚀 Iniciando o Ambiente

### Opção 1: Usando Docker Compose (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up

# Ou em modo detached (background)
docker-compose up -d

# Ver logs
docker-compose logs -f frontend

# Parar os serviços
docker-compose down
```

### Opção 2: Usando Docker diretamente

```bash
# Build da imagem
docker build -f Dockerfile.dev -t freela-frontend-dev .

# Executar container
docker run -p 4200:4200 -v $(pwd):/app -v /app/node_modules freela-frontend-dev
```

## 🌐 Acessando a Aplicação

Após iniciar, acesse:
- Frontend: http://localhost:4200
- A aplicação terá hot-reload ativado

## 🔧 Comandos Úteis

### Executar comandos npm dentro do container

```bash
# Instalar nova dependência
docker-compose exec frontend npm install nome-do-pacote

# Rodar testes
docker-compose exec frontend npm test

# Rodar build
docker-compose exec frontend npm run build

# Acessar shell do container
docker-compose exec frontend sh
```

### Rebuild após mudanças no package.json

```bash
# Rebuild e restart
docker-compose up --build

# Forçar rebuild completo
docker-compose build --no-cache
docker-compose up
```

## 🔗 Integração com Backend

### Configurar URL da API

1. **Via docker-compose.yml**:
   Edite a variável `API_URL` no arquivo `docker-compose.yml`:
   ```yaml
   environment:
     - API_URL=http://backend:3000/api
   ```

2. **Via environment.development.ts**:
   O arquivo já está configurado para usar `http://localhost:3000/api`

### Conectar com backend em container

Se o backend também estiver em Docker:

```yaml
# docker-compose.yml
services:
  frontend:
    # ... configurações existentes
    depends_on:
      - backend
    environment:
      - API_URL=http://backend:3000/api

  backend:
    image: sua-imagem-backend:dev
    container_name: freela-backend-dev
    ports:
      - "3000:3000"
    networks:
      - freela-network
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `NODE_ENV` | Ambiente de execução | `development` |
| `API_URL` | URL da API backend | `http://localhost:3000/api` |

## 🐛 Troubleshooting

### Hot-reload não funciona

Se as mudanças não forem detectadas automaticamente:

1. Verifique se o volume está montado corretamente
2. Aumente o intervalo de polling no `Dockerfile.dev`:
   ```dockerfile
   CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--poll", "5000"]
   ```

### Erro de permissão em node_modules

```bash
# Linux/Mac - ajustar permissões
sudo chown -R $USER:$USER node_modules

# Ou rebuild sem cache
docker-compose down -v
docker-compose up --build
```

### Container reinicia constantemente

```bash
# Ver logs completos
docker-compose logs frontend

# Verificar se a porta 4200 está livre
lsof -i :4200
```

## 📦 Performance

Para melhorar a performance do hot-reload:

1. **Use volumes nomeados para node_modules**:
   Já configurado no `docker-compose.yml`

2. **Ajuste o polling interval**:
   Valores menores = mais rápido, mas mais CPU
   ```dockerfile
   --poll 1000  # Mais rápido
   --poll 5000  # Mais econômico
   ```

3. **Desative source maps em desenvolvimento** (opcional):
   Em `angular.json`:
   ```json
   "sourceMap": false
   ```

## 🔄 Workflow de Desenvolvimento

1. Inicie os containers:
   ```bash
   docker-compose up -d
   ```

2. Faça suas alterações no código

3. O navegador recarregará automaticamente

4. Para parar:
   ```bash
   docker-compose down
   ```

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Angular CLI](https://angular.io/cli)
