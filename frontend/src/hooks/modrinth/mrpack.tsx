const MinecraftVersionFromDependencies = (deps: any): string => {
    if (!deps) return "latest"
    if (Array.isArray(deps)) {
        const mcDep = deps.find((d: any) => d?.id === "minecraft")
        if (mcDep?.version) return mcDep.version
    } else if (typeof deps === "object") {
        // posible formas: { minecraft: "1.18.2" } o { minecraft: { version: "1.18.2" } } o { version: "1.18.2" }
        if (typeof deps.minecraft === "string") return deps.minecraft
        if (deps.minecraft?.version) return deps.minecraft.version
        if (typeof deps.version === "string") return deps.version
    }
    return "latest"
}

export {
    MinecraftVersionFromDependencies
}