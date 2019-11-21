export interface CrudRepositoryAdapter {
	getValues(data:object, columns:string[]): any[];
	getColumns(TName: string, data:object): string[];
	getIdColumns(): string[];
	getQuote(): any;
	getTableName(typeName:string):string;
	
}
