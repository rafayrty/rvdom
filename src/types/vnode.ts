export type VNodeType = string;
export type VNodeProps = Record<string, any>;
export type VNodeChildren = VNode | string | (VNode | string)[] | null;

export interface VNode {
  type: VNodeType;
  props: VNodeProps;
  children: VNodeChildren;
  dom?: HTMLElement | Text;
}

export type TextVNode = {
  type: 'text';
  props: {};
  children: string;
  dom?: Text;
};

export type PatchType = 'APPEND' | 'REMOVE' | 'UPDATE_PROPS' | 'REPLACE' | 'TEXT';

export interface Patch {
  type: PatchType;
  node?: VNode | TextVNode;
  props?: VNodeProps;
  dom?: HTMLElement | Text;
  text?: string;
}

export type EventHandler = (event: Event) => void;
export type EventHandlers = Record<string, EventHandler>; 