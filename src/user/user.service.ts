import { Injectable, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(@Query() query) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    const userRole = query.role || null;

    const userCount = await this.databaseService.user.aggregate({
      where: {
        role: userRole !== null ? userRole : undefined,
      },
      _count: {
        _all: true,
      },
    });

    const totalPages = Math.ceil(userCount._count._all / limit);
    console.log(userCount, totalPages);

    const users = await this.databaseService.user.findMany({
      skip,
      take: limit,
      where: {
        role: userRole !== null ? userRole : undefined,
      },
    });

    users.map((user) => {
      delete user.hashedPassword;
      delete user.hashedRt;
      delete user.passwordChangeAt;
      delete user.passwordResetOtpCode;
      delete user.passwordResetExpires;
    });

    return {
      users,
      totalPages,
      currentPage: page,
    };
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    delete user.hashedPassword;
    delete user.hashedRt;
    delete user.passwordChangeAt;
    delete user.passwordResetOtpCode;
    delete user.passwordResetExpires;

    return user;
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    const updatedUser = await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        role: updateUserDto.role,
      },
    });

    delete updatedUser.hashedPassword;
    delete updatedUser.hashedRt;
    delete updatedUser.passwordChangeAt;
    delete updatedUser.passwordResetOtpCode;
    delete updatedUser.passwordResetExpires;

    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.databaseService.user.delete({
      where: {
        id,
      },
    });
    delete deletedUser.hashedPassword;
    delete deletedUser.hashedRt;
    delete deletedUser.passwordChangeAt;
    delete deletedUser.passwordResetOtpCode;
    delete deletedUser.passwordResetExpires;
    return deletedUser;
  }

  async search(@Query() query) {
    const searchTerm = query.searchterm || '';

    const result = await this.databaseService.user.findMany({
      where: {
        id: {
          search: searchTerm,
        },
        email: {
          search: searchTerm,
        },
      },
    });

    return result;
  }
}
