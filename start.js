self.location = {href: import.meta.url};
let mozjpeg = await (await import('./mozjpeg_enc.js')).default({noInitialRun: true});
// let mozjpeg = await (await import('https://esm.sh/gh/GoogleChromeLabs/squoosh/codecs/mozjpeg/enc/mozjpeg_enc.js')).default({noInitialRun: true});

let {decode, encode} = await import('https://esm.sh/gh/fakoua/jpeg.ts/mod.ts');
let {decode: decodeAVIF, encode: encodeAVIF} = await import('https://esm.sh/gh/jamsinclair/jSquash/packages/avif'); // npm:@jsquash/avif

let options = {
	quality: 75,
	baseline: false,
	arithmetic: false,
	progressive: true,
	optimize_coding: true,
	smoothing: 0,
	color_space: 3, // MozJpegColorSpace {GRAYSCALE = 1, RGB, YCbCr,}
	quant_table: 3,
	trellis_multipass: true,
	trellis_opt_zero: true,
	trellis_opt_table: true,
	trellis_loops: 1,
	auto_subsample: true,
	chroma_subsample: 2,
	separate_chroma_quality: false,
	chroma_quality: 75,
};

let source = './source';
let destination = './compressed';
for await (let file of Deno.readDir(source + '/')) {
	let rawImage = await Deno.readFile(source + '/' + file.name);
	let decodedImage = decode(rawImage);
	let encodedImage = mozjpeg.encode(decodedImage.data, decodedImage.width, decodedImage.height, options);
	Deno.writeFile(destination + '/' + file.name.split(',')[0] + '.jpg', encodedImage);
	console.log(file.name);
}