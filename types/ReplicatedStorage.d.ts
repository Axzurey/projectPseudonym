interface ReplicatedStorage extends Instance {
	guiAssets: Folder & {
		node: Frame & {
			UICorner: UICorner;
		};
		branch: Frame;
	};
	TS: Folder & {
		module: ModuleScript;
		agents: Folder & {
			Asterisk: ModuleScript;
		};
		int: ModuleScript;
		skillTree: ModuleScript;
		game: Folder & {
			framework: ModuleScript;
		};
		modifiers: ModuleScript;
		abilities: Folder & {
			XOR: ModuleScript;
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
