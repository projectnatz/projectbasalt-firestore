import { Database, database as createDatabase, autoid } from "../Database"

let autoidInitialized = false

/**
 * Create a database using the `firebase-admin` or `@react-native-firebase/firestore` package.
 * 
 * @version 1.0.0
 */
export function database<Tree extends Database.Tree>(dbmodule: typeof import("firebase-admin") | typeof import("@react-native-firebase/firestore").firebase)
{
	const firestore = dbmodule.firestore()

	if (!autoidInitialized) {
		autoid.setup(() => firestore.collection("test").doc().id)
		autoidInitialized = true
	}

	const baseDoc = firestore.doc("test/_____document")
	
	const db = createDatabase(
		{
			addDoc: (collection: FirebaseFirestore.CollectionReference, data: any) => collection.add(data),
			arrayRemove: dbmodule.firestore.FieldValue.arrayRemove,
			arrayUnion: dbmodule.firestore.FieldValue.arrayUnion,
			collection: (collectionPath) => firestore.collection(collectionPath),
			collectionGroup: (collectionId) => firestore.collectionGroup(collectionId),
			deleteDoc: (documentRef: FirebaseFirestore.DocumentReference) => documentRef.delete(),
			deleteField: dbmodule.firestore.FieldValue.delete,
			doc: (documentPath: string) => firestore.doc(documentPath),
			documentId: dbmodule.firestore.FieldPath.documentId,
			endAt: (snapshot: FirebaseFirestore.DocumentSnapshot) => (ref: FirebaseFirestore.Query) => ref.endAt(snapshot),
			endBefore: (snapshot: FirebaseFirestore.DocumentSnapshot) => (ref: FirebaseFirestore.Query) => ref.endBefore(snapshot),
			geopoint: (latitude, longitude) => new dbmodule.firestore.GeoPoint(latitude, longitude),
			getDoc: (ref: FirebaseFirestore.DocumentReference) => ref.get(),
			getDocs: (ref: FirebaseFirestore.Query) => ref.get() as any,
			increment: dbmodule.firestore.FieldValue.increment,
			isDocumentReference: (value): value is FirebaseFirestore.DocumentReference => value.constructor === baseDoc.constructor,
			isGeoPoint: (value): value is FirebaseFirestore.GeoPoint => value instanceof dbmodule.firestore.GeoPoint,
			isTimestamp: (value): value is FirebaseFirestore.Timestamp => value instanceof dbmodule.firestore.Timestamp,
			limit: (limit: number) => (ref: FirebaseFirestore.Query) => ref.limit(limit),
			onSnapshot: (ref: FirebaseFirestore.Query | FirebaseFirestore.DocumentReference | any, onNext, onError) => ref.onSnapshot(onNext as any, onError),
			orderBy: (field: string | FirebaseFirestore.FieldPath, direction: 'asc' | 'desc') => (ref: FirebaseFirestore.Query) => ref.orderBy(field, direction),
			query: (ref: FirebaseFirestore.Query, ...constraints: ((ref: FirebaseFirestore.Query) => FirebaseFirestore.Query)[]) => constraints.reduce((query, constraint) => constraint(query), ref),
			runTransaction: (updateFunction) => firestore.runTransaction(updateFunction as any),
			serverTimestamp: dbmodule.firestore.FieldValue.serverTimestamp,
			setDoc: (ref: FirebaseFirestore.DocumentReference, data) => ref.set(data as any),
			startAfter: (snapshot: FirebaseFirestore.DocumentSnapshot) => (ref: FirebaseFirestore.Query) => ref.startAfter(snapshot),
			startAt: (snapshot: FirebaseFirestore.DocumentSnapshot) => (ref: FirebaseFirestore.Query) => ref.startAt(snapshot),
			timestampNow: dbmodule.firestore.Timestamp.now,
			timestampFromDate: dbmodule.firestore.Timestamp.fromDate,
			updateDoc: (ref: FirebaseFirestore.DocumentReference, data) => ref.update(data as any),
			where: (field: string | FirebaseFirestore.FieldPath, op: FirebaseFirestore.WhereFilterOp, value: unknown) => (ref: FirebaseFirestore.Query) => ref.where(field, op, value),
			writeBatch: () => firestore.batch(),
		}
	)<Tree>()

	return db
}