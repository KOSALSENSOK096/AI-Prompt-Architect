export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
    image?: string;
    imageMimeType?: string;
    isLoading?: boolean;
    groundingMetadata?: {
        groundingChunks?: GroundingChunk[];
    };
}

export interface AlertMessage {
    id: number;
    type: 'error' | 'success' | 'info' | 'warning';
    message: string;
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title?: string;
    };
    retrievedContext?: {
        uri: string;
        title?: string;
    };
}

export interface Candidate {
    groundingMetadata?: {
        groundingChunks?: GroundingChunk[];
    };
} 