import { Database } from "./Database"

/** @version 1.0.0 */
export interface Model<Value, Collections extends Database.Tree = {}, Ids extends Record<string, unknown> = {}>
{
	readonly __model_collections: Collections
	readonly __model_ids: Ids
	readonly __model_value: Value
}