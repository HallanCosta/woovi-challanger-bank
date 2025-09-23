#!/bin/bash

echo "🔧 Configurando MongoDB Replica Set..."

# Parar MongoDB atual
echo "⏹️  Parando MongoDB atual..."
docker-compose down mongodb

# Subir MongoDB com configuração de replica set
echo "🚀 Subindo MongoDB com replica set..."
docker-compose up -d mongodb

# Aguardar MongoDB inicializar
echo "⏳ Aguardando MongoDB inicializar..."
sleep 10

# Inicializar replica set
echo "🔄 Inicializando replica set..."
docker exec -it mongodb mongosh --eval "
rs.initiate({
  _id: 'rs0',
  members: [
    {
      _id: 0,
      host: 'localhost:27017'
    }
  ]
});

// Aguardar replica set ficar pronto
sleep(3000);

// Verificar status
rs.status();
"

echo "✅ MongoDB Replica Set configurado com sucesso!"
echo "🎉 Agora você pode usar transações MongoDB!"
