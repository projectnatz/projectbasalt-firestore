# ProjectBasalt: Firestore
A shared Firestore interface for both client and server built with typesafety in mind.

## One interface - All roles and platforms
> Write your logic only once and share it with all platforms and roles.

This Firestore interface allows you to write consistent code in your codebase.  
You can even extract your logic into a shared library which can be imported by all roles and platforms alike.

## Type safety comes first
>Write your types once and automatically detect documents types from usage.

Your database tree will be mapped with all your types in one single place and the structure will be use to automatically infer the correct type based on the reference path.  
Customize the types and subcollections for specific document IDs for even more precision.

## Installation

Run `npm i @projectbasalt/firestore` to add this package to your dependencies.

## Setup

### Creating the Database Tree

Write your Database structure types by using the `Model` type utility.
Every key of your tree will corrispond to each collection inside the root / document.

```ts
type MyDatabaseTree =
{
  // Use Model<YourType> to define the type of each document in that collection...
  fruits: Model<{ name: string }>

  // ... or just assign the type directly to the key if you don't need any kind of customization.
  vegetables: { name: string }
  
  // Define the document' subcollections. You can nest how many subcollections you need.
  users: Model<
    { username: string, email: string },
    {
	    posts: Model<
	      { text: string, timestamp: Date },
	      {
	        comments: { author: Doc<`users/${string}`>, text: string, timestamp: Date }
	      }
	    >
	    images: { url: string, descriptions: string }
	  }
  >
  
  // Use custom type for specfic ids.
  animals: Model<
    { name: string, legs: number },
    {}
    {
      dog: { name: string, color: string } // The document `animals/dog` will always be of this type.
    }
  >
}
```

### Create your database

Create the database using the `database` function OR by using one of the available presets.
The created database will be used by every read/write function to determine the correct firestore operations for that package.

#### Presets:
- `import { database } from "@projectbasalt/firestore/firebase-v8-preset"`
- `import { database } from "@projectbasalt/firestore/firebase-v9-preset"`

#### Additional notes
If you do not use a preset, you will also need to setup (once) the autoid function using `autoid.setup`.
This is already included in the presets.

```ts
import { database } from "@projectbasalt/firestore/firebase-v8-preset"
import firebase from "firebase-admin"

export const db = database<MyDatabaseTree>(firebase)
```
