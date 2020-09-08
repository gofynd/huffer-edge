class HufferConfig {
  /**
   * @typedef config {
   *    aws:[],
   *    directories: {
   *        // Images
   *        "/media/": {
   *          namespace: "hdn-media",
   *          interceptors: [()=>{}]
   *      },
   *    }
   * }
   * @param config config
   */
  constructor(config) {
    this.aws = config.aws;
    this.directories = config.directories;

    this.aws.forEach((c) => {
      c.CloudFrontOriginBucket = c.CloudFrontOrigin.replace(
        "s3://",
        ""
      ).replace(".s3.amazonaws.com", "");
    });
  }
  getAWSConfig(stage) {
    return this.aws.find((c) => c.Stage === stage);
  }
  getAWSConfigForBucket(bucket) {
    return this.aws.find((c) => c.CloudFrontOriginBucket === bucket);
  }
  isValidAWSBucket(bucket) {
    return !!this.aws.find((c) => {
      return c.CloudFrontOriginBucket === bucket;
    });
  }
}

module.exports = HufferConfig;
