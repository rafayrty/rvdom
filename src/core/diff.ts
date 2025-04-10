import { VNode, Patch, VNodeProps, TextVNode } from '../types/vnode';

function createTextVNode(text: string): TextVNode {
  return {
    type: 'text',
    props: {},
    children: text
  };
}

function diffProps(oldProps: VNodeProps, newProps: VNodeProps): Patch | null {
  const changes: Record<string, any> = {};
  let hasChanges = false;

  // Check for removed or changed props
  Object.keys(oldProps).forEach(key => {
    if (!(key in newProps) || oldProps[key] !== newProps[key]) {
      hasChanges = true;
      changes[key] = newProps[key];
    }
  });

  // Check for added props
  Object.keys(newProps).forEach(key => {
    if (!(key in oldProps)) {
      hasChanges = true;
      changes[key] = newProps[key];
    }
  });

  return hasChanges ? { type: 'UPDATE_PROPS', props: changes } : null;
}

function diffChildren(
  oldChildren: VNode | string | (VNode | string)[] | null,
  newChildren: VNode | string | (VNode | string)[] | null,
  dom: HTMLElement | Text
): Patch[] {
  const patches: Patch[] = [];

  if (oldChildren === null && newChildren === null) {
    return patches;
  }

  if (oldChildren === null || newChildren === null) {
    return [{ 
      type: 'REPLACE', 
      node: typeof newChildren === 'string' 
        ? createTextVNode(newChildren)
        : newChildren as VNode 
    }];
  }

  if (typeof oldChildren === 'string' || typeof newChildren === 'string') {
    if (oldChildren !== newChildren) {
      return [{ type: 'TEXT', text: String(newChildren) }];
    }
    return patches;
  }

  const oldArray = Array.isArray(oldChildren) ? oldChildren : [oldChildren];
  const newArray = Array.isArray(newChildren) ? newChildren : [newChildren];

  // Simple array diffing (can be improved with keys later)
  const maxLength = Math.max(oldArray.length, newArray.length);
  for (let i = 0; i < maxLength; i++) {
    if (i >= oldArray.length) {
      const newChild = newArray[i];
      patches.push({ 
        type: 'APPEND', 
        node: typeof newChild === 'string' 
          ? createTextVNode(newChild)
          : newChild as VNode 
      });
    } else if (i >= newArray.length) {
      patches.push({ type: 'REMOVE' });
    } else {
      const oldChild = oldArray[i] as VNode;
      const newChild = newArray[i] as VNode;
      if (oldChild.type !== newChild.type) {
        patches.push({ type: 'REPLACE', node: newChild });
      } else {
        const childPatches = diff(oldChild, newChild);
        patches.push(...childPatches);
      }
    }
  }

  return patches;
}

export function diff(oldVNode: VNode | null, newVNode: VNode | null): Patch[] {
  if (oldVNode === null && newVNode === null) {
    return [];
  }

  if (oldVNode === null) {
    return [{ type: 'APPEND', node: newVNode! }];
  }

  if (newVNode === null) {
    return [{ type: 'REMOVE' }];
  }

  if (typeof oldVNode === 'string' || typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      return [{ type: 'TEXT', text: String(newVNode) }];
    }
    return [];
  }

  if (oldVNode.type !== newVNode.type) {
    return [{ type: 'REPLACE', node: newVNode }];
  }

  const patches: Patch[] = [];

  // Diff props
  const propsPatch = diffProps(oldVNode.props, newVNode.props);
  if (propsPatch) {
    patches.push(propsPatch);
  }

  // Diff children
  if (oldVNode.dom) {
    const childPatches = diffChildren(oldVNode.children, newVNode.children, oldVNode.dom);
    patches.push(...childPatches);
  }

  return patches;
} 