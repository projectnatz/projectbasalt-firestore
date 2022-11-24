import { Type } from "@projectbasalt/core"
import { Database } from "./Database"

interface Base
{
	[Type.Field]: "pn.basalt.field_path"
}

/** @version 1.0.0 */
export type FieldPath = FieldPath.DocumentId

export namespace FieldPath
{
	export interface DocumentId extends Base
	{
		type: "document_id"
	}

	export const Type = "pn.basalt.field_path" as Type<FieldPath>
}

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document. It can be used in queries to sort or filter by the document ID.
 * 
 * @version 1.0.0
 */
export const documentId = (): FieldPath.DocumentId =>
	Type.value("pn.basalt.field_path", { type: "document_id" })


/**
 * Prepare the `FieldPath` using the passed database.
 * 
 * @version 1.0.0
 */
export const prepareFieldPath = <DB extends Database>(db: DB, fieldPath: FieldPath | string) =>
{
	if (typeof fieldPath === "string") return fieldPath

	switch (fieldPath.type) {
		case "document_id": return db.documentId()
	}

	throw new Error("Unknown FieldPath")
}