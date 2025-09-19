import { connectDatabase } from '../src/database';
import { PixTransaction } from '../src/modules/pix/PixTransactionModel';
import mongoose from 'mongoose';

async function run() {
  await connectDatabase();

  console.log('🔧 Removendo índices antigos da collection PixTransaction...');
  
  try {
    // Remover todos os índices da collection (exceto o _id que é obrigatório)
    await PixTransaction.collection.dropIndexes();
    console.log('✅ Índices removidos com sucesso');
  } catch (error) {
    console.log('⚠️  Erro ao remover índices (pode ser que não existam):', error.message);
  }

  console.log('🗑️  Removendo todos os documentos da collection PixTransaction...');
  
  try {
    const result = await PixTransaction.deleteMany({});
    console.log(`✅ ${result.deletedCount} documentos removidos com sucesso`);
  } catch (error) {
    console.error('❌ Erro ao remover documentos:', error);
  }

  console.log('📊 Verificando índices restantes...');
  try {
    const indexes = await PixTransaction.collection.indexes();
    console.log('Índices atuais:', indexes);
  } catch (error) {
    console.error('❌ Erro ao listar índices:', error);
  }

  console.log('✨ Reset da collection PixTransaction concluído!');
  
  await mongoose.connection.close();
  process.exit(0);
}

run().catch(error => {
  console.error('❌ Erro durante o reset:', error);
  process.exit(1);
});
