import { typecheck } from "@projectbasalt/core"
import { Database } from "./Database"
import { Doc } from "./Doc"
import { transaction, Transaction } from "./Transaction"
import { writeBatch, WriteBatch } from "./WriteBatch"

/**
 * Prepares the `Transaction` to delete the document referred to by the specified `DocumentReference`.
 * 
 * @version 1.0.0
 */
export function deleteDoc<PATH extends string, DB extends Database>(transaction: Transaction<DB>, reference: Doc<PATH>): Transaction<DB>

/**
 * Prepares the `WriteBatch` to delete the document referred to by the specified `DocumentReference`.
 * 
 * @version 1.0.0
 */
export function deleteDoc<PATH extends string, DB extends Database>(writeBatch: WriteBatch<DB>, reference: Doc<PATH>): Transaction<DB>

/**
 * Deletes the document referred to by the specified `DocumentReference`.
 * 
 * @version 1.0.0
 */
export function deleteDoc<PATH extends string, DB extends Database>(db: DB, reference: Doc<PATH>): Promise<void>

export function deleteDoc(source: Transaction<Database> | WriteBatch<Database> | Database, reference: Doc<string>)
{
	return typecheck(source, Database)
		? source.deleteDoc(source.doc(reference.path))
		: typecheck(source, Transaction)
		? transaction(source._db, source._transaction.delete(source._db.doc(reference.path)))
		: writeBatch(source._db, source._batch.delete(source._db.doc(reference.path)))
}