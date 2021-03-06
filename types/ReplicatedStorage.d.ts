interface ReplicatedStorage extends Instance {
	assets: Folder & {
		_svnsts: Folder & {
			katsu: Model & {
				mid: MeshPart;
				center: MeshPart;
				outer: MeshPart;
			};
			yumi: Model & {
				mid: MeshPart;
				center: MeshPart;
				outer: MeshPart;
			};
			saya: Model & {
				mid: MeshPart;
				center: MeshPart;
				outer: MeshPart;
			};
			akemi: Model & {
				mid: MeshPart;
				center: MeshPart;
				outer: MeshPart;
			};
			mushi: Model & {
				mid: MeshPart;
				center: MeshPart;
				outer: MeshPart;
			};
		};
		wireframecube: MeshPart;
		greenBall: MeshPart;
	};
	remotes: Folder & {
		post: RemoteEvent;
		validUserInput: RemoteEvent;
		get: RemoteEvent;
		chat: RemoteEvent;
	};
	itemModels: Folder & {
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
		fremy: ModuleScript;
		glare: ModuleScript;
		services: ModuleScript;
		itemModules: Folder & {
			Raiden: ModuleScript;
		};
		abilities: Folder & {
			XOR: ModuleScript;
			Dot: ModuleScript;
		};
		enums: ModuleScript;
		shapesf: ModuleScript;
		game: Folder & {
			framework: ModuleScript;
			rawItemData: ModuleScript;
			items: ModuleScript;
		};
		pkg: Folder & {
			textures: ModuleScript;
		};
		skills: ModuleScript;
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
