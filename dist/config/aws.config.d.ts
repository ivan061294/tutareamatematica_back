declare const _default: (() => {
    region: string;
    dynamodb: {
        tablePrefix: string;
        endpoint: string;
    };
    s3: {
        bucket: string;
        urlExpiration: number;
        endpoint: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    region: string;
    dynamodb: {
        tablePrefix: string;
        endpoint: string;
    };
    s3: {
        bucket: string;
        urlExpiration: number;
        endpoint: string;
    };
}>;
export default _default;
