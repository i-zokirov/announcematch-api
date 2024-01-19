import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CustomCacheManagerInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const queryParams = JSON.stringify(req.query);
    const key = `${req.route.path}?${queryParams}`; // Customize this key as needed

    if (req.method === 'GET') {
      // Check if the data is in the cache
      const cachedResponse = await this.cacheManager.get(key);
      if (cachedResponse) {
        console.log(`Cache hit for key: ${key}`);
        return of(cachedResponse);
      } else {
        console.log(`Cache miss for key: ${key}`);
      }

      return next.handle().pipe(
        tap((response) => {
          // If it was a miss, now we're storing the response in the cache.
          if (!cachedResponse) {
            this.cacheManager.set(key, response);
          }
        }),
      );
    } else {
      // If it was a POST, PUT, PATCH or DELETE, we're clearing the cache.
      await this.cacheManager.del(key);
      return next.handle();
    }
  }
}
