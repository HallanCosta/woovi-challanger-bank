import type { Model } from 'mongoose';

/**
 * Deleta todos os documentos de uma coleção MongoDB
 * @param Model - Modelo Mongoose da coleção
 * @param name - Nome descritivo da coleção para logs
 * @returns Promise<void>
 */
async function deleteCollection(Model: Model<any>, name: string): Promise<void> {
  const count = await Model.countDocuments();
  
  if (count > 0) {
    await Model.deleteMany({});
    console.log(`${name} deletadas com sucesso`);
  } else {
    console.log(`Não há ${name} para deletar`);
  }
}

/**
 * Deleta múltiplas coleções em sequência
 * @param collections - Array de objetos com Model e name
 * @returns Promise<void>
 */
export async function deleteCollections(
  collections: Array<{ Model: Model<any>; name: string }>
): Promise<void> {
  for (const { Model, name } of collections) {
    await deleteCollection(Model, name);
  }
}
