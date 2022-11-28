import { CollectionGroup } from "./CollectionGroup"
import { Collection } from "./Collection"
import { Database } from "./Database"
import { Doc } from "./Doc"
import { MaybeSnapshot, snapshot } from "./Snapshot"
import { prepareQuery, Query } from "./Query"
import { querySnapshot, QuerySnapshot } from "./QuerySnapshot"
import { Transaction } from "./Transaction"
import { PathGroup } from "./Path"
import { typecheck } from "@projectbasalt/core"

/** @version 1.0.0 */
export interface Unsubscribe
{
	(): void
}

/**
 * Reads the document referred to by this `DocumentReference`.
 * The document is locked during the duration of the `Transaction`.
 * 
 * @version 1.0.0
 */
export function getDoc<PATH extends string, DB extends Database>(transaction: Transaction<DB>, reference: Doc<PATH>): Promise<MaybeSnapshot<PATH, Database.Collection<DB>>>

/**
 * Reads the document referred to by this `DocumentReference`.
 * 
 * @version 1.0.0
 */
export function getDoc<PATH extends string, DB extends Database>(db: DB, reference: Doc<PATH>): Promise<MaybeSnapshot<PATH, Database.Collection<DB>>>

export function getDoc(source: Transaction<Database> | Database, reference: Doc<string>): Promise<MaybeSnapshot<string, any>>
{
	const db = typecheck(source, Database) ? source : source._db
	const documentReference = db.doc(reference.path)

	return (typecheck(source, Database) ? source.getDoc(documentReference) : source._transaction.get(documentReference))
		.then(documentSnapshot => snapshot(db, documentSnapshot))
}

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 * 
 * @version 1.0.0
 */
// @ts-ignore
export function getDocs<Id extends string, DB extends Database>(db: DB | Transaction<DB>, query: CollectionGroup<Id> | Query.Group<Id>): Promise<QuerySnapshot<PathGroup<Id, Database.Collection<DB>>, Database.Collection<DB>>>

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 * 
 * @version 1.0.0
 */
export function getDocs<Path extends string, DB extends Database>(db: DB | Transaction<DB>, query: Collection<Path> | Query.Standard<Path>): Promise<QuerySnapshot<Path, Database.Collection<DB>>>

export function getDocs(source: Database | Transaction<Database>, query: CollectionGroup<string> | Collection<string> | Query<string>): Promise<QuerySnapshot<any, any>>
{
	const db = typecheck(source, Database) ? source : source._db
	const reference =
		typecheck(query, Collection)
			? db.collection(query.path)
		: typecheck(query, CollectionGroup)
			? db.collectionGroup(query.id)
			: prepareQuery(db, query)

	return (typecheck(source, Database) ? source.getDocs(reference) : source._transaction.get(reference))
		.then(snapshot => querySnapshot(db, snapshot))
}

/**
 * Attaches a listener for `MaybeSnapshot` events.
 * You may either pass individual `onNext` and `onError` callbacks or pass a single observer object with next and error callbacks.
 * 
 * @version 1.0.0
 */
export function onSnapshot<PATH extends string, DB extends Database>(db: DB, reference: Doc<PATH>, onNext: (snapshot: MaybeSnapshot<PATH, Database.Collection<DB>>) => void, onError?: (error: Error) => void): Unsubscribe

/**
 * Attaches a listener for `QuerySnapshot` events.
 * You may either pass individual `onNext` and `onError` callbacks or pass a single observer object with next and error callbacks.
 * The listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 * 
 * @version 1.0.0
 */
export function onSnapshot<Path extends string, DB extends Database>(db: DB, reference: Collection<Path> | Query.Standard<Path>, onNext: (snapshot: QuerySnapshot<Path, Database.Collection<DB>>) => void, onError?: (error: Error) => void): Unsubscribe

/**
 * Attaches a listener for `QuerySnapshot` events.
 * You may either pass individual `onNext` and `onError` callbacks or pass a single observer object with next and error callbacks.
 * The listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 * 
 * @version 1.0.0
 */
export function onSnapshot<Id extends string, DB extends Database>(db: DB, reference: CollectionGroup<Id> | Query.Group<Id>, onNext: (snapshot: QuerySnapshot<PathGroup<Id, Database.Collection<DB>>, Database.Collection<DB>>) => void, onError?: (error: Error) => void): Unsubscribe

export function onSnapshot(db: Database, reference: Doc<string> | CollectionGroup<string> | Collection<string> | Query<string>, onNext: Function, onError?: (error: Error) => void): Unsubscribe
{
	return db.onSnapshot(
		( typecheck(reference, Doc)
		? db.doc(reference.path)
		: typecheck(reference, Collection)
		? db.collection(reference.path)
		: typecheck(reference, CollectionGroup)
		? db.collectionGroup(reference.id)
		: prepareQuery(db, reference)),
		( typecheck(reference, Doc)
		? (documentSnapshot: any) => onNext(snapshot(db, documentSnapshot))
		: (documentSnapshots: any) => onNext(querySnapshot(db, documentSnapshots))),
		onError
	)
}

