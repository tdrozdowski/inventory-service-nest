import {
  Body,
  Controller,
  Delete,
  Get,
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
  findByAltId(@Param('altId') altId: string): Promise<Item> {
    return this.itemsService.findByAltId(altId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(+id);
  }

  @Post()
  create(@Body() createItemDto: Omit<Item, 'id' | 'alt_id'>): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: Partial<Item>,
  ): Promise<Item> {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(+id);
  }
}
