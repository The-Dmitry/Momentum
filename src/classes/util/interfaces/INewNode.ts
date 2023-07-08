export default interface INewNode {
  tag: string;
  cssClasses: string[] | null;
  textContent: string | null;
  callback: null | ((e: MouseEvent) => void) | void;
}
