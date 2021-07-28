interface ServerScriptService extends Instance {
	TS: Folder & {
		dataTypes: ModuleScript;
		handler: Script;
		datastore: ModuleScript;
		dataModules: ModuleScript;
	};
}
