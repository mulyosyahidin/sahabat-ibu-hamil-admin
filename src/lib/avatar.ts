import md5 from "blueimp-md5";

function initialsFromName(name?: string): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase() ?? "").join("") || "U";
}

/**
 * Generate URL Gravatar dengan fallback UI Avatars (berdasarkan inisial).
 * @param email  email user
 * @param name   nama user (untuk inisial fallback)
 * @param size   pixel (gravatar 1x; UI Avatars kubuat 2x agar tajam di retina)
 */
export function generateGravatarUrlWithFallback(
    email: string,
    name?: string,
    size = 44
): string {
    const hash = md5(email.trim().toLowerCase());
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(initialsFromName(name))}&size=${size * 2}&background=random&color=fff`;

    return `https://www.gravatar.com/avatar/${hash}?s=${size}&r=g&d=${encodeURIComponent(fallback)}`;
}
