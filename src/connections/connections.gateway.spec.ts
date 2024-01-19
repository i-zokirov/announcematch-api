import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsGateway } from './connections.gateway';
import { ConnectionsService } from './connections.service';

describe('ConnectionsGateway', () => {
  let gateway: ConnectionsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionsGateway, ConnectionsService],
    }).compile();

    gateway = module.get<ConnectionsGateway>(ConnectionsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
