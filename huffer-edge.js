"use strict";

const aws = require("aws-sdk");
const sharp = require("sharp");

const { supportImageTypes, corsAllowAllHeaders } = require("./constant");
const HufferConfig = require("./config");
const dutils = require("./dimensions");
const logger = require("./logger");

class HufferEdge {
  /**
   *
   * @param HufferConfig config
   */
  constructor(config) {
    this.config = new HufferConfig(config);
    this.s3 = new aws.S3({
      region: "us-east-1",
      signatureVersion: "v4",
    });
  }
  async handler(event, context, callback) {
    logger.info(event);
    const { request, response } = event.Records[0].cf;

    logger.info("* Request ==");
    logger.info(request);
    logger.info("* Request Headers ==");
    logger.info(request.headers);
    logger.info("* Origin Response Headers ==");
    logger.info(JSON.stringify(response.headers));

    response.headers = {
      ...response.headers,
      ...corsAllowAllHeaders,
    };

    // check if image is present and not cached.
    if (response.status == 404) {
      const originDomain =
        request.origin && request.origin.s3 && request.origin.s3.domainName;
      const AssetsBucket = request.origin.s3.domainName.replace(
        ".s3.amazonaws.com",
        ""
      );

      if (!originDomain) {
        logger.info("originDomain not found");
        callback(null, response);
        return;
      }

      if (!this.config.isValidAWSBucket(AssetsBucket)) {
        logger.info("invalid bucket");
        callback(null, response);
        return;
      }

      logger.info("* URI", request.uri);

      let originalFormat = request.uri.match(/(.*)\.(.*)/)[2].toLowerCase();
      const webpExt = "webp";
      let isWebp = originalFormat == webpExt;
      let isOriginalWebp = isWebp && new RegExp("/original/").test(request.uri);

      if (
        !supportImageTypes.some((o) => {
          return o.imageType == originalFormat;
        })
      ) {
        responseUpdate(403, "Forbidden", "Unsupported image type", [
          { key: "Content-Type", value: "text/plain" },
        ]);
        logger.info("* Lambda Response headers");
        logger.info(JSON.stringify(response.headers));
        callback(null, response);
        return;
      }

      const transformer = dutils.getTransformer(
        this.config,
        request.uri,
        AssetsBucket
      );
      // empty step no tranformation
      if (!transformer) {
        logger.info("invalid transformer");
        responseUpdate(404, "Error", "Invalid transformation", [
          { key: "Content-Type", value: "text/plain" },
        ]);
        callback(null, response);
        return;
      }

      try {
        let s3Object;

        // check if images with same name but other supported formats exist on s3
        // so that we can convert them to webp
        if (isWebp) {
          let imgs = supportImageTypes
            .filter((img) => img.imageType != webpExt)
            .map((i) => i.imageType);

          let pArr = [...imgs, ...imgs.map((i) => i.toUpperCase())].map(
            (img) => {
              let transformer = dutils.getTransformer(
                this.config,
                request.uri.replace(`.${webpExt}`, `.${img}`),
                AssetsBucket
              );
              return this.s3
                .getObject({
                  Bucket: AssetsBucket,
                  Key: transformer.s3Key,
                })
                .promise()
                .catch((e) => {});
            }
          );
          let s3Objs = await Promise.all(pArr);
          s3Object = s3Objs.find((s) => s && s.ContentLength) || s3Objs[0];
        } else {
          // get the source image file
          const s3Opt = {
            Bucket: AssetsBucket,
            Key: transformer.s3Key,
          };
          s3Object = await this.s3.getObject(s3Opt).promise();
        }
        if (!s3Object || !s3Object.ContentLength) {
          responseUpdate(404, "Not Found", "The image does not exist.", [
            { key: "Content-Type", value: "text/plain" },
          ]);
          logger.info("* Lambda Response headers");
          logger.info(JSON.stringify(response.headers));
          callback(null, response);
          return;
        }

        let metaData,
          resizedImage,
          byteLength = 0;

        let QUALITY = 80;
        while (1) {
          resizedImage = isWebp
            ? await sharp(s3Object.Body).webp({ quality: QUALITY })
            : await sharp(s3Object.Body).rotate();
          metaData = await resizedImage.metadata();

          transformer.transform(resizedImage);

          resizedImage = await resizedImage.toBuffer();

          byteLength = Buffer.byteLength(resizedImage, "base64");
          if (byteLength == metaData.size) {
            logger.info("byteLength != metaData.size");
            callback(null, response);
            return;
          }
          if (byteLength >= 5242880) {
            QUALITY -= 10;
          } else {
            break;
          }
        }

        responseUpdate(
          200,
          "OK",
          resizedImage.toString("base64"),
          [
            {
              key: "Content-Type",
              value:
                "image/" +
                supportImageTypes.find((s) => s.imageType == originalFormat)
                  .mimeType /*requiredFormat*/,
            },
          ],
          "base64"
        );
        response.headers["cache-control"] = [
          { key: "Cache-Control", value: "max-age=31536000" },
        ];
        logger.info("* Lambda Response headers");
        logger.info(JSON.stringify(response.headers));
        return callback(null, response);
      } catch (err) {
        console.error(err);
        logger.info("Error occurred");
        responseUpdate(404, `${err.toString()}`, err.toString(), [
          { key: "Content-Type", value: "text/plain" },
        ]);
        callback(null, response);
        return;
      }
    } else {
      logger.info("Image present on s3. No need to transform");
      // allow the response to pass through
      response.headers = response.headers || {};
      response.headers["cache-control"] = response.headers["cache-control"] || [
        { key: "Cache-Control", value: "max-age=31536000" },
      ];
      callback(null, response);
      return;
    }

    function responseUpdate(
      status,
      statusDescription,
      body,
      contentHeader,
      bodyEncoding = undefined
    ) {
      response.status = status;
      response.statusDescription = statusDescription;
      response.body = body;
      response.headers["content-type"] = contentHeader;
      if (bodyEncoding) {
        response.bodyEncoding = bodyEncoding;
      }
    }
  }
}

module.exports = HufferEdge;
