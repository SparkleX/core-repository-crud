import { CrudRepositoryAdapter } from './CrudRepositoryAdapter';

export class AnsiAdapter implements CrudRepositoryAdapter {
	getColumns(TName: string, data:object): string[] {
		var rt = [];
		for(var key in data) {
			rt.push(key as string);
		}
		return rt ;
	}
	getIdColumns(): string[] {
		return ["id"];
	}
	getQuote() {
		return '"';
	}
	getTableName(typeName:string): string {
		return typeName;
	}
	getValues(data:object, columns:string[]): any[]{
		var rt = [];
		for(let col of columns) {
			rt.push(data[col]);
		}
		return rt;
	}
}
 