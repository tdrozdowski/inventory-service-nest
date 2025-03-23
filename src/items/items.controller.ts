import {
  BadRequestException,
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
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto, ItemDto } from './item.dto';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items', description: 'Retrieves a list of all items in the inventory' })
  @ApiResponse({ status: 200, description: 'List of items retrieved successfully', type: [ItemDto] })
  async findAll(): Promise<ItemDto[]> {
    return this.itemsService.findAll();
  }

  @Get('alt/:altId')
  @ApiOperation({ summary: 'Get item by alternative ID', description: 'Retrieves an item by its alternative ID' })
  @ApiParam({ name: 'altId', description: 'Alternative ID of the item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully', type: ItemDto })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findByAltId(@Param('altId') altId: string): Promise<ItemDto> {
    const item = await this.itemsService.findByAltId(altId);
    if (!item) {
      throw new NotFoundException(`Item with alt_id ${altId} not found`);
    }
    return item;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID', description: 'Retrieves an item by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully', type: ItemDto })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Param('id') id: string): Promise<ItemDto> {
    const item = await this.itemsService.findOne(+id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  @Post()
  @ApiOperation({ summary: 'Create item', description: 'Creates a new item in the inventory' })
  @ApiResponse({ status: 201, description: 'Item created successfully', type: ItemDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createItemDto: CreateItemDto): Promise<ItemDto> {
    return this.itemsService.create(createItemDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update item', description: 'Updates an existing item in the inventory' })
  @ApiParam({ name: 'id', description: 'ID of the item to update' })
  @ApiResponse({ status: 200, description: 'Item updated successfully', type: ItemDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemDto> {
    const itemId = +id;
    if (isNaN(itemId)) {
      throw new BadRequestException(`Invalid item ID: ${id}`);
    }

    const updatedItem = await this.itemsService.update(itemId, updateItemDto);
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return updatedItem;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item', description: 'Deletes an item from the inventory' })
  @ApiParam({ name: 'id', description: 'ID of the item to delete' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(+id);
  }
}
