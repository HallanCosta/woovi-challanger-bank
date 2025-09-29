#!/bin/bash
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
