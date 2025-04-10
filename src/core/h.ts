import { VNode, VNodeProps, VNodeChildren } from '../types/vnode';

export function h(
  type: string,
  props: VNodeProps | null,
  children?: VNodeChildren
): VNode {
  return {
    type,
    props: props || {},
    children: children || null
  };
} 