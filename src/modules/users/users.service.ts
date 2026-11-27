import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('El email ya está registrado');

    const rounds = this.config.get<number>('app.bcryptRounds');
    const hashedPassword = await bcrypt.hash(dto.password, rounds);

    const user = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      role: dto.role || UserRole.STUDENT,
      isActive: true,
      emailVerified: false,
      enrolledCourses: [],
    });

    return this.sanitize(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findAll() {
    const result = await this.usersRepository.findAll();
    return { ...result, items: result.items.map(this.sanitize) };
  }

  async update(id: string, data: Partial<User>): Promise<Omit<User, 'password'>> {
    await this.findById(id);
    if (data.password) {
      const rounds = this.config.get<number>('app.bcryptRounds');
      data.password = await bcrypt.hash(data.password, rounds);
    }
    const updated = await this.usersRepository.update(id, data);
    return this.sanitize(updated);
  }

  async enrollInCourse(userId: string, courseId: string): Promise<void> {
    const user = await this.findById(userId);
    const enrolled = user.enrolledCourses || [];
    if (!enrolled.includes(courseId)) {
      await this.usersRepository.update(userId, {
        enrolledCourses: [...enrolled, courseId],
      });
    }
  }

  private sanitize(user: User): Omit<User, 'password'> {
    const { password, ...rest } = user;
    return rest;
  }
}
