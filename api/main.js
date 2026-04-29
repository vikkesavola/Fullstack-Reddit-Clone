import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts'
import { handle } from 'https://deno.land/x/hono@v3.11.7/adapter/vercel/mod.ts'
import app from '../server/app.js'

export default handle(app)