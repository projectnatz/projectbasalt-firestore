import { Type } from "@projectbasalt/core"

/** @version 1.0.0 */
export interface CollectionGroup<Id extends string>
{
	readonly [Type.Field]: "pn.basalt.collection_group"
	readonly id: Id
}

export namespace CollectionGroup
{
	export const Type = "pn.basalt.collection_group" as Type<CollectionGroup<string>>
}

/**
 * Create a `CollectionGroup` reference.
 * 
 * @version 1.0.0
 */
export function collectionGroup<ID extends string>(collectionId: ID): CollectionGroup<ID>
{
	return {
		[Type.Field]: "pn.basalt.collection_group",
		id: collectionId,
	}
}