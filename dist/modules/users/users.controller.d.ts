import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<Omit<import("./entities/user.entity").User, "password">>;
    getMe(req: any): Promise<import("./entities/user.entity").User>;
    updateMe(req: any, data: any): Promise<Omit<import("./entities/user.entity").User, "password">>;
}
