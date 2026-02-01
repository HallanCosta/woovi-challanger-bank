import type mongoose from 'mongoose'

async function waitForDrop(db) {
  while (true) {
    const collections = await db.listCollections().toArray()
    if (collections.length === 0) break
    await new Promise((resolve) => setTimeout(resolve, 500)) // Atraso de 0.5 segundos
  }
}

async function clearDatabase(connection: mongoose.Mongoose) {
  await connection.connection.db.dropDatabase({
    retryWrites: false,
    readConcern: 'majority'
  })
}

export async function clearDbAndRestartCounters(connection: mongoose.Mongoose) {
  await clearDatabase(connection)
}
