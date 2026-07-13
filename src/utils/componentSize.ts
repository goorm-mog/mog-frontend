export type ComponentSize = 'sm' | 'md' | 'lg' | number;

export function resolveComponentSize(
  size: ComponentSize,
  sizeMap: Record<Exclude<ComponentSize, number>, number>,
) {
  return typeof size === 'number' ? size : sizeMap[size];
}
