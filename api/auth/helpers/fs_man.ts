const fs = require('fs');
const _path = require('path');
const _ = require('lodash');
// const getAppDataPath = require("appdata-path");
const appName = "twitch-cp";
interface addDataInterface {
	category: string,
	data: any
}

export interface DataStorage{
	error: any;
	dir: string;
	file: string;
}
export class DataStorage {
	error: any;
	dir: string;
	file: string;
	storeProp: string|undefined;
	// save things in one dat file
	constructor(fname: string | undefined = undefined, storeProp: string|undefined=undefined){
		this.storeProp = storeProp;
		try{
			fs.accessSync(_path.join(__dirname, '/bin/'), fs.constants.W_OK | fs.constants.R_OK);
		}
		catch(err){
			if(err){
				// the path does not exist
				try{
					fs.mkdirSync(_path.join(__dirname, '/bin/'))
				}
				catch(e){
					console.error(e);
				}
			}
		}
		
		
		// the path now exists or already did
		this.dir = _path.join(__dirname, '/bin/');

		// if a file name was provided, we create the file. Otherwise, we don't
		if (fname){
			this.file = _path.join(this.dir, `${fname}.dat`);
		}
		else{
			this.file = _path.join(this.dir, 'gen.dat');
		}
		try{
			fs.accessSync(this.file, fs.constants.W_OK | fs.constants.R_OK);
		}
		catch(err){
			// if the file does not exist, but the path does...
			// Create the file...
			console.log('Couldn\'t find file ' + `${fname?fname:'gen'}.dat`);
			console.error(err);
			try{
				fs.writeFileSync(this.file, '{}');
			}
			catch(err){
				this.error = err;
				console.error(err);
			}
				

		}
		
	}
	addData(opts: addDataInterface){
		if(typeof opts !== 'object'){
			throw new Error("The parameter was not a 'DataSetup' object.")
		}
		
		try{
			
			let contents = fs.readFileSync(this.file);
			
			let old_data = JSON.parse(contents);
			// console.log('Parsed Data...');

			let new_data = _.merge(old_data[opts.category], opts.data);
			

			fs.writeFileSync(this.file, JSON.stringify(new_data));
			console.log('Written Data...');
		}catch(err){
			console.error(err);
			return err;
		}
	}
	set(data: any, path: string|undefined=undefined) {
		try {
			console.log('Writing Data...');
			let new_data;
			if(path){
				let contents = fs.readFileSync(this.file);
				let old_data = JSON.parse(contents);
				old_data[path] = data;
				console.log(old_data);
				new_data = old_data

			}
			else{
				let contents = fs.readFileSync(this.file);
				let old_data = JSON.parse(contents);
				new_data = _.merge(old_data, data);
				console.log(new_data);
			}

			fs.writeFileSync(this.file, JSON.stringify(new_data));
			console.log('Data Writing Complete!');
		} catch (err) {
			console.error(err);
			return err;
		}
	}
	replaceData(opts) {
		try {
			let contents = fs.readFileSync(this.file);

			let old_data = JSON.parse(contents);
			old_data[opts.category] = opts.data;
			
			fs.writeFileSync(this.file, JSON.stringify(old_data));
		} catch (err) {
			console.log(err);
			return err;
		}
	}
	pullData(data_path=undefined): Error|any {
		this.get(data_path);
	}
	get(data_path = undefined): Error | any {
		try {
			let contents = fs.readFileSync(this.file);
			console.log('Pulled Data from "%s"...', this.file);
			return JSON.parse(contents);
		} catch (err) {
			// console.error(err);
			throw err;
			// return err;
		}
	}
	delete(prop: string){
		let data = this.get();
		if(!data) return new Error('Issue getting the data to delete');

		if(typeof data === 'object'){
			delete data.prop;
		}
	}


}
export default DataStorage;
// module.exports = [DataStorage];

// export default StorageModule.DataStorage;
// module.exports = StorageModule.DataStorage;