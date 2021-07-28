interface ServerStorage extends Instance {
	["rbxts-object-to-tree"]: Folder & {
		Main: Script & {
			feedback: ModuleScript;
			config: ModuleScript;
			radio: ModuleScript;
			include: Folder & {
				RuntimeLib: ModuleScript;
				Promise: ModuleScript;
				node_modules: Folder & {
					["lerp-functions"]: ModuleScript;
					["cubic-bezier"]: ModuleScript;
					types: Folder & {
						include: Folder & {
							generated: Folder;
						};
					};
					cue: ModuleScript;
					tween: ModuleScript;
					["delay-spawn-wait"]: ModuleScript;
					["compiler-types"]: Folder & {
						types: Folder;
					};
					["easing-functions"]: ModuleScript;
				};
			};
			generateTree: ModuleScript;
			formatValue: ModuleScript;
			apiDump: ModuleScript;
		};
	};
}
