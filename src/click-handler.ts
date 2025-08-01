import { Editor, MarkdownView, Modal } from 'obsidian';
import { PLUGIN_NAME } from './constants';

export function clickHandler(evt: MouseEvent) {
	const editor: Editor =
		this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;

	if (
		this.app.workspace.getActiveViewOfType(MarkdownView)?.getMode() ===
		'preview'
	) {
		return;
	}

	if (editor && evt.target) {
		const targetElement = evt.target as HTMLElement;

		if (typeof targetElement?.className !== 'string') {
			return;
		}

		const match = targetElement.className.match(/pb(\d+)/);
		if (!match) {
			return;
		}

		const progressValue = parseInt(match[1], 10);
		const dialog = new Modal(this.app);

		dialog.contentEl.classList.add('portogress-dialog');
		dialog.contentEl.classList.add(
			`portogress-${this.settings.theme}-theme`
		);

		dialog.titleEl.setText(PLUGIN_NAME);

		dialog.contentEl.createEl('p', {
			text: 'Adjust the progress value below:',
			attr: { id: 'portogress-dialog-text' },
		});

		const sliderContainer = dialog.contentEl.createDiv({
			cls: 'portogress-dialog__slider-container',
		});

		const slider = sliderContainer.createEl('input', {
			type: 'range',
			value: progressValue.toString(),
			attr: { step: 5, min: 5, max: 100 },
		});

		sliderContainer.createEl('span', {
			text: `${progressValue}%`,
			attr: { id: 'portogress-dialog-label' },
		});

		const div = dialog.contentEl.createDiv({
			cls: 'portogress-dialog-buttons',
		});

		div.createEl('button', {
			text: 'Cancel',
			cls: 'portogress-cancel-button',
		}).addEventListener('click', () => {
			dialog.close();
		});

		div.createEl('button', {
			text: 'Save',
			cls: 'portogress-save-button',
		}).addEventListener('click', () => {
			const selectedLine = editor.getLine(editor.getCursor().line);
			const spanMatch = selectedLine.match(/<span[^>]*>(.*?)<\/span>/);
			if (spanMatch && spanMatch[1]) {
				const updatedText = selectedLine.replace(
					new RegExp(spanMatch[1], 'g'),
					slider.value
				);
				editor.setLine(editor.getCursor().line, updatedText);
				dialog.close();
			}
		});

		slider.addEventListener('input', (event) => {
			sliderInputHandler(event, dialog);
		});

		dialog.open();
		const modals = document.querySelectorAll('.modal');
		modals[0].classList.add('portogress-dialog-modal-container');
	}
}

function sliderInputHandler(event: Event, dialog: Modal) {
	const newValue = (event.target as HTMLInputElement).value;
	const label = dialog.contentEl.querySelector('#portogress-dialog-label');
	if (label) {
		label.textContent = `${newValue}%`;
	}
}
