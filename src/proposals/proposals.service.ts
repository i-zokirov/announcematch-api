import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateProposalDtoWithUser } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { Proposal } from './entities/proposal.entity';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private repository: Repository<Proposal>,
  ) {}
  create(createProposalDto: CreateProposalDtoWithUser) {
    const proposal = this.repository.create(createProposalDto);
    return this.repository.save(proposal);
  }

  find(options?: FindManyOptions<Proposal>) {
    return this.repository.find(options);
  }

  count(options?: FindManyOptions<Proposal>) {
    return this.repository.count(options);
  }

  findOne(options?: FindOneOptions<Proposal>) {
    return this.repository.findOne(options);
  }

  async updateById(id: string, updateProposalDto: UpdateProposalDto) {
    const proposal = await this.repository.findOne({ where: { id } });
    if (!proposal)
      throw new NotFoundException(`Proposal with id ${id} not found`);
    Object.assign(proposal, updateProposalDto);
    return this.repository.save(proposal);
  }

  async removeById(id: string) {
    const proposal = await this.repository.findOne({ where: { id } });
    if (!proposal)
      throw new NotFoundException(`Proposal with id ${id} not found`);
    return this.repository.remove(proposal);
  }

  save(proposal: Proposal) {
    return this.repository.save(proposal);
  }
}
