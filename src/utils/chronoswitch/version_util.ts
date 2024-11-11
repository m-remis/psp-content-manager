function compareVersions(version1: string, version2: string): number {
    const [v1, v2] = [version1, version2].map(v => v.split('.').map(Number));
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const diff = (v1[i] || 0) - (v2[i] || 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

export {compareVersions};