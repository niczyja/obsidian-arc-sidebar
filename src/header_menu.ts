
import { Component, getIcon } from 'obsidian';

export class HeaderMenu extends Component {
  containerEl: HTMLElement;

  constructor() {
    super();
    this.containerEl = createDiv({ cls: 'nav-header' });
  }

  onload(): void {
    this.containerEl.createDiv({ cls: 'nav-buttons-container' });
  }

  onunload(): void {
      this.containerEl.empty();
  }

  addItem(cb: (item: HeaderMenuItem) => any) {
    cb(new HeaderMenuItem(<HTMLElement>this.containerEl.children[0]));
  }
}

export class HeaderMenuItem {
  private contentEl: HTMLElement;

  constructor(parent: HTMLElement) {
    this.contentEl = parent.createDiv({ cls: 'clickable-icon nav-action-button' })
  }

  setIcon(icon: string): HeaderMenuItem {
    this.contentEl.empty();
    const svg = getIcon(icon);
    if (svg != null)
      this.contentEl.appendChild(<Node>svg);
    return this;
  }

  setLabel(label: string | null): HeaderMenuItem {
    this.contentEl.setAttr('aria-label', label);
    return this;
  }

  onClick(cb: (el: HeaderMenuItem) => any): HeaderMenuItem {
    const that = this;
    this.contentEl.onClickEvent((_ev) => cb(that));
    return this;
  }
}