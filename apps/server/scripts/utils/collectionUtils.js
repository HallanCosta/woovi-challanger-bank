"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollections = deleteCollections;
/**
 * Deleta todos os documentos de uma coleção MongoDB
 * @param Model - Modelo Mongoose da coleção
 * @param name - Nome descritivo da coleção para logs
 * @returns Promise<void>
 */
async function deleteCollection(Model, name) {
    const count = await Model.countDocuments();
    if (count > 0) {
        await Model.deleteMany({});
        await Model.collection.dropIndexes();
        console.log(`${name} deletadas com sucesso`);
    }
    else {
        console.log(`Não há ${name} para deletar`);
    }
}
/**
 * Deleta múltiplas coleções em sequência
 * @param collections - Array de objetos com Model e name
 * @returns Promise<void>
 */
async function deleteCollections(collections) {
    for (const { Model, name } of collections) {
        await deleteCollection(Model, name);
    }
}
