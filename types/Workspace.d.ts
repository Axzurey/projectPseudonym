interface Workspace extends Model {
	animations: Folder & {
		["compact smg"]: Folder & {
			fire: Animation;
			idle: Animation;
			reload: Animation;
		};
	};
	floriumBattery: Model & {
		florium: MeshPart;
		barrel: MeshPart;
	};
	Baseplate: Part & {
		Texture: Texture;
	};
	species: Folder & {
		Druid: ModuleScript;
	};
	build: Folder;
	Raiden: Model & {
		damping: MeshPart;
		grip: MeshPart;
		handle: Part & {
			blade: Motor6D;
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
	userData: Folder;
	cosy: ModuleScript & {
		Parser: ModuleScript;
		["Config.cosy"]: ModuleScript;
		Packages: Folder & {
			promise: ModuleScript;
			Neutron: Folder & {
				window: ModuleScript;
				frame: ModuleScript;
				index: ModuleScript;
				label: ModuleScript;
			};
			index: ModuleScript;
			sys: ModuleScript;
			mathf: ModuleScript;
			dictionary: ModuleScript;
			utils: ModuleScript;
			electron: ModuleScript & {
				window: ModuleScript;
			};
			array: ModuleScript;
			videoPlayer: ModuleScript;
			kaiyo: ModuleScript & {
				schema: ModuleScript;
				model: ModuleScript;
			};
			stringf: ModuleScript;
			request: ModuleScript;
			recorder: ModuleScript;
			console: ModuleScript;
			signal: ModuleScript;
		};
	};
	barLights: Model & {
		lightDamping: MeshPart;
		casing: MeshPart;
		light: MeshPart;
	};
	SpawnLocation: SpawnLocation & {
		Decal: Decal;
	};
	effects: Model & {
		["Meshes/StraightRowBall"]: MeshPart;
		["Meshes/DisolveLow"]: MeshPart;
		["Meshes/taurusbug3"]: MeshPart;
		["Meshes/lancebug"]: MeshPart;
		["Meshes/MarbleyBall"]: MeshPart;
		["Meshes/taurusbug2"]: MeshPart;
		["Meshes/SmoothBall"]: MeshPart;
		["Meshes/MoreDottedBall"]: MeshPart;
		["Meshes/DottedBall"]: MeshPart;
		wireframecube: MeshPart;
		["Meshes/taurusbug1"]: MeshPart;
		["Meshes/MagicyBall"]: MeshPart;
	};
	items: Folder & {
		["Compact Smg"]: ModuleScript;
	};
	Camera: Camera;
	cypher: Model & {
		["Left Leg"]: Part;
		Humanoid: Humanoid;
		["Right Leg"]: Part;
		Head: Part & {
			Face: Decal;
			Mesh: SpecialMesh;
			HeadWeld: Weld;
		};
		Torso: Part & {
			["Left Shoulder"]: Motor6D;
			["Right Shoulder"]: Motor6D;
			Neck: Motor6D;
			["Right Hip"]: Motor6D;
			["Left Hip"]: Motor6D;
		};
		HumanoidRootPart: Part & {
			["Root Hip"]: Motor6D;
		};
		["Right Arm"]: Part;
		["Left Arm"]: Part;
		pants: Pants;
		LooseSideBuns: Accessory & {
			Handle: Part & {
				HairAttachment: Attachment;
				OriginalSize: Vector3Value;
				SpecialMesh: SpecialMesh;
				AvatarPartScaleType: StringValue;
			};
		};
		shirt: Shirt;
	};
	spells: Folder & {
		["Geo Formation"]: ModuleScript;
	};
	game: Folder & {
		utils: ModuleScript;
		itemData: ModuleScript;
		client: ModuleScript;
		numberHelper: ModuleScript;
		guiHelper: ModuleScript & {
			weaponSlot: ModuleScript;
		};
	};
	models: Folder & {
		phyna: Model & {
			Humanoid: Humanoid;
			LeftFoot: MeshPart & {
				LeftAnkleRigAttachment: Attachment;
				OriginalSize: Vector3Value;
				LeftFoot: WrapTarget;
				LeftAnkle: Motor6D;
			};
			RightHand: MeshPart & {
				RightWristRigAttachment: Attachment;
				RightHand: WrapTarget;
				RightGripAttachment: Attachment;
				RightWrist: Motor6D;
			};
			HumanoidRootPart: Part & {
				RootRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
			};
			shirt: Shirt;
			pants: Pants;
			RightLowerLeg: MeshPart & {
				RightKneeRigAttachment: Attachment;
				RightAnkleRigAttachment: Attachment;
				RightKnee: Motor6D;
				RightLowerLeg: WrapTarget;
			};
			LeftUpperLeg: MeshPart & {
				LeftHipRigAttachment: Attachment;
				LeftHip: Motor6D;
				OriginalSize: Vector3Value;
				LeftUpperLeg: WrapTarget;
				LeftKneeRigAttachment: Attachment;
			};
			LeftLowerLeg: MeshPart & {
				LeftKnee: Motor6D;
				OriginalSize: Vector3Value;
				LeftLowerLeg: WrapTarget;
				LeftAnkleRigAttachment: Attachment;
				LeftKneeRigAttachment: Attachment;
			};
			LowerTorso: MeshPart & {
				WaistCenterAttachment: Attachment;
				LeftHipRigAttachment: Attachment;
				Root: Motor6D;
				RootRigAttachment: Attachment;
				RightHipRigAttachment: Attachment;
				LowerTorso: WrapTarget;
				WaistRigAttachment: Attachment;
				WaistBackAttachment: Attachment;
				WaistFrontAttachment: Attachment;
			};
			Head: Part & {
				HatAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				OriginalSize: Vector3Value;
				NeckRigAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				FaceFrontAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				HairAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
				Neck: Motor6D;
				Mesh: SpecialMesh;
				FaceCenterAttachment: Attachment & {
					OriginalPosition: Vector3Value;
				};
			};
			UpperTorso: MeshPart & {
				RightCollarAttachment: Attachment;
				BodyBackAttachment: Attachment;
				NeckRigAttachment: Attachment;
				LeftCollarAttachment: Attachment;
				Waist: Motor6D;
				UpperTorso: WrapTarget;
				LeftShoulderRigAttachment: Attachment;
				BodyFrontAttachment: Attachment;
				WaistRigAttachment: Attachment;
				RightShoulderRigAttachment: Attachment;
				NeckAttachment: Attachment;
			};
			LeftUpperArm: MeshPart & {
				LeftShoulderRigAttachment: Attachment;
				LeftShoulder: Motor6D;
				LeftShoulderAttachment: Attachment;
				LeftElbowRigAttachment: Attachment;
				LeftUpperArm: WrapTarget;
			};
			RightLowerArm: MeshPart & {
				RightWristRigAttachment: Attachment;
				RightLowerArm: WrapTarget;
				RightElbow: Motor6D;
				RightElbowRigAttachment: Attachment;
			};
			LeftHand: MeshPart & {
				LeftWrist: Motor6D;
				LeftGripAttachment: Attachment;
				LeftHand: WrapTarget;
				LeftWristRigAttachment: Attachment;
			};
			LooseSideBuns: Accessory & {
				Handle: Part & {
					OriginalSize: Vector3Value;
					HairAttachment: Attachment;
					AccessoryWeld: Weld;
					SpecialMesh: SpecialMesh;
					AvatarPartScaleType: StringValue;
				};
			};
			RightUpperArm: MeshPart & {
				RightUpperArm: WrapTarget;
				RightElbowRigAttachment: Attachment;
				RightShoulderRigAttachment: Attachment;
				RightShoulderAttachment: Attachment;
				RightShoulder: Motor6D;
			};
			LeftLowerArm: MeshPart & {
				LeftElbowRigAttachment: Attachment;
				LeftLowerArm: WrapTarget;
				LeftElbow: Motor6D;
				LeftWristRigAttachment: Attachment;
			};
			RightUpperLeg: MeshPart & {
				RightKneeRigAttachment: Attachment;
				RightHip: Motor6D;
				RightUpperLeg: WrapTarget;
				RightHipRigAttachment: Attachment;
			};
			RightFoot: MeshPart & {
				RightAnkleRigAttachment: Attachment;
				RightFoot: WrapTarget;
				RightAnkle: Motor6D;
			};
		};
		Raiden: Model & {
			damping: MeshPart;
			grip: MeshPart;
			handle: Part & {
				blade: Motor6D;
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
		pillar: Model & {
			landing: Part;
			["demon Pillar"]: MeshPart;
			effect: MeshPart;
		};
		["compact smg"]: Model & {
			Muzzle: UnionOperation & {
				Flash3: PointLight;
				Fire: Sound & {
					CompressorSoundEffect: CompressorSoundEffect;
				};
				Flash2: ParticleEmitter;
				Flash1: ParticleEmitter;
			};
			Barrel: MeshPart;
			Main: MeshPart & {
				Muzzle: Motor6D;
				Irons: Motor6D;
				Rail: Motor6D;
				Trigger: Motor6D;
				Barrel: Motor6D;
				Decor: Motor6D;
				Mag: Motor6D;
			};
			Rail: MeshPart;
			Mag: MeshPart;
			Trigger: MeshPart;
			Decor: MeshPart;
			Irons: MeshPart;
		};
	};
	remotes: Folder & {
		sprint: RemoteEvent;
		equipWeapon: RemoteFunction;
		useSpell: RemoteFunction;
		buildObject: RemoteEvent;
		updateLoadoutData: RemoteEvent;
	};
}
