const Image = require("@11ty/eleventy-img");
const config = require("./src/_data/config.js");

const GAP = config.gaps.desktop;
const MOBILE_GAP = config.gaps.mobile;
const BUFFER = config.gaps.buffer;
const MOBILE_BUFFER = config.gaps["buffer-mobile"];

const SCREEN_WIDTHES = config.screenWidthes;

const MAX_WIDTH = config.maxWidth;

const COLUMN_CONFIGURATION = [
  { from: 0, to: config.breakpoints.mobile, columns: config.columnConfiguration.mobile},
  { from: config.breakpoints.mobile, to: config.breakpoints.tablet, columns: config.columnConfiguration.tablet},
  { from: config.breakpoints.tablet, to: Number.POSITIVE_INFINITY, columns: config.columnConfiguration.desktop},
]

const IMAGE_DENSITY_CONFIGURATION = [
  { from: 0, to: config.breakpoints.mobile, multipliers: config.densityConfiguration.mobile},
  { from: config.breakpoints.mobile, to: config.breakpoints.tablet, multipliers: config.densityConfiguration.tablet},
  { from: config.breakpoints.tablet, to: Number.POSITIVE_INFINITY, multipliers: config.densityConfiguration.desktop},
];

let sizeRanges = convertInf(config.sizeRanges);

function convertInf(infArr){
  let resString = [];

  for (const i of infArr) {
    let tpm = [];
    for (const b of i) {
      tpm.push(eval(b))
    }
    resString.push(tpm)
  }

  return resString
}

function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

function getWidthStack(page) {
  if (!page.screenWidthStack) {
    page.screenWidthStack = [];
  }
  return page.screenWidthStack;
}

function getWidthStack(page) {
  if (!page.screenWidthStack) {
    page.screenWidthStack = [];
  }
  return page.screenWidthStack;
}

function pushOnWidthStack(page, params) {
  let stack = getWidthStack(page);
  stack.push(params);
}

function getAmountPerRow(COLUMN_CONFIGURATION, initialScreenWidth, columnsPerContainer) {
  let columnsWide = 0;
  for (let config of COLUMN_CONFIGURATION) {
    if (config.from <= initialScreenWidth && initialScreenWidth < config.to) {
      columnsWide = config.columns;
      break;
    }
  }

  if (!columnsWide) {
    //was not found
    throw new Error('Column configuration was not found for initialWidth: '
      + initialScreenWidth);
  }

  let amountPerRow = columnsWide / columnsPerContainer;
  return amountPerRow;
}

function pushdividerOnWidthStack(page, dividerAmount) {
  pushOnWidthStack(page, {divider: dividerAmount});
}

function pushPaddingOnWidthStack(page, unusedSpaceWidth) {
  pushOnWidthStack(page, {gap: unusedSpaceWidth});
}

function pushPBufferOnWidthStack(page, unusedSpaceWidth) {
  pushOnWidthStack(page, {buffer: unusedSpaceWidth});
}

function pushmaxWidthCalcOnWidthStack(page, maxWidth) {
  pushOnWidthStack(page, {maxWidth: maxWidth});
}

function popFromWidthStack(page) {
  let stack = getWidthStack(page);
  if (stack.length) {
    stack.length--;
  }
}

function getWidthDensityArray(widthsArr){
  let widthsWidthDensity = new Set();

  for (let it of widthsArr) {
    for (let density of IMAGE_DENSITY_CONFIGURATION) {
      if (density.from <= it.initialScreenWidth && it.initialScreenWidth < density.to) {
        for (let multiplier of density.multipliers) {
          widthsWidthDensity.add(Math.ceil(it.width * multiplier));
        }
      }
    }
  }  

  widthsWidthDensity = Array.from(widthsWidthDensity).sort(compareNumeric);

  return widthsWidthDensity;
}

function setSizes(stack, columnConfig) {

  if (stack.length && stack[0].maxWidth) {
    let maxWidth = stack[0].maxWidth;

    // here we push max width into sizeRanges
    for (let i = 0; i < sizeRanges.length - 1; i++) {
      let upper = sizeRanges[i][0];
      let lower = sizeRanges[i+1][0];

      if (lower < maxWidth && maxWidth < upper) {
        sizeRanges[i + 1][1] = maxWidth;
        sizeRanges[i][0] = maxWidth;
        sizeRanges[i][1] = Infinity;
        sizeRanges = sizeRanges.slice(i, sizeRanges.length);
        break;
      } else if(maxWidth === upper) {
        sizeRanges[i][0] = maxWidth;
        sizeRanges[i][1] = Infinity;
        sizeRanges = sizeRanges.slice(i, sizeRanges.length);
      }
    }
  }

  let sizes = [];

  for (let [from, to] of sizeRanges) {
    let ColumnCount = 1;
    let value = '100vw';

    for (let op of stack) {
      if (op.maxWidth) {
        if(ColumnCount === 1) {
          if (op.maxWidth <= from) {
            value = value.replace('100vw', op.maxWidth + 'px');
          }
        } else {
          if(Math.ceil(op.maxWidth * ColumnCount) <= from) {
            value = `${op.maxWidth}px`;
          }
        }
      }

      if (op.gap) {
        if(MOBILE_GAP){
          if(from == 0){
            value = `(${value} - ${MOBILE_GAP * 2}px)`;
          } else{
            value = `(${value} - ${op.gap}px)`;
          }
        } else{
          value = `(${value} - ${op.gap}px)`;
        }
        
      }

      if (op.buffer) {
        value = `(${value} - ${op.buffer}px)`;        
      }

      if (op.divider) {
        ColumnCount = ColumnCount * getAmountPerRow(columnConfig, from, op.divider);
        let amountPerRow = getAmountPerRow(columnConfig, from, op.divider);
        if (amountPerRow > 1) {
          value = `(${value} / ${amountPerRow})`;
        }
      }
    }

    let sizeString = '';

    if (from) sizeString = `(min-width: ${from}px)`;
    sizeString += ` calc(${value})`;

    sizes.push(sizeString);
  }

  return sizes;
}

async function imageShortcode3(src, alt, customParams) {
    console.log(`====================================================`);
    page = typeof page !== 'undefined' ?  page : this.page;
    let colConfig = COLUMN_CONFIGURATION;   
    
  
    if(alt === undefined) {
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }
  
    let result = '';
    let operationsStack = getWidthStack(page);
    let defaultScreenWidths = SCREEN_WIDTHES;
  
    
    let widths = [];
    for (let width of defaultScreenWidths) {
      widths.push({
        width: width,
        initialScreenWidth: width,
      });
    }
  
    let fallbackWidthValue = MAX_WIDTH;
  
  
    if(operationsStack.length){
      let op = Array.from(operationsStack)[0]
  
      if(Object.keys(op)[0] === "maxWidth"){
        fallbackWidthValue = Object.values(op)[0]
      }
    }
  
    widths.push({
      width: fallbackWidthValue,
      initialScreenWidth: fallbackWidthValue,
      fallbackCase: true,
    });
  
  
    for (let op of operationsStack) {

      // here widts array crop to a max width which is setted by container
      if (op.maxWidth){
        for(it of widths){
          if(it.width > MAX_WIDTH){
            it.width = MAX_WIDTH
          }
        }
      }
  
      if (op.divider){   
        for(it of widths){
          it.width = Math.round(it.width / getAmountPerRow(colConfig, it.initialScreenWidth, op.divider));
        }
      }
  
      if(op.gap){

        // If mobile gap exist
        if(MOBILE_GAP){
          // Search in which width mobile starts
          let mobileTo;
          for (const item of colConfig) {
            if(item.from == 0){
              mobileTo = item.to;
            }
          }

          // if width == moblie width => change gap value in calculations
          for(it of widths){
            if(it.width < mobileTo){
              it.width -= MOBILE_GAP * 2;
            }else{
              it.width -= op.gap;
            }
          }
        } else{
          it.width -= op.gap;
        } 
        
      }

      if(op.buffer){
        // If mobile buffer exist
        if(MOBILE_BUFFER){
          // Search in which width mobile starts
          let mobileTo;
          for (const item of colConfig) {
            if(item.from == 0){
              mobileTo = item.to;
            }
          }

          // if width == moblie width => change gap value in calculations
          for(it of widths){
            if(it.width < mobileTo){
              it.width -= MOBILE_BUFFER * 2;
            }else{
              it.width -= op.buffer;
            }
          }
        } else{
          it.width -= op.buffer;
        } 
      }

    }

    console.log(`stack -`, operationsStack);
    console.log(`widths - `, widths);

    let sizes = setSizes(operationsStack, colConfig);
  
    // tag builds here
    let formats = ['webp', 'png'];
    let sortedWidthsArray = getWidthDensityArray(widths);

    console.log(`sorted arr is - `, sortedWidthsArray);

    let metadata = await Image(src, {
      widths: sortedWidthsArray,
      formats: formats,
      outputDir: './_site/assets/img'
    });

  
    let widthOverHeight = metadata.png[0].width / metadata.png[0].height;
  
    let fallbackCaseWidth = Math.ceil(widths.filter(el => el.fallbackCase)[0].width);
    let fallbackCaseHeight = Math.ceil(fallbackCaseWidth / widthOverHeight);
  
    result  = '<picture>\n';
    for (let format of formats) {
      result += `  <source type="${metadata[format][0].sourceType}" srcset="`;
      result += metadata[format].map(el => `/assets${el.srcset}`).join(",\n");
      result += `" sizes="${sizes}">\n`;
    }

  
    let fallbackCaseUrl = "/assets" + metadata.png.filter(el => (el.width == fallbackCaseWidth))[0].url
  
    result += `<img
                   src="${fallbackCaseUrl}"
                   width="${fallbackCaseWidth}"
                   height="${fallbackCaseHeight}"
                   alt="${alt}"
                   loading="lazy"
                   decoding="async">\n`;
    result += '</picture>';
  
    return result;
}

async function enchancedImage(src,alt, widthsArr, size, customParams){
  let sizes = size;

  let sortedArray = widthsArr.sort(compareNumeric); 
  let widths = [];
  
  let formats;
  // tag builds here
  if(src.includes("svg")){
    formats = ['svg', 'jpeg'];
    sortedArray.forEach(el=>{
      widths.push(el)
    })
  } else{
    formats = ['webp', 'jpeg'];
    sortedArray.forEach(el=>{
      widths.push(el)
      widths.push(el*1.5)
      widths.push(el*2)
      widths.push(el*3)
    })
  }  

  widths = widths.sort(compareNumeric);
  
  let metadata = await Image(src, {
    widths: widths,
    formats: formats,
    outputDir: './_site/assets/img'
  });

  let widthOverHeight = metadata.jpeg[0].width / metadata.jpeg[0].height;

  let fallbackCaseWidth = sortedArray[sortedArray.length-1];
  let fallbackCaseHeight = Math.ceil(fallbackCaseWidth / widthOverHeight);

  result  = '<picture>\n';
  for (let format of formats) {
    result += `  <source type="${metadata[format][0].sourceType}" srcset="`;
    result += metadata[format].map(el => `/assets${el.srcset}`).join(",\n");
    result += `" sizes="${sizes}">\n`;
  }

  
  let fallbackCaseUrl = "/assets" + metadata.jpeg.filter(el => (el.width == fallbackCaseWidth))[0].url

  result += `<img
                  src="${fallbackCaseUrl}"
                  width="${fallbackCaseWidth}"
                  height="${fallbackCaseHeight}"
                  alt="${alt}"
                  loading="lazy"
                  decoding="async">\n`;
  result += '</picture>';

  return result;
}

async function pictureSvgPng(src, alt, width, height) {
  if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }
  
  let metadata = await Image(src, {
      formats: ['png', 'svg'],
      outputDir: './_site/assets/img'
  });

  // TODO: figure out that loading="lazy" decoding="async"
  // TODO: set image name like param
  
  return `<picture>
              <source type="image/svg+xml" srcset="/assets${metadata.svg[0].url}">
              <img src="/assets${metadata.png[0].url}" width="${width}" height="${height}" alt="${alt}"
              loading="lazy"
                      decoding="async">
          </picture>`;
}

async function imagePngSelfSize(src, alt, sizes  = "100vw", width, height) {
  if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let x1 = width;
  let x15 = width * 1.5;
  let x2 = width * 2;
  let x3 = width * 3;

  let imgWidthes = [x1, x15, x2, x3];
  // let imgWidthes = [x1];
  
  let metadata = await Image(src, {
      widths: imgWidthes,
      formats: ['webp', 'png'],
      outputDir: './_site/assets/img'
  });
  
  let lowsrc = metadata.png[0];
  
  return `<picture>
  ${Object.values(metadata).map(imageFormat => {
    return `              <source type="${imageFormat[0].sourceType}" srcset="/assets${imageFormat.map(entry => entry.srcset).join(",\n /assets")}" sizes="${sizes}">`;    }).join("\n")}
                  <img
                      src="/assets${lowsrc.url.substring(0,(lowsrc.url.lastIndexOf('-')+1))+width}.png"
                      width="${width}"
                      height="${height}"
                      alt="${alt}"
                      loading="lazy"
                      decoding="async">
            </picture>
  `;
}

async function imagePngSelfSize1(src, alt, sizes  = "100vw", width, height) {
  if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let x1 = width;

  let imgWidthes = [x1];
  
  let metadata = await Image(src, {
      widths: imgWidthes,
      formats: ['webp', 'png'],
      outputDir: './_site/assets/img'
  });
  
  let lowsrc = metadata.png[0];
  
  return `<picture>
  ${Object.values(metadata).map(imageFormat => {
    return `              <source type="${imageFormat[0].sourceType}" srcset="/assets${imageFormat.map(entry => entry.srcset).join(",\n /assets")}" sizes="${sizes}">`;    }).join("\n")}
                  <img
                      src="/assets${lowsrc.url.substring(0,(lowsrc.url.lastIndexOf('-')+1))+width}.png"
                      width="${width}"
                      height="${height}"
                      alt="${alt}"
                      loading="lazy"
                      decoding="async">
            </picture>
  `;
}



module.exports = function (eleventyConfig){
  eleventyConfig.addPassthroughCopy("src/assets/css");
	eleventyConfig.addWatchTarget("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/img");
	eleventyConfig.addWatchTarget("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
	eleventyConfig.addWatchTarget("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/js");
	eleventyConfig.addWatchTarget("src/assets/js");  
    
  eleventyConfig.addNunjucksShortcode("divider", function() {
    pushdividerOnWidthStack(this.page, 4);
    return `<div class="column">`;
  });

  eleventyConfig.addNunjucksShortcode("enddivider", function() {
    popFromWidthStack(this.page);// divider
    return `</div>`;
  });

  eleventyConfig.addNunjucksShortcode("endcontainer", function() {
    popFromWidthStack(this.page);//padding
    return `</div>`;
  });

  eleventyConfig.addNunjucksShortcode("container", function() {
    pushmaxWidthCalcOnWidthStack(this.page, MAX_WIDTH - GAP * 2);
    pushPaddingOnWidthStack(this.page, GAP * 2);
    return `<div class="container">`;
  });

  eleventyConfig.addNunjucksShortcode("endcontainer", function() {
    popFromWidthStack(this.page);//padding
    popFromWidthStack(this.page);//max-width
    return `</div>`;
  });

  eleventyConfig.addNunjucksShortcode("buffer", function() {
    page = typeof page !== 'undefined' ?  page : this.page;
    pushPBufferOnWidthStack(this.page, BUFFER * 2);
    return `<div class="buffer">`;
  });

  eleventyConfig.addNunjucksShortcode("endbuffer", function() {
    page = typeof page !== 'undefined' ?  page : this.page;
    popFromWidthStack(page);
    return `</div>`;
  });

  
  eleventyConfig.addNunjucksAsyncShortcode("imagePngSelfSize", imagePngSelfSize);
  eleventyConfig.addNunjucksAsyncShortcode("imagePngSelfSize1", imagePngSelfSize1);

  eleventyConfig.addNunjucksAsyncShortcode("imageShortcode3", imageShortcode3);
  eleventyConfig.addNunjucksAsyncShortcode("enchancedImage", enchancedImage);
  eleventyConfig.addNunjucksAsyncShortcode("pictureSvgPng", pictureSvgPng);
  

  return {
      dir: {
          input: 'src'
      },
      markdownTemplateEngine: 'njk',
  };
}
