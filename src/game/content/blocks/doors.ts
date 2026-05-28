import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const DOORS_BLOCKS: BlockDef[] = [
    {
        id: 'door_closed',
        name: 'Door Closed',
        type: BlockType.DOOR_CLOSED,
        color: { r: 160, g: 82, b: 45 },
    },{
        id: 'door_open',
        name: 'Door Open',
        type: BlockType.DOOR_OPEN,
        isSolid: false,
        color: { r: 160, g: 82, b: 45 },
    },{
        id: 'abyssal_gateway',
        name: 'Abyssal Gateway',
        type: BlockType.ABYSSAL_GATEWAY,
        isIndestructible: true,
        color: { r: 100, g: 0, b: 150 },
    },{
        id: 'raeth_gateway',
        name: 'Raeth Gateway',
        type: BlockType.RAETH_GATEWAY,
        isIndestructible: true,
        color: { r: 60, g: 20, b: 100 },
    },{
        id: 'door_locked',
        name: 'Door Locked',
        type: BlockType.DOOR_LOCKED,
        color: { r: 139, g: 100, b: 20 },
    },{
        id: 'door_boss',
        name: 'Door Boss',
        type: BlockType.DOOR_BOSS,
        isIndestructible: true,
        color: { r: 120, g: 0, b: 0 },
    },{
        id: 'arcane_gate',
        name: 'Arcane Gate',
        type: BlockType.ARCANE_GATE,
        isSolid: false,
        isIndestructible: true,
        color: { r: 138, g: 43, b: 226 },
    },{ id: 'thera_gateway', name: 'Thera Gateway', type: BlockType.THERA_GATEWAY, color: { r: 60, g: 180, b: 60 }, isSolid: true, isIndestructible: true },{ id: 'ather_gateway', name: 'Ather Gateway', type: BlockType.ATHER_GATEWAY, color: { r: 200, g: 50, b: 50 }, isSolid: true, isIndestructible: true },{ id: 'stone_door_closed', name: 'Stone Door Closed', type: BlockType.STONE_DOOR_CLOSED, color: { r: 105, g: 105, b: 105 }, isSolid: true },{ id: 'stone_door_open', name: 'Stone Door Open', type: BlockType.STONE_DOOR_OPEN, color: { r: 105, g: 105, b: 105 }, isSolid: false },
];