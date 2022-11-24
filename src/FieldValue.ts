import { Type, typecheck } from "@projectbasalt/core"
import { Database } from "./Database"
import { Doc } from "./Doc"

/** @version 1.0.0 */
export type FieldValue<T>
	= (T extends (infer X)[] ? FieldValue.ArrayRemove<X> | FieldValue.ArrayUnion<X> : never)
	| (T extends number ? FieldValue.Increment : never)
	| (T extends Database.Timestamp | Date ? Date | FieldValue.ServerTimestamp | FieldValue.Timestamp : never)
	| (T extends Database.GeoPoint ? FieldValue.GeoPoint : never)
	| FieldValue.DeleteField

/** @version 1.0.0 */
export type UpdateData<T> =
	T extends Primitive
		? never
	: T extends {}
		? { [K in keyof T]?: WithFieldValue<T[K]> | UpdateData<T[K]> } & NestedUpdateData<T>
		: T

/** @version 1.0.0 */
export type NestedUpdateData<T extends {}, Prefix extends string = ""> =
	UnionToIntersection<
		{
			[K in keyof T]
				-?: K extends string
					?
						| { [SubKey in `${Prefix}${K}`]?: WithFieldValue<T[K]> | UpdateData<T[K]> }
						|	(
							T[K] extends Primitive
								? {}
							: T[K] extends {}
								? NestedUpdateData<T[K], `${Prefix}${K}.`>
								: {}
						)
				: {}
		}[keyof T]
	>

/** @version 1.0.0 */
export type SetData<T> =
	T extends Primitive
		? never
	: T extends {}
		? { [K in keyof T]: WithFieldValue<T[K]> | SetData<T[K]> }
		: never

/** @version 1.0.0 */
export type WithFieldValue<T> =
	| FieldValue<T>
	| T

/** @version 1.0.0 */
type Primitive =
	| Database.GeoPoint
	| Database.Timestamp
	| Database.DocumentReference
	| Doc<string>
	| FieldValue<any>
	| Array<unknown>
	| Date
	| bigint
	| boolean
	| number
	| Function
	| string
	| symbol
	| null
	| undefined

/** @version 1.0.0 */
type UnionToIntersection<U>
	= (
		U extends unknown
			? (k: U) => void
			: never
		) extends (k: infer I) => void
			? I
			: never

interface Base
{
	[Type.Field]: "pn.basalt.field_value"
}

export namespace FieldValue
{
	export interface ArrayRemove<T> extends Base
	{
		type: "array_remove"
		elements: T[]
	}

	export interface ArrayUnion<T> extends Base
	{
		type: "array_union"
		elements: T[]
	}

	export interface DeleteField extends Base
	{
		type: "delete_field"
	}

	export interface Increment extends Base
	{
		type: "increment"
		n: number
	}

	export interface GeoPoint extends Base
	{
		type: "geopoint"
		latitude: number
		longitude: number
	}

	export interface ServerTimestamp extends Base
	{
		type: "server_timestamp"
	}

	export interface Timestamp extends Base
	{
		type: "timestamp"
		date?: Date
	}

	export const Type = "pn.basalt.field_value" as Type<Exclude<FieldValue<any>, Date>>
}

/**
 * Returns a special value that can be used with `setDoc()` or that tells the server to remove the given elements from any array value that already exists on the server.
 * All instances of each element specified will be removed from the array.
 * If the field being modified is not already an array it will be overwritten with an empty array.
 *
 * @version 1.0.0
 */
export const arrayRemove = <T>(...elements: T[]): FieldValue.ArrayRemove<T> =>
	Type.value("pn.basalt.field_value", { type: "array_remove", elements })

/**
 * Returns a special value that can be used with `setDoc()` or `updateDoc()` that tells the server to union the given elements with any array value that already exists on the server.
 * Each specified element that doesn"t already exist in the array will be added to the end.
 * If the field being modified is not already an array it will be overwritten with an array containing exactly the specified elements.
 * 
 * @version 1.0.0
 */
export const arrayUnion = <T>(...elements: T[]): FieldValue.ArrayUnion<T> =>
	Type.value("pn.basalt.field_value", { type: "array_union", elements })

/**
 * Returns a sentinel for use with `updateDoc()` or `setDoc()` with `{merge: true}` to mark a field for deletion.
 * 
 * @version 1.0.0
 */
export const deleteField = (): FieldValue.DeleteField =>
	Type.value("pn.basalt.field_value", { type: "delete_field" })

/**
 * Returns a special value that can be used with `setDoc()` or `updateDoc()` that tells the server to increment the field's current value by the given value.
 * If either the operand or the current field value uses floating point precision, all arithmetic follows IEEE 754 semantics.
 * If both values are integers, values outside of JavaScript"s safe number range (`Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER`) are also subject to precision loss.
 * Furthermore, once processed by the Firestore backend, all integer operations are capped between `-2^63` and `2^63-1`.
 * If the current field value is not of type `number`, or if the field does not yet exist, the transformation sets the field to the given value.
 * 
 * @version 1.0.0
 */
export const increment = (n: number): FieldValue.Increment =>
	Type.value("pn.basalt.field_value", { type: "increment", n })

/**
 * Returns a special value that can be used with `setDoc()` or `updateDoc()` that tells the server to save an object representing a geo point in Firestore.
 * The geo point is represented as latitude/longitude pair.
 * Latitude values are in the range of [-90, 90]. Longitude values are in the range of [-180, 180].
 * 
 * @version 1.0.0
 */
export const geopoint = (latitude: number, longitude: number): FieldValue.GeoPoint =>
	Type.value("pn.basalt.field_value", { type: "geopoint", latitude, longitude })

/**
 * Prepare the data by replacing each `FieldValue` with the real Sentinel used by the passed database.
 * 
 * @version 1.0.0
 */
export const prepareData = <DB extends Database>(db: DB, data: unknown) =>
{
	if (data === undefined || data === null || typeof data === "boolean" || typeof data === "number" || typeof data === "string" || typeof data === "bigint" || Array.isArray(data)) return data
	if (typeof data !== "object") return undefined

	return prepareFieldValue(db, data as any)
}

/**
 * Prepare the `FieldValue` using the passed database.
 * 
 * @version 1.0.0
 */
export const prepareFieldValue = <DB extends Database>(db: DB, fieldValue: unknown) =>
{
	if (fieldValue === undefined || typeof fieldValue === "symbol" || typeof fieldValue === "function") return undefined
	if (fieldValue === null || typeof fieldValue !== "object" || Array.isArray(fieldValue) || db.isDocumentReference(fieldValue) || db.isGeoPoint(fieldValue) || db.isTimestamp(fieldValue)) return fieldValue

	if (fieldValue instanceof Date) return db.timestampFromDate(fieldValue)

	if (typecheck(fieldValue, FieldValue)) {
		switch (fieldValue.type) {
			case "array_remove": return db.arrayRemove(...fieldValue.elements)
			case "array_union": return db.arrayUnion(...fieldValue.elements)
			case "delete_field": return db.deleteField()
			case "increment": return db.increment(fieldValue.n)
			case "geopoint": return db.geopoint(fieldValue.latitude, fieldValue.longitude)
			case "server_timestamp": return db.serverTimestamp()
			case "timestamp": return fieldValue.date === undefined ? db.timestampNow() : db.timestampFromDate(fieldValue.date)
		}
	}

	if (typecheck(fieldValue, Doc)) return db.doc(fieldValue.path)

	const initialData: any = {}

	for (const key in fieldValue) {
		initialData[key] = prepareFieldValue(db, (fieldValue as any)[key])
	}

	return initialData
}

/**
 * Returns a sentinel used with `setDoc()` or `updateDoc()` to include a server-generated timestamp in the written data.
 * 
 * @version 1.0.0
 */
export const serverTimestamp = (): FieldValue.ServerTimestamp =>
	Type.value("pn.basalt.field_value", { type: "server_timestamp" })

/**
 * Create a `Timestamp` using the current time.
 * 
 * @version 1.0.0
 */
export function timestamp(): FieldValue.Timestamp

/**
 * Create a `Timestamp` using the passed date.
 * 
 * @version 1.0.0
 */
export function timestamp(date: Date): FieldValue.Timestamp

export function timestamp(date?: Date): FieldValue.Timestamp
{
	return Type.value("pn.basalt.field_value", { type: "timestamp", date })
}