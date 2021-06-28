## Properties 
### RESIZE (resize)
##### Resize Image
#### Params:
* **height** - h => **Type**: integer, **Default**: 0
* **width** - w => **Type**: integer, **Default**: 0
* **fit** - f => **Type**: enum, **Default**: cover
* **position** - p => **Type**: enum, **Default**: center
* **background** - b => **Type**: color, **Default**: 000000
* **withoutEnlargement** - we => **Type**: boolean, **Default**: false

[Sharp Resize Documentation](https://sharp.pixelplumbing.com/api-operation#resize)

### EXTEND (extend)
##### Extends/pads the edges of the image with the provided background colour. This operation will always occur after resizing and extraction, if any.
#### Params:
* **top** - t => **Type**: integer, **Default**: 10
* **left** - l => **Type**: integer, **Default**: 10
* **left** - b => **Type**: integer, **Default**: 10
* **right** - r => **Type**: integer, **Default**: 10
* **background** - bc => **Type**: color, **Default**: 000000

[Sharp Extend Documentation](https://sharp.pixelplumbing.com/api-operation#extend)

### EXTRACT (extract)
##### Extract a region of the image.
#### Params:
* **top** - t => **Type**: integer, **Default**: 10
* **left** - l => **Type**: integer, **Default**: 10
* **height** - h => **Type**: integer, **Default**: 50
* **width** - w => **Type**: integer, **Default**: 20

[Sharp Extract Documentation](https://sharp.pixelplumbing.com/api-operation#extract)

### TRIM (trim)
##### Trim "boring" pixels from all edges that contain values similar to the top-left pixel. Images consisting entirely of a single colour will calculate "boring" using the alpha channel, if any.
#### Params:
* **threshold** - t => **Type**: integer, **Default**: 10

[Sharp Trim Documentation](https://sharp.pixelplumbing.com/api-operation#trim)

### ROTATE (rotate)
##### Rotate Image
#### Params:
* **angle** - a => **Type**: integer, **Default**: 0
* **background** - b => **Type**: color, **Default**: 000000

[Sharp Rotate Documentation](https://sharp.pixelplumbing.com/api-operation#rotate)

### FLIP (flip)
##### Rotate Flips image on X-Axis


[Sharp Flip Documentation](https://sharp.pixelplumbing.com/api-operation#flip)

### FLOP (flop)
##### Rotate Flips image on Y-Axis


[Sharp Flop Documentation](https://sharp.pixelplumbing.com/api-operation#flop)

### SHARPEN (sharpen)
##### Sharpen Image
#### Params:
* **sigma** - s => **Type**: integer, **Default**: 1
* **flat** - f => **Type**: integer, **Default**: 1
* **jagged** - j => **Type**: integer, **Default**: 2

[Sharp Sharpen Documentation](https://sharp.pixelplumbing.com/api-operation#sharpen)

### MEDIAN (median)
##### 
#### Params:
* **size** - s => **Type**: integer, **Default**: 3

[Sharp Median Documentation](https://sharp.pixelplumbing.com/api-operation#median)

### BLUR (blur)
##### Blurs Image
#### Params:
* **sigma** - s => **Type**: integer, **Default**: 1

[Sharp Blur Documentation](https://sharp.pixelplumbing.com/api-operation#blur)

### FLATTEN (flatten)
##### 
#### Params:
* **background** - b => **Type**: color, **Default**: 000000

[Sharp Flatten Documentation](https://sharp.pixelplumbing.com/api-operation#flatten)

### NEGATE (negate)
##### Creates nagative Image


[Sharp Negate Documentation](https://sharp.pixelplumbing.com/api-operation#negate)

### NORMALISE (normalise)
##### Color Normalise Image


[Sharp Normalise Documentation](https://sharp.pixelplumbing.com/api-operation#normalise)

### LINEAR (linear)
##### Apply the linear formula a * input + b to the image (levels adjustment)
#### Params:
* **a** - a => **Type**: integer, **Default**: 1
* **b** - b => **Type**: integer, **Default**: 0

[Sharp Linear Documentation](https://sharp.pixelplumbing.com/api-operation#linear)

### MODULATE (modulate)
##### 
#### Params:
* **brightness** - b => **Type**: integer, **Default**: 0.5
* **saturation** - s => **Type**: integer, **Default**: 0.5
* **hue** - h => **Type**: integer, **Default**: 90

[Sharp Modulate Documentation](https://sharp.pixelplumbing.com/api-operation#modulate)

### GREY (grey)
##### Grey scales Image


[Sharp Grey Documentation](https://sharp.pixelplumbing.com/api-operation#grey)

### TINT (tint)
##### Creates tint on Image
#### Params:
* **color** - c => **Type**: color, **Default**: 000000

[Sharp Tint Documentation](https://sharp.pixelplumbing.com/api-operation#tint)

### JPG (jpg)
##### JPG format optimizations
#### Params:
* **quality** - q => **Type**: integer, **Default**: 90
* **progressive** - p => **Type**: boolean, **Default**: false
* **chromaSubsampling** - cs => **Type**: string, **Default**: 4:2:0

[Sharp Jpg Documentation](https://sharp.pixelplumbing.com/api-operation#jpg)

### PNG (png)
##### PNG format optimizations
#### Params:
* **quality** - q => **Type**: integer, **Default**: 90
* **progressive** - p => **Type**: boolean, **Default**: false
* **compressionLevel** - c => **Type**: integer, **Default**: 9

[Sharp Png Documentation](https://sharp.pixelplumbing.com/api-operation#png)

