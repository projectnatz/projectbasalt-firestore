import { Type } from "@projectbasalt/core"
import { Database } from "./Database"
import { FieldPath, prepareFieldPath } from "./FieldPath"
import { prepareFieldValue } from "./FieldValue"
import { Snapshot } from "./Snapshot"

/** @version 1.0.0 */
export type QueryConstraint
	= QueryConstraint.EndAt
	| QueryConstraint.EndBefore
	| QueryConstraint.Limit
	| QueryConstraint.OrderBy
	| QueryConstraint.StartAfter
	| QueryConstraint.StartAt
	| QueryConstraint.Where

export namespace QueryConstraint
{
	export interface EndAt
	{
		[Type.Field]: "pn.basalt.query_constraint.end_at"
		snapshot: Snapshot<any, any>
	}

	export interface EndBefore
	{
		[Type.Field]: "pn.basalt.query_constraint.end_before"
		snapshot: Snapshot<any, any>
	}

	export interface Limit
	{
		[Type.Field]: "pn.basalt.query_constraint.limit"
		limit: number
	}

	export interface OrderBy
	{
		[Type.Field]: "pn.basalt.query_constraint.order_by"
		fieldPath: string | FieldPath
		direction: "asc" | "desc"
	}

	export interface StartAfter
	{
		[Type.Field]: "pn.basalt.query_constraint.start_after"
		snapshot: Snapshot<any, any>
	}

	export interface StartAt
	{
		[Type.Field]: "pn.basalt.query_constraint.start_at"
		snapshot: Snapshot<any, any>
	}

	export interface Where
	{
		[Type.Field]: "pn.basalt.query_constraint.where"
		fieldPath: string | FieldPath
		op: WhereOp
		value: unknown
	}
}

type WhereOp = "<" | "<=" | "==" | "!=" | ">=" | ">" | "array-contains" | "in" | "array-contains-any" | "not-in"

/**
 * Creates a `QueryConstraint` that modifies the result set to end at the provided document (inclusive).
 * The end position is relative to the order of the query.
 * The document must contain all of the fields provided in the `orderBy` of the query.
 * 
 * @version 1.0.0
 */
export const endAt = (snapshot: Snapshot<any, any>): QueryConstraint.EndAt =>
	Type.value("pn.basalt.query_constraint.end_at", { snapshot })

/**
 * Creates a `QueryConstraint` that modifies the result set to end before the provided document (exclusive).
 * The end position is relative to the order of the query.
 * The document must contain all of the fields provided in the `orderBy` of the query.
 * 
 * @version 1.0.0
 */
export const endBefore = (snapshot: Snapshot<any, any>): QueryConstraint.EndBefore =>
	Type.value("pn.basalt.query_constraint.end_before", { snapshot })

/**
 * Creates a `QueryConstraint` that only returns the first matching documents.
 * 
 * @version 1.0.0
 */
export const limit = (limit: number): QueryConstraint.Limit =>
	Type.value("pn.basalt.query_constraint.limit", { limit })

/**
 * Creates a `QueryConstraint` that sorts the query result by the specified field, optionally in descending order instead of ascending.
 * 
 * @version 1.0.0
 */
export const orderBy = (fieldPath: string | FieldPath, direction: "asc"|"desc"): QueryConstraint.OrderBy =>
	Type.value("pn.basalt.query_constraint.order_by", { fieldPath, direction })

/**
 * Prepare the `QueryConstraint` using the passed database.
 * 
 * @version 1.0.0
 */
export const prepareConstraint = <DB extends Database>(db: DB, constraint: QueryConstraint) =>
{
	switch (constraint[Type.Field]) {
		case "pn.basalt.query_constraint.end_at": return db.endAt(db.manage.snapshot(constraint.snapshot))
		case "pn.basalt.query_constraint.end_before": return db.endBefore(db.manage.snapshot(constraint.snapshot))
		case "pn.basalt.query_constraint.limit": return db.limit(constraint.limit)
		case "pn.basalt.query_constraint.order_by": return db.orderBy(prepareFieldPath(db, constraint.fieldPath), constraint.direction)
		case "pn.basalt.query_constraint.start_after": return db.startAfter(db.manage.snapshot(constraint.snapshot))
		case "pn.basalt.query_constraint.start_at": return db.startAt(db.manage.snapshot(constraint.snapshot))
		case "pn.basalt.query_constraint.where": return db.where(prepareFieldPath(db, constraint.fieldPath), constraint.op, prepareFieldValue(db, constraint.value))
	}

	throw new Error("Unknown Query Constraint")
}

/**
 * Creates a `QueryConstraint` that modifies the result set to start after the provided document (exclusive).
 * The starting position is relative to the order of the query.
 * The document must contain all of the fields provided in the `orderBy` of the query.
 * 
 * @version 1.0.0
 */
export const startAfter = (snapshot: Snapshot<any, any>): QueryConstraint.StartAfter =>
	Type.value("pn.basalt.query_constraint.start_after", { snapshot })

/**
 * Creates a `QueryConstraint` that modifies the result set to start at the provided document (inclusive).
 * The starting position is relative to the order of the query.
 * The document must contain all of the fields provided in the `orderBy` of this query.
 * 
 * @version 1.0.0
 */
export const startAt = (snapshot: Snapshot<any, any>): QueryConstraint.StartAt =>
	Type.value("pn.basalt.query_constraint.start_at", { snapshot })

/**
 * Creates a `QueryConstraint` that modifies the result set to start at the provided document (inclusive).
 * The starting position is relative to the order of the query.
 * The document must contain all of the fields provided in the `orderBy` of this query.
 * 
 * @version 1.0.0
 */
export const where = (fieldPath: string | FieldPath, op: WhereOp, value: unknown): QueryConstraint.Where =>
	Type.value("pn.basalt.query_constraint.where", { fieldPath, op, value })
