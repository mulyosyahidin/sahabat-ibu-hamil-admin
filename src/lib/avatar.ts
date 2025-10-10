/**
 * Generate URL DiceBear Avatar berdasarkan email dengan style pixel-art.
 * @param email  email user
 * @param name   nama user (untuk seed fallback)
 * @param size   pixel size (default 44px)
 */
export function generateDiceBearUrl(
    email: string,
    name?: string,
    size = 44
): string {
    const seed = name || email;
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&size=${size}&scale=80`;
}