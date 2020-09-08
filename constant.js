// Image types that can be handled by Sharp
const supportImageTypes = [
  {
    imageType: "jpg",
    mimeType: "jpeg",
  },
  {
    imageType: "jpeg",
    mimeType: "jpeg",
  },
  {
    imageType: "png",
    mimeType: "png",
  },
  {
    imageType: "gif",
    mimeType: "gif",
  },
  {
    imageType: "webp",
    mimeType: "webp",
  },
  {
    imageType: "svg",
    mimeType: "svg",
  },
  {
    imageType: "tiff",
    mimeType: "tiff",
  },
];

const corsAllowAllHeaders = {
  "access-control-allow-origin": [
    {
      key: "Access-Control-Allow-Origin",
      value: "*",
    },
  ],
  "access-control-allow-headers": [
    {
      key: "Access-Control-Allow-Headers",
      value: "*",
    },
  ],
  "access-control-allow-methods": [
    {
      key: "Access-Control-Allow-Methods",
      value: "*",
    },
  ],
};

module.exports = {
  supportImageTypes,
  corsAllowAllHeaders,
};
