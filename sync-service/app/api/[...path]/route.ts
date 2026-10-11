import { env } from 'cloudflare:workers';
import { handle } from '../../../lib/sync-service.mjs';
export const dynamic = 'force-dynamic';
export const GET = (request: Request) => handle(request, env);
export const POST = GET;
export const DELETE = GET;
export const OPTIONS = GET;
