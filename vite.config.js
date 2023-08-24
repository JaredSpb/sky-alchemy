import * as fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import buildPotions from './src/potions-file-build-plugin.js';
import buildRasterSprites from './src/raster-sprites-builder-plugin.js';


// https://vitejs.dev/config/
export default defineConfig(async () => {
	return {
		plugins: [
			buildPotions(),
			await buildRasterSprites({
				source: __dirname + '/src/data/icons/*.png',
				target: {
					image: __dirname + '/public/images/icons.png',
					css: __dirname + '/src/assets/icons.less'
				}

			}),
			vue(),
		],
		build: {
			sourcemap: true,
			minify: false
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		}
	}
});


