declare const _default: (() => {
    env: string;
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    frontendUrl: string;
    bcryptRounds: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    env: string;
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    frontendUrl: string;
    bcryptRounds: number;
}>;
export default _default;
