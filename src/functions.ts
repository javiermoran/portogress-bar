import { Editor, MarkdownView, Modal } from 'obsidian';
import PortogressBar from './main';

export function getPercentage(inputValue: string): number {
	const parts = inputValue.split('/');
	if (parts.length === 2) {
		const [current, total] = parts.map((part) => part.trim());
		if (
			!isNaN(Number(current)) &&
			!isNaN(Number(total)) &&
			Number(total) !== 0
		) {
			const percent = Math.min(
				Math.ceil((Number(current) / Number(total)) * 20) * 5,
				100
			);

			return Number(percent.toFixed(0));
		}
	}
	return Number(inputValue) || 5;
}

export function generatePortogressBars(portogressBar: any, editor: Editor) {
	const selection = editor.getSelection();

	if (selection.length > 0) {
		let percentage = getPercentage(selection);

		editor.replaceSelection(
			`<span class="pb${percentage}">${selection}</span>`
		);
	}

	replaceAllKeywords(editor, 'pb', portogressBar);
	updateAllProgressBars(editor, portogressBar);
}

function replaceAllKeywords(
	editor: Editor,
	key: string,
	portogressBar: PortogressBar
) {
	const editorContent = editor.getValue();
	const keywordRegex = new RegExp(`${key}:\\S+`, 'g');
	const matches = editorContent.match(keywordRegex);
	if (matches) {
		let updatedContent = editorContent;
		matches.forEach((match) => {
			const [key, value] = match.split(':');
			const percentage = getPercentage(value);
			const cls = getClassName(percentage, portogressBar);

			updatedContent = updatedContent.replace(
				match,
				`<span class="${cls}">${value}</span>`
			);
		});
		editor.setValue(updatedContent);
	}
}

function updateAllProgressBars(editor: Editor, portogressBar: PortogressBar) {
	let editorContent = editor.getValue();
	const spanRegex = /<span class="pb\d+(?: pb\d+-l)?">.*?<\/span>/g;

	const matches = editorContent.match(spanRegex);

	for (let match of matches || []) {
		const innerTextRegex = /<span class="pb\d+(?: pb\d+-l)?">(.*?)<\/span>/;
		const innerTextMatch = match.match(innerTextRegex);
		if (innerTextMatch && innerTextMatch[1]) {
			const innerText = innerTextMatch[1];
			const percentage = getPercentage(innerText);
			const cls = getClassName(percentage, portogressBar);
			const newSpan = `<span class="${cls}">${innerText}</span>`;
			editorContent = editorContent.replace(match, newSpan);
			editor.setValue(editorContent);
		}
	}
}

function getClassName(
	percentage: number,
	portogressBar: PortogressBar
): string {
	return `pb${percentage}${
		portogressBar.settings.showLabels &&
		percentage > portogressBar.settings.minLabelPercentage
			? ` pb${percentage}-l`
			: ''
	}`;
}

export function setEditorClass(portogressBar: PortogressBar) {
	const viewContentEl = document.querySelector('.view-content');
	if (viewContentEl) {
		// Remove any existing portogress theme class
		viewContentEl.className = viewContentEl.className.replace(
			/\bportogress-\S+-theme\b/g,
			''
		);

		// Add the new theme class
		viewContentEl.classList.add(
			`portogress-${portogressBar.settings.theme}-theme`
		);

		if (!portogressBar.settings.showBars) {
			viewContentEl.addClass('portogress-hide-bars');
		} else {
			viewContentEl.removeClass('portogress-hide-bars');
		}
	}
}
