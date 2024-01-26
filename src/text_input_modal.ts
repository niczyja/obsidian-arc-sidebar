
import { App, Modal, Setting } from 'obsidian';

export class TextInputModal extends Modal {
  name: string;
  value: string;
  save: (value: string) => void

  constructor(app: App, name: string, value: string, save: (value: string) => void) {
    super(app);
    this.name = name;
    this.value = value;
    this.save = save;
  }

  display(): void {
    this.titleEl.setText(this.name);
    new Setting(this.contentEl)
      .addText(ct => ct
        .setValue(this.value)
        .onChange(value =>
          this.value = value
        )
        .inputEl.setAttribute('size', '60')
      )
      .addButton(cb => cb
        .setButtonText('Save')
        .onClick(async () => {
          this.save(this.value);
          this.close();
        }));
  }

  onOpen() {
    this.display();
  }

  onClose() {
    this.contentEl.empty();
  }
}