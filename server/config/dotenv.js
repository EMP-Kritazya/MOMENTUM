import dotenv from 'dotenv'
import path from "node:path"
import { fileURLToPath } from "node:url"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
dotenv.config({ path: path.resolve(dirname, "../.env") })

