import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PersonsService } from './persons.service';
import { CreatePersonDto, UpdatePersonDto, PersonDto } from './person.dto';

@ApiTags('persons')
@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all persons',
    description: 'Retrieves a list of all persons in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of persons retrieved successfully',
    type: [PersonDto],
  })
  async findAll(): Promise<PersonDto[]> {
    return this.personsService.findAll();
  }

  @Get('alt/:altId')
  @ApiOperation({
    summary: 'Get person by alternative ID',
    description: 'Retrieves a person by their alternative ID',
  })
  @ApiParam({ name: 'altId', description: 'Alternative ID of the person' })
  @ApiResponse({
    status: 200,
    description: 'Person retrieved successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'Person not found' })
  async findByAltId(@Param('altId') altId: string): Promise<PersonDto> {
    const person = await this.personsService.findByAltId(altId);
    if (!person) {
      throw new NotFoundException(`Person with alt_id ${altId} not found`);
    }
    return person;
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Get person by email',
    description: 'Retrieves a person by their email address',
  })
  @ApiParam({ name: 'email', description: 'Email of the person' })
  @ApiResponse({
    status: 200,
    description: 'Person retrieved successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'Person not found' })
  async findByEmail(@Param('email') email: string): Promise<PersonDto> {
    const person = await this.personsService.findByEmail(email);
    if (!person) {
      throw new NotFoundException(`Person with email ${email} not found`);
    }
    return person;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get person by ID',
    description: 'Retrieves a person by their ID',
  })
  @ApiParam({ name: 'id', description: 'ID of the person' })
  @ApiResponse({
    status: 200,
    description: 'Person retrieved successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 404, description: 'Person not found' })
  async findOne(@Param('id') id: string): Promise<PersonDto> {
    const person = await this.personsService.findOne(+id);
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  @Post()
  @ApiOperation({
    summary: 'Create person',
    description: 'Creates a new person in the system',
  })
  @ApiResponse({
    status: 201,
    description: 'Person created successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createPersonDto: CreatePersonDto): Promise<PersonDto> {
    return this.personsService.create(createPersonDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update person',
    description: 'Updates an existing person in the system',
  })
  @ApiParam({ name: 'id', description: 'ID of the person to update' })
  @ApiResponse({
    status: 200,
    description: 'Person updated successfully',
    type: PersonDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Person not found' })
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonDto> {
    return this.personsService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete person',
    description: 'Deletes a person from the system',
  })
  @ApiParam({ name: 'id', description: 'ID of the person to delete' })
  @ApiResponse({ status: 200, description: 'Person deleted successfully' })
  @ApiResponse({ status: 404, description: 'Person not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.personsService.remove(+id);
  }
}
