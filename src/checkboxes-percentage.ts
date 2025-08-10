import { App, Editor, MarkdownView } from 'obsidian';

export function generatePortogressCheckboxSummary(app: App, editor: Editor) {
	console.log('here');
	const viewContent = document.querySelector('.view-content');
	const editorMode = app.workspace
		.getActiveViewOfType(MarkdownView)
		?.getMode();

	let totalCheckboxes = 0;
	let checkedCheckboxes = 0;

	if (editorMode === 'preview') {
		const taskListItems = document.querySelectorAll('.task-list-item');
		totalCheckboxes = taskListItems.length;
		checkedCheckboxes = Array.from(taskListItems).filter((item) =>
			item.classList.contains('is-checked')
		).length;
	} else {
		const editorContent = editor.getValue();
		const checkboxRegex = /- \[([ x])\] (.*?)(?=\n|$)/g;

		let match;
		while ((match = checkboxRegex.exec(editorContent)) !== null) {
			totalCheckboxes++;
			if (match[1] === 'x') {
				checkedCheckboxes++;
			}
		}
	}

	console.log(editorMode);

	if (viewContent) {
		let summaryDiv = document.getElementById('portogress-summary');

		if (checkedCheckboxes === 0) {
			if (summaryDiv) {
				summaryDiv.remove();
			}
			return;
		}

		const percentage = Math.round(
			(checkedCheckboxes / totalCheckboxes) * 100
		);
		const fifthsPercentage = Math.round(percentage / 5) * 5;
		const summaryText = `Progress`;
		viewContent?.classList.add('portogress-with-summary');

		if (!summaryDiv) {
			summaryDiv = document.createElement('div');
			summaryDiv.id = 'portogress-summary';
			viewContent.appendChild(summaryDiv);
		}

		summaryDiv.textContent = '';

		if (checkedCheckboxes === 0) {
			return;
		}

		const span = document.createElement('span');
		span.className = 'pb-label';
		span.textContent = summaryText;
		summaryDiv.appendChild(span);

		const percentageSpan = document.createElement('span');
		const labelCls = percentage <= 20 ? '' : `pb${fifthsPercentage}-l`;
		percentageSpan.className = `pb pb${fifthsPercentage} ${labelCls}`;
		percentageSpan.textContent = ` (${fifthsPercentage}%)`;
		summaryDiv.appendChild(percentageSpan);
	}
}
