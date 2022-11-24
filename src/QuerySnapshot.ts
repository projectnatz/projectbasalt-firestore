import { Database } from "./Database"
import { EscapePath } from "./Path"
import { Snapshot, snapshot } from "./Snapshot"

export type QuerySnapshot<Path extends string, Tree extends Database.Tree> = Snapshot<`${EscapePath<Path>}/${string}`, Tree>[]

export const querySnapshot = (db: Database, documentSnapshots: any) => documentSnapshots.docs.map((documentSnapshot: any) => snapshot(db, documentSnapshot))