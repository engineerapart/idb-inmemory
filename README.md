# idb-inmemory
An in-memory database that mimics the idb api (jakearchibald/idb)

## Note
I started this as an approach for a project but decided to go another way. Committing this for posterity and indeed I do actually hope to come back and finish it. It would be ideal to support browsers that don't implement indexedDB, and browsers that block IDB in private browsing (e.g. Firefox as of May 2020).

In the meantime, take a look at https://github.com/dumbmatter/fakeIndexedDB which is an in-memory version of indexedDB (duplicating that API, not the `idb` package's API) and may serve your needs.
