/**
 * Read Sheet1 from 기사 정리.xlsx as raw rows.
 */
import { readFile } from 'node:fs/promises'
import * as XLSX from 'xlsx'

const file = process.argv[2] ?? 'C:\\Users\\user\\Documents\\카카오톡 받은 파일\\기사 정리.xlsx'
const buf = await readFile(file)
const wb = XLSX.read(buf, { type: 'buffer' })
console.log('Sheets:', wb.SheetNames)

for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  console.log(`\n=== ${name} (${rows.length} rows) ===`)
  for (let i = 0; i < rows.length; i++) {
    console.log(`${i}:`, JSON.stringify(rows[i]))
  }
}
