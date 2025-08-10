import { PortogressSettingTab } from 'src/settings';
import { Editor, MarkdownView, Plugin } from 'obsidian';
import { generatePortogressBars, setEditorClass } from './functions';
import { clickHandler } from './click-handler';
import {
	COMMAND_ID,
	DEFAULT_SETTINGS,
	PLUGIN_ID,
	PortogressBarSettings,
} from './constants';
import { generatePortogressCheckboxSummary } from './checkboxes-percentage';

export default class PortogressBar extends Plugin {
	settings: PortogressBarSettings;

	async onload() {
		await this.loadSettings();

		//Add editor command
		this.addCommand({
			id: COMMAND_ID,
			name: 'Generate Portogress Bar',
			editorCallback: (editor: Editor) => {
				generatePortogressBars(this, editor);
				generatePortogressCheckboxSummary(editor);
			},
		});

		//Addd ribbon icon
		this.addRibbonIcon('percent-sign-glyph', 'PortogressBar', () => {
			const commands = (this.app as any).commands;
			console.log(`${PLUGIN_ID}:${COMMAND_ID}`);
			commands.executeCommandById(`${PLUGIN_ID}:${COMMAND_ID}`);
		});

		// Add settings tab
		this.addSettingTab(new PortogressSettingTab(this.app, this));

		// Register event on view focus
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', (leaf) => {
				if (leaf && leaf.view instanceof MarkdownView) {
					setEditorClass(this);
				}
			})
		);

		// Register click event
		this.registerDomEvent(document, 'click', clickHandler.bind(this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		setEditorClass(this);
	}
}
