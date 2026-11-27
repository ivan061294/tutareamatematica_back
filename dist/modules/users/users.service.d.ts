import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly config;
    constructor(usersRepository: UsersRepository, config: ConfigService);
    create(dto: CreateUserDto): Promise<Omit<User, 'password'>>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<{
        items: Omit<User, "password">[];
        lastKey?: Record<string, any>;
        count: number;
    }>;
    update(id: string, data: Partial<User>): Promise<Omit<User, 'password'>>;
    enrollInCourse(userId: string, courseId: string): Promise<void>;
    private sanitize;
}
