import { Type, typecheck } from "@projectbasalt/core"
import { Doc } from "./Doc"
import { pathJoin, collectionPath, EscapePath, PathCollection } from "./Path"

/**
 * A reference to a Collection in the database.
 * 
 * @version 1.0.0
 */
export interface Collection<Path extends string>
{
	readonly _tag: "pn.basalt.collection"
	readonly path: Path
}

export namespace Collection
{
	export const Type = "pn.basalt.collection" as Type<Collection<string>>
}

type CollectionReferencePath<PathSegments extends [string, ...string[]]>
	= PathCollection<Join<{ [Key in keyof PathSegments]: EscapePath<PathSegments[Key]> }, "/">>

/**
 * Gets a `Collection` instance that refers to the collection at the specified absolute path.
 * 
 * @version 1.0.0
 */
export function collection<PathSegments extends [string, ...string[]]>(...pathSegments: PathSegments): Collection<CollectionReferencePath<PathSegments>>

/**
 * Gets a `Collection` instance that refers to the collection at the specified path relative to the `Doc` position.
 * 
 * @version 1.0.0
 */
export function collection<PathSegments extends [string, ...string[]], ParentPath extends string>(document: Doc<ParentPath>, ...pathSegments: PathSegments): Collection<CollectionReferencePath<[ParentPath, ...PathSegments]>>

export function collection(first: string | Doc<string>, ...pathSegments: string[]): Collection<string>
{
	const path = collectionPath(pathJoin(typecheck(first, Doc) ? first.path : first, ...pathSegments))
	
	return {
		[Type.Field]: "pn.basalt.collection",
		path: path,
	}
}