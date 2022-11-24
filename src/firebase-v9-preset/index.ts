import type { DocumentReference, GeoPoint, Firestore, Query, Timestamp } from "firebase/firestore"
import { Database, database as createDatabase, autoid } from "../Database"

let autoidInitialized = false

/**
 * Create a database using the `firebase` package (v9).
 * 
 * @version 1.0.0
 */
export function database<Tree extends Database.Tree>(firestore: Firestore, dbmodule: typeof import("firebase/firestore"))
{
	if (!autoidInitialized) {
		autoid.setup(() => dbmodule.doc(dbmodule.collection(firestore, "test")).id)
		autoidInitialized = true
	}
	
	const db = createDatabase(
		{
			addDoc: dbmodule.addDoc,
			arrayRemove: dbmodule.arrayRemove,
			arrayUnion: dbmodule.arrayUnion,
			collection: collectionPath => dbmodule.collection(firestore, collectionPath),
			collectionGroup: collectionId => dbmodule.collectionGroup(firestore, collectionId),
			deleteDoc: dbmodule.deleteDoc,
			deleteField: dbmodule.deleteField,
			doc: (documentPath: string) => dbmodule.doc(firestore, documentPath),
			documentId: dbmodule.documentId,
			endAt: dbmodule.endAt,
			endBefore: dbmodule.endBefore,
			geopoint: (latitude, longitude) => new dbmodule.GeoPoint(latitude, longitude),
			getDoc: dbmodule.getDoc,
			getDocs: dbmodule.getDocs,
			increment: dbmodule.increment,
			isDocumentReference: (value): value is DocumentReference => value instanceof dbmodule.DocumentReference,
			isGeoPoint: (value): value is GeoPoint => value instanceof dbmodule.GeoPoint,
			isTimestamp: (value): value is Timestamp => value instanceof dbmodule.Timestamp,
			limit: dbmodule.limit,
			// @ts-ignore
			onSnapshot: (reference: Query | DocumentReference, onNext, onError): any => dbmodule.onSnapshot(reference as any, onNext as any, onError),
			orderBy: dbmodule.orderBy,
			query: dbmodule.query,
			// @ts-ignore
			runTransaction: updateFunction => dbmodule.runTransaction(firestore, updateFunction),
			serverTimestamp: dbmodule.serverTimestamp,
			setDoc: dbmodule.setDoc,
			startAfter: dbmodule.startAfter,
			startAt: dbmodule.startAt,
			timestampNow: dbmodule.Timestamp.now,
			timestampFromDate: dbmodule.Timestamp.fromDate,
			updateDoc: dbmodule.updateDoc,
			where: dbmodule.where,
			writeBatch: () => dbmodule.writeBatch(firestore),
		}
	)<Tree>()

	return db
}