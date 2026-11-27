import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        tokenType: string;
        user: Omit<import("../users/entities/user.entity").User, "password">;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        tokenType: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
            avatarUrl?: string;
            phone?: string;
            isActive: boolean;
            emailVerified: boolean;
            enrolledCourses: string[];
            createdAt: string;
            updatedAt: string;
        };
    }>;
}
