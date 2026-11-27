import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
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
    private generateToken;
}
