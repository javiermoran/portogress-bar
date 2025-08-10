export const PLUGIN_NAME = 'Portogress Bar';
export const PLUGIN_ID = 'portogress-bar';
export const COMMAND_ID = 'generate-portogress-bar';

export interface PortogressBarSettings {
	showLabels: boolean;
	showBars: boolean;
	minLabelPercentage: number;
	theme: string;
	checkboxesPercentage: boolean;
}

export const DEFAULT_SETTINGS: PortogressBarSettings = {
	showLabels: true,
	showBars: true,
	minLabelPercentage: 60,
	theme: 'cool',
	checkboxesPercentage: false,
};

export const THEMES = {
	warm: 'Warm',
	cool: 'Cool',
	forest: 'Forest',
	cyberpunk: 'Cyberpunk',
	eighties: '80s',
	rainbow: 'Rainbow',
	chalkboard: 'Chalkboard',
};
