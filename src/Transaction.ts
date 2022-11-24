import { Type } from "@projectbasalt/core"
import { Database } from "./Database"

/** @version 1.0.0 */
export interface Transaction<DB extends Database>
{
	readonly [Type.Field]: "pn.basalt.transaction"
	readonly _db: DB
	readonly _transaction: {
		delete(ref: unknown): Transaction<DB>["_transaction"]
		get(ref: unknown): Promise<any>
		set(ref: unknown, data: unknown, options?: unknown): Transaction<DB>["_transaction"]
		update(ref: unknown, data: unknown): Transaction<DB>["_transaction"]
	}
}

export namespace Transaction
{
	export const Type = "pn.basalt.transaction" as Type<Transaction<Database>>
}

/**
 * Executes the given `updateFunction` and then attempts to commit the changes applied within the transaction.
 * If any document read within the transaction has changed, Cloud Firestore retries the `updateFunction`.
 * If it fails to commit after 5 attempts, the transaction fails.
 * The maximum number of writes allowed in a single transaction is 500.
 * 
 * @version 1.0.0
 */
export const runTransaction = <DB extends Database, R>(db: DB, updateFunction: ((transaction: Transaction<DB>) => Promise<R>)): Promise<R> =>
	db.runTransaction((t: any) => updateFunction(transaction(db, t)))

/**
 * Create a `Transaction`.
 * 
 * @version 1.0.0
 */
export function transaction<DB extends Database>(db: DB, transaction: Transaction<DB>["_transaction"]): Transaction<DB>
{
	return {
		[Type.Field]: "pn.basalt.transaction",
		_db: db,
		_transaction: transaction,
	}
}