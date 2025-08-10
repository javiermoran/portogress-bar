import { Editor } from 'obsidian';

export function generatePortogressCheckboxSummary(editor: Editor) {
	const editorContent = editor.getValue();
	const checkboxRegex = /- \[([ x])\] (.*?)(?=\n|$)/g;
	let totalCheckboxes = 0;
	let checkedCheckboxes = 0;

	let match;
	while ((match = checkboxRegex.exec(editorContent)) !== null) {
		totalCheckboxes++;
		if (match[1] === 'x') {
			checkedCheckboxes++;
		}
	}

	if (totalCheckboxes === 0) {
		return;
	}

	const percentage = Math.round((checkedCheckboxes / totalCheckboxes) * 100);

	const fifthsPercentage = Math.round(percentage / 5) * 5;
	const summaryText = `Progress`;

	const viewContent = document.querySelector('.view-content');

	if (viewContent) {
		let summaryDiv = document.getElementById('portogress-summary');
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
		const labelCls = percentage <= 10 ? '' : `pb${fifthsPercentage}-l`;
		percentageSpan.className = `pb pb${fifthsPercentage} ${labelCls}`;
		percentageSpan.textContent = ` (${fifthsPercentage}%)`;
		summaryDiv.appendChild(percentageSpan);
	}
}
