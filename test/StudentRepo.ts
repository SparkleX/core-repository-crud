import {CrudRepository, CrudRepositoryAdapter} from "../src/index"
import { Student } from './Student';
import { RepositoryHandler } from "core-repository";

export class StudentRepo extends CrudRepository<Student, Number> {
	public constructor(handler : RepositoryHandler, adapter:CrudRepositoryAdapter) {
		super(handler, adapter, Student);
	}
}