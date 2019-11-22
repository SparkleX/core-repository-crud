import { CrudRepositoryAdapter } from "./CrudRepositoryAdapter";
import {RepositoryHandler} from "core-repository"

export class CrudRepository<T extends object,ID>{

	protected adapter: CrudRepositoryAdapter;
	protected handler: RepositoryHandler;
	protected q: string;
	protected TName: string;
	table: string;
	public postConstruct(handler : RepositoryHandler, adapter:CrudRepositoryAdapter, x : new () => T) {
		this.adapter = adapter;
		this.handler = handler;
		this.q = this.adapter.getQuote();
		this.TName = x.name;
		this.table = this.adapter.getTableName(this.TName);
	}
	public async findAll():Promise<T[]> {
		
		var sql = `select * from ${this.q}${this.table}${this.q}`;
		console.log(sql);
		var list = this.handler.execute(sql);
		return list;
	}
	public async findById(id:ID):Promise<T> {
		var columns:string[] = this.adapter.getIdColumns();
		var condition = this.sqlKeys(columns);
		var sql = `select * from ${this.q}${this.table}${this.q} where ${condition}`;
		console.log(sql);
		var list = await this.handler.execute(sql, [id]) as any;
		if(list.length==0) {
			return null;
		}
		return list[0];
	}
	public async deleteById(id:ID):Promise<void>{
		var columns:string[] = this.adapter.getIdColumns();
		var condition = this.sqlKeys(columns);
		var sql = `delete from ${this.q}${this.table}${this.q} where ${condition}`;
		console.log(sql);
		await this.handler.execute(sql, [id]);
	}		
	private sqlKeys(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.q}${col}${this.q}=? and`;
		}
		var sql = rt.substr(0, rt.length-4);
		return sql;
	}
	public async insert(data:T):Promise<void>{
		var columns:string[] = this.adapter.getColumns(this.TName, data);
		var values = this.adapter.getValues(data, columns);
		var sqlInsertColumns = this.sqlInsertColumns(columns);
		var sqlInsert = this.sqlInsert(columns);
		var sql = `insert into ${this.q}${this.table}${this.q}(${sqlInsertColumns}) values(${sqlInsert})`;
		console.log(sql);
		await this.handler.execute(sql, values);
	}
	private sqlInsertColumns(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.q}${col}${this.q},`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}	
	private sqlInsert(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `?,`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}
	public async updateById(id:ID, data:T):Promise<void>{
		var columns:string[] = this.adapter.getColumns(this.TName, data);
		var values = this.adapter.getValues(data, columns);
		var sqlUpdate = this.sqlUpdate(columns);
		var idColumns:string[] = this.adapter.getIdColumns();
		var sqlWhere = this.sqlKeys(idColumns);
		var sql = `update ${this.q}${this.table}${this.q} set ${sqlUpdate} where ${sqlWhere}`;
		console.log(sql);
		values.push(id);
		await this.handler.execute(sql, values);
	}
	private sqlUpdate(columns: string[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.q}${col}${this.q}=?,`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}

}