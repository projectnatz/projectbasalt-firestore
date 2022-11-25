import { Type } from "@projectbasalt/core"
import { Database } from "./Database"
import { doc, Doc } from "./Doc"
import { PathValue } from "./Path"
import { RefField } from "./ref"

export const SnapshotField = Symbol("pn.basalt.snapshot_field")

/** @version 1.0.0 */
export type MaybeSnapshot<Path extends string, Tree extends Database.Tree> = EmptySnapshot<Path> | Snapshot<Path, Tree>

/** @version 1.0.0 */
export interface EmptySnapshot<Path extends string>
{
	readonly [Type.Field]: "pn.basalt.empty_snapshot"
	readonly [SnapshotField]: any
	readonly [RefField]: Doc<Path>
}

/** @version 1.0.0 */
export type Snapshot<Path extends string, Tree extends Database.Tree> = ([PathValue<Path, Tree>] extends [never] ? {} : PathValue<Path, Tree>) &
{
	readonly [Type.Field]: "pn.basalt.snapshot"
	readonly [SnapshotField]: any
	readonly [RefField]: Doc<Path>
}

export const EmptySnapshot = {
	Type: "pn.basalt.empty_snapshot" as Type<{ [Type.Field]: "pn.basalt.empty_snapshot", [SnapshotField]: any, [RefField]: any }>
} as const

export const Snapshot = {
	Type: "pn.basalt.snapshot" as Type<Readonly<{ [Type.Field]: "pn.basalt.snapshot", [SnapshotField]: any, [RefField]: any }>>
} as const


/**
 * Create a `Snapshot`.
 * 
 * @version 1.0.0
 */
export function snapshot<Path extends string, Tree extends Database.Tree>(db: Database, snapshot: { data: () => any, exists: boolean | (() => boolean), ref: { path: string } }): MaybeSnapshot<Path, Tree>
{
	if (!getSnapshotExists(snapshot)) return {
		[Type.Field]: "pn.basalt.empty_snapshot",
		[SnapshotField]: snapshot,
		[RefField]: doc(snapshot.ref.path) as any,
	}

	return {
		...convertData(db, snapshot.data()),
		[Type.Field]: "pn.basalt.snapshot",
		[SnapshotField]: snapshot,
		[RefField]: doc(snapshot.ref.path),
	}
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