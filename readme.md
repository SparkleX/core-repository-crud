# SQL.JS driver for db-conn

Example

```ts
import {Connection} from "db-conn"
import {SqlJsConnection, initSqlJs} from "db-conn-sqljs"

var SQL = await initSqlJs();
var conn:Connection = new SqlJsConnection();
await conn.open(SQL);
conn.execute("create table test (id, name);");
await conn.close();
```
