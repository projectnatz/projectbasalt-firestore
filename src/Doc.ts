import { Type, typecheck } from "@projectbasalt/core"
import { Collection } from "./Collection"
import { collectionPath, PathCollection, PathId, pathId, PathJoin, pathJoin } from "./Path"

/**
 * A reference to a document in the database.
 * 
 * @version 1.0.0
 */
export interface Doc<Path extends string>
{
	readonly [Type.Field]: "pn.basalt.doc"
	readonly id: PathId<Path>
	readonly path: Path
}

export namespace Doc
{
	export const Type = "pn.basalt.doc" as Type<Omit<Doc<string>, "id"> & { id: string }>
}

type DocumentReferencePath<PathSegments extends [string, ...string[]], Path extends string = PathJoin<PathSegments>>
	= `${PathCollection<Path>}/${PathId<Path, string>}`

/**
 * Gets a `Doc` instance that refers to the document at the specified absolute path.
 * 
 * @version 1.0.0
 */
export function doc<PathSegments extends [string, ...string[]]>(...pathSegments: PathSegments): Doc<DocumentReferencePath<PathSegments>>

/**
 * Gets a `Doc` instance that refers to the document at the specified path relative to the `Collection`.
 * 
 * @version 1.0.0
 */
export function doc<PathSegments extends string[], ParentPath extends string = "">(collection: Collection<ParentPath>, ...pathSegments: PathSegments): Doc<DocumentReferencePath<[ParentPath, ...PathSegments]>>

export function doc(first: string | Collection<string>, ...pathSegments: string[]): any
{
	const fullPath = pathJoin(typecheck(first, Collection) ? first.path : first, ...pathSegments)
	const id = pathId(fullPath)
	const parentPath = collectionPath(fullPath)
	const path = pathJoin(parentPath, id)
	
	return {
		[Type.Field]: "pn.basalt.doc",
		id: id,
		path: path,
	}
}