/**
 * Tiny class-name joiner. Filters out falsy values so conditional classes can be
 * written inline: `cn("base", isActive && "active", className)`.
 */
export const cn = (
  ...parts: Array<string | number | false | null | undefined>
) => parts.filter(Boolean).join(" ");
