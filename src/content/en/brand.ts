export const brand = {
    app: {
        fullName: "Veloce Digital Garage",
        compactName: "Veloce Garage",
        shortName: "Veloce",
        genericName: "digital garage",
        metadataDescription: "Modern fuel and vehicle tracking application",
    },
    ai: {
        copilotName: "Veloce Copilot",
        vaultName: "AI Vault",
    },
    rewards: {
        name: "Veloce Rewards",
    },
} as const;

export type BrandContent = typeof brand;
