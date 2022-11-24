import { Type } from "@projectbasalt/core"
import { Database } from "./Database"

/** @version 1.0.0 */
export interface WriteBatch<DB extends Database>
{
	readonly [Type.Field]: "pn.basalt.write_batch"
	readonly _batch: {
		commit(): Promise<void>
		delete(ref: unknown): WriteBatch<DB>["_batch"]
		set(ref: unknown, data: unknown, options?: unknown): WriteBatch<DB>["_batch"]
		update(ref: unknown, data: unknown): WriteBatch<DB>["_batch"]
	}
	readonly _db: DB
}

export namespace WriteBatch
{
	export const Type = "pn.basalt.write_batch" as Type<WriteBatch<Database>>
}

/**
 * Commit the write batch.
 * 
 * @version 1.0.0
 */
export const commitBatch = <DB extends Database>(writeBatch: WriteBatch<DB>): Promise<void> =>
	writeBatch._batch.commit()

/**
 * Creates a write batch, used for performing multiple writes as a single atomic operation.
 * The maximum number of writes allowed in a single `WriteBatch` is 500.
 * Unlike transactions, write batches are persisted offline and therefore are preferable when you don"t need to condition your writes on read data.
 * 
 * @version 1.0.0
 */
export function writeBatch<DB extends Database>(db: DB, batch?: WriteBatch<DB>["_batch"]): WriteBatch<DB>
{
	return {
		[Type.Field]: "pn.basalt.write_batch",
		_batch: batch ?? db.writeBatch() as any,
		_db: db,
	}
}