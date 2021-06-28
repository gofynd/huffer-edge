const path = require("path");
const { pathToRegexp } = require("path-to-regexp");
const HexRe = /[0-9a-f]{6}/;

const Validators = {
  integer: (value, schema) => {
    return Number.isInteger(Number(value));
  },
  string: (value, schema) => {
    return Object.prototype.toString.call(value) === "[object String]";
  },
  color: (value, schema) => {
    value = value || "";
    if (value.length === 6 && HexRe.test(value)) {
      return true;
    } else if (value.length === 8 && HexRe.test(value)) {
      return true;
    }
    return false;
  },
  enum: (value, schema) => {
    const xenum = schema.enum || [];
    return xenum.includes(value);
  },
  boolean: (value, schema) => {
    return (
      value === false ||
      value === true ||
      value === "true" ||
      value === "false" ||
      value === "0" ||
      value === "1"
    );
  },
};

// https://sharp.pixelplumbing.com/
const optMap = {
  resize: {
    desc: "Resize Image",
    params: {
      // Height
      h: {
        name: "height",
        type: "integer",
        default: 0,
      },
      // Width
      w: {
        name: "width",
        type: "integer",
        default: 0,
      },
      // fit
      f: {
        name: "fit",
        type: "enum",
        enum: ["cover", "contain", "fill", "inside", "outside"],
        default: "cover",
      },
      // position
      p: {
        name: "position",
        type: "enum",
        enum: [
          "top",
          "bottom",
          "left",
          "right",
          "right_top",
          "right_bottom",
          "left_top",
          "left_bottom",
          "center",
        ],
        default: "center",
      },
      // background color
      b: {
        name: "background",
        type: "color",
        default: "000000",
      },
      // without enlargement
      we: {
        name: "withoutEnlargement",
        type: "boolean",
        default: false,
      },
    },
    process: (sharpImage, params) => {
      const fprams = {
        height: parseInt(params.h),
        width: parseInt(params.w),
        fit: params.f,
        position: params.p.replace("_", ""),
        background: "#" + params.b,
        withoutEnlargement: !!JSON.parse(params.we),
      };
      if (fprams.height === 0) {
        delete fprams.height;
      }
      if (fprams.width === 0) {
        delete fprams.width;
      }
      return sharpImage.resize(fprams);
    },
  },
  extend: {
    desc: "Extends/pads the edges of the image with the provided background colour. This operation will always occur after resizing and extraction, if any.",
    params: {
      t: {
        name: "top",
        type: "integer",
        default: 10,
      },
      l: {
        name: "left",
        type: "integer",
        default: 10,
      },
      b: {
        name: "left",
        type: "integer",
        default: 10,
      },
      r: {
        name: "right",
        type: "integer",
        default: 10,
      },
      bc: {
        name: "background",
        type: "color",
        default: "000000",
      },
    },
    process: (sharpImage, params) => {
      const fprams = {
        top: parseInt(params.t),
        left: parseInt(params.l),
        bottom: parseInt(params.b),
        right: parseInt(params.r),
        background: "#" + params.bc,
      };
      return sharpImage.extend(fprams);
    },
  },
  extract: {
    desc: "Extract a region of the image.",
    params: {
      t: {
        name: "top",
        type: "integer",
        default: 10,
      },
      l: {
        name: "left",
        type: "integer",
        default: 10,
      },
      h: {
        name: "height",
        type: "integer",
        default: 50,
      },
      w: {
        name: "width",
        type: "integer",
        default: 20,
      },
    },
    process: (sharpImage, params) => {
      const fprams = {
        top: parseInt(params.t),
        left: parseInt(params.l),
        height: parseInt(params.h),
        width: parseInt(params.w),
      };
      return sharpImage.extract(fprams);
    },
  },
  trim: {
    desc: 'Trim "boring" pixels from all edges that contain values similar to the top-left pixel. Images consisting entirely of a single colour will calculate "boring" using the alpha channel, if any.',
    params: {
      t: {
        name: "threshold",
        type: "integer",
        default: 10,
      },
    },
    process: (sharpImage, params) => {
      const threshold = parseInt(params.t);
      const r = sharpImage.trim(threshold);
      return r;
    },
  },
  rotate: {
    desc: "Rotate Image",
    params: {
      // angle
      a: {
        name: "angle",
        type: "integer",
        default: 0,
      },
      // background color
      b: {
        name: "background",
        type: "color",
        default: "000000",
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.rotate(parseInt(params.a), {
        background: "#" + params.b,
      });
    },
  },
  flip: {
    desc: "Rotate Flips image on X-Axis",
    params: {},
    process: (sharpImage, params) => {
      return sharpImage.flip();
    },
  },
  flop: {
    desc: "Rotate Flips image on Y-Axis",
    params: {},
    process: (sharpImage, params) => {
      return sharpImage.flop();
    },
  },
  sharpen: {
    desc: "Sharpen Image",
    params: {
      // sigma
      s: {
        name: "sigma",
        type: "integer",
        default: 1,
      },
      // flat
      f: {
        name: "flat",
        type: "integer",
        default: 1.0,
      },
      // jagged
      j: {
        name: "jagged",
        type: "integer",
        default: 2.0,
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.sharpen(
        Number(params.s),
        Number(params.f),
        Number(params.j)
      );
    },
  },
  median: {
    params: {
      // size
      s: {
        name: "size",
        type: "integer",
        default: 3,
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.median(Number(params.s));
    },
  },
  blur: {
    desc: "Blurs Image",
    params: {
      // sigma
      s: {
        name: "sigma",
        type: "integer",
        default: 1.0,
      },
    },
    process: (sharpImage, params) => {
      const sigma = Number(params.s);
      // value between 0.3 and 1000 representing the sigma of the Gaussian mask
      if (sigma > 0.3 && sigma < 1000) {
        return sharpImage.blur(sigma);
      }
      return sharpImage;
    },
  },
  flatten: {
    params: {
      // background color
      b: {
        name: "background",
        type: "color",
        default: "000000",
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.flatten({ background: "#" + params.b });
    },
  },
  negate: {
    desc: "Creates nagative Image",
    params: {},
    process: (sharpImage, params) => {
      return sharpImage.negate();
    },
  },
  normalise: {
    desc: "Color Normalise Image",
    params: {},
    process: (sharpImage, params) => {
      return sharpImage.normalise();
    },
  },
  linear: {
    desc: "Apply the linear formula a * input + b to the image (levels adjustment)",
    params: {
      a: {
        name: "a",
        type: "integer",
        default: 1.0,
      },
      b: {
        name: "b",
        type: "integer",
        default: 0.0,
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.linear(Number(params.a), Number(params.b));
    },
  },
  modulate: {
    params: {
      b: {
        name: "brightness",
        type: "integer",
        default: 0.5,
      },
      s: {
        name: "saturation",
        type: "integer",
        default: 0.5,
      },
      h: {
        name: "hue",
        type: "integer",
        default: 90,
      },
    },
    process: (sharpImage, params) => {
      const fprams = {
        brightness: Number(params.b),
        saturation: Number(params.s),
        hue: Number(params.h),
      };
      return sharpImage.modulate(fprams);
    },
  },
  grey: {
    desc: "Grey scales Image",
    params: {},
    process: (sharpImage, params) => {
      return sharpImage.greyscale();
    },
  },
  tint: {
    desc: "Creates tint on Image",
    params: {
      // rgb color to tint
      c: {
        name: "color",
        type: "color",
        default: "000000",
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.tint("#" + params.c);
    },
  },
  jpg: {
    desc: "JPG format optimizations",
    params: {
      // quality
      q: {
        name: "quality",
        type: "integer",
        default: 90,
      },
      // progressive
      p: {
        name: "progressive",
        type: "boolean",
        default: false,
      },
      // chromaSubsampling,
      cs: {
        name: "chromaSubsampling",
        type: "string",
        default: "4:2:0",
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.jpeg({
        quality: Number(params.q),
        progressive: !!JSON.parse(params.p),
        chromaSubsampling: params.cs,
      });
    },
    restrictFormats: ["jpg", "jpeg"],
  },
  png: {
    desc: "PNG format optimizations",
    params: {
      //quality
      q: {
        name: "quality",
        type: "integer",
        default: 90,
      },
      // progressive
      p: {
        name: "progressive",
        type: "boolean",
        default: false,
      },
      // compressionLevel
      c: {
        name: "compressionLevel",
        type: "integer",
        default: 9,
      },
    },
    process: (sharpImage, params) => {
      return sharpImage.png({
        quality: Number(params.q),
        compressionLevel: Number(params.c),
        progressive: !!JSON.parse(params.p),
      });
    },
    restrictFormats: ["png"],
  },
};

const optMapKeys = Object.keys(optMap);
optMapKeys.map((k) => {
  optMap[k].prefix = k;
});

function removeLeadingDash(str) {
  if (str.charAt(0) === "-") {
    return str.substr(1);
  }
  return str;
}

function txtToOptions(dSplit, originalFormat) {
  const t = optMapKeys.find((i) => dSplit.startsWith(i));
  if (!t) {
    return;
  }
  const opt = optMap[t];
  const sOpt = removeLeadingDash(dSplit.replace(opt.prefix, "")).split(",");

  if (opt.restrictFormats && !opt.restrictFormats.includes(originalFormat)) {
    return;
  }

  const oParams = {};

  sOpt.map((s) => {
    const l = s.split(":");
    const k = l[0];
    const v = l[1];
    if (k) {
      oParams[k] = v;
    }
  });

  if (Object.keys(oParams).length > Object.keys(opt.params).length) {
    return;
  }

  const kk = Object.keys(opt.params);
  for (var i = 0; i < kk.length; i++) {
    const key = kk[i];
    const oxp = opt.params[key];
    if (oParams[key] === undefined) {
      oParams[key] = oxp.default;
    }
    if (!Validators[oxp.type](oParams[key], oxp)) {
      console.log("!! Failed", oxp.type, oxp);
      return;
    }
  }

  if (Object.keys(oParams).length > Object.keys(opt.params).length) {
    return;
  }

  return {
    name: t,
    params: oParams,
    opt: opt,
  };
}

const cache = {};
function getCachedFinalInterceptMap(config, bucket) {
  const awsConfig = config.getAWSConfigForBucket(bucket);
  const directories = config.directories;

  const { CloudFrontOriginBucket, InterceptPrefixs } = awsConfig;
  if (cache[CloudFrontOriginBucket]) {
    return cache[CloudFrontOriginBucket];
  }
  const InterceptMapX = {};
  InterceptPrefixs.forEach((ip) => {
    Object.keys(directories).forEach((k) => {
      const fk = path.join(ip, k);
      // Clone object so prefix doesn't override;
      InterceptMapX[fk] = Object.assign({}, directories[k]);
      InterceptMapX[fk].prefix = fk;
      InterceptMapX[fk].prefixRegex = pathToRegexp(fk, null, { end: false });
    });
  });

  cache[CloudFrontOriginBucket] = InterceptMapX;

  return InterceptMapX;
}

function getTransformer(config, uri, bucket) {
  const InterceptMap = getCachedFinalInterceptMap(config, bucket);
  const InterceptMapKeys = Object.keys(InterceptMap);

  const m = InterceptMapKeys.find((imk) =>
    InterceptMap[imk].prefixRegex.test(uri)
  );
  if (!m) {
    return;
  }

  const { interceptors, prefixRegex } = InterceptMap[m];

  const originalDimension = uri.replace(prefixRegex, "").split("/")[0];
  const dimension = decodeURIComponent(originalDimension);

  // send original as it is.
  const xdSplit = dimension === "original" ? [] : dimension.split("~");
  // intercept transformation option
  const dSplit = xdSplit.map((ds) => {
    for (let i = 0; i < interceptors.length; i++) {
      ds = interceptors[i](ds);
    }
    return ds;
  });

  const originalFormat = uri.match(/(.*)\.(.*)/)[2].toLowerCase();
  const opts = dSplit.map((x) => txtToOptions(x, originalFormat));
  for (var i = 0; i < opts.length; i++) {
    // one of the filter options was invalid
    if (!opts[i]) {
      return;
    }
  }

  return {
    opts: opts,
    s3Key: decodeURIComponent(
      uri.replace("/", "").replace(`/${originalDimension}/`, "/original/")
    ),
    transform: function transform(img) {
      opts.map((o) => o.opt.process(img, o.params));
      return img;
    },
  };
}

module.exports = {
  optMap,
  getTransformer,
};
