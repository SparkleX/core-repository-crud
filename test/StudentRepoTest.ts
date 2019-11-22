import {describe,it} from "mocha"
import {expect} from 'chai'
import {StudentRepo} from './StudentRepo'
import {CrudRepository, AnsiAdapter, CrudRepositoryAdapter} from "../src/index"
import { RepositoryHandler } from "core-repository";
import * as mockito from "ts-mockito"
import { Student } from "./Student";


class RepoHandlerImpl implements RepositoryHandler {
    execute(sql: string, ...params: any): Promise<any> {
        throw "Should be mocked";
    }
}

function getRepo(handler:RepoHandlerImpl):StudentRepo {
	var adapter:CrudRepositoryAdapter = new AnsiAdapter();
	var repoStudent:StudentRepo = new StudentRepo();
	repoStudent.postConstruct(handler, adapter, Student);
	return repoStudent;
}

describe(__filename, () => {
    it("findAll", async () => {
        let mockedHandler:RepoHandlerImpl = mockito.mock(RepoHandlerImpl);
		var handler = mockito.instance(mockedHandler);

        var rt:Student[] = [];
        mockito.when(mockedHandler.execute('select * from "Student"')).thenResolve(rt);
		

		var repoStudent:StudentRepo = getRepo(handler);
		var result = await repoStudent.findAll();
		 //verify mock
		mockito.verify(mockedHandler.execute('select * from "Student"')).called();		
		 
		expect(result).to.equal(rt);

	});
    it("findById w/o return", async () => {
        let mockedHandler:RepoHandlerImpl = mockito.mock(RepoHandlerImpl);
		var handler = mockito.instance(mockedHandler);

        var rt:Student[] = [];
		mockito.when(mockedHandler.execute('select * from "Student" where "id"=?', mockito.deepEqual([1]))).thenResolve(rt);
		
		var repoStudent:StudentRepo = getRepo(handler);
		var result = await repoStudent.findById(1);
		 //verify mock
		mockito.verify(mockedHandler.execute('select * from "Student" where "id"=?', mockito.deepEqual([1]))).called();		
		expect(result).to.equal(null);

	});	
    it("findById with return", async () => {
        let mockedHandler:RepoHandlerImpl = mockito.mock(RepoHandlerImpl);
		var handler = mockito.instance(mockedHandler);

		var student = new Student();
        var rt:Student[] = [student];
		mockito.when(mockedHandler.execute('select * from "Student" where "id"=?', mockito.deepEqual([1]))).thenResolve(rt);
		
		var repoStudent:StudentRepo = getRepo(handler);
		var result = await repoStudent.findById(1);
		 //verify mock
		mockito.verify(mockedHandler.execute('select * from "Student" where "id"=?', mockito.deepEqual([1]))).called();		
		expect(result).to.equal(student);

	});	
    it("deleteById", async () => {
        let mockedHandler:RepoHandlerImpl = mockito.mock(RepoHandlerImpl);
		var handler = mockito.instance(mockedHandler);

		var student = new Student();
        var rt:Student[] = [student];
		mockito.when(mockedHandler.execute('delete from "Student" where "id"=?', mockito.deepEqual([1]))).thenResolve(rt);
		
		var repoStudent:StudentRepo = getRepo(handler);
		await repoStudent.deleteById(1);

		mockito.verify(mockedHandler.execute('delete from "Student" where "id"=?', mockito.deepEqual([1]))).called();		
	});
	
    it("insert", async () => {
        let mockedHandler:RepoHandlerImpl = mockito.mock(RepoHandlerImpl);
		var handler = mockito.instance(mockedHandler);

		var student = new Student();
		student.id = 1;
		student.firstName = "Hu";
		student.lastName = "Wang";
		mockito.when(mockedHandler.execute('insert into "Student"("id","firstName","lastName") values(?,?,?)', mockito.deepEqual([1,"Hu","Wang"]))).thenResolve(null);
		
		var repoStudent:StudentRepo = getRepo(handler);
		await repoStudent.insert(student);

		mockito.verify(mockedHandler.execute('insert into "Student"("id","firstName","lastName") values(?,?,?)', mockito.deepEqual([1,"Hu","Wang"]))).called();		
	});	
    it("update", async () => {
        let mockedHandler:RepoHandlerImpl = mockito.mock(RepoHandlerImpl);
		var handler = mockito.instance(mockedHandler);

		var student = new Student();
		student.id = 1;
		student.firstName = "Hu";
		student.lastName = "Wang";
		mockito.when(mockedHandler.execute('update "Student" set "id"=?,"firstName"=?,"lastName"=? where "id"=?', mockito.deepEqual([1,"Hu","Wang", 1])));
		
		var repoStudent:StudentRepo = getRepo(handler);
		await repoStudent.updateById(1, student);

		mockito.verify(mockedHandler.execute('update "Student" set "id"=?,"firstName"=?,"lastName"=? where "id"=?', mockito.deepEqual([1,"Hu","Wang",1]))).called();		
    });		
});