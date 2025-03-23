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
import { ItemsService } from './items.service';
import { Item } from './items.interface';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get('alt/:altId')
  async findByAltId(@Param('altId') altId: string): Promise<Item> {
    const item = await this.itemsService.findByAltId(altId);
    if (!item) {
      throw new NotFoundException(`Item with alt_id ${altId} not found`);
    }
    return item;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    const item = await this.itemsService.findOne(+id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  @Post()
  create(@Body() createItemDto: Omit<Item, 'id' | 'alt_id'>): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: Partial<Item>,
  ): Promise<Item> {
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
  remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(+id);
  }
}
