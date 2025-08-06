import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product', async () => {
    const tenant = 'tenant1';
    const name = 'Product A';
    const mockResult = { id: '1', name, created_at: new Date(), updated_at: new Date() };

    mockProductService.create.mockResolvedValue(mockResult);

    const result = await controller.create(tenant, name);
    expect(service.create).toHaveBeenCalledWith(tenant, name);
    expect(result).toEqual(mockResult);
  });

  it('should return all products', async () => {
    const tenant = 'tenant1';
    const mockResult = [
      { id: '1', name: 'P1', created_at: new Date(), updated_at: new Date() },
      { id: '2', name: 'P2', created_at: new Date(), updated_at: new Date() },
    ];

    mockProductService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll(tenant);
    expect(service.findAll).toHaveBeenCalledWith(tenant);
    expect(result).toEqual(mockResult);
  });

  it('should return one product by id', async () => {
    const tenant = 'tenant1';
    const id = '123';
    const mockProduct = { id, name: 'Product A', created_at: new Date(), updated_at: new Date() };

    mockProductService.findOne.mockResolvedValue(mockProduct);

    const result = await controller.findOne(tenant, id);
    expect(service.findOne).toHaveBeenCalledWith(tenant, id);
    expect(result).toEqual(mockProduct);
  });

  it('should update a product', async () => {
    const tenant = 'tenant1';
    const id = '123';
    const name = 'Updated Product';
    const updatedProduct = { id, name, created_at: new Date(), updated_at: new Date() };

    mockProductService.update.mockResolvedValue(updatedProduct);

    const result = await controller.update(tenant, id, name);
    expect(service.update).toHaveBeenCalledWith(tenant, id, name);
    expect(result).toEqual(updatedProduct);
  });

  it('should remove a product', async () => {
    const tenant = 'tenant1';
    const id = '123';

    mockProductService.remove.mockResolvedValue(undefined);

    const result = await controller.remove(tenant, id);
    expect(service.remove).toHaveBeenCalledWith(tenant, id);
    expect(result).toBeUndefined();
  });
});

