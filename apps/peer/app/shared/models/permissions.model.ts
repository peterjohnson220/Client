
export interface PeerPermissions {
    ExchangeAccess: number[];
}

export function generateMockPeerPermissions(): PeerPermissions {
    return {
        ExchangeAccess: [4, 5, 6]
    };
}
