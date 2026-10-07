import { PrismaClient } from '@prisma/client'

const DEFAULT_DATABASE_URL =
  'mongodb+srv://furynetworkslk_db_user:1Ku5a5AuPYrhhME1@cluster0.2xwy1al.mongodb.net/sera?retryWrites=true&w=majority&appName=Cluster0'

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
      },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
