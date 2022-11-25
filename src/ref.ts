import { typecheck } from "@projectbasalt/core"
import { collection, Collection } from "./Collection"
import type { Database } from "./Database"
import { doc, Doc } from "./Doc"
import { parentPath, PathParent } from "./Path"
import type { MaybeSnapshot } from "./Snapshot"

export const RefField = Symbol("pn.basalt.ref_field")

/**
 * Get the reference to the parent document of a collection.
 * 
 * @version 1.0.0
 */
export function parent<Path extends string>(collectionReference: Collection<Path>): Doc<PathParent<Path>>

/**
 * Get the reference to the parent collection of a document.
 * 
 * @version 1.0.0
 */
export function parent<Path extends string>(documentReference: Doc<Path>): Collection<PathParent<Path>>

export function parent<Path extends string>(reference: Collection<Path> | Doc<Path>): Doc<any> | Collection<any>
{
	const path = parentPath(reference.path)
	return typecheck(reference, Doc)
		? collection(path)
		: doc(path)
}

export function ref<Path extends string, Tree extends Database.Tree>(snapshot: MaybeSnapshot<Path, Tree> | Doc<Path>)
{
	return typecheck(snapshot, Doc)
		? snapshot
		: snapshot[RefField]
}