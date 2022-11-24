import { CollectionGroup } from "./CollectionGroup"
import { Collection } from "./Collection"
import { Database } from "./Database"
import { QueryConstraint, prepareConstraint } from "./QueryConstraint"
import { Type, typecheck } from "@projectbasalt/core"

interface BaseQuery
{
	readonly [Type.Field]: "pn.basalt.query"
	readonly constraints: QueryConstraint[]
}

/** @version 1.0.0 */
export type Query<Path extends string> = Query.Standard<Path> | Query.Group<Path>

export namespace Query
{
	/** @version 1.0.0 */
	export interface Standard<Path extends string> extends BaseQuery
	{
		readonly collection: Collection<Path>
	}

	/** @version 1.0.0 */
	export interface Group<Id extends string> extends BaseQuery
	{
		readonly collection: CollectionGroup<Id>
	}

	export const Type = "pn.basalt.query" as Type<Group<string>>
}

/**
 * Creates a new immutable instance of `Query` that is extended to also include additional query constraints.
 * 
 * @version 1.0.0
 */
export function query<Path extends string>(reference: Query.Standard<Path> | Collection<Path>, ...queryConstraints: QueryConstraint[]): Query.Standard<Path>

/**
 * Creates a new immutable instance of `Query` that is extended to also include additional query constraints.
 * 
 * @version 1.0.0
 */
export function query<Id extends string>(reference: Query.Group<Id> | CollectionGroup<Id>, ...queryConstraints: QueryConstraint[]): Query.Group<Id>

export function query(reference: Query<string> | CollectionGroup<string> | Collection<string>, ...queryConstraints: QueryConstraint[])
{
	return {
		[Type.Field]: "pn.basalt.query",
		collection: typecheck(reference, Query) ? reference.collection : reference,
		constraints: typecheck(reference, Query) ? [...reference.constraints, ...queryConstraints] : queryConstraints,
	}
}

/**
 * Prepare the query for the current database.
 * 
 * @version 1.0.0
 */
export const prepareQuery = <DB extends Database<Database.Tree>>(db: DB, query: Query<string>) =>
	db.query(
		typecheck(query.collection, Collection) ? db.collection(query.collection.path) : db.collectionGroup(query.collection.id),
		...query.constraints.map(constraint => prepareConstraint(db, constraint))
	)
