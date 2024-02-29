import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('city')
export class CityController {
  constructor(
    private readonly cityService: CityService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  async getCities() {
    const cachedCities = await this.cacheManager.get('all-cities');
    if (cachedCities) return cachedCities;

    const cities = await this.cityService.getCities();
    await this.cacheManager.set('all-cities', cities, 10);

    return cities;
  }

  @Get(':id')
  // динамический параметр айди переходит в свойсвто id c помощью декоратоора param
  async getCityById(@Param('id') id: number): Promise<any> {
    return this.cityService.getCityById(id);
  }
}
