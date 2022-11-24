import { typecheck } from "@projectbasalt/core"
import { Collection } from "./Collection"
import { Database } from "./Database"
import { doc, Doc } from "./Doc"
import { prepareData, UpdateData, SetData } from "./FieldValue"
import { PathCollection, PathId, PathValue } from "./Path"
import { transaction, Transaction } from "./Transaction"
import { writeBatch, WriteBatch } from "./WriteBatch"

/** @version 1.0.0 */
export interface SetOptions
{
	merge?: boolean
	mergeFields?: string[]
}

/**
 * Prepares the `Transaction` to add a new document to the specified `CollectionReference` with the given data, assigning it a document ID automatically.
 * 
 * @version 1.0.0
 */
export function addDoc<Path extends string, DB extends Database>(db: Transaction<DB>, reference: Collection<Path>, data: SetData<PathValue<Path, Database.Collection<DB>>>): Doc<`${PathCollection<Path>}/${PathId<Path, string>}`>

/**
 * Prepares the `WriteBatch` to add a new document to the specified `CollectionReference` with the given data, assigning it a document ID automatically.
 * 
 * @version 1.0.0
 */
export function addDoc<Path extends string, DB extends Database>(db: WriteBatch<DB>, reference: Collection<Path>, data: SetData<PathValue<Path, Database.Collection<DB>>>): Doc<`${PathCollection<Path>}/${PathId<Path, string>}`>

/**
 * Add a new document to specified `CollectionReference` with the given data, assigning it a document ID automatically.
 * 
 * @version 1.0.0
 */
export function addDoc<Path extends string, DB extends Database>(db: DB, reference: Collection<Path>, data: SetData<PathValue<Path, Database.Collection<DB>>>): Promise<Doc<`${PathCollection<Path>}/${PathId<Path, string>}`>>

export function addDoc<Path extends string, DB extends Database, DocRef extends Doc<any> = ReturnType<typeof doc<[], Path>>>(source: DB | Transaction<DB> | WriteBatch<DB>, reference: Collection<Path>, data: SetData<PathValue<DocRef["path"], Database.Collection<DB>>>): Promise<DocRef> | DocRef
{
	// @ts-ignore
	const document: DocRef = doc(reference)
	// @ts-ignore
	const result = setDoc(source, document, data)

	return result instanceof Promise ? result.then(() => document) : document
}
		
/**
 * Prepares the `Transaction` to write to the document referred to by the specified `DocumentReference`.
 * If the document does not yet exist, it will be created.
 * If you provide `merge` or `mergeFields`, the provided data can be merged into an existing document.
 * 
 * @version 1.0.0
 */
export function setDoc<Path extends string, DB extends Database>(transaction: Transaction<DB>, reference: Doc<Path>, data: SetData<PathValue<Path, Database.Collection<DB>>>, options?: SetOptions): Transaction<DB>

/**
 * Prepares the `WriteBatch` to write to the document referred to by the specified `DocumentReference`.
 * If the document does not yet exist, it will be created.
 * If you provide `merge` or `mergeFields`, the provided data can be merged into an existing document.
 * 
 * @version 1.0.0
 */
export function setDoc<Path extends string, DB extends Database>(writeBatch: WriteBatch<DB>, reference: Doc<Path>, data: SetData<PathValue<Path, Database.Collection<DB>>>, options?: SetOptions): WriteBatch<DB>

/**
 * Writes to the document referred to by the specified `DocumentReference`.
 * If the document does not yet exist, it will be created.
 * If you provide `merge` or `mergeFields`, the provided data can be merged into an existing document.
 * 
 * @version 1.0.0
 */
export function setDoc<Path extends string, DB extends Database>(db: DB, reference: Doc<Path>, data: SetData<PathValue<Path, Database.Collection<DB>>>, options?: SetOptions): Promise<void>

export function setDoc(source: Database | Transaction<Database> | WriteBatch<Database>, reference: Doc<string>, data: any, options?: any)
{
	return typecheck(source, Transaction)
		? transaction(source._db, source._transaction.set(source._db.doc(reference.path), prepareData(source._db, data), options))
		: typecheck(source, WriteBatch)
		? writeBatch(source._db, source._batch.set(source._db.doc(reference.path), prepareData(source._db, data), options))
		: source.setDoc(source.doc(reference.path), prepareData(source, data), options)
}

/**
 * Prepares the `Transaction` to update fields in the document referred to by the specified `DocumentReference`.
 * The update will fail if applied to a document that does not exist.
 * 
 * @version 1.0.0
 */
export function updateDoc<Path extends string, DB extends Database>(transaction: Transaction<DB>, reference: Doc<Path>, data: UpdateData<PathValue<Path, Database.Collection<DB>>>): Transaction<DB>

/**
 * Prepares the `WriteBatch` to update fields in the document referred to by the specified `DocumentReference`.
 * The update will fail if applied to a document that does not exist.
 * 
 * @version 1.0.0
 */
export function updateDoc<Path extends string, DB extends Database>(writeBatch: WriteBatch<DB>, reference: Doc<Path>, data: UpdateData<PathValue<Path, Database.Collection<DB>>>): WriteBatch<DB>

/**
 * Updates fields in the document referred to by the specified `DocumentReference`.
 * The update will fail if applied to a document that does not exist.
 * 
 * @version 1.0.0
 */
export function updateDoc<Path extends string, DB extends Database>(db: DB, reference: Doc<Path>, data: UpdateData<PathValue<Path, Database.Collection<DB>>>): Promise<void>

export function updateDoc(source: Database | Transaction<Database> | WriteBatch<Database>, reference: Doc<string>, data: any)
{
	return typecheck(source, Transaction)
		? transaction(source._db, source._transaction.update(source._db.doc(reference.path), prepareData(source._db, data)))
		: typecheck(source, WriteBatch)
		? writeBatch(source._db, source._batch.update(source._db.doc(reference.path), prepareData(source._db, data)))
		: source.updateDoc(source.doc(reference.path), prepareData(source, data))
}