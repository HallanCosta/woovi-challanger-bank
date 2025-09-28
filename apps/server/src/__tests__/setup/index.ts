import type MongoMemoryServer from 'mongodb-memory-server-core'
import type mongoose from 'mongoose'
import { clearDbAndRestartCounters } from './mongodb/clearDatabase'
import { connectMongoose } from './mongodb/connectMemoryDb'
import { disconnectMongoose } from './mongodb/disconnectMemoryDb'
import { startMemoryDb } from './mongodb/startMemoryDb'
import { closeRedisPubSub } from '../../modules/pubSub/redisPubSub'

process.env.NODE_ENV = 'test';

interface TestSetupContext {
  mongod: MongoMemoryServer | null
  connection: mongoose.Mongoose | null
}

// Contexto global compartilhado entre os testes
const testContext: TestSetupContext = {
  mongod: null,
  connection: null
}

export const setupDatabase = () => {
  beforeAll(async () => {
    // console.log('🚀 Iniciando setup do banco de dados para testes...')
    testContext.mongod = await startMemoryDb()
  }, 120000) // 120 segundos timeout para download do MongoDB
  
  beforeEach(async () => {
    testContext.connection = await connectMongoose()
    await clearDbAndRestartCounters(testContext.connection)
  })
  
  afterEach(async () => {
    if (testContext.connection) {
      await disconnectMongoose(testContext.connection)
      testContext.connection = null
    }
  })
  
  afterAll(async () => {
    if (testContext.mongod) {
      // console.log('🔥 Finalizando MongoDB Memory Server...')
      await testContext.mongod.stop()
      testContext.mongod = null
    }
    
    // Fechar conexões do RedisPubSub para evitar handles abertos
    await closeRedisPubSub()
  }, 30000) // 30 segundos timeout para parar o MongoDB
}