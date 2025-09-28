import { MongoMemoryServer } from 'mongodb-memory-server'

interface MongoConfig {
  dbName: string
  downloadDir: string
  supportedVersions: string[]
  retryableErrors: string[]
}

interface StartMemoryDbResult {
  server: MongoMemoryServer
  uri: string
  dbName: string
}

let mongoServer: MongoMemoryServer | null = null

const DEFAULT_CONFIG: MongoConfig = {
  dbName: 'test-db',
  downloadDir: './mongodb-binaries',
  supportedVersions: ['6.0.4', '5.0.0', '4.4.29'],
  retryableErrors: ['libcrypto.so.1.1', 'library is missing', 'StdoutInstanceError']
}

const createServerWithVersion = async (version: string, config: MongoConfig): Promise<MongoMemoryServer> => {
  // console.log(`⏳ Tentando MongoDB versão ${version}...`)
  
  const server = await MongoMemoryServer.create({
    binary: {
      version,
      downloadDir: config.downloadDir,
      systemBinary: undefined,
    },
    instance: {
      dbName: config.dbName,
      port: undefined,
      args: ['--quiet'],
    },
  })
  
  // console.log(`✅ MongoDB ${version} iniciado com sucesso!`)
  return server
}

const isRetryableError = (error: Error, retryableErrors: string[]): boolean => {
  return retryableErrors.some(errorType => error.message.includes(errorType))
}

const tryVersions = async (config: MongoConfig): Promise<MongoMemoryServer> => {
  let lastError: Error | null = null

  for (const version of config.supportedVersions) {
    try {
      return await createServerWithVersion(version, config)
    } catch (error) {
      const err = error as Error
      // console.log(`❌ Falha com MongoDB ${version}:`, err.message.substring(0, 100) + '...')
      lastError = err
      
      if (!isRetryableError(err, config.retryableErrors)) {
        throw err
      }
    }
  }

  throw lastError || new Error('Nenhuma versão do MongoDB foi iniciada com sucesso')
}

const startMongoMemoryServer = async (config: MongoConfig): Promise<StartMemoryDbResult> => {
  // console.log('🚀 Iniciando MongoDB Memory Server...')
  
  if (!mongoServer) {
    mongoServer = await tryVersions(config)
  }
  
  const uri = mongoServer.getUri()
  const dbName = config.dbName
  
  // Configurar variáveis globais para compatibilidade
  global.__MONGO_URI__ = uri
  global.__MONGO_DB_NAME__ = dbName
  
  // console.log('🎉 MongoDB Memory Server URI:', uri)

  return {
    server: mongoServer,
    uri,
    dbName
  }
}

export const startMemoryDb = async (): Promise<MongoMemoryServer> => {
  const result = await startMongoMemoryServer(DEFAULT_CONFIG)
  return result.server
}

export const startMemoryDbWithConfig = async (config?: Partial<MongoConfig>): Promise<StartMemoryDbResult> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  return await startMongoMemoryServer(finalConfig)
}