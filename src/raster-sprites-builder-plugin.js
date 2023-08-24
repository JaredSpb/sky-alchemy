import {globSync} from 'glob';
import sharp from 'sharp';
import * as fs from 'node:fs';

export default async function( params ){
	
	let files = globSync(params.source);

	let max_height = 30;
	let total_width = 0;
	let sprites = [];

	for( let file of files ){

		let i = sharp(file);
		let md = await i.metadata();

		let width = 30;//Math.ceil(md.width * ( max_height / md.height ));

		let icon_name = file.replace(/.*\/([^/]+)\.png/,"$1");
		sprites.push({
			name: icon_name,
			left: total_width,
			top: 0,
			input: await i.resize({height: max_height, width: width, options: {fit: 'contain'}}).toBuffer(),
			width: width,
			height: max_height
		});

		total_width += width;

	}
	
	let less = `
.icon::before{
	content: '';
	display: block;
	background: url('/images/icons.png');
}
	`;

	for( let sprite of sprites ){
		less += `
.icon.${sprite.name}::before{
	background-position: -${ sprite.left }px 0;
	width: ${sprite.width}px;
	height: ${sprite.height}px;
}
		`;
	}

	await sharp({
		create: {
			width: total_width,
			height: max_height,
			background: 'rgba(0,0,0,0)',
			channels: 4,
		}
	})
		.composite( sprites )
		.toFile(params.target.image);

	fs.writeFileSync(params.target.css, less);

}
