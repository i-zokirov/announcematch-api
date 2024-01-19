import { Test, TestingModule } from '@nestjs/testing';
import { SocketsStateService } from './sockets-state.service';

describe('SocketsStateService', () => {
  let service: SocketsStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketsStateService],
    }).compile();

    service = module.get<SocketsStateService>(SocketsStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
