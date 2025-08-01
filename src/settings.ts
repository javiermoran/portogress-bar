import { App, PluginSettingTab, Setting } from 'obsidian';
import PortogressBar from './main';
import { THEMES } from './constants';

export class PortogressSettingTab extends PluginSettingTab {
	plugin: PortogressBar;

	constructor(app: App, plugin: PortogressBar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Show labels')
			.setDesc('Show label on progress bar')
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.showLabels)
					.onChange(async (value) => {
						this.plugin.settings.showLabels = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Show bars')
			.setDesc('Show progress bars')
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.showBars)
					.onChange(async (value) => {
						this.plugin.settings.showBars = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Min percentage for label')
			.setDesc('Minimum percentage to show label on progress bar')
			.addSlider((slider) =>
				slider
					.setLimits(5, 100, 5)
					.setValue(this.plugin.settings.minLabelPercentage)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.minLabelPercentage = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Theme')
			.setDesc('Color theme for portogress bars')
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(THEMES)
					.setValue(this.plugin.settings.theme)
					.onChange(async (value) => {
						this.plugin.settings.theme = value;
						await this.plugin.saveSettings();

						const viewContentEl =
							document.querySelector('.view-content');
						if (viewContentEl) {
							// Remove any existing portogress theme class
							viewContentEl.className =
								viewContentEl.className.replace(
									/\bportogress-\S+-theme\b/g,
									''
								);

							// Add the new theme class
							viewContentEl.classList.add(
								`portogress-${value}-theme`
							);
						}
					})
			);
	}
}
