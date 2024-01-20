import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import Serialize from 'src/decorators/serialize.decorator';
import ValidateRoutParams from 'src/decorators/validate-route-params.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CustomCacheManagerInterceptor } from 'src/interceptors/cache-manager.interceptor';
import { HttpLoggingInterceptor } from 'src/interceptors/http-logging.interceptor';
import { UserRoles } from 'src/types/enums';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Serialize(CategoryDto)
@UseInterceptors(HttpLoggingInterceptor, CustomCacheManagerInterceptor)
@ValidateRoutParams()
@ApiTags('categories')
@ApiBearerAuth('jwt')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(UserRoles.Admin)
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Only admins can create new categories.',
  })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Roles(UserRoles.Admin, UserRoles.Publisher, UserRoles.Contributor)
  @ApiOperation({
    summary: 'Get all categories',
    description: 'All authenticated users can view all categories.',
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':category_id')
  @ApiOperation({
    summary: 'Get a category',
    description: 'All authenticated users can view a category.',
  })
  findOne(@Param('category_id') category_id: string) {
    return this.categoriesService.findOne({ where: { id: category_id } });
  }

  @Patch(':category_id')
  @Roles(UserRoles.Admin)
  @ApiOperation({
    summary: 'Update a category',
    description: 'Only admins can update categories.',
  })
  @ApiBody({ type: UpdateCategoryDto })
  update(
    @Param('category_id') category_id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(category_id, updateCategoryDto);
  }

  @Delete(':category_id')
  @Roles(UserRoles.Admin)
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Only admins can delete categories.',
  })
  remove(@Param('category_id') category_id: string) {
    return this.categoriesService.remove(category_id);
  }
}
