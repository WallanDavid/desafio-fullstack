import initSqlJs, { Database } from 'sql.js'
import fs from 'fs-extra'

let db: Database | null = null
const DB_FILE = './data.sqlite'

export async function initDb() {
  const SQL = await initSqlJs()
  if (await fs.pathExists(DB_FILE)) {
    const data = await fs.readFile(DB_FILE)
    db = new SQL.Database(data)
  } else {
    db = new SQL.Database()
  }
  db!.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  )
  db!.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  )
  await save()
}

async function save() {
  if (!db) return
  const data = db.export()
  await fs.writeFile(DB_FILE, Buffer.from(data))
}

export function dbAll(sql: string, params: unknown[] = []) {
  const stmt = db!.prepare(sql)
  stmt.bind(params as any)
  const rows: any[] = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

export function dbGet(sql: string, params: unknown[] = []) {
  const stmt = db!.prepare(sql)
  stmt.bind(params as any)
  let row: any | undefined
  if (stmt.step()) row = stmt.getAsObject()
  stmt.free()
  return row
}

export async function dbRun(sql: string, params: unknown[] = []) {
  db!.run(sql, params as any)
  await save()
}

export function lastInsertId() {
  const row = dbGet('SELECT last_insert_rowid() as id')
  return row?.id as number
}

