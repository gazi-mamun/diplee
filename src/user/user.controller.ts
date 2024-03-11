import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/common/decorators/permission.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(['ADMIN'])
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  @Get('/search')
  @Roles(['ADMIN'])
  search(@Query() query) {
    return this.userService.search(query);
  }

  @Get(':id')
  @Roles(['ADMIN'])
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
