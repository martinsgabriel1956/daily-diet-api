import { knex } from '../database'

interface IsResourceExistsProps {
  tableName: string
  resourceId: string
  sessionId?: string
}

export async function isResourceExists ({ resourceId, sessionId, tableName }: IsResourceExistsProps) {
  const resourceExists = await knex(tableName).where({
    id: resourceId,
    session_id: sessionId
  }).first();

  if (!resourceExists) {
    return false;
  }

  return true;
}
