import { beforeEach, describe, expect, it } from "vitest";
import { Test, TestingModule } from '@nestjs/testing';
import { LiveDataController } from './live-data.controller';
describe('LiveDataController', () => {
  let controller: LiveDataController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveDataController],
    }).compile();
    controller = module.get<LiveDataController>(LiveDataController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
