# Repository support CRUD operations

Example

```ts
var repoStudent:StudentRepo = new StudentRepo(handler, adapter);

var result = await repoStudent.findAll();

await repoStudent.insert(student);

await repoStudent.updateById(1, student);

await repoStudent.deleteById(1);
```
