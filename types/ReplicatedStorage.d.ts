interface ReplicatedStorage extends Instance {
	TS: Folder & {
		module: ModuleScript;
		agents: Folder & {
			Asterisk: ModuleScript;
		};
		int: ModuleScript;
		game: Folder & {
			framework: ModuleScript;
		};
		modifiers: ModuleScript;
		skills: Folder & {
			Dot: ModuleScript;
		};
	};
	assets: Folder & {
		greenBall: MeshPart;
		wireframecube: MeshPart;
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			services: ModuleScript;
			["compiler-types"]: Folder & {
				types: Folder;
			};
			types: Folder & {
				include: Folder & {
					generated: Folder;
				};
			};
		};
	};
}
