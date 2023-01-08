import { Type } from "@projectbasalt/core"
import { Database } from "./Database"
import { doc, Doc } from "./Doc"
import { PathValue } from "./Path"
import { RefField } from "./ref"

/** @version 1.0.0 */
export type MaybeSnapshot<Path extends string, Tree extends Database.Tree> = undefined | Snapshot<Path, Tree>

/** @version 1.0.0 */
export type Snapshot<Path extends string, Tree extends Database.Tree> = ([PathValue<Path, Tree>] extends [never] ? {} : PathValue<Path, Tree>) &
{
	readonly [Type.Field]: "pn.basalt.snapshot"
	readonly [RefField]: Doc<Path>
}

export const Snapshot = {
	Type: "pn.basalt.snapshot" as Type<Readonly<{ [Type.Field]: "pn.basalt.snapshot", [RefField]: any }>>
} as const


/**
 * Create a `Snapshot`.
 * 
 * @version 1.0.0
 */
export function snapshot<Path extends string, Tree extends Database.Tree>(db: Database, snapshot: { data: () => any, exists: boolean | (() => boolean), ref: { path: string } }): MaybeSnapshot<Path, Tree>
{
	if (!getSnapshotExists(snapshot)) return undefined

	const value = {
		...convertData(db, snapshot.data()),
		[Type.Field]: "pn.basalt.snapshot",
		[RefField]: doc(snapshot.ref.path),
	}

	db.manage.snapshot(value, snapshot)

	return value
}

/**
 * Generate the exists function for a `DocumentSnapshot`.
 * 
 * @version 1.0.0
 */
function getSnapshotExists(snapshot: { exists: boolean | (() => boolean) })
{
	return typeof snapshot.exists === "boolean"
		? snapshot.exists
		: snapshot.exists()
}

/**
 * Convert the data into a format that can be used with this library.
 * 
 * @version 1.0.0
 */
function convertData(db: Database, data: unknown)
{
	if (typeof data === "object" && data !== null) {
		if (db.isDocumentReference(data)) return doc(data.path)
		if (db.isGeoPoint(data) || db.isTimestamp(data)) return data

		const converted: any = {}

		for (const key in data) {
			converted[key] = convertData(db, (data as any)[key])
		}

		return converted
	}

	return data
}