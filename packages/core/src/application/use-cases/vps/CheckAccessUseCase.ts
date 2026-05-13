import { VpsAccessService } from '../../services/vps/VpsAccessService';

export class CheckAccessUseCase {
  constructor(private readonly service: VpsAccessService) {}

  execute(resource: string): Promise<boolean> {
    return this.service.canAccess(resource);
  }
}
