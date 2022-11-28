import { Type } from "@projectbasalt/core"
import type { Transaction } from "./Transaction"
import type { WriteBatch } from "./WriteBatch"

/**
 * @version 1.0.0
 */
export interface Database<
	Tree extends Database.Tree = Database.Tree,
	CollectionGroup = any,
	CollectionReference extends Database.CollectionReference = Database.CollectionReference,
	DocumentReference extends Database.DocumentReference = Database.DocumentReference,
	DocumentSnapshot extends Database.DocumentSnapshot = Database.DocumentSnapshot,
	FieldPath = any,
	FieldValue = any,
	GeoPoint extends Database.GeoPoint = Database.GeoPoint,
	Query = any,
	QueryConstraint = any,
	QueryDocumentSnapshot extends Database.QueryDocumentSnapshot = Database.QueryDocumentSnapshot,
	QuerySnapshot extends Database.QuerySnapshot<QueryDocumentSnapshot> = Database.QuerySnapshot<QueryDocumentSnapshot>,
	Timestamp extends Database.Timestamp = Database.Timestamp,
	Transaction extends Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>= Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>,
	WriteResult = any,
	WriteBatch extends Database.WriteBatch<DocumentReference> = Database.WriteBatch<DocumentReference, WriteResult>,
>
{
	readonly [Type.Field]: "pn.basalt.database"

	addDoc(collectionReference: CollectionReference, data: unknown): Promise<DocumentReference>
	arrayRemove(...values: unknown[]): FieldValue
	arrayUnion(...values: unknown[]): FieldValue
	// readonly clearIndexedDbPersistence: Function
	collection(path: string): CollectionReference
	collectionGroup(id: string): CollectionGroup
	// readonly connectFirestoreEmulator: Function
	deleteDoc(documentReference: DocumentReference): Promise<WriteResult>
	deleteField(): FieldValue
	// readonly disableNetwork: PromiseFunction
	doc(path: string): DocumentReference
	documentId(): FieldPath
	// readonly enableIndexedDbPersistence: PromiseFunction
	// readonly enableMultiTabIndexedDbPersistence: PromiseFunction
	// readonly enableNetwork: PromiseFunction
	endAt(snapshot: DocumentSnapshot): QueryConstraint
	endBefore(snapshot: DocumentSnapshot): QueryConstraint
	geopoint(latitude: number, longitude: number): GeoPoint
	getDoc(documentReference: DocumentReference): Promise<DocumentSnapshot>
	// readonly getDocFromCache: PromiseFunction
	// readonly getDocFromServer: PromiseFunction
	getDocs(query: Query): Promise<QuerySnapshot>
	// readonly getDocsFromCache: PromiseFunction
	// readonly getDocsFromServer: PromiseFunction
	increment(n: number): FieldValue
	isDocumentReference(o: object): o is DocumentReference
	isGeoPoint(o: object): o is GeoPoint
	isTimestamp(o: object): o is Timestamp
	limit(limit: number): QueryConstraint
	// readonly limitToLast: Function
	onSnapshot(documentReference: DocumentReference, onNext: (snapshot: DocumentSnapshot) => void, onError?: (error: Error) => void): (() => void)
	onSnapshot(query: Query, onNext: (snapshot: QuerySnapshot) => void, onError?: (error: Error) => void): (() => void)
	// readonly onSnapshotInSync: Function
	orderBy(field: string | FieldPath, direction: "asc" | "desc"): QueryConstraint
	query(query: Query, ...constraints: QueryConstraint[]): Query
	// readonly queryEqual: Function
	// readonly refEqual: Function
	runTransaction<R>(callbackfn: (transaction: Transaction) => Promise<R>): Promise<R>
	serverTimestamp(): FieldValue
	setDoc(documentReference: DocumentReference, data: unknown, options?: unknown): Promise<WriteResult>
	startAfter(snapshot: DocumentSnapshot): QueryConstraint
	startAt(snapshot: DocumentSnapshot): QueryConstraint
	timestampFromDate(date: Date): Timestamp
	timestampNow(): Timestamp
	updateDoc(documentReference: DocumentReference, data: unknown): Promise<WriteResult>
	where(field: string | FieldPath, op: string, value: unknown): QueryConstraint
	writeBatch(): WriteBatch
}

const Config = {
	autoid: () => Math.random().toString().split(".").join("")
}

export namespace Database
{
	export type Collection<Source extends Database.Source> = Source extends Database.Source<infer Tree> ? Tree : never

	export interface CollectionReference
	{
		path: string
	}
	
	export interface DocumentReference
	{
		id: string
		path: string
	}
	
	export interface DocumentSnapshot
	{
		data(): unknown
		exists: boolean | (() => boolean)
	}

	export interface GeoPoint
	{
		latitude: number
		longitude: number
	}
	
	export interface QueryDocumentSnapshot
	{
		data(): unknown
		exists: boolean | (() => boolean)
	}
	
	export interface QuerySnapshot<DQDS extends Database.QueryDocumentSnapshot>
	{
		docs: DQDS[]
	}
	
	export interface Timestamp
	{
		toDate(): Date
	}

	export type Source<Tree extends Database.Tree = Database.Tree> = DatabaseSource<Tree>
	
	export interface Transaction<
		DocumentReference extends Database.DocumentReference,
		DocumentSnapshot extends Database.DocumentSnapshot = Database.DocumentSnapshot,
		Query = any,
		QueryDocumentSnapshot extends Database.QueryDocumentSnapshot = Database.QueryDocumentSnapshot,
		QuerySnapshot extends Database.QuerySnapshot<QueryDocumentSnapshot> = Database.QuerySnapshot<QueryDocumentSnapshot>,
	>
	{
		delete(documentReference: DocumentReference): Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>
		get(documentReference: DocumentReference): Promise<DocumentSnapshot>
		get(query: Query): Promise<QuerySnapshot>
		set(documentReference: DocumentReference, data: unknown, options?: unknown): Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>
		update(documentReference: DocumentReference, data: unknown): Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>
	}

	export type Tree = Record<string, unknown>
	
	export interface WriteBatch<
		DocumentReference extends Database.DocumentReference,
		WriteResult = any,
	>
	{
		commit(): Promise<WriteResult>
		delete(documentReference: DocumentReference): Database.WriteBatch<DocumentReference>
		set(documentReference: DocumentReference, data: unknown, options?: unknown): Database.WriteBatch<DocumentReference>
		update(documentReference: DocumentReference, data: unknown): Database.WriteBatch<DocumentReference>
	}

	export const Type = "pn.basalt.database" as Type<Database>
}

export type GeoPoint = Database.GeoPoint
export type Timestamp = Database.Timestamp
type DatabaseSource<Tree extends Database.Tree> =
	| Database<Tree>
	| Transaction<Database<Tree>>
	| WriteBatch<Database<Tree>>

/**
 * Generate a document id.
 * 
 * @version 1.0.0
 */
export const autoid = () => Config.autoid()

/**
 * Setup the autoid function.
 * 
 * @param autoid The new id generator (e.g. `() => admin.firestore().collection("test").doc().id`).
 * @version 1.0.0
 */
autoid.setup = (autoid: typeof Config.autoid) =>
{
	Config.autoid = autoid
}

/**
 * Create a database instance.
 * 
 * @version 1.0.0
 */
export const database = <
	CollectionGroup = any,
	CollectionReference extends Database.CollectionReference = Database.CollectionReference,
	DocumentReference extends Database.DocumentReference = Database.DocumentReference,
	DocumentSnapshot extends Database.DocumentSnapshot = Database.DocumentSnapshot,
	FieldPath = any,
	FieldValue = any,
	GeoPoint extends Database.GeoPoint = Database.GeoPoint,
	Query = any,
	QueryConsttaint = any,
	QueryDocumentSnapshot extends Database.QueryDocumentSnapshot = Database.QueryDocumentSnapshot,
	QuerySnapshot extends Database.QuerySnapshot<QueryDocumentSnapshot> = Database.QuerySnapshot<QueryDocumentSnapshot>,
	Timestamp extends Database.Timestamp = Database.Timestamp,
	Transaction extends Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>= Database.Transaction<DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot, QuerySnapshot>,
	WriteResult = any,
	WriteBatch extends Database.WriteBatch<DocumentReference> = Database.WriteBatch<DocumentReference, WriteResult>,
>(methods: Omit<Database<any, CollectionGroup, CollectionReference, DocumentReference, DocumentSnapshot, FieldPath, FieldValue, GeoPoint, Query, QueryConsttaint, QueryDocumentSnapshot, QuerySnapshot, Timestamp, Transaction, WriteResult, WriteBatch>, "collections" | Type.Field>) =>
	<Tree extends Database.Tree>(): Database<Tree, CollectionGroup, CollectionReference, DocumentReference, DocumentSnapshot, FieldPath, FieldValue, GeoPoint, Query, QueryConsttaint, QueryDocumentSnapshot, QuerySnapshot, Timestamp, Transaction, WriteResult, WriteBatch> =>
		({
			...methods,
			[Type.Field]: "pn.basalt.database",
		})