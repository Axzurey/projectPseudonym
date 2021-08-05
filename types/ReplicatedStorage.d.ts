interface ReplicatedStorage extends Instance {
	itemModules: Folder & {
		Raiden: Model & {
			damping: MeshPart;
			grip: MeshPart;
			hitbox: Part;
			handle: Part & {
				blade: Motor6D;
				hitbox: Motor6D;
				back: Motor6D;
				damping: Motor6D;
				guard: Motor6D;
				grip: Motor6D;
			};
			blade: MeshPart & {
				top: Texture;
				bottom: Texture;
			};
			guard: MeshPart;
			back: MeshPart;
		};
	};
	assets: Folder & {
		greenBall: MeshPart;
		wireframecube: MeshPart;
	};
	remotes: Folder & {
		validUserInput: RemoteEvent;
	};
	animations: Folder & {
		Raiden: Folder & {
			idle: Animation;
			run: Animation;
			attack: Animation;
		};
	};
	guiAssets: Folder & {
		node: Frame & {
			UICorner: UICorner;
		};
		branch: Frame;
	};
	TS: Folder & {
		quark: ModuleScript;
		skillTree: ModuleScript;
		shapesf: ModuleScript;
		mathf: ModuleScript;
		abilities: Folder & {
			XOR: ModuleScript;
			Dot: ModuleScript;
		};
		skills: ModuleScript;
		glare: ModuleScript;
		game: Folder & {
			framework: ModuleScript;
		};
		agents: Folder & {
			Asterisk: ModuleScript;
			Phiora: ModuleScript;
			Morgan: ModuleScript;
		};
		fremy: ModuleScript;
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			services: ModuleScript;
			t: Folder & {
				lib: Folder & {
					ts: ModuleScript;
				};
			};
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
